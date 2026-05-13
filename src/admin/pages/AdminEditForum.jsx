import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client";

export default function AdminEditForum() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    forumType: "discussion",
    categoryId: "",
    redirectUrl: ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api("/categories")
      .then(setCategories)
      .catch((err) => setError(err.message));

    api(`/forums/${id}`)
      .then((forum) => {
        setForm({
          name: forum.name || "",
          description: forum.description || "",
          forumType: forum.type || "discussion",
          categoryId: forum.categoryId || "",
          redirectUrl: forum.redirectUrl || "",
          
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.categoryId) {
      setError("Parent category is required");
      return;
    }

    if (form.forumType === "redirect" && !form.redirectUrl.trim()) {
      setError("Redirect URL is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api(`/forums/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          categoryId: form.categoryId,
          type: form.forumType,
          redirectUrl:
            form.forumType === "redirect" ? form.redirectUrl.trim() : null,
        }),
      });

      navigate("/admin/forums");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-8">Edit Forum</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        {error && (
          <div className="m-5 text-red-400 bg-red-950/40 border border-red-900 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <FormRow label="Name" required>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full max-w-xl h-12 bg-neutral-700 border border-neutral-600 rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </FormRow>

          <FormRow label="Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full max-w-xl h-32 bg-neutral-700 border border-neutral-600 rounded-md p-4 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </FormRow>

          <FormRow label="Type" required>
            <div className="space-y-5">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="radio"
                  checked={form.forumType === "discussion"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      forumType: "discussion",
                      redirectUrl: "",
                    }))
                  }
                  className="mt-1 w-5 h-5 accent-blue-600"
                />

                <div>
                  <p className="font-bold">Forum</p>
                  <p className="text-neutral-500">
                    Users can start topics and reply.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="radio"
                  checked={form.forumType === "redirect"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      forumType: "redirect",
                    }))
                  }
                  className="mt-1 w-5 h-5 accent-blue-600"
                />

                <div>
                  <p className="font-bold">Redirect</p>
                  <p className="text-neutral-500">
                    Redirects users to another location.
                  </p>
                </div>
              </label>
            </div>
          </FormRow>

          <FormRow label="Parent Category" required>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full max-w-xl h-12 bg-neutral-700 border border-neutral-600 rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormRow>

          {form.forumType === "redirect" && (
            <FormRow label="Redirect URL" required>
              <input
                type="url"
                value={form.redirectUrl}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    redirectUrl: e.target.value,
                  }))
                }
                placeholder="https://example.com"
                className="w-full max-w-xl h-12 bg-neutral-700 border border-neutral-600 rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </FormRow>
          )}

          

          <div className="flex justify-center p-5 border-t border-neutral-800">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-7 py-2.5 rounded-md text-white font-bold transition"
            >
              {submitting ? "Saving..." : "Save"}
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