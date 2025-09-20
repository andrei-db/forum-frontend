import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Acasă</h2>
      {user ? (
        <p className="text-lg">👋 Bun venit, <b>{user.username}</b>!</p>
      ) : (
        <p className="text-gray-600">
          Ești vizitator. <br /> Loghează-te pentru mai multe opțiuni.
        </p>
      )}
    </div>
  );
}
