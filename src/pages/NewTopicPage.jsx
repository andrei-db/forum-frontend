import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
export default function NewTopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/forums/${id}`)
      .then(setForum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-neutral-400">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="text-sm text-red-500 bg-yellow-950/20 border border-yellow-900/40 rounded p-4">
        You must be logged in to create a topic.
      </div>
    );
  }

  if (!forum?.permissions?.canPostTopic && !user?.group?.isStaff) {
    return (
      <div className="text-sm text-red-500 bg-yellow-950/20 border border-yellow-900/40 rounded p-4">
        You do not have permission to create topics in this forum.
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a topic.");
      return;
    }

    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);

    try {
      const topic = await api("/topics", {
        method: "POST",
        body: JSON.stringify({ forum: id, title, content }),
      });

      navigate(`/topics/${topic.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="text-neutral-300 bg-neutral-900 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">New topic</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 bg-neutral-800 rounded"
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Message..."
          className="w-full p-2 bg-neutral-800 rounded"
          rows="5"
        />

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Publish topic"}
        </button>
      </form>
    </div>
  );
}