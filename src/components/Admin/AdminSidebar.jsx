import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, BookOpen, ClipboardList, FileClock, LayoutDashboard, MessageSquare, Settings, Ticket, Users, FileText, Image as ImageIcon, Waves, Utensils, Bed, GraduationCap, Tag, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { settingsService } from "../../services/settingsService";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Hero Landing", path: "/admin/hero", icon: BookOpen },
  { label: "Tickets", path: "/admin/tickets", icon: Ticket },
  { label: "Bookings", path: "/admin/bookings", icon: ClipboardList },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Gallery", path: "/admin/gallery", icon: ImageIcon },
  { label: "Attractions", path: "/admin/attractions", icon: Waves },
  { label: "Restaurant", path: "/admin/restaurant", icon: Utensils },
  { label: "Suites & Rooms", path: "/admin/suites", icon: Bed },
  { label: "Events & Halls", path: "/admin/halls", icon: GraduationCap },
  { label: "Promotions", path: "/admin/offers", icon: Tag, roles: ["super_admin", "admin"] },
  { label: "Content Mgmt", path: "/admin/content", icon: FileText, roles: ["super_admin", "admin"] },
  { label: "SEO Manager", path: "/admin/seo", icon: Search, roles: ["super_admin", "admin"] },
  { label: "Settings", path: "/admin/settings", icon: Settings, roles: ["super_admin", "admin"] },
  { label: "Users", path: "/admin/users", icon: Users, roles: ["super_admin", "admin"] },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: FileClock, roles: ["super_admin", "admin"] },
];

export default function AdminSidebar() {
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
        console.error("Failed to load sidebar toggles in AdminSidebar:", err);
      }
    }
    loadToggles();
    return () => {
      active = false;
    };
  }, []);

  const visibleItems = navItems.filter((item) => {
    if (item.roles && !item.roles.includes(user?.role)) {
      return false;
    }
    if (item.label === "Settings") {
      return true;
    }
    if (toggles && toggles[item.label] === false) {
      return false;
    }
    return true;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
      {/* Pinned Header */}
      <div className="h-20 px-6 flex items-center border-b border-slate-850 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-md font-black tracking-tight">YOYO Admin</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Booking Ops</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Pinned Footer Card */}
      <div className="p-4 border-t border-slate-850 bg-slate-900/30 flex-shrink-0">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <BookOpen className="mb-2 text-blue-300" size={18} />
          <p className="text-xs font-black text-slate-200">YOYO FUN N FOODS</p>
          <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-400">
            Secure booking, inventory, and revenue operations.
          </p>
        </div>
      </div>
    </aside>
  );
}
