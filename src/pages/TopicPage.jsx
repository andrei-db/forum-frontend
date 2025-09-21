import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function TopicPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api(`/topics/${id}`)
      .then(setTopic)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddPost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const post = await api("/posts", {
        method: "POST",
        body: JSON.stringify({ topic: id, content: newPost }),
      });

      setTopic({ ...topic, posts: [...topic.posts, post] });
      setNewPost("");
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!topic) return <p>Topic not found</p>;


  return (
    <div className="space-y-6 text-gray-700">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">{topic.title}</h2>
        <p className="text-sm text-gray-500">
          <b>{topic.author.username}</b> {" "}
          {new Date(topic.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="space-y-4">
        {topic.posts.map(post => (
          <div
            key={post._id}
            className="p-4 gap-10 flex bg-white rounded shadow-sm"
          >
            <div className="flex flex-col pb-4 bg-gray-100 justify-end items-center h-72 w-64">

              <b className="text-red-700">{post.author.username}</b>
            </div>
            <div className="flex-1">
              <p className="text-sm  text-gray-500 mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-800">{post.content}</p>
              
            </div>

          </div>
        ))}
      </div>

      <form
        onSubmit={handleAddPost}
        className="p-4 mb-4 bg-white rounded shadow space-y-2"
      >
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 rounded"
          placeholder="Scrie un răspuns..."
          rows="3"
        />
        <button
          type="submit"
          disabled={posting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {posting ? "Se postează..." : "Adaugă răspuns"}
        </button>
      </form>
    </div>
  );
}
