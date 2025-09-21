import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      nav("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center text-gray-200">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-md p-8 my-20">
        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-300">Register</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full placeholder:text-neutral-500 bg-neutral-800 px-3 py-2 rounded-lg focus:border-blue-500"
              placeholder="john_doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full placeholder:text-neutral-500 bg-neutral-800 px-3 py-2 rounded-lg focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 placeholder:text-neutral-500 bg-neutral-800 rounded-lg focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
