import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";
export default function Navbar() {
    const nav = useNavigate();
    const authed = !!localStorage.getItem("token");
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (authed) {
            api("/me")
                .then(setMe)
                .catch(() => setMe(null));
        }
    }, [authed]);

    const logout = () => {
        localStorage.removeItem("token");
        nav("/login");
    };

    return (
        <nav className="bg-white text-black flex justify-between px-5 py-4">
            <Link to="/">Forum</Link>
            {authed ? (
                <div>
                    <span className="me-5">Hi, {me?.username}!</span>
                    <button onClick={logout}>Logout</button>
                </div>

            ) : (
                <div>
                    <Link to="/login" >Login</Link>
                    <Link to="/register" className="ms-3">Register</Link>
                </div>
            )}
        </nav>
    );
}
