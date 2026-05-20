"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, AlertCircle, BookOpen, Clock, ArrowRight } from "lucide-react";
import {
  getAllArticles,
  searchArticles,
  getArticlesByCategory,
} from "@/lib/api/articles";
import type { Article } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CATEGORIES = [
  { id: "Cancer", name: "Cancer", icon: "🎗️" },
  { id: "Cardiology", name: "Cardiology", icon: "❤️" },
  { id: "Clinical Trials", name: "Clinical Trials", icon: "🔬" },
  { id: "Diabetes", name: "Diabetes", icon: "💉" },
  { id: "Neurology", name: "Neurology", icon: "🧠" },
  { id: "Nutrition", name: "Nutrition", icon: "🥗" },
  { id: "Physiology", name: "Physiology", icon: "🫀" },
  { id: "Psychology", name: "Psychology", icon: "🧘" },
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (selectedCategory) {
        const response = await getArticlesByCategory(
          selectedCategory,
          page,
          limit
        );
        // Category endpoint returns different structure
        setArticles(response.articles);
        setTotal(response.total || response.articles.length);
        // Calculate pages from total
        setTotalPages(
          Math.ceil((response.total || response.articles.length) / limit)
        );
      } else {
        const response = await getAllArticles(page, limit);
        setArticles(response.articles);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      }
    } catch (err: any) {
      console.error("Articles fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch articles. Please try again later."
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setPage(1);
      fetchArticles();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPage(1);
      const response = await searchArticles(searchQuery, 1, limit);
      setArticles(response.articles);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Search failed. Please try again."
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
    setSearchQuery("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title + Search Combined Layout */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Medical Articles</h1>
              <p className="text-sm text-slate-400">Browse peer-reviewed articles written by healthcare professionals</p>
            </div>
          </div>

          {/* Search Bar - Full width within container */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search articles by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-12 pr-28 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg px-5 h-9"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`p-3 rounded-lg border transition text-center ${
                selectedCategory === null
                  ? "border-slate-800 bg-black text-white"
                  : "border-slate-200 hover:border-slate-400 text-slate-700"
              }`}
            >
              <span className="text-sm font-medium">All</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-3 rounded-lg border transition text-center ${
                  selectedCategory === cat.id
                    ? "border-slate-800 bg-black text-white"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <div className="text-lg mb-1">{cat.icon}</div>
                <div className={`text-xs font-medium  ${
                  selectedCategory === cat.id
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}>{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State - Skeleton Cards with Book Animation */}
        {loading ? (
          <div className="space-y-8">
            {/* Book Animation */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 animate-bounce">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-2xl bg-teal-500/20 animate-ping" />
              </div>
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading articles...</p>
            </div>
            
            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  {/* Image skeleton */}
                  <div className="w-full h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  {/* Content skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-full" />
                      <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded" />
                    <div className="h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded w-3/4" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 bg-slate-100 rounded animate-pulse" />
                      <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                      <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-500">
              {total} article{total !== 1 ? "s" : ""} found
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 rounded-xl flex flex-col">
                  {/* Article Image */}
                  {article.imageUrl && (
                    <div className="overflow-hidden h-48">
                      <Link href={`/articles/${article.slug}`}>
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="flex-1 flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                          {article.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(article.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <Link href={`/articles/${article.slug}`}>
                        <CardTitle className="text-base text-slate-800 hover:text-teal-600 cursor-pointer transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </Link>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between pt-0">
                      <CardDescription className="text-slate-600 line-clamp-2 mb-4 text-sm">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime} min read
                        </span>
                        <Link href={`/articles/${article.slug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-teal-600 hover:text-teal-700 hover:bg-transparent font-medium group/btn"
                          >
                            Read
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  No articles found.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800"
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-500 px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </main>
  );
}
