import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();
  const { settings } = useSettings();

  const submit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      nav("/login");
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  if (settings?.registrationEnabled === "false") {
    return (
      <div className="my-20 mx-auto max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-300">
        <h1 className="text-2xl font-bold text-neutral-100 mb-3">
          Registration is closed
        </h1>
        <p className="text-neutral-500">
          New account registrations are currently disabled.
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center text-neutral-200 my-20 px-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-md p-8 border border-neutral-800">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create Account
        </h2>

        <p className="text-sm text-neutral-500 text-center mb-6">
          Join the community and start posting.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-950/50 border border-red-900 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Username
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="w-full bg-neutral-800 pl-10 pr-3 py-2 rounded-lg outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-500 transition"
                placeholder="john_doe"
                autoComplete="username"
                minLength={3}
                maxLength={20}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full bg-neutral-800 pl-10 pr-3 py-2 rounded-lg outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-500 transition"
                placeholder="you@example.com"
                autoComplete="email"
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
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <p className="text-xs text-neutral-500 mt-1">
              Minimum 6 characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-neutral-500 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}