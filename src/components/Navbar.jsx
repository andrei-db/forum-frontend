import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleColors } from "../utils/roleColors";
import { useState, useEffect, useRef } from "react";
import { CrownIcon, MenuIcon, SearchIcon, UsersIcon, X } from "lucide-react";
export default function Navbar() {
  const nav = useNavigate();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <nav className="flex justify-between items-center px-5 py-4 bg-neutral-900 shadow text-neutral-300">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden text-white"
      >
        <MenuIcon size={24} />
      </button>
      {mobileOpen && (
        <div className="absolute top-0 left-0 min-w-80 h-full bg-neutral-800 flex
         flex-col items-start p-4 gap-3 border-t border-neutral-800 md:hidden z-50">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="absolute right-3 text-white"
          >
            <X size={24} />
          </button>
          {user ? (
            <>
              <Link
                to={`/members/${user.username}`}
                onClick={() => setMobileOpen(false)}
                className={`${roleColors[user.role]} font-bold`}
              >
                {user.username}
              </Link>
              <Link to="/account/account-details" onClick={() => setMobileOpen(false)}>
                Account details
              </Link>
              <Link to="/account/security" onClick={() => setMobileOpen(false)}>
                Security
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  nav("/login");
                }}
                className="w-full text-left text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
      <div className="flex gap-5 items-center">
        <Link to="/" className="text-2xl font-bold flex
         items-center gap-1 hover:bg-neutral-800 p-2 rounded">
          Forum MVP
        </Link>
        <div className="hidden md:flex">
          <Link to="/" className="text-lg font-semibold flex items-center gap-1 hover:bg-neutral-800 p-2 rounded">
            <UsersIcon />
            Staff
          </Link>
          <Link to="/" className="text-lg font-semibold flex items-center gap-1 hover:bg-neutral-800 p-2 rounded">
            <CrownIcon />
            Leaderboard
          </Link>
          <Link to="/" className="text-lg font-semibold flex items-center gap-1 hover:bg-neutral-800 p-2 rounded">
            <SearchIcon />
            Search
          </Link>
        </div>

      </div>


      <div className="hidden sm:flex items-center gap-4">
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
              <div className="absolute right-0 w-50 bg-neutral-900 rounded-md shadow-lg z-50">
                
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
            <Link className="font-bold" to="/login">
              Existing user? Sign In
            </Link>
            <Link className="font-bold bg-blue-500 rounded py-1 px-4" to="/register">
              Register
            </Link>
          </>
        )}
      </div>


    </nav>
  );
}