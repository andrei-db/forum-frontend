import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { MessageCircle } from "lucide-react";
import { roleColors } from "../utils/roleColors";

export default function ForumPage() {
    const { id } = useParams();
    const [topics, setTopics] = useState([]);
    const [forum, setForum] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const topicsData = await api(`/forums/${id}/topics-with-last-reply`);
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
        <div className="space-y-6 text-neutral-300">
            {forum && (
                <div className="p-4 bg-neutral-900 rounded shadow">
                    <h2 className="text-2xl font-bold">{forum.name}</h2>
                    <p className="text-neutral-300">{forum.description}</p>
                </div>
            )}
            <div className="flex justify-end items-center">
                <Link
                    to={`/forums/${id}/new-topic`}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    New topic
                </Link>
            </div>
            <div>
                {topics.length === 0 ? (
                    <p className="text-neutral-300">Nu există topicuri încă.</p>
                ) : (
                    <div className="space-y-2">
                        {topics.map(topic => (
                            <div
                                key={topic._id}
                                className="p-4 flex justify-between gap-4 items-center rounded bg-neutral-900 hover:bg-neutral-800"
                            >
                                <div className="flex items-center">
                                    <div className="me-3">
                                        <MessageCircle />
                                    </div>
                                    <div>
                                        <Link
                                            to={`/topics/${topic._id}`}
                                            className="font-medium"
                                        >
                                            {topic.title}
                                        </Link>
                                        <p className="text-sm text-neutral-500">
                                            created by <span className={`${roleColors[topic.author.role]} font-bold`}>{topic.author.username}</span> at{" "}
                                            {new Date(topic.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-10 items-center">
                                    <div>
                                        <p className="text-sm text-neutral-500">
                                            Replies: {topic.replies}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <div className="text-end w-40">
                                            {topic.lastReply ? (
                                                <>
                                                    <p className="text-xs">
                                                        {new Date(topic.lastReply.createdAt).toLocaleString()}
                                                    </p>
                                                    <p className={`${roleColors[topic.lastReply.author.role]} text-sm font-medium`}>
                                                        {topic.lastReply.author.username}
                                                    </p>

                                                </>
                                            ) : (
                                                <p className="text-xs text-neutral-500">No replies yet</p>
                                            )}
                                        </div>
                                        <div className="ms-3 h-10 w-10 me-3">
                                            <img className="w-full h-full object-cover rounded opacity-90" src={topic?.lastReply.author.profilePicture || "/default-avatar.png"}></img>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
}
