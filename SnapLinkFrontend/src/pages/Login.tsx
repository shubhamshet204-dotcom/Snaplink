import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data.token) {
        loginUser(response.data.token);
        toast.success(response.message || "Welcome back to SnapLink!");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to log in");
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid email or password";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="bg-white border-4 border-[#0C0C0C] p-8 shadow-[8px_8px_0px_0px_#0C0C0C]">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#0C0C0C]">
            Sign in to account
          </h2>
          <p className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mt-1">
            Shorten and track your links
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full neo-input px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0C0C0C] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full neo-input px-4 py-3 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-4 neo-btn-primary text-sm uppercase tracking-wider"
          >
            {loading ? (
              <span className="w-5 h-5 border-3 border-t-transparent border-black rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mt-6">
          Don't have an account?
          <Link to="/register" className="text-[#FF5A00] ml-1.5 hover:underline font-extrabold">
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
