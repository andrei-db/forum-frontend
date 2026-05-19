import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "../../api/client";

export default function AdminSettings() {
  const [form, setForm] = useState({
    forumName: "",
    forumDescription: "",
    registrationEnabled: "true",
    topicsPerPage: "20",
    postsPerPage: "10",
    maintenanceMode: "false",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/settings")
      .then((data) => {
        setForm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api("/settings", {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      alert("Settings saved");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8 text-neutral-400">Loading settings...</p>;

  return (
    <section className="p-8 text-neutral-300">
      <h1 className="text-3xl font-bold text-neutral-100 mb-8">
        Forum Settings
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        {error && (
          <div className="m-5 p-3 rounded bg-red-950/40 border border-red-900 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormRow label="Forum Name" required>
            <input
              value={form.forumName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, forumName: e.target.value }))
              }
              className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
            />
          </FormRow>

          <FormRow label="Forum Description">
            <textarea
              value={form.forumDescription}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  forumDescription: e.target.value,
                }))
              }
              className="w-full max-w-xl min-h-28 bg-neutral-800 border border-neutral-700 rounded px-4 py-3 outline-none focus:border-blue-500 resize-none"
            />
          </FormRow>

          <FormRow label="Registration">
            <select
              value={form.registrationEnabled}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  registrationEnabled: e.target.value,
                }))
              }
              className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </FormRow>

          <FormRow label="Topics Per Page">
            <input
              type="number"
              value={form.topicsPerPage}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, topicsPerPage: e.target.value }))
              }
              className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
            />
          </FormRow>

          <FormRow label="Posts Per Page">
            <input
              type="number"
              value={form.postsPerPage}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, postsPerPage: e.target.value }))
              }
              className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
            />
          </FormRow>

          <FormRow label="Maintenance Mode">
            <select
              value={form.maintenanceMode}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  maintenanceMode: e.target.value,
                }))
              }
              className="w-full max-w-xl h-12 bg-neutral-800 border border-neutral-700 rounded px-4 outline-none focus:border-blue-500"
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </FormRow>

          <div className="flex justify-center p-5 border-t border-neutral-800">
            <button
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-7 py-2.5 rounded text-white font-bold"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FormRow({ label, required, children }) {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 px-5 py-7 border-t border-neutral-800">
      <div className="text-right pt-2">
        <p className="font-bold text-neutral-200">{label}</p>
        {required && (
          <p className="text-xs text-red-400 font-bold uppercase mt-1">
            Required
          </p>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
}