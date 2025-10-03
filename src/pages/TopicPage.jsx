import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { EditIcon, Trash2Icon } from "lucide-react";
import { roleColors } from "../utils/roleColors";
import { formatDate } from "../utils/formatDate";
import { renderPost } from "../utils/renderPost.jsx";

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
    <div className="mt-5 space-y-6 text-neutral-300">
      <div className="p-4 bg-neutral-900 rounded shadow">
        <h2 className="text-2xl font-bold">{topic.title}</h2>
        <p className="text-sm">
          <span className={`${roleColors[topic.author.role]} font-bold`}>{topic.author.username}</span> {" "}
          {new Date(topic.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="space-y-4">
        {topic.posts.map(post => (
          <div
            key={post._id}
            className="p-4 gap-10 flex items-start bg-neutral-900 rounded shadow-sm"
          >
            <div className="text-sm  rounded-lg bg-neutral-800
            w-64">
              <img className="w-full h-full object-cover opacity-90" src={post.author.profilePicture || "/default-avatar.png"}></img>

              <div className="py-2">

                <div className={`${roleColors[post.author.role]}  text-center text-lg`}>{post.author.username}</div>
                <div className="text-center">{post.author.role}</div>

                <div className="mt-5">
                  <div className="flex justify-between px-3">
                    <div>Joined:</div>
                    <div>{formatDate(post.author.createdAt)}</div>
                  </div>
                  <div className="flex justify-between px-3">
                    <div>Messages:</div>
                    <div>100k</div>
                  </div>
                </div>
              </div>

            </div>
            <div className="flex justify-between flex-col flex-1">
              <div>
                <p className="text-sm  text-neutral-300 mt-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                {editingPost === post._id ? (
                  <form onSubmit={(e) => handleEdit(e, post._id)} className="space-y-2">
                    <textarea
                      className="w-full p-2 bg-neutral-700 h-90 rounded"
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
                  <div className="whitespace-pre overflow-x-auto">
                    {renderPost(post.content)}
                  </div>
                )}
              </div>
              {user && (user.id === post.author._id || user.role === "admin") && (
                <div className="flex justify-end gap-2 mt-2 text-sm">
                  <button
                    className="flex justify-center items-center gap-1 rounded-xs bg-blue-600 text-white p-1"
                    onClick={() => {
                      setEditingPost(post._id);
                      setEditContent(post.content);
                    }}
                  >
                    <EditIcon size={16} />
                    Edit
                  </button>
                  <button
                    className="flex justify-center items-center gap-1 rounded-xs bg-red-600 text-white p-1"
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

      {topic.closed ? (
        <p className="bg-neutral-800 rounded p-4 text-red-500 mt-4">This topic is closed and cannot receive new replies.</p>
      ) : (
        <form
        onSubmit={handleAddPost}
        className="p-4 mb-4 bg-neutral-900 rounded shadow space-y-2"
      >
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 rounded"
          placeholder="Write a message..."
          rows="3"
        />
        <button
          type="submit"
          disabled={posting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {posting ? "Proccessing..." : "Send message"}
        </button>
      </form>
      )}
      
    </div>
  );
}
