import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";
import { roleColors } from "../utils/roleColors";
import Breadcrumbs from "../components/Breadcrumbs";
import Search from "../components/Search";
function HomeSkeleton() {
    return (
        <div className="mt-5 text-neutral-300 gap-5 flex flex-col lg:flex-row items-start">
            <div className="w-full md:flex-1">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-md shadow p-4 bg-neutral-900 mb-5 animate-pulse">
                        <div className="h-6 w-40 bg-neutral-800 rounded mb-3" />
                        <div className="h-4 w-80 bg-neutral-800 rounded mb-5" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const [data, setData] = useState({
        categories: [],
        topics: [],
        posts: [],
        topPosters: [],
        latestPosts: [],
        messagesCount: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadHomeData() {
            try {
                setLoading(true);

                const homeData = await api("/home");

                if (!cancelled) {
                    setData(homeData);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Something went wrong");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadHomeData();

        return () => {
            cancelled = true;
        };
    }, []);

    const latestPostsByForumId = useMemo(() => {
        return new Map(
            data.latestPosts.map((item) => [item.forum.id, item])
        );
    }, [data.latestPosts]);

    const messagesCountByForumId = useMemo(() => {
        return new Map(
            data.messagesCount.map((item) => [item.id, item.messagesCount])
        );
    }, [data.messagesCount]);

    if (loading) return <HomeSkeleton />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
    
                <Breadcrumbs items={[]} />
           

            <div className="mt-5 text-neutral-300 gap-5 flex flex-col lg:flex-row items-start">

                <div className="w-full md:flex-1">
                    {data.categories.map((cat) => (
                        <div key={cat.id} className="rounded-md shadow p-4 bg-neutral-900 mb-5">
                            <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                            <p className="text-neutral-500 mb-4">{cat.description}</p>

                            <div className="divide-y divide-neutral-800">
                                {cat.forums.map((forum) => {
                                    const forumData = latestPostsByForumId.get(forum.id);
                                    const messagesCount = messagesCountByForumId.get(forum.id) || 0;

                                    return (
                                        <div key={forum.id} className="flex gap-3 items-center">
                                            <MessageCircle className="shrink-0" />

                                            <div className="flex flex-col md:flex-row flex-1 justify-between py-2">
                                                <div className="py-2">
                                                    {forum.type === "redirect" ? (
                                                        <a
                                                            href={forum.redirectUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-medium hover:text-blue-400"
                                                        >
                                                            {forum.name}
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            to={`/forums/${forum.id}`}
                                                            className="font-medium hover:text-blue-400"
                                                        >
                                                            {forum.name}
                                                        </Link>
                                                    )}

                                                    <span className="text-neutral-500 text-sm flex items-center gap-1">
                                                        {forum.description}
                                                    </span>
                                                </div>

                                                <div className="min-w-90 flex flex-col md:flex-row justify-start md:items-center">
                                                    <div className="flex mb-3 md:mb-0 md:flex-col justify-start md:justify-end items-center me-5">


                                                        <span>
                                                            Topics<span className="me-2">:</span>
                                                        </span>
                                                        <span>{formatNumber(messagesCount)}</span>
                                                    </div>

                                                    {forumData?.lastPost ? (
                                                        <div className="flex items-center text-sm mb-2 md:mb-0">
                                                            <Link
                                                                to={`/members/${forumData.lastPost.author.username}`}
                                                                className="h-10 w-10 me-2 shrink-0"
                                                            >
                                                                <img
                                                                    className="w-full h-full object-cover rounded-full opacity-90"
                                                                    src={
                                                                        forumData.lastPost.author.profilePicture ||
                                                                        "/default-avatar.png"
                                                                    }
                                                                    alt={forumData.lastPost.author.username}
                                                                    loading="lazy"
                                                                />
                                                            </Link>

                                                            <div className="w-60 min-w-0">
                                                                <Link
                                                                    to={`/topics/${forumData.lastPost.topic.id}`}
                                                                    className="block truncate text-neutral-200 hover:text-blue-400"
                                                                    title={forumData.lastPost.topic.title}
                                                                >
                                                                    {forumData.lastPost.topic.title}
                                                                </Link>

                                                                <p className="text-xs text-neutral-500">
                                                                    {new Date(forumData.lastPost.createdAt).toLocaleString()} by{" "}
                                                                    <Link
                                                                        to={`/members/${forumData.lastPost.author.username}`}
                                                                        className={`${roleColors[forumData.lastPost.author.role] || "text-neutral-300"} font-bold`}
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
                    <SidebarBox title="Recent topics">
                        {data.topics.map((t) => (
                            <UserItem
                                key={t.id}
                                image={t.author.profilePicture}
                                username={t.author.username}
                                role={t.author.role}
                                title={t.title}
                                date={t.createdAt}
                                link={`/topics/${t.id}`}
                            />
                        ))}
                    </SidebarBox>

                    <SidebarBox title="Recent posts">
                        {data.posts.map((post) => (
                            <UserItem
                                key={post.id}
                                image={post.author.profilePicture}
                                username={post.author.username}
                                role={post.author.role}
                                title={post.topic.title}
                                date={post.createdAt}
                                link={`/topics/${post.topic.id}#${post.id}`}
                                prefix="topic:"
                            />
                        ))}
                    </SidebarBox>

                    <SidebarBox title="Top posters">
                        {data.topPosters.map((tp) => {
                            if (!tp.user) return null;

                            return (
                                <div key={tp.id} className="flex py-2 items-center gap-5">
                                    <Link to={`/members/${tp.user.username}`} className="h-10 w-10 me-3 shrink-0">
                                        <img
                                            className="w-full h-full object-cover rounded-full opacity-90"
                                            src={tp.user.profilePicture || "/default-avatar.png"}
                                            alt={tp.user.username}
                                            loading="lazy"
                                        />
                                    </Link>

                                    <Link
                                        to={`/members/${tp.user.username}`}
                                        className={`${roleColors[tp.user.role] || "text-neutral-300"} font-bold text-sm`}
                                    >
                                        {tp.user.username}
                                    </Link>
                                </div>
                            );
                        })}
                    </SidebarBox>
                </div>
            </div>
        </>
    );
}

function SidebarBox({ title, children }) {
    return (
        <div className="p-4 rounded-md bg-neutral-900">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <div className="divide-y divide-neutral-800">{children}</div>
        </div>
    );
}

function UserItem({ image, username, role, title, date, link, prefix }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <Link to={`/members/${username}`} className="flex-shrink-0 w-10 h-10">
                <img
                    className="w-10 h-10 object-cover rounded-full opacity-90"
                    src={image || "/default-avatar.png"}
                    alt={username}
                    loading="lazy"
                />
            </Link>

            <div className="min-w-0 flex-1">
                <Link
                    to={link}
                    className="block text-sm font-medium text-neutral-200 truncate hover:text-blue-400"
                    title={title}
                >
                    {prefix && <span className="text-neutral-400">{prefix} </span>}
                    {title}
                </Link>

                <p className="text-xs text-neutral-500 truncate">
                    {new Date(date).toLocaleString()}{" "}
                    <span className="text-neutral-400">by</span>{" "}
                    <Link
                        to={`/members/${username}`}
                        className={`${roleColors[role] || "text-neutral-300"} font-bold hover:underline`}
                    >
                        {username}
                    </Link>
                </p>
            </div>
        </div>
    );
}