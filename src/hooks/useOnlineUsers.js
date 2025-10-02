import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useOnlineUsers() {
  const [data, setData] = useState({ members: [], guests: 0, loading: true });

  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const json = await api("/online");

        setData({ ...json, loading: false });
      } catch (err) {
        console.error("Failed to fetch /online:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchOnline();
    const interval = setInterval(fetchOnline, 60000); 
    return () => clearInterval(interval);
  }, []);

  return data;
}
