import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";

const permissionColumns = [
  { key: "canView", label: "SEE FORUM" },
  { key: "canRead", label: "READ TOPICS" },
  { key: "canPostTopic", label: "POST NEW TOPICS" },
  { key: "canReply", label: "REPLY TO TOPICS" },
];

export default function AdminGroupPermissions() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/groups/${id}/forum-permissions`)
      .then((data) => {
        setGroup(data.group);
        setCategories(data.categories);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function togglePermission(forumId, key) {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        forums: category.forums.map((forum) =>
          forum.id === forumId
            ? {
                ...forum,
                permissions: {
                  ...forum.permissions,
                  [key]: !forum.permissions[key],
                },
              }
            : forum
        ),
      }))
    );
  }

  async function handleSave() {
    try {
      setSaving(true);

      const permissions = categories.flatMap((category) =>
        category.forums.map((forum) => ({
          forumId: forum.id,
          ...forum.permissions,
        }))
      );

      await api(`/groups/${id}/forum-permissions`, {
        method: "PUT",
        body: JSON.stringify({ permissions }),
      });

      alert("Permissions saved");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!group) return <p className="p-8 text-neutral-400">Loading permissions...</p>;

  return (
    <section className="p-8 text-neutral-300">
      <p className="font-bold text-neutral-400">{group.name}</p>
      <h1 className="text-3xl font-bold mb-8 text-neutral-100">{group.name}</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-neutral-800">
          <button className="px-5 py-3 rounded bg-neutral-700 text-white font-bold">
            Forums
          </button>
          <button className="px-5 py-3 rounded text-neutral-500 font-bold">
            Events
          </button>
          <button className="px-5 py-3 rounded text-neutral-500 font-bold">
            Gallery
          </button>
          <button className="px-5 py-3 rounded text-neutral-500 font-bold">
            Downloads
          </button>
        </div>

        <div className="grid grid-cols-[2fr_repeat(4,1fr)] bg-neutral-800 text-xs font-bold text-neutral-400">
          <div className="px-5 py-4"></div>

          {permissionColumns.map((col) => (
            <div key={col.key} className="px-5 py-4 text-center">
              {col.label}
            </div>
          ))}
        </div>

        {categories.map((category) => (
          <div key={category.id}>
            <div className="grid grid-cols-[2fr_repeat(4,1fr)] items-center border-t border-neutral-800 bg-neutral-900">
              <div className="px-5 py-5 font-bold text-neutral-100">
                {category.name}
              </div>

              {permissionColumns.map((col) => (
                <div key={col.key} className="px-5 py-5 flex justify-center">
                  <input
                    type="checkbox"
                    checked={category.forums.every((forum) => forum.permissions[col.key])}
                    onChange={() => {
                      const allChecked = category.forums.every(
                        (forum) => forum.permissions[col.key]
                      );

                      setCategories((prev) =>
                        prev.map((cat) =>
                          cat.id === category.id
                            ? {
                                ...cat,
                                forums: cat.forums.map((forum) => ({
                                  ...forum,
                                  permissions: {
                                    ...forum.permissions,
                                    [col.key]: !allChecked,
                                  },
                                })),
                              }
                            : cat
                        )
                      );
                    }}
                    className="w-5 h-5 accent-blue-600"
                  />
                </div>
              ))}
            </div>

            {category.forums.map((forum) => (
              <div
                key={forum.id}
                className="grid grid-cols-[2fr_repeat(4,1fr)] items-center border-t border-neutral-800 bg-neutral-900/70"
              >
                <div className="px-10 py-5 font-bold text-neutral-200">
                  {forum.name}
                </div>

                {permissionColumns.map((col) => (
                  <div key={col.key} className="px-5 py-5 flex justify-center">
                    <input
                      type="checkbox"
                      checked={forum.permissions[col.key]}
                      onChange={() => togglePermission(forum.id, col.key)}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-center p-5 border-t border-neutral-800 bg-neutral-900">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}