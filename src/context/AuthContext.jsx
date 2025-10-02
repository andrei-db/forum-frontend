import { createContext, useContext, useEffect, useState, useRef } from "react";
import { api } from "../api/client";
const AuthContext = createContext();
export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const refreshUser = async () => {
        try {
            const me = await api("/me");
            setUser(me);
        } catch(err) {
            setUser(null);
            if (err?.message?.includes("Unauthorized") || err?.message?.includes("401")) {
                logout();
            } else {
                setUser(null);
            }
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
    
    const login = (token, user) => {
        localStorage.setItem("token", token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
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
