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
    <div className="text-gray-700 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Creează un topic nou</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titlu topic"
          className="w-full p-2 bg-gray-100 rounded"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Scrie primul mesaj..."
          className="w-full p-2 bg-gray-100 rounded"
          rows="5"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Se trimite..." : "Publică topicul"}
        </button>
      </form>
    </div>
  );
}
