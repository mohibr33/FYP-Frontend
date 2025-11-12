import React, { useEffect, useState } from "react";
import { Search, Star, Edit, Trash2, X } from "lucide-react";

const API = "http://localhost:5000/api";

function AdminReviews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, reviewText: '' });
  const token = localStorage.getItem("hp:token");

  useEffect(() => {
    load();
  }, [token]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Reviews loaded:", data);
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rows.filter(
    (r) =>
      r.medicineName?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  const openEditModal = (review) => {
    setFormData({
      rating: review.rating || 5,
      reviewText: review.reviewText || review.reviewTitle || "",
    });
    setEditModal(review);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/reviews/${editModal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: formData.rating,
          reviewText: formData.reviewText,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      alert("Review updated successfully!");
      setEditModal(null);
      load();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${API}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setRows((p) => p.filter((x) => x._id !== id));
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          Reviews Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage medicine reviews and user feedback
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          className="outline-none flex-1 text-lg"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-yellow-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-32">
                User
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-40">
                Medicine
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-32">
                Rating
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Comment
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-32">
                Date
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="hover:bg-yellow-50/30">
                  <td className="px-6 py-4 font-medium">
                    {r?.user?.firstName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">{r.medicineName}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md">
                    <div
                      className="line-clamp-3"
                      title={r.reviewText || r.reviewTitle}
                    >
                      {r.reviewText?.substring(0, 150) || r.reviewTitle}
                      {r.reviewText?.length > 150 && "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => remove(r._id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditModal(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit Review</h3>
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
                  Medicine
                </label>
                <input
                  type="text"
                  disabled
                  value={editModal.medicineName}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, rating: num })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          num <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review Text *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reviewText: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Update Review
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

export default AdminReviews;
