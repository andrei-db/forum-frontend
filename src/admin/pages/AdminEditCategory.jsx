import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client";

export default function AdminEditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    order: 0,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api(`/categories/${id}`)
      .then((category) => {
        setForm({
          name: category.name || "",
          description: category.description || "",
          order: category.order || 0,
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

    try {
      setSubmitting(true);
      setError("");

      await api(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          order: form.order,
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
      <h1 className="text-2xl font-bold mb-8">Edit Category</h1>

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