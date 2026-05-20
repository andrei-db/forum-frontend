import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { api } from "../api/client";
export default function WhosOnline() {
    const [online, setOnline] = useState({
        members: [],
        membersCount: 0,
        guestsCount: 0,
        totalOnline: 0,
    });

    useEffect(() => {
        loadOnline();

        const interval = setInterval(loadOnline, 60000);

        return () => clearInterval(interval);
    }, []);

    async function loadOnline() {
        try {
            const data = await api("/online");
            setOnline(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <section className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-neutral-200">
            <div className="mb-3 flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                <h2 className="font-semibold">Who's Online</h2>
            </div>

            <p className="text-sm text-neutral-400">
                {online.totalOnline} online: {online.membersCount} members and{" "}
                {online.guestsCount} guests
            </p>

            {online.members.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {online.members.map((member) => (
                        <span className={member.group?.color || "text-neutral-300"}>
                            {member.username}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}