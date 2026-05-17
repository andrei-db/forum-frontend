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
    Check,
    Pencil,
    LockIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../api/client";
import { NavLink, useSearchParams } from "react-router-dom";
export default function AdminGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sortOpen, setSortOpen] = useState(false);
    const [orderOpen, setOrderOpen] = useState(false);

    const [search, setSearch] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const sortBy = searchParams.get("sort") || "name";
    const orderBy = searchParams.get("order") || "asc";

    const sortOptions = [
        { label: "Group Name", value: "name" },
        { label: "Number of Members", value: "members" }
    ];

    const filteredGroups = groups.filter((group) => {
        const query = search.toLowerCase().trim();

        if (!query) return true;

        return (
            group.name.toLowerCase().includes(query)

        );
    });

    const sortedGroups = [...filteredGroups].sort((a, b) => {
        let aValue;
        let bValue;

        switch (sortBy) {
            case "members":
                aValue = a._count.users;
                bValue = b._count.users;
                break;

            default:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
        }

        if (aValue < bValue) return orderBy === "asc" ? -1 : 1;
        if (aValue > bValue) return orderBy === "asc" ? 1 : -1;

        return 0;
    });

    useEffect(() => {
        api("/groups")
            .then(setGroups)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleDeleteGroup(id) {
        if (!confirm("Are you sure you want to delete this group?")) return;

        try {
            await api(`/groups/${id}`, {
                method: "DELETE",
            });

            setGroups((prev) => prev.filter((group) => group.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-neutral-200">Groups</h1>

                <div className="flex gap-3">


                    <NavLink
                        to="/admin/groups/add"
                        className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition"
                    >
                        <Plus size={20} />
                        Create New Group
                    </NavLink>

                </div>
            </div>

            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-800 shadow">
                <div className="flex items-center justify-end gap-8 px-4 py-3 bg-neutral-900">



                    <div className="relative">
                        <button
                            onClick={() => setSortOpen(!sortOpen)}
                            className={`
      flex items-center gap-2 px-5 py-4 rounded-lg text-sm font-bold transition
      ${sortOpen
                                    ? "bg-neutral-700 text-white ring-4 ring-slate-800"
                                    : "text-neutral-400 hover:text-white"
                                }
    `}
                        >
                            SORT BY
                            <ChevronDown size={16} />
                        </button>

                        {sortOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-[62px] w-[250px] bg-neutral-800 border border-[#171b22] rounded-xl shadow-2xl z-[999]">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-neutral-800 border-l border-t border-[#171b22] rotate-45" />

                                <div className="relative z-10 py-4">
                                    {sortOptions.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setSearchParams({
                                                    sort: item.value,
                                                    order: orderBy,
                                                });
                                                setSortOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-8 py-4 hover:bg-neutral-700 transition text-left"
                                        >
                                            <div className="w-7 flex justify-center">
                                                {sortBy === item.value ? (
                                                    <Check size={26} className="text-neutral-300" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border-2 border-neutral-600" />
                                                )}
                                            </div>

                                            <span className="text-[16px] leading-none font-semibold text-neutral-300">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative z-50">
                        <button
                            onClick={() => setOrderOpen(!orderOpen)}
                            className="flex items-center gap-1 text-sm font-bold text-neutral-400"
                        >
                            ORDER BY <ChevronDown size={14} />
                        </button>

                        {orderOpen && (
                            <div className="absolute right-0 top-10 w-44 bg-[#2b3038] border border-neutral-700 rounded-lg shadow-xl z-[999]">
                                <button
                                    onClick={() => {
                                        setSearchParams({
                                            sort: sortBy,
                                            order: "asc",
                                        });

                                        setOrderOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-3 hover:bg-neutral-700"
                                >
                                    Ascending
                                </button>

                                <button
                                    onClick={() => {
                                        setSearchParams({
                                            sort: sortBy,
                                            order: "desc",
                                        });

                                        setOrderOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-3 hover:bg-neutral-700"
                                >
                                    Descending
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center bg-[#2a2f38] rounded-md px-3 py-2 w-80">
                        <Search size={18} className="text-neutral-500 mr-3" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none flex-1 text-sm font-bold"
                            placeholder="SEARCH"
                        />
                        <Settings size={16} className="text-neutral-500" />
                    </div>
                </div>

                <div className="grid grid-cols-[1.5fr_1.5fr_0.5fr] bg-neutral-800 text-sm font-bold text-neutral-400">
                    <div className="px-4 py-4">GROUP NAME</div>
                    <div className="px-4 py-4">MEMBERS</div>
                </div>

                {sortedGroups.length === 0 ? (
                    <div className="px-6 py-8 text-neutral-500 text-center bg-neutral-900 border-t border-neutral-800">
                        No groups found.
                    </div>
                ) : (
                    sortedGroups.map((group) => (
                        <NavLink
                            to={`/admin/groups/${group.id}`}>


                            <div
                                key={group.id}
                                className="grid grid-cols-[1.5fr_1.5fr_0.5fr]
                        items-center bg-neutral-900 border-t border-neutral-800 hover:bg-neutral-800"
                            >


                                <div className={`${group.color} px-4 py-5 font-bold `}>
                                    {group.name}
                                </div>

                                <div className="px-4 py-5 text-neutral-300">
                                    {group._count.users}
                                </div>
                                <div className="px-4 py-5 flex gap-3">
                                    <NavLink
                        to={`/admin/groups/${group.id}`}
                                    className="p-2 cursor-pointer rounded hover:bg-neutral-700 font-bold"
                                >
                                    <Pencil size={20} /> 
                                </NavLink>
                                
                                <NavLink key={group.id} to={`/admin/groups/${group.id}/permissions`}
                                className="p-2 cursor-pointer rounded hover:bg-neutral-700 font-bold"
                                >
                                
                                    <LockIcon size={20} />
                                </NavLink>
                                <button
                                    onClick={
                                        (e) =>{
                                            e.preventDefault();
                                            handleDeleteGroup(group.id);
                                        }
                                    }
                                    className="p-2 cursor-pointer rounded hover:bg-neutral-700 font-bold"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            </div>
                        </NavLink>
                    )))}
            </div>
        </div>
    );
}