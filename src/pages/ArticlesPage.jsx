import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const categoryStyles = {
  Cancer: { color: "from-red-500 to-red-700", iconBg: "bg-red-500" },
  Neurology: { color: "from-purple-500 to-purple-700", iconBg: "bg-purple-500" },
  Cardiology: { color: "from-pink-500 to-rose-600", iconBg: "bg-pink-500" },
  Diabetes: { color: "from-sky-500 to-blue-600", iconBg: "bg-sky-500" },
  Nutrition: { color: "from-green-500 to-emerald-600", iconBg: "bg-green-500" },
  "Clinical Trials": { color: "from-indigo-500 to-blue-700", iconBg: "bg-indigo-500" },
  Psychology: { color: "from-orange-500 to-amber-600", iconBg: "bg-orange-500" },
  Physiology: { color: "from-teal-500 to-cyan-600", iconBg: "bg-teal-500" },
};

// ✅ Category list
const categories = [
  { name: "Cancer", desc: "Oncology research, treatments, and patient care" },
  { name: "Neurology", desc: "Brain, nervous system, and neurological conditions" },
  { name: "Cardiology", desc: "Heart health, cardiovascular diseases, and treatments" },
  { name: "Diabetes", desc: "Blood sugar management and diabetes care" },
  { name: "Nutrition", desc: "Diet, nutrition science, and healthy eating" },
  { name: "Clinical Trials", desc: "Medical research and clinical study findings" },
  { name: "Psychology", desc: "Mental health, behavior, and psychological well-being" },
  { name: "Physiology", desc: "Body functions, systems, and biological processes" },
];

const ArticlesPage = () => {
  const [view, setView] = useState("main"); // main | category | detail
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showingAll, setShowingAll] = useState(false); // ✅ NEW: track if we've expanded to all

  // NEW: copy-source button state & handler
  const [copiedSource, setCopiedSource] = useState(false);
  const handleCopySource = async () => {
    try {
      const src = selectedArticle?.SourceLink;
      if (!src) return;
      const url = src.startsWith("http") ? src : new URL(src, window.location.origin).href;
      await navigator.clipboard.writeText(url);
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } catch (err) {
      console.error("Failed to copy source link:", err);
    }
  };

  // ✅ Fetch articles for a category (supports limit)
  const fetchArticles = async (category, limit = 3) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/articles?category=${encodeURIComponent(category)}&limit=${limit}`
      );
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setArticles(list);
      console.log("✅ Fetched articles:", list);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch full article details
  const fetchArticleDetail = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/articles/${id}`);
      const data = await res.json();
      setSelectedArticle(data);
      setView("detail");
    } catch (err) {
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Back buttons
  const backToCategories = () => {
    setSelectedCategory(null);
    setArticles([]);
    setShowingAll(false); // reset
    setView("main");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* =============== HEADER SECTION =============== */}
      <div
        className={`text-white py-12 px-6 text-center ${
          view === "main"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600"
            : selectedCategory
            ? `bg-gradient-to-r ${
                categoryStyles[selectedCategory.name]?.color || "from-blue-600 to-indigo-600"
              }`
            : "bg-gradient-to-r from-blue-600 to-indigo-600"
        }`}
      >
        {view === "main" && (
          <>
            <h1 className="text-5xl font-extrabold mb-3">
              Health & Medicine Articles
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Explore evidence-based articles across medical specialties written
              by healthcare experts.
            </p>
          </>
        )}

        {view === "category" && selectedCategory && (
          <>
            <h1 className="text-5xl font-extrabold mb-3">
              {selectedCategory.name}
            </h1>
            <p className="text-blue-100 text-lg">{selectedCategory.desc}</p>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* =============== MAIN CATEGORY VIEW =============== */}
        {view === "main" && (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowingAll(false); // reset when opening a category
                    setView("category");
                    fetchArticles(cat.name, 3);
                  }}
                  className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-center hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold ${
                      categoryStyles[cat.name]?.iconBg || "bg-blue-600"
                    }`}
                  >
                    {cat.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{cat.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* =============== CATEGORY ARTICLES VIEW =============== */}
        {view === "category" && (
          <div>
            <button
              onClick={backToCategories}
              className="flex items-center text-blue-600 hover:underline font-medium mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Categories
            </button>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <p className="text-center text-gray-500 text-lg py-12">
                No articles found for this category.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((a) => (
                    <div
                      key={a._id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                    >
                      {a.ImageURL && (
                        <img
                          src={a.ImageURL}
                          alt={a.Title}
                          className="w-full h-52 object-cover"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {a.Title}
                        </h3>
                        <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                          {a.ShortDescription}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>
                            By {a.createdBy ? a.createdBy.name || "Dr. Smith" : "Dr. Smith"}
                          </span>
                          <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => fetchArticleDetail(a._id)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ✅ Show the "View All Articles" button ONLY before expansion */}
                {articles.length >= 3 && !showingAll && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => {
                        fetchArticles(selectedCategory.name, 1000); // big limit
                        setShowingAll(true); // hide the button after loading all
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition"
                    >
                      View All Articles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* =============== ARTICLE DETAIL VIEW =============== */}
        {view === "detail" && selectedArticle && (
          <div>
            <button
              onClick={() => setView("category")}
              className="flex items-center text-blue-600 hover:underline font-medium mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to{" "}
              {selectedCategory?.name || "Articles"}
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {selectedArticle.ImageURL && (
                <img
                  src={selectedArticle.ImageURL}
                  alt={selectedArticle.Title}
                  className="w-full h-96 object-cover"
                />
              )}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedArticle.Title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {selectedArticle.ShortDescription}
                </p>
                <div className="text-sm text-gray-500 mb-6">
                  By{" "}
                  {selectedArticle.createdBy
                    ? selectedArticle.createdBy.name || "Dr. Smith"
                    : "Dr. Smith"}{" "}
                  • {new Date(selectedArticle.createdAt).toLocaleDateString()}
                </div>
                <div
                  className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedArticle.Content,
                  }}
                />
                {selectedArticle.SourceLink && (
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={selectedArticle.SourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      🔗 Open Source Link
                    </a>
                    <button
                      type="button"
                      onClick={handleCopySource}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:opacity-90 transition"
                      title="Copy source link"
                    >
                      {copiedSource ? "Copied" : "Copy Source"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
