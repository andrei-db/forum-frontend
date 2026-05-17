import { NavLink } from "react-router-dom";


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
export default function AdminNavbar(){
    return(
        <header className="sticky top-0 h-16 bg-neutral-900 border-b border-[#2a3038] flex items-center px-4 gap-4">
          <div className="relative flex-1 max-w-5xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input
              className="w-full h-12 bg-neutral-800 rounded-md pl-11 pr-4 outline-none text-sm text-neutral-200 placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-600"
              placeholder="Search for settings, members, etc."
            />
          </div>


      
          <NavLink
            to="/"
            target="_blank"
            rel="noopener noreferrer" className="flex gap-1 items-center hover:bg-neutral-700 py-2 px-3 rounded font-semibold"
          >
            <Home size={17} />
            Visit Website
          </NavLink>
          

          <button className="relative text-neutral-300 hover:text-white">
            <Bell size={21} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="w-10 h-10 rounded-full bg-teal-400 text-white flex items-center justify-center font-bold">
            A
          </div>
        </header>
    );
}