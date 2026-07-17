import { CircleUserRound, LogOut, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const shortLinkBaseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL || "http://localhost:8082";

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b-3 border-[#0C0C0C] sticky top-0 z-40 flex items-center justify-between px-6">
      <Logo />

      <div className="flex items-center gap-4">
        <a
          href={`${shortLinkBaseUrl}/swagger-ui.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 border-2 border-[#0C0C0C] bg-white hover:bg-[#FFEFE5] text-[#0C0C0C] active:translate-y-[1px] transition-all"
        >
          API DOCS
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="h-6 w-0.5 bg-[#0C0C0C]" />

        <div className="flex items-center">
          <CircleUserRound
            onClick={() => navigate("/profile")}
            className="w-6 h-6 text-[#0C0C0C] hover:text-[#FF5A00] transition cursor-pointer"
          />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 border-2 border-[#0C0C0C] bg-[#FF2E63] text-white active:translate-y-[1px] transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT
        </button>
      </div>
    </header>
  );
}
