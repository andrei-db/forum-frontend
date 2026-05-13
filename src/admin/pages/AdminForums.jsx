import {
    Plus,
    ChevronDown,
    MessageCircle,
    Grip,
    PlusCircle,
    XCircle,
    Pencil
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/client";

export default function AdminForums() {
    const [categories, setCategories] = useState([]);
    const [openCategories, setOpenCategories] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        loadForums();
    }, []);

    async function loadForums() {
        try {
            const data = await api("/categories");

            setCategories(data);

            const opened = {};

            data.forEach((cat) => {
                opened[cat.id] = false;
            });

            setOpenCategories(opened);
        } catch (err) {
            setError(err.message || "Failed to load forums");
        }
    }

    async function deleteCategory(id) {
        const confirmed = window.confirm(
            "Delete this category and everything inside it?"
        );

        if (!confirmed) return;

        try {
            await api(`/categories/${id}`, {
                method: "DELETE",
            });

            setCategories((prev) =>
                prev.filter((cat) => cat.id !== id)
            );
        } catch (err) {
            alert(err.message);
        }
    }
    async function deleteForum(id) {
        const confirmed = window.confirm(
            "Delete this forum and everything inside it?"
        );

        if (!confirmed) return;

        try {
            await api(`/forums/${id}`, {
                method: "DELETE",
            });

            setCategories((prev) =>
                prev.map((category) => ({
                    ...category,
                    forums: category.forums.filter((forum) => forum.id !== id),
                }))
            );
        } catch (err) {
            alert(err.message);
        }
    }
    function toggleCategory(id) {
        setOpenCategories((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    return (
        <section className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-neutral-300">
                    Forums
                </h1>

                <NavLink
                    to="/admin/forums/add"
                    className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition"
                >
                    <Plus size={20} />
                    Create New
                </NavLink>
            </div>

            {error && (
                <div className="mb-5 text-red-400 bg-red-950/40 border border-red-900 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {categories.map((category) => {
                    const isOpen = openCategories[category.id];

                    return (
                        <div
                            key={category.id}
                            className="bg-neutral-800 border border-neutral-800 overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-6 py-5 bg-neutral-900 flex items-center justify-between text-left hover:bg-neutral-900 transition"
                            >
                                <div className="flex gap-5 items-center">
                                    <Grip size={22}
                                        className="text-neutral-400" />
                                    <ChevronDown
                                        size={22}
                                        className={`text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {category.name}
                                        </h2>

                                        {category.description && (
                                            <p className="text-neutral-500 text-sm mt-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                </div>
                                <div className="flex gap-5">

                                    <NavLink
                                        to={`/admin/forums/add?categoryId=${category.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                         <PlusCircle size={26} className="text-neutral-500" />
                                    </NavLink>
                                    <NavLink
                                        to={`/admin/categories/${category.id}/edit`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Pencil size={26} className="text-neutral-500" />
                                    </NavLink>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCategory(category.id);
                                        }}

                                    >
                                        <XCircle size={26} className="text-red-500" />
                                    </button>

                                </div>


                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeInOut",
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="divide-y divide-neutral-800">
                                            {category.forums.length === 0 ? (
                                                <div className="p-6 text-neutral-500">
                                                    No forums in this category.
                                                </div>
                                            ) : (
                                                category.forums.map((forum) => (
                                                    <div
                                                        key={forum.id}
                                                        className="flex items-center justify-between px-6 py-5 hover:bg-neutral-800/40 transition"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-11 h-11 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                                                <MessageCircle
                                                                    size={20}
                                                                    className="text-blue-400"
                                                                />
                                                            </div>

                                                            <div>
                                                                <h3 className="font-semibold text-white">
                                                                    {forum.name}
                                                                </h3>

                                                                <p className="text-sm text-neutral-500">
                                                                    {forum.description || "No description"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-5">
                                                            <button>
                                                                <PlusCircle size={20} className="text-neutral-500" />
                                                            </button>

                                                            <NavLink
                                                                to={`/admin/forums/${forum.id}/edit`}
                                                            >
                                                                <Pencil size={20} className="text-neutral-500" />
                                                            </NavLink>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteForum(forum.id);
                                                                }}

                                                            >
                                                                <XCircle size={20} className="text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}