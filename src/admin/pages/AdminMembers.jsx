import {
    Plus,
    UploadCloud,
    DownloadCloud,
    Wrench,
    Search,
    Settings,
    ChevronDown,
    SearchIcon,
    XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../api/client";
import { formatDate } from "../../utils/formatDate";
import { NavLink } from "react-router-dom";
export default function AdminMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api("/members")
            .then(setMembers)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleDeleteMember(id) {
        if (!confirm("Are you sure you want to delete this member?")) return;

        try {
            await api(`/members/${id}`, {
                method: "DELETE",
            });

            setMembers((prev) => prev.filter((member) => member.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-neutral-200">Members</h1>

                <div className="flex gap-3">


                    <NavLink
                        to="/admin/members/add"
                        className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition"
                    >
                        <Plus size={20} />
                        Create New Member
                    </NavLink>

                </div>
            </div>

            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-800 shadow">
                <div className="flex items-center justify-end gap-8 px-4 py-3 bg-neutral-900">
                    <button className="flex items-center gap-1 text-sm font-bold text-neutral-400">
                        FILTER <ChevronDown size={14} />
                    </button>

                    <button className="flex items-center gap-1 text-sm font-bold text-neutral-400">
                        SORT BY <ChevronDown size={14} />
                    </button>

                    <button className="flex items-center gap-1 text-sm font-bold text-neutral-400">
                        ORDER BY <ChevronDown size={14} />
                    </button>

                    <div className="flex items-center bg-[#2a2f38] rounded-md px-3 py-2 w-80">
                        <Search size={18} className="text-neutral-500 mr-3" />
                        <input
                            className="bg-transparent outline-none flex-1 text-sm font-bold"
                            placeholder="SEARCH"
                        />
                        <Settings size={16} className="text-neutral-500" />
                    </div>
                </div>

                <div className="grid grid-cols-[80px_1.5fr_2fr_1fr_1.5fr_0.5fr] bg-neutral-800 text-sm font-bold text-neutral-400">
                    <div></div>
                    <div className="px-4 py-4">DISPLAY NAME</div>
                    <div className="px-4 py-4">EMAIL ADDRESS</div>
                    <div className="px-4 py-4 flex items-center justify-between">
                        JOINED <ChevronDown size={14} />
                    </div>
                    <div className="px-4 py-4">GROUP</div>
                </div>

                {members.map((member) => (
                    <div
                        key={member.id}
                        className="grid grid-cols-[80px_1.5fr_2fr_1fr_1.5fr_0.5fr] 
                        items-center bg-neutral-900 border-t border-neutral-800 hover:bg-neutral-800"
                    >
                        <div className="px-5 py-5">
                            {member.profilePicture ? (
                                <img
                                    src={member.profilePicture}
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-neutral-700 text-white flex items-center justify-center text-2xl">
                                    {member.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-5 font-bold text-neutral-100">
                            {member.username}
                        </div>

                        <div className="px-4 py-5 text-neutral-300">
                            {member.email}
                        </div>

                        <div className="px-4 py-5">
                            {formatDate(member.createdAt)}
                        </div>

                        <div className="px-4 py-5">
                            {member.role}
                        </div>
                        <div className="px-4 py-5">
                            <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-red-400 hover:text-red-300 font-bold"
                            >
                                <XCircle  size={22}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}