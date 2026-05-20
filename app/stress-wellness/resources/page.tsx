"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Heart, Search, Clock, Tag } from "lucide-react";
import { getWellnessResources } from "@/lib/api/stress-wellness";
import type { WellnessResource, WellnessResourcesResponse } from "@/lib/types";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "mental_health", label: "Mental Health" },
  { value: "stress_management", label: "Stress Management" },
  { value: "self_care", label: "Self Care" },
  { value: "healthy_lifestyle", label: "Healthy Lifestyle" },
];

export default function WellnessResourcesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<WellnessResource[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedResource, setSelectedResource] = useState<WellnessResource | null>(null);

  const fetchData = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await getWellnessResources({
        category: category || undefined,
        page: pageNum,
        limit: 20,
        search: search || undefined,
      });
      if (res.success && res.data) {
        setResources(res.data.resources);
        setPagination(res.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, category, fetchData]);

  if (authLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => router.push("/stress-wellness")} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Wellness
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Wellness Resources</h1>
            <p className="text-sm text-slate-500">Articles and guides for mental health and self-care</p>
          </div>
        </div>

        {selectedResource ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedResource.title}</CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary">{selectedResource.category.replace("_", " ")}</Badge>
                    {selectedResource.readTime && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {selectedResource.readTime} min read
                      </span>
                    )}
                    {selectedResource.author && (
                      <span className="text-xs text-slate-400">By {selectedResource.author}</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedResource(null)}>Back</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedResource.imageUrl && (
                <img src={selectedResource.imageUrl} alt={selectedResource.title} className="w-full h-48 object-cover rounded-xl" />
              )}
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {selectedResource.content}
              </div>
              {selectedResource.tags && selectedResource.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {selectedResource.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
              {selectedResource.sourceLink && (
                <p className="text-xs text-slate-400">
                  Source: <a href={selectedResource.sourceLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{selectedResource.sourceLink}</a>
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <Button
                  key={c.value}
                  variant={category === c.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(c.value)}
                >
                  {c.label}
                </Button>
              ))}
            </div>

            {/* Resource List */}
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            ) : resources.length === 0 ? (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No resources found. Check back later for new content!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {resources.map((r) => (
                  <Card
                    key={r.id}
                    className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedResource(r)}
                  >
                    {r.imageUrl && (
                      <img src={r.imageUrl} alt={r.title} className="w-full h-36 object-cover rounded-t-xl" />
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="text-xs">{r.category.replace("_", " ")}</Badge>
                        {r.readTime && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {r.readTime} min
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-base mt-2">{r.title}</CardTitle>
                      {r.excerpt && <CardDescription className="text-sm">{r.excerpt}</CardDescription>}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={pagination.page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => fetchData(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
