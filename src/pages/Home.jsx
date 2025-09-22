import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";
import { roleColors } from "../utils/roleColors";

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api("/categories")
            .then(setCategories)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        api("/topics/recent")
            .then(setTopics)
            .catch(err => setError(err.message));
    }, []);

    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        api("/forums/latest-posts")
            .then(setLatestPosts)
            .catch(err => setError(err.message));
    }, []);

    const [messagesCount, setMessagesCount] = useState([]);

    useEffect(() => {
        api("/forums/messages-count")
            .then(setMessagesCount)
            .catch(err => setError(err.message));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="text-neutral-300 gap-5 flex items-start">
            <div className="flex-1">
                {categories.map(cat => (
                    <div key={cat._id} className="rounded-md shadow p-4 bg-neutral-900 mb-5">
                        <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                        <p className="text-neutral-500 mb-4">{cat.description}</p>
                        <div className="divide-y-1 divide-neutral-800">
                            {cat.forums.map((forum) => {
                                const forumData = latestPosts.find(lp => lp.forum._id === forum._id);
                                const countData = messagesCount.find(mc => mc._id === forum._id);
                                return (
                                    <div className="flex py-2 justify-between items-center">
                                        <div className="flex gap-4 items-center">
                                            <div><MessageCircle /></div>
                                            <div
                                                key={forum._id}
                                                className="py-2"
                                            >
                                                <Link
                                                    to={`/forums/${forum._id}`}
                                                    className="font-medium"
                                                >
                                                    {forum.name}
                                                </Link>
                                                <span className="text-neutral-500 text-sm flex items-center gap-1">
                                                    {forum.description}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-start items-start w-110">
                                            <div className="flex flex-col justify-center items-center me-10">
                                                <span>Messages</span>
                                                <span>{countData ? formatNumber(countData.messagesCount) : 0}</span>
                                            </div>
                                            {forumData?.lastPost ? (
                                                <div className="flex justify-start">
                                                    <div className="w-10 h-10 bg-neutral-700 me-3"></div>
                                                    <div>
                                                        <Link to={`/topics/${forumData.lastPost.topic._id}`}>
                                                            {forumData.lastPost.topic.title}
                                                        </Link>
                                                        <p className="text-sm text-neutral-500">
                                                            {new Date(forumData.lastPost.createdAt).toLocaleString()} by{" "}
                                                            <span className={`${roleColors[forumData.lastPost.author.role]} font-bold`}>
                                                                {forumData.lastPost.author.username}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-neutral-500">No posts yet</div>
                                            )}

                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-80 p-4 rounded-md bg-neutral-900">
                <h3 className="text-xl font-semibold mb-2">Recent topics</h3>
                <div>
                    {topics.map(t => (
                        <div key={t._id} className="flex py-2 items-center gap-5">
                            <div className="w-10 h-10 bg-neutral-700"></div>
                            <div>
                                <Link to={`/topics/${t._id}`}>
                                    {t.title}
                                </Link>
                                <p className="text-sm text-neutral-500">
                                    {new Date(t.createdAt).toLocaleString()} by{" "}
                                    <span className={`${roleColors[t.author.role]} font-bold`}>
                                        {t.author.username}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
