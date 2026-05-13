import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: form.identifier.trim(),
          password: form.password,
        }),
      });

      login(data.token, data.user);
      nav("/");
    } catch (err) {
      setError(err.message || "Invalid username/email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center text-neutral-200 my-20 px-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-md p-8 border border-neutral-800">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>

        <p className="text-sm text-neutral-500 text-center mb-6">
          Welcome back. Sign in to continue.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-950/50 border border-red-900 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Username or Email
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

              <input
                type="text"
                value={form.identifier}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                className="w-full bg-neutral-800 pl-10 pr-3 py-2 rounded-lg outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-500 transition"
                placeholder="yourname or you@example.com"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full bg-neutral-800 pl-10 pr-3 py-2 rounded-lg outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-500 transition"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-neutral-500 mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}