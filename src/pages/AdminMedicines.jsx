import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit, Trash2, Tag, Pill, X } from "lucide-react";

const API = "http://localhost:5000/api";

function AdminMedicines() {
  const token = localStorage.getItem("hp:token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // which medicine is being edited (full object)
  const [editModal, setEditModal] = useState(null);

  // add modal state
  const [addModal, setAddModal] = useState(false);

  // shared form state (used by both Add and Edit modals)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    usage: "",
    sideEffect: "",
    category: "",
    tags: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/medicine`, { headers });
      const data = await res.json();
      console.log("Medicines loaded:", data);
      setList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading medicines:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = list.filter(
    (m) =>
      m.title?.toLowerCase().includes(q.toLowerCase()) ||
      m.category?.toLowerCase().includes(q.toLowerCase())
  );

  const openEditModal = (medicine) => {
    setFormData({
      title: medicine.title || "",
      imageUrl: medicine.imageUrl || "",
      usage: medicine.usage || "",
      sideEffect: Array.isArray(medicine.sideEffect)
        ? medicine.sideEffect.join(", ")
        : (medicine.sideEffect || ""),
      category: medicine.category || "",
      tags: Array.isArray(medicine.tags) ? medicine.tags.join(", ") : (medicine.tags || ""),
    });
    setEditModal(medicine);
  };

  // Add new medicine
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        imageUrl: formData.imageUrl || undefined,
        usage: formData.usage,
        sideEffect: formData.sideEffect
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      console.log("📤 Adding medicine:", payload);

      const res = await fetch(`${API}/medicine`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add medicine");
      alert("✅ Medicine added successfully!");

      setAddModal(false);
      setFormData({
        title: "",
        imageUrl: "",
        usage: "",
        sideEffect: "",
        category: "",
        tags: "",
      });
      load();
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("❌ Failed to add medicine");
    }
  };

  // Update existing medicine
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        imageUrl: formData.imageUrl || undefined,
        usage: formData.usage,
        sideEffect: formData.sideEffect
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      const res = await fetch(`${API}/medicine/${editModal._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      alert("✅ Medicine updated successfully!");
      setEditModal(null);
      load();
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert("❌ Failed to update medicine");
    }
  };

  // Delete medicine
  const remove = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      const res = await fetch(`${API}/medicine/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Failed to delete");

      setList((p) => p.filter((x) => x._id !== id));
      alert("✅ Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("❌ Failed to delete medicine");
    }
  };

  const categories = [
    "Heart/BP",
    "Diabetes",
    "First Aid & Wound Care",
    "Pain Relief",
    "Vitamins & Multivitamins",
    "Fever & Cough",
    "Minerals & Supplements",
    "Gastrointestinal",
  ];

  // ==============================
  // UI
  // ==============================
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          Medicine Database
        </h1>
        <p className="text-gray-600 text-lg">
          Manage medicine information and database
        </p>
      </div>

      {/* Search + Add */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 w-full max-w-xl">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="outline-none flex-1"
            placeholder="Search medicines…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setFormData({
              title: "",
              imageUrl: "",
              usage: "",
              sideEffect: "",
              category: "",
              tags: "",
            });
            setAddModal(true);
          }}
          className="ml-4 px-4 py-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </button>
      </div>

      {/* Medicine list */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading medicines...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.length > 0 ? (
            filtered.map((m) => (
              <div
                key={m._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex gap-6">
                  <div className="w-40 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt={m.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Pill className="w-16 h-16 text-white/70" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {m.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      <span className="font-semibold">Usage:</span> {m.usage}
                    </p>

                    {m.sideEffect?.length > 0 && (
                      <div className="mb-3">
                        <div className="font-semibold text-gray-700">
                          Side Effects:
                        </div>
                        <ul className="list-disc ml-5 text-gray-600">
                          {m.sideEffect.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium inline-flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" /> {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openEditModal(m)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center gap-1 transition-colors"
                      title="Edit Medicine"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => remove(m._id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1 transition-colors"
                      title="Delete Medicine"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 bg-white rounded-2xl shadow-lg py-16">
              <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">No medicines found.</p>
            </div>
          )}
        </div>
      )}

      {/* =================== Add Modal =================== */}
      {addModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Add Medicine</h3>
              <button
                onClick={() => setAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usage *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.usage}
                  onChange={(e) =>
                    setFormData({ ...formData, usage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Side Effects (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={formData.sideEffect}
                  onChange={(e) =>
                    setFormData({ ...formData, sideEffect: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Nausea, Headache, Dizziness"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="prescription, over-the-counter, analgesic"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Add Medicine
                </button>
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================== Edit Modal (NEW) =================== */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditModal(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Edit Medicine</h3>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usage *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.usage}
                  onChange={(e) =>
                    setFormData({ ...formData, usage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Side Effects (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={formData.sideEffect}
                  onChange={(e) =>
                    setFormData({ ...formData, sideEffect: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nausea, Headache, Dizziness"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="prescription, over-the-counter, analgesic"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminMedicines;
