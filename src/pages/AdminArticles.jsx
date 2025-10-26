import React, { useEffect, useMemo, useState } from "react";
import { Search, Edit, Trash2, FileText, X, Plus } from "lucide-react";

const API = "http://localhost:5000/api";

function AdminArticles() {
  const token = localStorage.getItem("hp:token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageUrl: "",
    shortDescription: "",
    content: "",
    sourceLink: "",
  });

  // ============================================
  // Load all articles
  // ============================================
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/articles`, { headers });
      const data = await res.json();
      console.log("📦 Loaded articles:", data);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error loading articles:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const getField = (obj, field) => {
    const lowerField = field.toLowerCase();
    const capitalField = field.charAt(0).toUpperCase() + field.slice(1);
    return obj[field] || obj[lowerField] || obj[capitalField] || "";
  };

  const filtered = list.filter((a) => {
    const title = getField(a, "title");
    const category = getField(a, "category");
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ============================================
  // Reset form data
  // ============================================
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      imageUrl: "",
      shortDescription: "",
      content: "",
      sourceLink: "",
    });
  };

  // ============================================
  // Open add modal
  // ============================================
  const openAddModal = () => {
    resetForm();
    setAddModal(true);
  };

  // ============================================
  // Open edit modal
  // ============================================
  const openEditModal = (article) => {
    console.log("📝 Opening edit for:", article);
    setFormData({
      title: getField(article, "title"),
      category: getField(article, "category"),
      imageUrl: getField(article, "imageUrl") || getField(article, "ImageURL"),
      shortDescription:
        getField(article, "shortDescription") ||
        getField(article, "ShortDescription"),
      content: getField(article, "content") || getField(article, "Content"),
      sourceLink:
        getField(article, "sourceLink") || getField(article, "SourceLink"),
    });
    setEditModal(article);
  };

  // ============================================
  // ✅ Handle Add Article
  // ============================================
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        Title: formData.title,
        Category: formData.category,
        ShortDescription: formData.shortDescription,
        Content: formData.content,
        ImageURL: formData.imageUrl,
        SourceLink: formData.sourceLink,
      };

      console.log("📤 Sending create request:", payload);

      const res = await fetch(`${API}/articles`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Response from backend:", data);

      if (!res.ok) throw new Error(data.error || "Failed to create article");

      alert("✅ Article created successfully!");
      setAddModal(false);
      resetForm();
      await load(); // refresh list
    } catch (err) {
      console.error("❌ Error creating article:", err);
      alert("❌ Failed to create article: " + err.message);
    }
  };

  // ============================================
  // ✅ Handle Update Article
  // ============================================
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editModal?._id) return alert("❌ No article selected.");

    try {
      const payload = {
        Title: formData.title,
        Category: formData.category,
        ShortDescription: formData.shortDescription,
        Content: formData.content,
        ImageURL: formData.imageUrl,
        SourceLink: formData.sourceLink,
      };

      console.log("📤 Sending update request:", payload);

      const res = await fetch(`${API}/articles/${editModal._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Response from backend:", data);

      if (!res.ok) throw new Error(data.error || "Failed to update article");

      alert("✅ Article updated successfully!");
      setEditModal(null);
      await load(); // refresh list
    } catch (err) {
      console.error("❌ Error updating article:", err);
      alert("❌ Failed to update article: " + err.message);
    }
  };

  // ============================================
  // Delete Article
  // ============================================
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`${API}/articles/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete");
      setList((prev) => prev.filter((x) => x._id !== id));
      alert("✅ Article deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting article:", err);
      alert("❌ Failed to delete article.");
    }
  };

  const categories = [
    "Cancer",
    "Neurology",
    "Cardiology",
    "Diabetes",
    "Nutrition",
    "Clinical Trials",
    "Psychology",
    "Physiology",
  ];

  // ============================================
  // Render UI
  // ============================================
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          Article Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage health articles and medical content
        </p>
      </div>

      {/* Search & Add Button */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="outline-none flex-1 text-lg"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Article
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((a) => {
              const title = getField(a, "title");
              const category = getField(a, "category");
              const imageUrl =
                getField(a, "imageUrl") || getField(a, "ImageURL");
              const shortDescription =
                getField(a, "shortDescription") ||
                getField(a, "ShortDescription");
              const createdBy =
                a.createdBy?._id || a.createdBy || "Anonymous";
              const createdAt = a.createdAt;

              return (
                <div
                  key={a._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="flex gap-6 p-6">
                    {/* Image */}
                    <div className="w-40 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 relative">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                              const fallback =
                                e.target.parentElement.querySelector(
                                  ".fallback-letter"
                                );
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div className="fallback-letter hidden w-full h-full items-center justify-center text-white text-5xl font-bold">
                            {category?.charAt(0) || "P"}
                          </div>
                        </>
                      ) : (
                        <div className="text-white text-5xl font-bold">
                          {category?.charAt(0) || "P"}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {title}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                        {category}
                      </span>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {shortDescription}
                      </p>
                      <div className="text-sm text-gray-500">
                        By {createdBy} •{" "}
                        {createdAt
                          ? new Date(createdAt).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="Edit Article"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => remove(a._id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-lg py-16 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No articles found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Article Modal */}
      {addModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Add New Article</h3>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter article title"
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
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Brief description of the article"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Full article content"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Source Link
                </label>
                <input
                  type="url"
                  value={formData.sourceLink}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://source.com/article"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Article
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

      {/* Edit Modal */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditModal(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Edit Article</h3>
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
                  placeholder="Enter article title"
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
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Brief description of the article"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Full article content"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Source Link
                </label>
                <input
                  type="url"
                  value={formData.sourceLink}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://source.com/article"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Update Article
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

export default AdminArticles;