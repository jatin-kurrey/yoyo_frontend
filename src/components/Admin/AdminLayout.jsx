import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../hooks/useAuth";
import { settingsService } from "../../services/settingsService";

const mobileItems = [
  ["Dashboard", "/admin/dashboard"],
  ["Hero Landing", "/admin/hero"],
  ["Tickets", "/admin/tickets"],
  ["Bookings", "/admin/bookings"],
  ["Messages", "/admin/messages"],
  ["Gallery", "/admin/gallery"],
  ["Attractions", "/admin/attractions"],
  ["Restaurant", "/admin/restaurant"],
  ["Suites & Rooms", "/admin/suites"],
  ["Events & Halls", "/admin/halls"],
  ["Promotions", "/admin/offers", ["super_admin", "admin"]],
  ["Content Mgmt", "/admin/content", ["super_admin", "admin"]],
  ["SEO Manager", "/admin/seo", ["super_admin", "admin"]],
  ["Settings", "/admin/settings", ["super_admin", "admin"]],
  ["Users", "/admin/users", ["super_admin", "admin"]],
  ["Audit Logs", "/admin/audit-logs", ["super_admin", "admin"]],
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [toggles, setToggles] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadToggles() {
      try {
        const data = await settingsService.public();
        if (active && data?.admin_sidebar_toggles) {
          setToggles(data.admin_sidebar_toggles);
        }
      } catch (err) {
        console.error("Failed to load sidebar toggles in AdminLayout:", err);
      }
    }
    loadToggles();
    return () => {
      active = false;
    };
  }, []);

  const visibleMobileItems = mobileItems.filter((item) => {
    // 1. Check user roles access
    if (item[2] && !item[2].includes(user?.role)) {
      return false;
    }
    // 2. Settings is always visible
    if (item[0] === "Settings") {
      return true;
    }
    // 3. Filter by admin sidebar toggles
    if (toggles && toggles[item[0]] === false) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 backdrop-blur-sm lg:hidden">
          <div className="h-full w-full max-w-sm rounded-lg bg-slate-950 p-4 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-lg font-black">YOYO Admin</p>
              <button onClick={() => setOpen(false)} className="rounded-lg bg-white/10 p-2">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-2">
              {visibleMobileItems.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `block rounded-lg px-4 py-3 text-sm font-black ${isActive ? "bg-blue-600" : "text-slate-300"}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
      <div className="lg:pl-72">
        <AdminHeader onMenu={() => setOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
