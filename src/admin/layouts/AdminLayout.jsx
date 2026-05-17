import { Outlet, NavLink } from "react-router-dom";



import {
  Search,
  Home,
  Link as LinkIcon,
  Bell,
  Settings,
  MessageCircle,
  User,
  DollarSign,
  FileText,
  BarChart3,
  Brush,
  Upload,
  Plus,
  AlertTriangle,
  GripVertical,
  Pencil,
  FileImage,
  ChevronDown,
  Code,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <AdminSidebar />

      <main className="flex-1">
        <AdminNavbar />
        <Outlet />
      </main>
    </div>
  );
}
