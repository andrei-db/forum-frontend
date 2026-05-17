import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Shield, Mail, Calendar, MessageCircle } from "lucide-react";
import { api } from "../../api/client";
import { formatDate } from "../../utils/formatDate";

export default function AdminMemberProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [member, setMember] = useState(null);
    const [groups, setGroups] = useState([]);
    const [form, setForm] = useState({
        username: "",
        email: "",
        groupId: "",
        profilePicture: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [memberData, groupsData] = await Promise.all([
                    api(`/members/id/${id}`),
                    api("/groups"),
                ]);

                setMember(memberData);
                setGroups(groupsData);

                setForm({
                    username: memberData.username || "",
                    email: memberData.email || "",
                    groupId: memberData.group?.id || "",
                    profilePicture: memberData.profilePicture || "",
                    password: "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const updated = await api(`/members/id/${id}`, {
                method: "PATCH",
                body: JSON.stringify(form),
            });

            setMember((prev) => ({
                ...prev,
                ...updated,
            }));

            setForm((prev) => ({
                ...prev,
                password: "",
            }));

            alert("Member updated");
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p className="p-8 text-neutral-400">Loading member...</p>;
    if (error) return <p className="p-8 text-red-400">{error}</p>;
    if (!member) return <p className="p-8 text-neutral-400">Member not found</p>;

    return (
        <section className="p-8 text-neutral-300">
            <button
                onClick={() => navigate("/admin/members")}
                className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white"
            >
                <ArrowLeft size={18} />
                Back to members
            </button>

            <div className="flex items-center justify-between mb-8 
      bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <div className="flex items-center gap-5">
                    {member.profilePicture ? (
                        <img
                            src={member.profilePicture}
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-neutral-700 flex items-center justify-center text-4xl font-bold">
                            {member.username[0]?.toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold text-neutral-100">
                            {member.username}
                        </h1>
                        <p className="text-neutral-500">{member.email}</p>
                    </div>
                </div>
                {/* 
        <span className="px-4 py-2 rounded bg-neutral-800 text-sm font-bold">
          {member.online ? "Online" : "Offline"}
        </span> */}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Shield size={20} />} label="Group" value={member.group.name} />
                <StatCard icon={<MessageCircle size={20} />} label="Posts" value={member.postsCount} />
                <StatCard icon={<MessageCircle size={20} />} label="Topics" value={member.topicsCount} />
                <StatCard icon={<Calendar size={20} />} label="Joined" value={formatDate(member.createdAt)} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden"
            >
                <FormRow label="Username">
                    <input
                        value={form.username}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, username: e.target.value }))
                        }
                        className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                    />
                </FormRow>

                <FormRow label="Email">
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                    />
                </FormRow>

                
                    <FormRow label="Group">
                        <select
                            value={form.groupId}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    groupId: e.target.value,
                                }))
                            }
                            className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                        >
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </FormRow>



                <FormRow label="New password">
                    <input
                        type="password"
                        value={form.password}
                        placeholder="Leave empty to keep current password"
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, password: e.target.value }))
                        }
                        className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
                    />
                </FormRow>

                <div className="flex justify-center p-5 border-t border-neutral-800">
                    <button
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-7 py-2.5 rounded text-white font-bold"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </form>
        </section>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-neutral-500 mb-2">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <p className="text-xl font-bold text-neutral-100">{value}</p>
        </div>
    );
}

function FormRow({ label, children }) {
    return (
        <div className="grid grid-cols-[260px_1fr] gap-6 px-5 py-7 border-t border-neutral-800">
            <div className="text-right pt-2">
                <p className="font-bold text-neutral-200">{label}</p>
            </div>
            <div>{children}</div>
        </div>
    );
}