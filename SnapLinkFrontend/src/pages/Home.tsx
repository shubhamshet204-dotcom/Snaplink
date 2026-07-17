import { Link } from "react-router-dom";
import { Link2, Shield, BarChart3, Clock, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C0C0C] neo-grid-bg selection:bg-[#FF5A00]/25 selection:text-[#0C0C0C]">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b-3 border-[#0C0C0C] bg-white">
        <Logo />
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-xs font-black uppercase tracking-wider text-[#0C0C0C] hover:text-[#FF5A00] transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            to="/register"
            className="neo-btn-primary px-4 py-2 text-xs"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-2 border-[#0C0C0C] bg-[#FFEFE5] text-xs font-bold uppercase tracking-wider text-[#0C0C0C] mb-8 shadow-[2px_2px_0px_0px_#0C0C0C]">
          <span className="w-2.5 h-2.5 bg-[#FF5A00] border border-[#0C0C0C]" />
          PRODUCTION READY URL SHORTENING
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight mb-8 leading-[1.05] text-[#0C0C0C] font-display">
          SHORTEN YOUR LINKS.<br />
          <span className="px-3 bg-[#FF5A00] text-[#0C0C0C] inline-block border-3 border-[#0C0C0C] shadow-[4px_4px_0px_0px_#0C0C0C] rotate-1 mt-2 transform">
            TRACK THEIR SUCCESS.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#0C0C0C] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          SnapLink is a high-contrast URL shortener featuring real-time click statistics, custom aliases, password-locked redirects, and link schedules.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto neo-btn-primary px-8 py-4 text-sm flex items-center justify-center gap-2"
          >
            START SHORTENING FREE
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto neo-btn-secondary px-8 py-4 text-sm text-center"
          >
            DEMO LOGIN
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t-3 border-[#0C0C0C] bg-white">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-[#0C0C0C] mb-4">
            Everything you need in a URL shortener
          </h2>
          <p className="text-sm font-bold text-[#5A5A5A] uppercase tracking-wide">
            Professional link management tools powered by Spring Boot and Redis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="neo-card p-6 flex flex-col justify-between h-64 hover:bg-[#FFEFE5]/30">
            <div>
              <div className="w-10 h-10 border-2 border-[#0C0C0C] bg-[#FF5A00] flex items-center justify-center text-[#0C0C0C] mb-6 shadow-[2px_2px_0px_0px_#000000]">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 tracking-tight">Custom Aliases</h3>
              <p className="text-xs text-[#5A5A5A] leading-relaxed font-semibold">
                Create memorable brand links by defining custom paths instead of random auto-generated codes.
              </p>
            </div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#FF5A00]">FEATURE // 01</div>
          </div>

          {/* Card 2 */}
          <div className="neo-card p-6 flex flex-col justify-between h-64 hover:bg-[#FFEFE5]/30">
            <div>
              <div className="w-10 h-10 border-2 border-[#0C0C0C] bg-[#FF5A00] flex items-center justify-center text-[#0C0C0C] mb-6 shadow-[2px_2px_0px_0px_#000000]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 tracking-tight">Click Analytics</h3>
              <p className="text-xs text-[#5A5A5A] leading-relaxed font-semibold">
                Track referrals, device types, browsers, operating systems, and link access counts dynamically.
              </p>
            </div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#FF5A00]">FEATURE // 02</div>
          </div>

          {/* Card 3 */}
          <div className="neo-card p-6 flex flex-col justify-between h-64 hover:bg-[#FFEFE5]/30">
            <div>
              <div className="w-10 h-10 border-2 border-[#0C0C0C] bg-[#FF5A00] flex items-center justify-center text-[#0C0C0C] mb-6 shadow-[2px_2px_0px_0px_#000000]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 tracking-tight">Access Control</h3>
              <p className="text-xs text-[#5A5A5A] leading-relaxed font-semibold">
                Restrict destination redirects by locking your links behind custom password protections.
              </p>
            </div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#FF5A00]">FEATURE // 03</div>
          </div>

          {/* Card 4 */}
          <div className="neo-card p-6 flex flex-col justify-between h-64 hover:bg-[#FFEFE5]/30">
            <div>
              <div className="w-10 h-10 border-2 border-[#0C0C0C] bg-[#FF5A00] flex items-center justify-center text-[#0C0C0C] mb-6 shadow-[2px_2px_0px_0px_#000000]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold uppercase mb-2 tracking-tight">Link Expiry</h3>
              <p className="text-xs text-[#5A5A5A] leading-relaxed font-semibold">
                Define scheduled expiry times. Links automatically deactivate once their timeframe has elapsed.
              </p>
            </div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#FF5A00]">FEATURE // 04</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-[#0C0C0C] bg-[#FAF8F5] text-center py-10 text-[#0C0C0C] text-xs font-mono font-bold">
        <p>SNAPLINK © 2026 // BUILT ON SPRING BOOT & REACT. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
