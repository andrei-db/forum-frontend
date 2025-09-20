import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Home() {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            api("/me")
                .then(setMe)
                .catch(() => setMe(null))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Acasă</h2>
            {me ? (
                <p className="text-lg">👋 Bun venit, <b>{me.username}</b>!</p>
            ) : (
                <p className="text-gray-600">Ești vizitator. <br /> Loghează-te pentru mai multe opțiuni.</p>
            )}
        </div>
    );
}
