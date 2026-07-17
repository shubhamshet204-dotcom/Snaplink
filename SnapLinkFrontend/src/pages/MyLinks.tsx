import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Search, 
  Trash2, 
  Pencil, 
  BarChart3, 
  Copy, 
  ExternalLink,
  Check,
  Filter
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import EditLinkModal from "../components/EditLinkModal";
import Loader from "../components/Loader";
import { linkService } from "../services/api";
import { ShortLinkResponse } from "../types";

export default function MyLinks() {
  const navigate = useNavigate();
  const shortLinkBaseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL || "https://snap.lk";
  const localRedirectBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api").replace("/api", "");

  const [links, setLinks] = useState<ShortLinkResponse[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copyingId, setCopyingId] = useState<number | null>(null);

  // Edit Modal State
  const [selectedLink, setSelectedLink] = useState<ShortLinkResponse | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function loadLinks() {
    try {
      const response = await linkService.getMyLinks(page, 10, "id", "asc", search);
      if (response.success && response.data) {
        setLinks(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, [search, page]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await linkService.deleteLink(id);
      toast.success("Link deleted successfully");
      loadLinks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete link");
    }
  }

  function handleEdit(link: ShortLinkResponse) {
    setSelectedLink(link);
    setIsEditOpen(true);
  }

  async function handleSave(payload: {
    originalUrl: string;
    customAlias?: string;
    password?: string;
    expiresAt?: string;
  }) {
    if (!selectedLink) return;

    try {
      const response = await linkService.updateLink(selectedLink.id, payload);
      if (response.success) {
        toast.success("Link updated successfully");
        loadLinks();
      } else {
        toast.error(response.message || "Failed to update link");
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update link. Custom alias may already be taken.";
      toast.error(errorMsg);
      throw error;
    }
  }

  async function copyLink(id: number, shortUrl: string) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyingId(id);
      toast.success("Link copied!");
      setTimeout(() => setCopyingId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b-3 border-[#0C0C0C] pb-5">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0C0C0C]">
            My Links
          </h1>
          <p className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mt-1">
            Search, edit, delete, and view analytics for all links
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#0C0C0C]" />
            <input
              type="text"
              placeholder="Search by original URL or short code..."
              value={search}
              onChange={(e) => {
                setPage(0);
                setSearch(e.target.value);
              }}
              className="w-full neo-input pl-10 pr-4 py-3 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 px-4 py-3 border-2 border-[#0C0C0C] bg-white text-xs font-bold uppercase tracking-wider text-[#0C0C0C] shadow-[2px_2px_0px_0px_#0C0C0C]">
            <Filter className="w-4 h-4 text-[#FF5A00]" />
            ACTIVE
          </div>
        </div>

        {/* Links Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader label="Loading your links..." />
          </div>
        ) : links.length === 0 ? (
          <div className="neo-card p-12 text-center">
            <p className="text-[#5A5A5A] text-xs font-bold uppercase tracking-wider">No links found matching search.</p>
          </div>
        ) : (
          <div className="neo-card overflow-hidden shadow-xl">
            <div className="overflow-x-auto border-b-2 border-[#0C0C0C]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FFEFE5] text-[#0C0C0C] font-extrabold border-b-3 border-[#0C0C0C] text-left uppercase text-xs">
                    <th className="p-3 pl-6">Original URL</th>
                    <th className="p-3">Short Code</th>
                    <th className="p-3">Clicks</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#0C0C0C]">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-[#FFEFE5]/40 transition-colors font-medium">
                      <td className="p-3 pl-6 max-w-xs md:max-w-md truncate text-[#0C0C0C] font-sans">
                        {link.originalUrl}
                      </td>
                      <td className="p-3">
                        <a
                          href={`${localRedirectBaseUrl}/${link.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF5A00] hover:underline font-extrabold font-mono flex items-center gap-1 w-max"
                        >
                          {link.shortCode}
                          <ExternalLink className="w-3.5 h-3.5 text-[#0C0C0C]" />
                        </a>
                      </td>
                      <td className="p-3 text-[#0C0C0C] font-mono font-bold">{link.clickCount}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/analytics/${link.id}`)}
                            className="p-1.5 border-2 border-[#0C0C0C] bg-white hover:bg-[#FFEFE5] active:translate-y-[1px] cursor-pointer"
                            title="Analytics Details"
                          >
                            <BarChart3 className="w-4 h-4 text-[#0C0C0C]" />
                          </button>

                          <button
                            onClick={() => copyLink(link.id, `${shortLinkBaseUrl}/${link.shortCode}`)}
                            className="p-1.5 border-2 border-[#0C0C0C] bg-white hover:bg-[#FFEFE5] active:translate-y-[1px] cursor-pointer"
                            title="Copy Short URL"
                          >
                            {copyingId === link.id ? (
                              <Check className="w-4 h-4 text-emerald-600 animate-scaleIn" />
                            ) : (
                              <Copy className="w-4 h-4 text-[#0C0C0C]" />
                            )}
                          </button>

                          <button
                            onClick={() => handleEdit(link)}
                            className="p-1.5 border-2 border-[#0C0C0C] bg-white hover:bg-[#FFEFE5] active:translate-y-[1px] cursor-pointer"
                            title="Edit Link Settings"
                          >
                            <Pencil className="w-4 h-4 text-[#0C0C0C]" />
                          </button>

                          <button
                            onClick={() => handleDelete(link.id)}
                            className="p-1.5 border-2 border-[#0C0C0C] bg-white hover:bg-[#FF2E63] hover:text-white active:translate-y-[1px] cursor-pointer"
                            title="Delete Link"
                          >
                            <Trash2 className="w-4 h-4 text-[#0C0C0C] hover:text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-white flex items-center justify-between">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="neo-btn-secondary px-3 py-1.5 text-xs uppercase disabled:opacity-40 disabled:pointer-events-none"
                >
                  Previous
                </button>

                <span className="text-xs font-mono font-bold text-[#0C0C0C]">
                  PAGE {page + 1} OF {totalPages}
                </span>

                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="neo-btn-secondary px-3 py-1.5 text-xs uppercase disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <EditLinkModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedLink(null);
        }}
        onSave={handleSave}
        link={selectedLink}
      />
    </DashboardLayout>
  );
}
