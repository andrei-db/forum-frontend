import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { roleColors } from "../utils/roleColors";
import { formatDate } from "../utils/formatDate";
export default function Profile() {
    const { username } = useParams();
    const [member, setMember] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadData() {
            try {
                const memberData = await api(`/members/${username}`);

                console.log("DEBUG:", memberData);

                setMember(memberData);
            } catch (err) {
                console.error("Error in fetching member:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [username]);
    if (loading) return <p>Loading...</p>;
    if (error) return <div className="mt-5 bg-neutral-900 p-3 rounded">The requested page could not be found.</div>;
    return (
        
        <div className="mt-5">
            <div className=" overflow-hidden">
                <div className="ps-70 h-60 bg-neutral-800 flex gap-2 pb-3 flex-col
                 justify-end">
                    <div className={`${roleColors[member?.role]} text-4xl font-semibold`}>{member?.username}</div>
                    <div className="uppercase font-semibold">{member?.role}</div>
                </div>
                <div className="relative flex justify-center items-center">
                    <div className=" absolute bottom-3 left-10 w-50 h-50 ">
                        <img className="opacity-95 rounded-full" src={member?.profilePicture || "/default-avatar.png"} />
                    </div>
                    <div className="flex gap-20 ps-70 px-4 py-2 bg-neutral-900 flex-1">
                        <dl className="text-center">
                            <dt className="text-sm uppercase">Posts</dt>
                            <dd className="text-lg font-semibold">{member?.postsCount}</dd>
                        </dl>
                        <dl className="text-center ">
                            <dt className="text-sm uppercase">Joined</dt>
                            <dd className="text-lg font-semibold">{formatDate(member?.createdAt)}</dd>
                        </dl>
                        <dl className="text-center ">
                            <dt className="text-sm uppercase">Last visited</dt>
                            <dd className="text-lg font-semibold">{formatDate(member?.lastSeen)}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex gap-5 h-80">
                <div className="bg-neutral-900 w-1/5 rounded flex justify-center items-center">Empty</div>
                <div className="bg-neutral-900 w-4/5 rounded flex justify-center items-center">
                    Theres nothing to show right now</div>
            </div>
        </div>
    )
}