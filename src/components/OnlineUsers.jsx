
import { roleColors } from "../utils/roleColors";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

export default function OnlineUsers() {
    const { members, guests, loading } = useOnlineUsers();

    if (loading) return <p>Loading online users…</p>;

    return (
        <div className="rounded p-4 bg-neutral-800">
            <h3 className="text-lg font-semibold mb-2">Who’s Online ( active last 5 minutes )</h3>

            <p className="text-sm mb-2">
                {members.length} members, {guests} guests online
            </p>

            <ul className="list-disc list-inside">
                {members.map((m) => (
                        <span className={`${roleColors[m.role]}`}>{m.username}</span>
                ))}
            </ul>
        </div>
    );
}
