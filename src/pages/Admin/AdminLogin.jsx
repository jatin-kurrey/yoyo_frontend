import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function AdminLogin() {
  usePageTitle("Admin Login");
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setForm({
      email: import.meta.env.VITE_DEMO_ADMIN_EMAIL || "admin@yoyofun.local",
      password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "admin123",
    });
  };

  const isDevelopment = import.meta.env.DEV;

  const demoEmail = import.meta.env.VITE_DEMO_ADMIN_EMAIL || "admin@yoyofun.local";
  const demoPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "admin123";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-blue-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-white/15">
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-4xl font-black tracking-tight">YOYO FUN N FOODS</h1>
              <p className="mt-4 max-w-md text-lg font-semibold leading-8 text-blue-50">Secure operations for tickets, bookings, payments, messages, users, and revenue tracking.</p>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-100">Admin access only</p>
          </div>
          <div className="p-8 text-slate-900 md:p-12">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">Admin Login</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Welcome back</h2>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Email</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-4 pl-12 pr-4 font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                    autoComplete="email"
                  />
                </div>
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Password</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    className="w-full rounded-lg border border-slate-200 py-4 pl-12 pr-4 font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </label>
              {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
              <button disabled={submitting} className="w-full rounded-lg bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60">
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo Credentials - Development Only */}
            {isDevelopment && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <button
                  onClick={() => setShowDemo(!showDemo)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showDemo ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showDemo ? "Hide" : "Show"} Demo Credentials
                </button>

                  {showDemo && (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                        <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">
                          Development Only
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Email</p>
                            <p className="text-sm font-bold text-slate-900">{demoEmail}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Password</p>
                            <p className="text-sm font-bold text-slate-900">{demoPassword}</p>
                          </div>
                        </div>
                        <button
                          onClick={fillDemo}
                          type="button"
                          className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
