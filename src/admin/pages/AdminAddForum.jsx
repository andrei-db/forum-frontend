import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Smile,
  MoreHorizontal,
  Paperclip,
  FolderOpen,
} from "lucide-react";

import { api } from "../../api/client";

const tabs = ["Forum Settings", "Customization", "Rules", "Topics & Posts"];



export default function AdminAddForum() {
  const [activeTab, setActiveTab] = useState("Forum Settings");
  const [form, setForm] = useState({
    name: "",
    description: "",
    nodeType: "category",
    forumType: "discussion",
    categoryId: "",
    redirectUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    api("/categories")
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (form.nodeType === "forum" && !form.categoryId) {
      setError("Parent category is required");
      return;
    }
    if (form.nodeType === "forum" && form.forumType === "redirect" && !form.redirectUrl.trim()) {
      setError("Redirect URL is required");
      return;
    }
    try {
      setSubmitting(true);
      setError("");



      if (form.nodeType === "category") {
        await api("/categories", {
          method: "POST",
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
          }),
        });
      }

      if (form.nodeType === "forum") {
        await api("/forums", {
          method: "POST",
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            categoryId: form.categoryId,
            type: form.forumType,
            redirectUrl: form.forumType === "redirect" ? form.redirectUrl.trim() : null,
          }),
        });
      }
      navigate("/admin/forums");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-8">Add Forum</h1>

      <div className="bg-neutral-900 border border-[#2b313a] rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-[#2b313a]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-md font-semibold transition ${activeTab === tab
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white hover:bg-[#2a3038]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-5 py-6 border-b border-[#2b313a]">
          <h2 className="text-xl font-bold">{activeTab}</h2>
        </div>

        {activeTab === "Forum Settings" && (
          <form onSubmit={submit}>
            <FormRow label="Name" required>
              <input
                value={form.name}
                required
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </FormRow>

            <FormRow label="Description">
              <div className="w-full">
                <div className="bg-neutral-800 border border-[#59616e] rounded-md overflow-hidden">
                  <div className="h-14 flex items-center gap-5 px-5 border-b border-[#343b46] text-neutral-400">
                    <button type="button" className="hover:text-white">
                      <Bold size={18} />
                    </button>
                    <button type="button" className="hover:text-white">
                      <Italic size={18} />
                    </button>
                    <button type="button" className="hover:text-white">
                      <Underline size={18} />
                    </button>
                    <button type="button" className="hover:text-white">
                      <LinkIcon size={18} />
                    </button>
                    <button type="button" className="hover:text-white">
                      <Smile size={18} />
                    </button>
                    <button type="button" className="hover:text-white">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full h-80 bg-neutral-700 p-5 resize-none outline-none text-neutral-200"
                  />

                  <div className="m-3 bg-[#303743] rounded-md px-5 py-4 flex items-center justify-between text-neutral-300">
                    <div className="flex items-start gap-3">
                      <Paperclip size={20} className="text-neutral-500 mt-1" />
                      <div>
                        <p className="font-semibold">
                          Drag files here to attach, or{" "}
                          <span className="underline text-white">
                            choose files...
                          </span>
                        </p>
                        <p className="text-sm text-neutral-500">
                          Max total size: 48.83 MB
                        </p>
                      </div>
                    </div>

                    <FolderOpen size={22} className="text-neutral-400" />
                  </div>
                </div>
              </div>
            </FormRow>

            <FormRow label="Type" required>
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="radio"
                  checked={form.nodeType === "category"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      nodeType: "category",
                      forumType: "discussion",
                      categoryId: "",
                      redirectUrl: "",
                    }))
                  }
                  className="mt-1 w-5 h-5 accent-blue-600"

                />

                <div>
                  <p className="font-bold">Category</p>
                  <p className="text-neutral-500">
                    Container for other forums. Nothing can be posted directly within them.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="radio"
                  checked={form.nodeType === "forum" && form.forumType === "discussion"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      nodeType: "forum",
                      forumType: "discussion",
                      redirectUrl: "",
                    }))
                  }
                  className="mt-1 w-5 h-5 accent-blue-600"
                />

                <div>
                  <p className="font-bold">Forum</p>
                  <p className="text-neutral-500">
                    Users can start topics that other users can reply to.
                    Replies are shown in the order they're posted.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="radio"
                  checked={form.nodeType === "forum" && form.forumType === "redirect"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      nodeType: "forum",
                      forumType: "redirect",
                    }))
                  }
                  className="mt-1 w-5 h-5 accent-blue-600"
                />

                <div>
                  <p className="font-bold">Redirect</p>
                  <p className="text-neutral-500">
                    Redirects users to another location when clicked on.
                  </p>
                </div>
              </label>
            </FormRow>

            {form.nodeType === "forum" && (
              <FormRow label="Parent Category" required>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
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
            )}

            {form.nodeType === "forum" && form.forumType === "redirect" && (
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
                  className="w-full max-w-xl h-12 bg-neutral-700 border border-[#69717f] rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </FormRow>
            )}
            <div className="flex justify-center p-5 border-t border-[#2b313a]">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-7 py-2.5 rounded-md text-white font-bold transition"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        {activeTab !== "Forum Settings" && (
          <div className="p-10 text-neutral-500">
            {activeTab} settings coming soon.
          </div>

        )}
        {error && (
          <div className="mx-5 mt-5 text-red-400 bg-red-950/40 border border-red-900 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}

function FormRow({ label, required, children }) {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 px-5 py-7 border-t border-[#2b313a]">
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