import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  MousePointerClick, 
  Link2, 
  Info,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { analyticsService } from "../services/api";
import { AnalyticsResponse } from "../types";

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const shortLinkBaseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL || "https://snap.lk";
  const localRedirectBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api").replace("/api", "");

  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      if (!id) return;
      try {
        const response = await analyticsService.getAnalytics(Number(id));
        if (response.success && response.data) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load analytics details");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader size="lg" label="Loading link analytics..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-red-500 font-bold uppercase tracking-wider text-sm">// ERROR: Analytics not found or access denied.</p>
          <Link
            to="/links"
            className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-[#FF5A00] hover:underline uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Links
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation */}
        <Link
          to="/links"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 border-2 border-[#0C0C0C] bg-white hover:bg-[#FFEFE5] text-[#0C0C0C] active:translate-y-[1px] transition-all uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Links
        </Link>

        {/* Header */}
        <div className="border-b-3 border-[#0C0C0C] pb-5">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0C0C0C]">
            Link Performance
          </h1>
          <p className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mt-1">
            Realtime metrics for shortcode: <span className="text-[#FF5A00] font-bold font-mono">{analytics.shortCode}</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed Info Card */}
          <div className="neo-card p-6 lg:col-span-2 space-y-6">
            <h3 className="text-lg font-extrabold uppercase tracking-tight flex items-center gap-2 border-b-2 border-[#0C0C0C] pb-3">
              <Info className="w-5 h-5 text-[#FF5A00]" />
              Link Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Destination (Long) URL</p>
                <p className="text-sm text-[#0C0C0C] mt-1 break-all bg-[#FAF8F5] p-3 border-2 border-[#0C0C0C] font-medium">
                  {analytics.originalUrl}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Short link</p>
                  <a
                    href={`${localRedirectBaseUrl}/${analytics.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#FF5A00] hover:underline mt-1.5 font-bold font-mono"
                  >
                    {`${shortLinkBaseUrl}/${analytics.shortCode}`}
                    <ExternalLink className="w-3.5 h-3.5 text-[#0C0C0C]" />
                  </a>
                </div>

                <div>
                  <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Short Code / Alias</p>
                  <p className="text-sm text-[#0C0C0C] mt-1.5 font-mono font-bold">
                    {analytics.shortCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Side Card */}
          <div className="space-y-6">
            {/* Clicks metric */}
            <div className="neo-card p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Total Clicks</p>
                <h3 className="text-3xl font-black text-[#0C0C0C] font-mono mt-1">{analytics.clickCount}</h3>
              </div>
              <div className="p-2.5 border-2 border-[#0C0C0C] bg-[#FFEFE5] text-[#FF5A00] shadow-[2px_2px_0px_0px_#0C0C0C]">
                <MousePointerClick className="w-6 h-6" />
              </div>
            </div>

            {/* Creation Date metric */}
            <div className="neo-card p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Created On</p>
                <p className="text-sm text-[#0C0C0C] font-bold mt-2">
                  {new Date(analytics.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }).toUpperCase()}
                </p>
              </div>
              <div className="p-2.5 border-2 border-[#0C0C0C] bg-[#FFEFE5] text-[#FF5A00] shadow-[2px_2px_0px_0px_#0C0C0C]">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            {/* Status metric */}
            <div className="neo-card p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold text-[#5A5A5A] uppercase tracking-wider">Status</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {analytics.deleted ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-500 font-extrabold uppercase">Inactive</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-600 font-extrabold uppercase">Active</span>
                    </>
                  )}
                </div>
              </div>
              <div className={`p-2.5 border-2 border-[#0C0C0C] shadow-[2px_2px_0px_0px_#0C0C0C] ${analytics.deleted ? "bg-red-100 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>
                <Link2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
