export async function api(path, options = {}) {
    const token = localStorage.getItem("token");
    const API_BASE = import.meta.env.VITE_API_BASE;

    const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

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
