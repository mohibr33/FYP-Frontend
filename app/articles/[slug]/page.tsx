"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Tag,
  Loader2,
  AlertCircle,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { getArticleBySlug } from "@/lib/api/articles";
import type { Article } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { use } from "react";

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticleBySlug(slug);
      setArticle(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load article. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
        {/* Dark header skeleton */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-slate-700 rounded mb-6"></div>
              <div className="h-6 w-24 bg-slate-700 rounded mb-4"></div>
              <div className="h-10 w-3/4 bg-slate-700 rounded mb-4"></div>
              <div className="h-6 w-1/2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
        {/* Dark header for error state */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>
            <h1 className="text-3xl font-bold text-white">Article Not Found</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Article not found"}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Dark Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-500/30">
              <BookOpen className="w-4 h-4" />
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {(article.excerpt || article.shortDescription) && (
            <p className="text-lg text-slate-300 leading-relaxed mb-6 max-w-3xl">
              {article.excerpt || article.shortDescription}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-slate-300">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-slate-300">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {article.readTime && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-slate-300">{article.readTime} min read</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <article>
          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <Card className="mb-8 border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-400" />
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-800 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>
          </Card>

          {/* Tags & Source in a grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-purple-600" />
                    </div>
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-200 hover:bg-purple-100 transition-colors cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Source Link */}
            {article.sourceLink && (
              <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    Original Source
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col gap-3">
                    <a
                      href={article.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm"
                    >
                      {article.sourceLink}
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(article.sourceLink!)}
                      className="w-fit border-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1.5" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-slate-400 to-slate-300" />
            <CardContent className="py-4">
              <p className="text-sm text-slate-500 text-center">
                Last updated:{" "}
                {new Date(article.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </article>
      </div>
    </main>
  );
}
