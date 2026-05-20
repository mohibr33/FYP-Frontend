"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  getAllArticles,
  searchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  AdminArticle,
} from "@/lib/api/admin";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<AdminArticle | null>(
    null
  );

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
    imageUrl: "",
    readTime: 5,
    tags: "",
  });

  useEffect(() => {
    loadArticles();
  }, [page]);

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await getAllArticles(page, 10);
      setArticles(data.articles);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadArticles();
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const data = await searchArticles(searchQuery, page, 10);
      setArticles(data.articles);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateArticle() {
    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.author
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      await createArticle({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        category: formData.category,
        author: formData.author,
        imageUrl: formData.imageUrl || undefined,
        readTime: formData.readTime,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      toast.success("Article created successfully");
      setCreateDialogOpen(false);
      resetForm();
      loadArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create article");
    }
  }

  async function handleUpdateArticle() {
    if (!selectedArticle) return;

    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.author
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      await updateArticle(selectedArticle.id, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        category: formData.category,
        author: formData.author,
        imageUrl: formData.imageUrl || undefined,
        readTime: formData.readTime,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      toast.success("Article updated successfully");
      setEditDialogOpen(false);
      setSelectedArticle(null);
      resetForm();
      loadArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update article");
    }
  }

  async function handleDeleteArticle() {
    if (!selectedArticle) return;

    try {
      await deleteArticle(selectedArticle.id);
      toast.success("Article deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedArticle(null);
      loadArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete article");
    }
  }

  function openEditDialog(article: AdminArticle) {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl || "",
      readTime: article.readTime || 5,
      tags: article.tags?.join(", ") || "",
    });
    setEditDialogOpen(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      imageUrl: "",
      readTime: 5,
      tags: "",
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Articles Management</h2>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-black hover:bg-slate-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search articles by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              />
            </div>
            <Button onClick={handleSearch} className="bg-black hover:bg-slate-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            {isSearching && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                  setPage(1);
                  loadArticles();
                }}
                variant="outline"
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Clear
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="text-slate-600 font-medium">Title</TableHead>
                      <TableHead className="text-slate-600 font-medium">Category</TableHead>
                      <TableHead className="text-slate-600 font-medium">Author</TableHead>
                      <TableHead className="text-slate-600 font-medium">Read Time</TableHead>
                      <TableHead className="text-slate-600 font-medium">Created</TableHead>
                      <TableHead className="text-slate-600 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-400 py-12"
                      >
                        No articles found
                      </TableCell>
                    </TableRow>
                    ) : (
                      articles.map((article) => (
                        <TableRow key={article.id} className="border-slate-100 hover:bg-slate-50/50">
                          <TableCell className="max-w-xs">
                            <div className="font-medium text-slate-800 truncate">
                              {article.title}
                            </div>
                            {article.excerpt && (
                              <div className="text-xs text-slate-400 truncate mt-1">
                                {article.excerpt}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              {article.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600">{article.author}</TableCell>
                          <TableCell className="text-slate-500">{article.readTime} min</TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(article)}
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedArticle(article);
                                  setDeleteDialogOpen(true);
                                }}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
              <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-slate-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Create Article Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Article title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Health Tips, Nutrition"
                />
              </div>
              <div className="space-y-2">
                <Label>Author *</Label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief summary of the article"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Full article content"
                rows={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Read Time (minutes)</Label>
                <Input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readTime: parseInt(e.target.value) || 5,
                    })
                  }
                  min={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="health, wellness, lifestyle"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateArticle}>Create Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Article title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Health Tips, Nutrition"
                />
              </div>
              <div className="space-y-2">
                <Label>Author *</Label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief summary of the article"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Full article content"
                rows={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Read Time (minutes)</Label>
                <Input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readTime: parseInt(e.target.value) || 5,
                    })
                  }
                  min={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="health, wellness, lifestyle"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedArticle(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateArticle}>Update Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the article{" "}
            <strong>&quot;{selectedArticle?.title}&quot;</strong>? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedArticle(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
