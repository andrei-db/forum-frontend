import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { roleColors } from "../utils/roleColors";

const socket = io(import.meta.env.VITE_API_BASE, { withCredentials: true });

export default function OnlineUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("online_users", (data) => {
            setUsers(data);
        });

        return () => {
            socket.off("online_users");
        };
    }, []);

    return (
        <div className="p-4 bg-neutral-900 rounded-md text-neutral-300">
            <h3 className="font-semibold mb-2">Online users</h3>
            <div className="flex space-x-1">
                {users.length === 0 ? (
                    <p className="text-neutral-500 text-sm">No users online</p>
                ) : (
                    users.map((u, index) => (
                        <div
                            key={u._id}
                            className={`${roleColors[u.role]} text-sm font-semibold`}
                        >
                            {u.username}
                            {index < users.length - 1 && ", "}
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
