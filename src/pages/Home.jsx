import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="text-gray-700">
            {categories.map(cat => (
                <div key={cat._id} className="rounded-md shadow p-4 bg-white mb-5">


                    <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                    <p className="text-gray-600 mb-4">{cat.description}</p>

                    <div className="divide-y divide-gray-200">
                        {cat.forums.map((forum) => (
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
                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                        {forum.description}
                                    </span>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
