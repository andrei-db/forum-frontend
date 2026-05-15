import { useState, useEffect } from "react";
import {
    Bold,
    Italic,
    Underline,
    Link as LinkIcon,
    Smile,
    MoreHorizontal,
    Paperclip,
    FolderOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
export default function AdminAddMember() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        password: "",
        email: "",
        group: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const submit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.password.trim() || !form.email.trim()) {
            setError("All fields are required");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await api("/members", {
                method: "POST",
                body: JSON.stringify({
                    username: form.name,
                    password: form.password,
                    email: form.email,
                    role: form.group || "user",
                }),
            });

            navigate("/admin/members");
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold mb-8">
                Create New Member
            </h1>

            <div className="bg-neutral-900 border border-[#2b313a] rounded-lg overflow-hidden">

                {error && (
                    <div className="mx-5 mt-5 text-red-400 bg-red-950/40 border border-red-900 p-3 rounded-lg">
                        {error}
                    </div>
                )}
                <form onSubmit={submit}>
                    <FormRow label="Name" required>
                        <input
                            value={form.name}
                            required
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </FormRow>
                    <FormRow label="Password" required>
                        <input
                            type="password"
                            value={form.password}
                            required
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, password: e.target.value }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </FormRow>
                    <FormRow label="Email" required>
                        <input
                            value={form.email}
                            required
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </FormRow>
                    <FormRow label="Group" required>
                        <select
                            value={form.group}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    group: e.target.value,
                                }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        >
                            <option value="">Select group</option>
                            <option value="user">Member</option>
                            <option value="admin">Administrator</option>
                        </select>
                        
                </FormRow>





                <div className="flex justify-center p-5 border-t border-[#2b313a]">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-7 py-2.5 rounded-md text-white font-bold transition"
                    >
                        {submitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>



        </div>
        </section >
    );
}

function FormRow({ label, required, children }) {
    return (
        <div className="grid grid-cols-[260px_1fr] gap-6 px-5 py-7 border-t border-[#2b313a]">
            <div className="text-right pt-2">
                <p className="font-bold text-neutral-200">{label}</p>

                {required && (
                    <p className="text-xs text-red-400 font-bold uppercase mt-1">
                        Required
                    </p>
                )}
            </div>

            <div>{children}</div>
        </div>
    );
}