import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Home() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/me")
      .then(setMe)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Acasă</h2>
      {error && <p>{error}</p>}
      {me ? <p>Bun venit, {me.username}!</p> : <p>Se încarcă...</p>}
    </div>
  );
}
