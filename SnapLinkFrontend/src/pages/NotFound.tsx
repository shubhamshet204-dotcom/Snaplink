import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] neo-grid-bg flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="p-4 bg-[#FFEFE5] border-3 border-[#0C0C0C] text-[#FF5A00] mb-6 shadow-[4px_4px_0px_0px_#0C0C0C] animate-bounce">
        <HelpCircle className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-extrabold uppercase mb-2 tracking-tight text-[#0C0C0C]">
        Page Not Found
      </h1>
      <p className="text-xs font-bold text-[#5A5A5A] max-w-xs mb-8 uppercase tracking-wider leading-relaxed">
        The link you followed may have expired, or this route does not exist.
      </p>

      <Link
        to="/"
        className="neo-btn-secondary px-6 py-3.5 text-xs flex items-center gap-2 uppercase"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
}
