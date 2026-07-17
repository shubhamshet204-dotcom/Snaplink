import { Link2 } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-1.5 select-none font-bold">
      <div className="px-2 py-1.5 bg-[#0C0C0C] text-white border-2 border-[#0C0C0C] flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform duration-200">
        <Link2 className="w-5 h-5 text-[#FF5A00]" />
      </div>
      <span className="text-xl font-black uppercase tracking-tight text-[#0C0C0C] font-display ml-1">
        Snap<span className="text-[#FF5A00]">Link</span>
      </span>
    </div>
  );
}
