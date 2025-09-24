import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { io } from "socket.io-client";
const AuthContext = createContext();
const socket = io(import.meta.env.VITE_API_BASE, { withCredentials: true });
export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const me = await api("/me");
            setUser(me);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            refreshUser();
        } else {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (user) {
            socket.emit("user_online", { id: user._id });
        }
    }, [user]);
    const login = (token, user) => {
        localStorage.setItem("token", token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        socket.disconnect();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
