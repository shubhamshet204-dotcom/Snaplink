import { useEffect, useState, FormEvent } from "react";
import { 
  Link2, 
  Activity, 
  Trash2, 
  MousePointerClick, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  QrCode,
  Lock,
  Calendar,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { dashboardService, linkService } from "../services/api";
import { DashboardResponse, ShortLinkResponse } from "../types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const shortLinkBaseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL || "https://snap.lk";
  const localRedirectBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api").replace("/api", "");

  // Shortener form state
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdLink, setCreatedLink] = useState<ShortLinkResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function fetchDashboard() {
    try {
      const response = await dashboardService.getDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      toast.error("Could not fetch dashboard metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function handleShorten(e: FormEvent) {
    e.preventDefault();
    if (!originalUrl) {
      toast.error("Please enter a long URL");
      return;
    }

    try {
      setSubmitting(true);
      setCreatedLink(null);
      setShowQr(false);

      const payload = {
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        password: password.trim() || undefined,
        expiresAt: expiresAt ? expiresAt : undefined,
      };

      const response = await linkService.createShortLink(payload);
      if (response.success) {
        setCreatedLink(response.data);
        toast.success("Short link generated!");
        // Reset form
        setOriginalUrl("");
        setCustomAlias("");
        setPassword("");
        setExpiresAt("");
        setShowAdvanced(false);
        // Refresh dashboard stats
        fetchDashboard();
      } else {
        toast.error(response.message || "Failed to shorten link");
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An error occurred. Alias may already be taken.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader size="lg" label="Loading dashboard metrics..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#0C0C0C] pb-5">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#0C0C0C]">
              Dashboard
            </h1>
            <p className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mt-1">
              Create short links and manage link performance
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 border-2 border-[#0C0C0C] bg-[#FFEFE5] text-[#0C0C0C] shadow-[2px_2px_0px_0px_#0C0C0C]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
            LIVE REDIS CACHE
          </div>
        </div>

        {/* Shortener Widget */}
        <div className="neo-card-lg p-6 relative overflow-hidden">
          <h2 className="text-lg font-extrabold uppercase tracking-tight mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF5A00]" />
            Shorten a new link
          </h2>

          <form onSubmit={handleShorten} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow">
                <input
                  type="url"
                  required
                  placeholder="Paste your long URL here (e.g. https://example.com/very/long/path)..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full neo-input px-4 py-3.5 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="neo-btn-primary px-6 py-3.5 text-sm uppercase tracking-wider cursor-pointer shrink-0 disabled:opacity-50"
              >
                {submitting ? "Shortening..." : "Shorten URL"}
              </button>
            </div>

            {/* Advanced toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#0C0C0C] hover:text-[#FF5A00] transition duration-150 cursor-pointer"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Advanced Options
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] font-bold text-[#0C0C0C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#FF5A00]" />
                      Custom Alias
                    </label>
                    <input
                      type="text"
                      placeholder="my-custom-code"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className="w-full neo-input px-3.5 py-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#0C0C0C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#FF5A00]" />
                      Password Lock
                    </label>
                    <input
                      type="password"
                      placeholder="Optional password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full neo-input px-3.5 py-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#0C0C0C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF5A00]" />
                      Expiration Date
                    </label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full neo-input px-3.5 py-2.5 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Creation Success result view */}
          {createdLink && (
            <div className="mt-6 p-4 border-3 border-[#0C0C0C] bg-[#FFEFE5] animate-fadeIn">
              <p className="text-xs font-black text-[#0C0C0C] uppercase tracking-wider mb-2">
                // SUCCESS: Short link generated
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 bg-white px-4 py-3 border-2 border-[#0C0C0C] text-sm font-mono font-bold select-all truncate text-[#0C0C0C]">
                  {`${shortLinkBaseUrl}/${createdLink.shortCode}`}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(`${shortLinkBaseUrl}/${createdLink.shortCode}`)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 neo-btn-secondary text-xs uppercase"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() => setShowQr(!showQr)}
                    className="flex items-center justify-center p-3 neo-btn-secondary text-xs"
                    title="Toggle QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <a
                    href={`${localRedirectBaseUrl}/${createdLink.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center p-3 neo-btn-primary"
                    title="Test redirection link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {showQr && (
                <div className="mt-4 flex flex-col items-center justify-center p-4 bg-white border-3 border-[#0C0C0C] w-max mx-auto shadow-[4px_4px_0px_0px_#0C0C0C] animate-fadeIn">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${shortLinkBaseUrl}/${createdLink.shortCode}`)}`}
                    alt="Short Link QR Code"
                    className="w-36 h-36"
                  />
                  <span className="text-[9px] text-[#0C0C0C] font-mono font-bold mt-2 uppercase tracking-wide">
                    Scan to open link
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="neo-card p-5 flex items-center justify-between group hover:border-[#FF5A00]">
            <div>
              <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Total Links</p>
              <h3 className="text-3xl font-black mt-1 text-[#0C0C0C] font-mono">
                {data?.totalLinks ?? 0}
              </h3>
            </div>
            <div className="p-2.5 border-2 border-[#0C0C0C] bg-white group-hover:bg-[#FF5A00] transition-colors shadow-[2px_2px_0px_0px_#0c0c0c]">
              <Link2 className="w-5 h-5 text-[#0C0C0C]" />
            </div>
          </div>

          <div className="neo-card p-5 flex items-center justify-between group hover:border-[#FF5A00]">
            <div>
              <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Active Links</p>
              <h3 className="text-3xl font-black mt-1 text-[#0C0C0C] font-mono">
                {data?.activeLinks ?? 0}
              </h3>
            </div>
            <div className="p-2.5 border-2 border-[#0C0C0C] bg-white group-hover:bg-[#FF5A00] transition-colors shadow-[2px_2px_0px_0px_#0c0c0c]">
              <Activity className="w-5 h-5 text-[#0C0C0C]" />
            </div>
          </div>

          <div className="neo-card p-5 flex items-center justify-between group hover:border-[#FF5A00]">
            <div>
              <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Deleted Links</p>
              <h3 className="text-3xl font-black mt-1 text-[#0C0C0C] font-mono">
                {data?.deletedLinks ?? 0}
              </h3>
            </div>
            <div className="p-2.5 border-2 border-[#0C0C0C] bg-white group-hover:bg-[#FF5A00] transition-colors shadow-[2px_2px_0px_0px_#0c0c0c]">
              <Trash2 className="w-5 h-5 text-[#0C0C0C]" />
            </div>
          </div>

          <div className="neo-card p-5 flex items-center justify-between group hover:border-[#FF5A00]">
            <div>
              <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Total Clicks</p>
              <h3 className="text-3xl font-black mt-1 text-[#0C0C0C] font-mono">
                {data?.totalClicks ?? 0}
              </h3>
            </div>
            <div className="p-2.5 border-2 border-[#0C0C0C] bg-white group-hover:bg-[#FF5A00] transition-colors shadow-[2px_2px_0px_0px_#0c0c0c]">
              <MousePointerClick className="w-5 h-5 text-[#0C0C0C]" />
            </div>
          </div>
        </div>

        {/* Top Performing Links Table */}
        <div className="neo-card p-6 shadow-xl">
          <h3 className="text-lg font-extrabold uppercase tracking-tight mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF5A00]" />
            Top Performing Links
          </h3>

          {!data?.topLinks || data.topLinks.length === 0 ? (
            <div className="text-center py-8 text-[#5A5A5A] text-xs font-bold uppercase tracking-wider">
              No link clicks recorded yet. Create and share links to get started!
            </div>
          ) : (
            <div className="overflow-x-auto border-3 border-[#0C0C0C]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FFEFE5] text-[#0C0C0C] font-extrabold border-b-3 border-[#0C0C0C] text-left uppercase text-xs">
                    <th className="p-3">Original URL</th>
                    <th className="p-3">Short Code</th>
                    <th className="p-3 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#0C0C0C]">
                  {data.topLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-[#FFEFE5]/40 transition-colors font-medium">
                      <td className="p-3 max-w-sm truncate text-[#0C0C0C] font-sans">
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
                      <td className="p-3 text-right text-[#0C0C0C] font-mono font-bold">
                        {link.clickCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
