import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { EditIcon, Trash2Icon } from "lucide-react";
export default function TopicPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();
  async function handleEdit(e, postId) {
    e.preventDefault();
    try {
      const updated = await api(`/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify({ content: editContent }),
      });

      setTopic({
        ...topic,
        posts: topic.posts.map(p => p._id === postId ? updated : p),
      });
      setEditingPost(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(postId) {
    if (!confirm("Sigur vrei să ștergi postul?")) return;

    try {
      await api(`/posts/${postId}`, { method: "DELETE" });
      setTopic({
        ...topic,
        posts: topic.posts.filter(p => p._id !== postId),
      });
    } catch (err) {
      alert(err.message);
    }
  }

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
            <div className="flex justify-between flex-col flex-1">
              <div>
                <p className="text-sm  text-gray-500 mt-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                {editingPost === post._id ? (
                  <form onSubmit={(e) => handleEdit(e, post._id)} className="space-y-2">
                    <textarea
                      className="w-full p-2 bg-gray-100 rounded"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPost(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-800">{post.content}</p>
                )}
              </div>
              {user && (user.id === post.author._id || user.role === "admin") && (
                <div className="flex justify-end gap-2 mt-2 text-sm">
                  <button
                    className="flex justify-center items-center gap-1 rounded-lg bg-blue-600 text-white p-1"
                    onClick={() => {
                      setEditingPost(post._id);
                      setEditContent(post.content);
                    }}
                  >
                    <EditIcon size={16} />
                    Edit
                  </button>
                  <button
                    className="flex justify-center items-center gap-1 rounded-lg bg-red-600 text-white p-1"
                    onClick={() => handleDelete(post._id)}
                  >
                    <Trash2Icon size={16} />
                    Delete
                  </button>
                </div>
              )}

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
          placeholder="Write a response..."
          rows="3"
        />
        <button
          type="submit"
          disabled={posting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {posting ? "Proccessing..." : "Add new post"}
        </button>
      </form>
    </div>
  );
}
