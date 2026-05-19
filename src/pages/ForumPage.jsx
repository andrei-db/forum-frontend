import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { LockIcon, MessageCircle, PinIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import ForumActionBox from "../components/ForumActionBox";
export default function ForumPage() {
    const { id } = useParams();
    const [topics, setTopics] = useState([]);
    const [forum, setForum] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    useEffect(() => {
        async function loadData() {
            try {
                const topicsData = await api(`/forums/${id}/topics-with-last-reply`);
                const forumData = await api(`/forums/${id}`);
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


    if (error) {
        return (
            <div className="mt-5 text-sm text-red-500 bg-yellow-950/20 border border-yellow-900/40 rounded p-4">
                {error}
            </div>
        );
    }
    return (
        <div className="space-y-6 mt-5 text-neutral-300">

            {forum && (
                <>
                    <Breadcrumbs
                        items={[
                            {
                                label: forum.category.name,
                                to: `/categories/${forum.category.id}`,
                            },
                            {
                                label: forum.name,
                            },
                        ]}
                    />
                    <div className="p-4 bg-neutral-900 rounded shadow">
                        <h2 className="text-2xl font-bold">{forum.name}</h2>
                        <p className="text-neutral-300">{forum.description}</p>
                    </div>
                </>
            )}
            <div className="flex justify-end items-center">
                <ForumActionBox user={user} forum={forum} />
            </div>
            <div>
                <div className="space-y-2">
                    {topics.map(topic => (

                        <div
                            key={topic.id}
                            className="p-4 flex justify-between gap-4 items-center rounded bg-neutral-900 hover:bg-neutral-800"
                        >
                            <div className="flex items-center">
                                <div className="me-3">
                                    <MessageCircle />
                                </div>
                                <div>
                                    <Link
                                        to={`/topics/${topic.id}`}
                                        className="font-medium"
                                    >
                                        {topic.title}
                                    </Link>
                                    <p className="text-sm text-neutral-500">
                                        created by <span className={`${topic.author.group.color} font-bold`}>{topic.author.username}</span> at{" "}
                                        {new Date(topic.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-10 items-center">
                                <div className="flex gap-5">
                                    {topic.closed ? (
                                        <div className="bg-red-700 text-white rounded-full p-1.5">
                                            <LockIcon className="w-4 h-4" /></div>
                                    ) : ""}
                                    {topic.sticky ? (
                                        <div className="bg-green-700 text-white rounded-full p-1.5">
                                            <PinIcon className="w-4 h-4" /></div>
                                    ) : ""}
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">
                                        Posts: {topic.postsCount}
                                    </p>
                                </div>
                                <div className="flex">
                                    <div className="text-end w-40">
                                        {topic.lastReply ? (
                                            <>
                                                <p className="text-xs">
                                                    {new Date(topic.lastReply.createdAt).toLocaleString()}
                                                </p>
                                                <p className={`${topic.lastReply.author.group.color} text-sm font-medium`}>
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

            </div>


        </div>
    );
}
