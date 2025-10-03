import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleColors } from "../utils/roleColors";
import { useState, useEffect, useRef } from "react";
export default function Navbar() {
  const nav = useNavigate();
  const { user, loading, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-neutral-900 shadow text-neutral-300">
      <Link to="/" className="text-lg font-bold">
        Forum MVP
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative cursor-pointer hover:bg-neutral-700 rounded-sm" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex p-2 items-center gap-1 hover:text-white"
            >
              👋 Hi,{" "}
              <span className={`${roleColors[user.role]} font-bold`}>
                {user.username}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-50 bg-neutral-900 rounded-md shadow-lg z-50">
                 {user.role === "admin" ? (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-sm font-bold bg-black hover:bg-red-500"
                    onClick={() => setOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : null}
                <Link
                  to={`/members/${user.username}`}
                  className="block px-4 py-2 text-sm hover:bg-neutral-700"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
               
                <Link
                  to="/account/account-details"
                  className="block px-4 py-2 text-sm hover:bg-neutral-700"
                  onClick={() => setOpen(false)}
                >
                  Account details
                </Link>
                <Link
                  to="/account/security"
                  className="block px-4 py-2 text-sm hover:bg-neutral-700"
                  onClick={() => setOpen(false)}
                >
                  Password and security
                </Link>
                <button
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>
            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}