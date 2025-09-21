import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const nav = useNavigate();
    const { login } = useAuth();

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await api("/auth/login", {
                method: "POST",
                body: JSON.stringify(form),
            });
            login(data.token, data.user);
            nav("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center text-neutral-200 my-20">
            <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={form.identifier}
                            onChange={(e) =>
                                setForm({ ...form, identifier: e.target.value })
                            }
                            className="w-full bg-neutral-800 px-3 py-2 rounded-lg focus:border-blue-500 placeholder:text-neutral-500"
                            placeholder="yourname or you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full bg-neutral-800 px-3 py-2 rounded-lg focus:border-blue-500 placeholder:text-neutral-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6 text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
