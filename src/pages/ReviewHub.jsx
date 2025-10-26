import React, { useEffect, useState } from "react";
import { Star, CheckCircle, X } from "lucide-react";
import { ReviewAPI } from "../utils/api.js";
import { useAuth } from "../state/AuthContext";

const ReviewHub = () => {
  const { user, token } = useAuth();

  // 🧠 fallback for immediate display (no refresh)
  const localUser = JSON.parse(localStorage.getItem("hp:user") || "{}");
  const displayUser = user || localUser;

  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    medicineName: "",
    rating: 0,
    reviewTitle: "",
    reviewText: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // ✅ Fetch all community reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await ReviewAPI.list();
        const data = res?.data || [];
        setReviews(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setMessage({
          text: err?.response?.data?.error || "Failed to load reviews.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    const filteredData = reviews.filter((r) =>
      r.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
  }, [searchTerm, reviews]);

  // ✅ Handle form changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () =>
    setForm({ medicineName: "", rating: 0, reviewTitle: "", reviewText: "" });

  // ✅ Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.medicineName || !form.reviewTitle || !form.reviewText || !form.rating) {
      setMessage({ text: "Please fill all fields and select a rating.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await ReviewAPI.create(form, { headers });

      // ✅ Attach user manually for instant UI update
      const newReview = {
        ...res?.data,
        user: displayUser,
      };

      setReviews([newReview, ...reviews]);
      setFiltered([newReview, ...filtered]);
      setShowModal(false);
      resetForm();
      setMessage({ text: "Review submitted successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setMessage({
        text: err?.response?.data?.error || "Failed to submit review.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Review Hub
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Write Review
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Share and read authentic medicine reviews from the community.
        </p>

        {/* Current user info */}
        {displayUser?.email && (
          <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg mb-6 text-sm">
            Logged in as <strong>{displayUser.email}</strong>
          </div>
        )}

        {/* Messages */}
        {message.text && (
          <div
            className={`mb-4 text-sm font-medium text-center ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search medicines or reviews..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Reviews List */}
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No reviews found.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((r) => (
              <div
                key={r._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full font-semibold text-gray-700">
                      {r.user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {r.user
                          ? `${r.user.firstName || ""} ${r.user.lastName || ""}`
                          : "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                    <CheckCircle
                      className="w-4 h-4 text-blue-600 ml-2"
                      title="Verified"
                    />
                  </div>
                  <span className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {r.medicineName || "Unknown"}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (Number(r.rating) || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <h3 className="font-semibold text-gray-800 mb-1">
                  {r.reviewTitle}
                </h3>
                <p className="text-gray-700 text-sm">{r.reviewText}</p>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Write Review Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/50"
            onClick={() => setShowModal(false)}
            aria-modal="true"
            role="dialog"
          >
            <div
              className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Write a Review
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="medicineName"
                  placeholder="Medicine name"
                  value={form.medicineName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  name="reviewTitle"
                  placeholder="Review title"
                  value={form.reviewTitle}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  name="reviewText"
                  placeholder="Write your review..."
                  value={form.reviewText}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

                {/* Rating Stars */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-16">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        onClick={() => setForm({ ...form, rating: num })}
                        className={`w-6 h-6 cursor-pointer transition ${
                          num <= form.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="mt-12 bg-gray-100 p-6 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">Review Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Share honest experiences about effectiveness and side effects.</li>
            <li>Do not include personal medical information.</li>
            <li>Reviews should be based on your own experience with the medicine.</li>
            <li>Be respectful and constructive in your feedback.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewHub;
