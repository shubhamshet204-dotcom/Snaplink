import { useState, FormEvent } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Lock, AlertCircle, ArrowLeft } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo";

export default function PasswordChallenge() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [searchParams] = useSearchParams();
  const isError = searchParams.get("error") === "true";

  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim() || !shortCode) return;

    const shortLinkBaseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL || "http://localhost:8082";
    // Direct redirection to the backend redirect GET route with password parameter
    window.location.href = `${shortLinkBaseUrl}/${shortCode}?password=${encodeURIComponent(password)}`;
  }

  return (
    <AuthLayout>
      <div className="bg-white border-4 border-[#0C0C0C] p-8 shadow-[8px_8px_0px_0px_#0C0C0C] space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#0C0C0C]">
            PASSWORD REQUIRED
          </h2>
          <p className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider">
            This link is secure and requires a decryption key
          </p>
        </div>

        {isError && (
          <div className="flex items-center gap-2 p-3 bg-red-100 border-2 border-red-500 text-red-600 text-xs font-bold uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Invalid password. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF5A00]" />
              Enter Link Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full neo-input px-4 py-3 text-sm"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 neo-btn-primary text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Submit Decryption Key
          </button>
        </form>

        <div className="flex justify-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0C0C0C] hover:text-[#FF5A00] transition duration-150 uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
