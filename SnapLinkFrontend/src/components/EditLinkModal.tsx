import { useEffect, useState } from "react";
import { X, Link2, Lock, Calendar } from "lucide-react";
import { ShortLinkResponse } from "../types";

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    originalUrl: string;
    customAlias?: string;
    password?: string;
    expiresAt?: string;
  }) => Promise<void>;
  link: ShortLinkResponse | null;
}

export default function EditLinkModal({ isOpen, onClose, onSave, link }: EditLinkModalProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (link) {
      setOriginalUrl(link.originalUrl);
      setCustomAlias(link.shortCode);
      setPassword("");
      setExpiresAt("");
    }
  }, [link]);

  if (!isOpen || !link) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!originalUrl) return;

    try {
      setSaving(true);
      await onSave({
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        password: password.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0C0C0C]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-[#0C0C0C] p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_#0C0C0C] animate-scaleIn">
        <div className="flex items-center justify-between mb-6 border-b-2 border-[#0C0C0C] pb-3">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#0C0C0C]">
            Edit Short Link
          </h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-[#0C0C0C] bg-white hover:bg-[#FFEFE5] active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#0C0C0C]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-1.5">
              Destination URL
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full neo-input px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5" />
              Custom Alias / Code
            </label>
            <input
              type="text"
              placeholder="e.g. customized-path"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full neo-input px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep same"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full neo-input px-3.5 py-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                New Expiration Date
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full neo-input px-3.5 py-2.5 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#0C0C0C] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn-secondary px-4 py-2 text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="neo-btn-primary px-5 py-2 text-xs"
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
