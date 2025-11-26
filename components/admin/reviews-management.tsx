"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  getAllReviews,
  getReviewStats,
  approveReview,
  publishReview,
  deleteReview,
  AdminReview,
  ReviewStats,
} from "@/lib/api/admin";
import { ChevronLeft, ChevronRight, Trash2, Check, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [page, approvalFilter]);

  async function loadReviews() {
    setLoading(true);
    try {
      const isApproved =
        approvalFilter === "all"
          ? undefined
          : approvalFilter === "approved"
          ? true
          : false;
      const data = await getAllReviews({
        page,
        limit: 10,
        isApproved,
      });
      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await getReviewStats();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to load stats:", error);
    }
  }

  async function handleApprove(id: string, approved: boolean) {
    try {
      await approveReview(id, approved);
      toast.success(approved ? "Review approved" : "Review rejected");
      loadReviews();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  }

  async function handlePublish(id: string, published: boolean) {
    try {
      await publishReview(id, published);
      toast.success(published ? "Review published" : "Review unpublished");
      loadReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  }

  async function handleDeleteReview() {
    if (!selectedReview) return;
    try {
      await deleteReview(selectedReview.id);
      toast.success("Review deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedReview(null);
      loadReviews();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.averageRating.toFixed(1)} ⭐
            </p>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Status:</Label>
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Visibility</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500">
                          No reviews found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">
                                {review.user?.firstName} {review.user?.lastName}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {review.user?.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{review.medicine?.title}</p>
                              <p className="text-gray-500 text-xs">
                                {review.medicine?.brand}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-yellow-500">
                              {"⭐".repeat(review.rating)}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate text-sm">{review.message}</p>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                review.isApproved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {review.isApproved ? "Approved" : "Pending"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                review.isPublished
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {review.isPublished ? "Public" : "Hidden"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleApprove(review.id, !review.isApproved)
                                }
                                title={
                                  review.isApproved ? "Reject" : "Approve"
                                }
                              >
                                {review.isApproved ? (
                                  <X className="h-4 w-4 text-red-600" />
                                ) : (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handlePublish(review.id, !review.isPublished)
                                }
                                title={
                                  review.isPublished ? "Hide" : "Publish"
                                }
                              >
                                {review.isPublished ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedReview(review);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
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
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
