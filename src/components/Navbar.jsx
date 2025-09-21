import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleColors } from "../utils/roleColors";
export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-neutral-900 shadow text-neutral-300">
      <Link to="/" className="text-lg font-bold">
        Forum MVP
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div >👋 Hi, <span className={`${roleColors[user.role]} font-bold`}>{user.username}</span>!</div>
            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
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