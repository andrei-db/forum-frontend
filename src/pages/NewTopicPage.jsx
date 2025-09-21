import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function NewTopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const topic = await api("/topics", {
        method: "POST",
        body: JSON.stringify({ forum: id, title, content }),
      });

      navigate(`/topics/${topic._id}`); 
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
