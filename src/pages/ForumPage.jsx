import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { MessageCircle } from "lucide-react";

export default function ForumPage() {
    const { id } = useParams();
    const [topics, setTopics] = useState([]);
    const [forum, setForum] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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
            <div className="flex justify-end items-center">
            <Link
                to={`/forums/${id}/new-topic`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Creează topic nou
            </Link>
            </div>
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

          
        </div>
    );
}
