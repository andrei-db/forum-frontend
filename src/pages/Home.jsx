import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";
import { roleColors } from "../utils/roleColors";
import { useAuth } from "../context/AuthContext";
export default function Home() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
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

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        api("/posts/recent")
            .then(setPosts)
            .catch(err => setError(err.message));
    }, []);

    const [topPosters, setTopPosters] = useState([]);
    useEffect(() => {
        api("/posts/top")
            .then(setTopPosters)
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
        <div className="mt-5 text-neutral-300 gap-5 flex flex-col lg:flex-row items-start ">
            <div className="w-full md:flex-1">
                {categories.map(cat => (
                    <div key={cat._id} className="rounded-md shadow p-4 bg-neutral-900 mb-5">
                        <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                        <p className="text-neutral-500 mb-4">{cat.description}</p>
                        <div className="divide-y-1 divide-neutral-800">
                            {cat.forums.map((forum) => {
                                const forumData = latestPosts.find(lp => lp.forum._id === forum._id);
                                const countData = messagesCount.find(mc => mc._id === forum._id);
                                return (
                                    <div className="flex gap-3 items-center">
                                        <div><MessageCircle /></div>
                                        <div className="flex flex-col md:flex-row flex-1 justify-between py-2">
                                            <div className="flex items-center">

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
                                            <div className="min-w-90 flex flex-col md:flex-row justify-start md:items-center">
                                                <div className="flex mb-3 md:mb-0 md:flex-col justify-start md:justify-end items-center me-5">
                                                    <span>Posts<span className="me-2">:</span></span>
                                                    <span>{countData ? formatNumber(countData.messagesCount) : 0}</span>
                                                </div>

                                                {forumData?.lastPost ? (

                                                    <div className="flex items-center text-sm mb-2 md:mb-0">
                                                        <div className="h-10 w-10 me-2">
                                                            <Link to={`/members/${forumData.lastPost.author.username}`}>
                                                                <img className="w-full h-full object-cover rounded-full opacity-90"
                                                                    src={forumData.lastPost.author.profilePicture || "/default-avatar.png"}
                                                                    alt={forumData.lastPost.author.username}></img>
                                                            </Link>
                                                        </div>
                                                        <div className="w-60 min-w-0">
                                                            <Link
                                                                to={`/topics/${forumData.lastPost.topic._id}`}
                                                                className="block truncate text-neutral-200 hover:text-blue-400"
                                                                title={forumData.lastPost.topic.title}
                                                            >
                                                                {forumData.lastPost.topic.title}
                                                            </Link>
                                                            <p className="text-xs text-neutral-500">
                                                                {new Date(forumData.lastPost.createdAt).toLocaleString()} by{" "}
                                                                <Link
                                                                    to={`/members/${forumData.lastPost.author.username}`}
                                                                    className={`${roleColors[forumData.lastPost.author.role]} font-bold`}
                                                                >
                                                                    {forumData.lastPost.author.username}
                                                                </Link>
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-neutral-500">No posts yet</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full lg:w-80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                <div className="p-4 rounded-md bg-neutral-900">
                    <h3 className="text-xl font-semibold mb-3">Recent topics</h3>

                    <div className="divide-y divide-neutral-800">
                        {topics.map((t) => (
                            <div key={t._id} className="flex items-start gap-3 py-3">
                                <Link
                                    to={`/members/${t.author.username}`}
                                    className="flex-shrink-0 w-10 h-10"
                                >
                                    <img
                                        className="w-10 h-10 object-cover rounded-full opacity-90"
                                        src={t.author.profilePicture || "/default-avatar.png"}
                                        alt={t.author.username}
                                    />
                                </Link>

                                <div className="min-w-0 flex-1">
                                    <Link
                                        to={`/topics/${t._id}`}
                                        className="block text-sm font-medium text-neutral-200 truncate hover:text-blue-400"
                                        title={t.title}
                                    >
                                        {t.title}
                                    </Link>
                                    <p className="text-xs text-neutral-500 truncate">
                                        {new Date(t.createdAt).toLocaleString()}{" "}
                                        <span className="text-neutral-400">by</span>{" "}
                                        <Link
                                            to={`/members/${t.author.username}`}
                                            className={`${roleColors[t.author.role]} font-bold hover:underline`}
                                        >
                                            {t.author.username}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 rounded-md bg-neutral-900">
                    <h3 className="text-xl font-semibold mb-3">Recent posts</h3>

                    <div className="divide-y divide-neutral-800">
                        {posts.map((post) => (
                            <div key={post._id} className="flex gap-3 py-3 items-start">
                                <Link
                                    to={`/members/${post.author.username}`}
                                    className="flex-shrink-0 w-10 h-10"
                                >
                                    <img
                                        className="w-10 h-10 object-cover rounded-full opacity-90"
                                        src={post.author.profilePicture || "/default-avatar.png"}
                                        alt={post.author.username}
                                    />
                                </Link>

                                <div className="min-w-0 flex-1">
                                    <Link
                                        className="block text-sm text-neutral-400 truncate hover:text-blue-400"
                                        to={`/topics/${post.topic._id}#${post._id}`}
                                        title={post.topic.title}
                                    >
                                        topic: <span className="text-white">{post.topic.title}</span>
                                    </Link>

                                    <p className="text-xs text-neutral-500 mt-1">
                                        {new Date(post.createdAt).toLocaleString()}{" "}
                                        <span className="text-neutral-400">by</span>{" "}
                                        <Link
                                            to={`/members/${post.author.username}`}
                                            className={`${roleColors[post.author.role]} font-bold hover:underline`}
                                        >
                                            {post.author.username}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-md bg-neutral-900">
                    <h3 className="text-xl font-semibold mb-2">Top posters</h3>
                    <div>
                        {console.log(topPosters)}
                        {topPosters?.map(tp => (
                            <div key={tp._id} className="flex py-2 items-center gap-5">
                                <div className="h-10 w-10 me-3">
                                    <Link to={`/members/${tp.user.username}`}>
                                        <img className="w-full h-full object-cover rounded-full opacity-90"
                                            src={tp.user.profilePicture || "/default-avatar.png"}
                                            alt={tp.user.username}></img>
                                    </Link>
                                </div>                            <div>

                                    <p className="text-sm text-neutral-500">
                                        <Link to={`/members/${tp.user.username}`}
                                            className={`${roleColors[tp.user.role]} font-bold`}>
                                            {tp.user.username}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
