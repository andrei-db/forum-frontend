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
export default function AdminAddGroup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        slug: "",
        color: "text-neutral-300",
        description: "",
        isStaff: false,
        isDefault: false,
    });


    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    async function handleSubmit(e) {
    e.preventDefault();

    try {
        setSubmitting(true);
        setError("");

        await api("/groups", {
            method: "POST",
            body: JSON.stringify(form),
        });

        navigate("/admin/groups");
    } catch (err) {
        setError(err.message || "Something went wrong");
    } finally {
        setSubmitting(false);
    }
}

    return (
        <section className="p-8">
            <h1 className="text-2xl font-bold mb-8">
                Create New Group
            </h1>

            <div className="bg-neutral-900 border border-[#2b313a] rounded-lg overflow-hidden">

                {error && (
                    <div className="mx-5 mt-5 text-red-400 bg-red-950/40 border border-red-900 p-3 rounded-lg">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <FormRow label="Group Name" required>
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                            placeholder="Members"
                        />
                    </FormRow>

                    <FormRow label="Slug" required>
                        <input
                            value={form.slug}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    slug: e.target.value,
                                }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                            placeholder="members"
                        />
                    </FormRow>

                    <FormRow label="Color Class">
                        <input
                            value={form.color}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    color: e.target.value,
                                }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                            placeholder="text-blue-400"
                        />

                        <p className={`mt-3 text-sm font-bold ${form.color}`}>
                            Preview Color
                        </p>
                    </FormRow>

                    <FormRow label="Description">
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="w-full max-w-xl min-h-32 bg-neutral-800 border border-neutral-700 rounded px-4 py-3 outline-none focus:border-blue-500 resize-none"
                            placeholder="Group description..."
                        />
                    </FormRow>

                    <FormRow label="Staff Permissions">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.isStaff}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isStaff: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5"
                            />

                            <span>Allow ACP / moderation access</span>
                        </label>
                    </FormRow>

                    <FormRow label="Default Group">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isDefault: e.target.checked,
                                    }))
                                }
                                className="w-5 h-5"
                            />

                            <span>Assign automatically to new members</span>
                        </label>
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
            <div className="text-right">
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