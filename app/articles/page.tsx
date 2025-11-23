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
import { Search, Loader2, AlertCircle } from "lucide-react";
import {
  getAllArticles,
  searchArticles,
  getArticlesByCategory,
} from "@/lib/api/articles";
import type { Article } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CATEGORIES = [
  { id: "Health Tips", name: "Health Tips", icon: "💡" },
  { id: "Nutrition", name: "Nutrition", icon: "🥗" },
  { id: "Mental Health", name: "Mental Health", icon: "🧠" },
  { id: "Disease Prevention", name: "Disease Prevention", icon: "🛡️" },
  { id: "Fitness", name: "Fitness", icon: "💪" },
  { id: "Medical News", name: "Medical News", icon: "📰" },
  { id: "Women Health", name: "Women Health", icon: "👩" },
  { id: "Child Care", name: "Child Care", icon: "👶" },
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

      let response;
      if (selectedCategory) {
        response = await getArticlesByCategory(selectedCategory, page, limit);
      } else {
        response = await getAllArticles(page, limit);
      }

      setArticles(response.articles);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err: any) {
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
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Medical Articles
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse thousands of peer-reviewed articles written by healthcare
            professionals
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 border-blue-200 focus:border-blue-600"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`p-4 rounded-lg border transition ${
                selectedCategory === null
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-blue-100 hover:border-blue-300"
              }`}
            >
              All Articles
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-4 rounded-lg border transition text-left ${
                  selectedCategory === cat.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-blue-100 hover:border-blue-300"
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm">{cat.name}</div>
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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              {total} article{total !== 1 ? "s" : ""} found
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/articles/${article.slug}`}>
                          <CardTitle className="text-blue-600 hover:text-blue-700 cursor-pointer">
                            {article.title}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            By {article.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {article.readTime} min read
                          </span>
                        </div>
                        <CardDescription className="mt-2">
                          {article.excerpt}
                        </CardDescription>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4 whitespace-nowrap">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Link href={`/articles/${article.slug}`}>
                        <Button variant="link" className="p-0 text-blue-600">
                          Read Article →
                        </Button>
                      </Link>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
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
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
