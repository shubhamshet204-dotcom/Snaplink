import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Shield, Mail, Calendar, LogOut, Info } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { userService } from "../services/api";
import { User } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await userService.getProfile();
        if (response.success && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to load user profile", error);
        toast.error("Could not fetch profile details");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader size="lg" label="Retrieving user profile details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-white border-3 border-[#0C0C0C]">
          <p className="text-red-500 font-extrabold uppercase tracking-wider text-xs">// ERROR: Unable to load profile</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get first letter of name for profile avatar block
  const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "?";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b-3 border-[#0C0C0C] pb-5">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0C0C0C]">
            Profile Settings
          </h1>
          <p className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mt-1">
            Manage your account info and security credentials
          </p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 neo-card p-6 space-y-6">
            <h3 className="text-lg font-extrabold uppercase tracking-tight flex items-center gap-2 border-b-2 border-[#0C0C0C] pb-3">
              <UserIcon className="w-5 h-5 text-[#FF5A00]" />
              Account Details
            </h3>

            {/* Avatar & Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FFEFE5] p-5 border-2 border-[#0C0C0C] shadow-[3px_3px_0px_0px_#0C0C0C]">
              <div className="w-16 h-16 bg-[#0C0C0C] text-white flex items-center justify-center text-3xl font-black border-2 border-[#0C0C0C] select-none shrink-0 transform -rotate-3">
                {avatarLetter}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-xl font-extrabold text-[#0C0C0C] uppercase tracking-tight">{profile.name}</h4>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#0C0C0C] mt-1 bg-white px-2 py-0.5 border border-[#0C0C0C] w-max mx-auto sm:mx-0">
                  <Shield className="w-3 h-3 text-[#FF5A00]" />
                  <span>ROLE // {profile.role}</span>
                </div>
              </div>
            </div>

            {/* Detail rows */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b-2 border-dashed border-[#0C0C0C] pb-3">
                <span className="text-xs font-black uppercase text-[#5A5A5A] flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#0C0C0C]" />
                  Email Address
                </span>
                <span className="sm:col-span-2 text-sm font-mono font-bold text-[#0C0C0C] break-all">
                  {profile.email}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b-2 border-dashed border-[#0C0C0C] pb-3">
                <span className="text-xs font-black uppercase text-[#5A5A5A] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0C0C0C]" />
                  Member Since
                </span>
                <span className="sm:col-span-2 text-sm font-mono font-bold text-[#0C0C0C]">
                  {new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="neo-btn-danger px-5 py-3 text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Account
              </button>
            </div>
          </div>

          {/* Security Information Panel */}
          <div className="neo-card p-6 space-y-4 hover:bg-[#FFEFE5]/10">
            <h3 className="text-base font-extrabold uppercase tracking-tight flex items-center gap-2 border-b-2 border-[#0C0C0C] pb-3">
              <Info className="w-5 h-5 text-[#FF5A00]" />
              Security Tips
            </h3>

            <div className="space-y-3.5 text-xs font-medium text-[#0C0C0C] leading-relaxed">
              <p className="bg-[#FFEFE5] p-3 border-2 border-[#0C0C0C] font-semibold">
                <strong>Credential Leak Alerts:</strong> Chrome warning alerts occur if your test passwords (like <em>password123</em>) exist in database breaches. Always use unique credentials in staging.
              </p>
              <p>
                <strong>Password Protection:</strong> Define decryption keys for shortcode paths. Visitors redirecting to these links are securely challenged before navigation.
              </p>
              <p>
                <strong>Token Lifetimes:</strong> Authentication tokens expire periodically. Keep your browser session clean by logging out after using shared terminals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
