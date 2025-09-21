import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { MessageCircle } from "lucide-react";

export default function ForumPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [topics, setTopics] = useState([]);
    const [forum, setForum] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [newTopic, setNewTopic] = useState({ title: "", content: "" });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const topicsData = await api(`/forums/${id}/topics`);
                const forumData = await api(`/forums/${id}`);

                console.log("DEBUG forum:", forumData);

                setTopics(topicsData);
                setForum(forumData);
            } catch (err) {
                console.error("Error in ForumPage:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);


    async function handleCreateTopic(e) {
        e.preventDefault();
        if (!newTopic.title.trim() || !newTopic.content.trim()) return;

        setCreating(true);
        try {
            const topic = await api("/topics", {
                method: "POST",
                body: JSON.stringify({
                    forum: id,
                    title: newTopic.title,
                    content: newTopic.content,
                }),
            });
            setTopics([topic, ...topics]);
            setNewTopic({ title: "", content: "" });
        } catch (err) {
            alert(err.message);
        } finally {
            setCreating(false);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6 text-gray-700">
            {console.log(forum)}
            {forum && (
                <div className="p-4 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold">{forum.name}</h2>
                    <p className="text-gray-600">{forum.description}</p>
                </div>
            )}

            <div>
                {topics.length === 0 ? (
                    <p className="text-gray-500">Nu există topicuri încă.</p>
                ) : (
                    <div className="space-y-2">
                        {topics.map(topic => (
                            <div
                                key={topic._id}
                                className="p-4 flex gap-4 items-center rounded bg-white hover:bg-gray-50"
                            >

                                <div>
                                    <MessageCircle />
                                </div>
                                <div>
                                    <Link
                                        to={`/topics/${topic._id}`}
                                        className="font-medium"
                                    >
                                        {topic.title}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        creat de <b>{topic.author.username}</b> la{" "}
                                        {new Date(topic.createdAt).toLocaleString()}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {user && (
                <form
                    onSubmit={handleCreateTopic}
                    className="p-4 bg-white border rounded shadow space-y-2"
                >
                    <h3 className="text-lg font-semibold">➕ Creează un topic nou</h3>
                    <input
                        type="text"
                        value={newTopic.title}
                        onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Titlu topic"
                    />
                    <textarea
                        value={newTopic.content}
                        onChange={e => setNewTopic({ ...newTopic, content: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Primul mesaj..."
                        rows="3"
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {creating ? "Se creează..." : "Creează topic"}
                    </button>
                </form>
            )}
        </div>
    );
}
