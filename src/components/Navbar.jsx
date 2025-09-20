import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow text-gray-700">
      <Link to="/" className="text-lg font-bold">
        Forum MVP
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">👋 Hi, {user.username}!</span>
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