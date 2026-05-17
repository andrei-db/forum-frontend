import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Folder,
  Settings,
  Brush,
  ShieldCheck,
} from "lucide-react";

const items = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Forums & Categories", to: "/admin/forums", icon: MessageCircle },
  { label: "Members", to: "/admin/members", icon: Users },
  { label: "Groups", to: "/admin/groups", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 text-neutral-300">
      <div className="h-16 flex items-center px-5 border-b border-neutral-800">
        <h1 className="text-lg font-bold text-white">Admin Panel</h1>
      </div>

      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}