export async function api(path, options = {}) {
    const token = localStorage.getItem("token");
    const API_BASE = "http://localhost:4000";
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
        let msg = "Server error";
        try {
            const data = await res.json();
            msg = data.error || msg;
        } catch { }
        throw new Error(msg);
    }
    return res.json();
}
