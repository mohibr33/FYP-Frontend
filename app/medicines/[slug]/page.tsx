"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Pill,
  ShieldAlert,
  Info,
  AlertTriangle,
  FlaskConical,
  Thermometer,
  Baby,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { getMedicineBySlug } from "@/lib/api/medicines";
import {
  getMedicineReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/lib/api/reviews";
import type { Medicine } from "@/lib/types";
import type { Review } from "@/lib/api/reviews";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

export default function MedicinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [medicineSlug, setMedicineSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setMedicineSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (medicineSlug) {
      fetchMedicine();
    }
  }, [medicineSlug]);

  const fetchMedicine = async () => {
    if (!medicineSlug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getMedicineBySlug(medicineSlug);
      setMedicine(data);
      // Fetch reviews after getting medicine data
      if (data.id) {
        fetchReviews(data.id);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load medicine details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (medicineId: string) => {
    try {
      setReviewsLoading(true);
      const response = await getMedicineReviews(medicineId, {
        page: 1,
        limit: 50,
      });
      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.pagination.total);
      }
    } catch (err: any) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Check if current user has already reviewed this medicine
  const userHasReviewed =
    user && reviews.some((review) => review.userId === user.id);

  const handleSubmitReview = async () => {
    if (!user) {
      setReviewError("Please login to submit a review");
      router.push("/auth/login");
      return;
    }

    if (!medicine?.id) {
      setReviewError("Medicine information not available");
      return;
    }

    if (reviewComment.length < 10 || reviewComment.length > 1000) {
      setReviewError("Review must be between 10 and 1000 characters");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      if (editingReview) {
        // Update existing review
        const response = await updateReview(editingReview.id, {
          rating: reviewRating,
          message: reviewComment,
        });
        if (response.success) {
          setReviewSuccess("Review updated successfully and pending approval");
          setEditingReview(null);
        }
      } else {
        // Create new review
        const response = await createReview({
          medicineId: medicine.id,
          rating: reviewRating,
          message: reviewComment,
        });
        if (response.success) {
          setReviewSuccess(
            "Review submitted successfully and pending approval"
          );
        }
      }

      // Reset form
      setReviewRating(5);
      setReviewComment("");

      // Refresh reviews
      fetchReviews(medicine.id);
    } catch (err: any) {
      setReviewError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.message);
    setReviewError(null);
    setReviewSuccess(null);
    // Scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewRating(5);
    setReviewComment("");
    setReviewError(null);
    setReviewSuccess(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await deleteReview(reviewId);
      if (response.success && medicine?.id) {
        setReviewSuccess("Review deleted successfully");
        fetchReviews(medicine.id);
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50">
        {/* Dark header skeleton */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-slate-700 rounded mb-6"></div>
              <div className="h-10 w-2/3 bg-slate-700 rounded mb-4"></div>
              <div className="h-6 w-1/3 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !medicine) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50">
        {/* Dark header for error state */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/medicines"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Medicines
            </Link>
            <h1 className="text-3xl font-bold text-white">Medicine Not Found</h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Medicine not found"}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50">
      {/* Dark Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/medicines"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Medicines
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Info */}
            <div className="flex-1 space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-teal-500/30">
                  <Pill className="w-4 h-4" />
                  {medicine.usedFor}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-500/30">
                  <Info className="w-4 h-4" />
                  {medicine.childCategory}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    medicine.productDetails.requiresPrescriptionYesNo === "Yes"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Rx: {medicine.productDetails.requiresPrescriptionYesNo}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {medicine.title}
              </h1>

              {/* Brand, Generic, Dosage */}
              <div className="space-y-1 text-slate-300">
                <p>
                  Brand:{" "}
                  <span className="font-semibold text-white">
                    {medicine.brand}
                  </span>
                </p>
                {medicine.productDetails.generics && (
                  <p>
                    Generic:{" "}
                    <span className="font-semibold text-white">
                      {medicine.productDetails.generics}
                    </span>
                  </p>
                )}
                {medicine.productDetails.dosage && (
                  <p>
                    Dosage:{" "}
                    <span className="font-semibold text-white">
                      {medicine.productDetails.dosage}
                    </span>
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="font-semibold text-lg text-white">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-slate-400">
                  ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            {/* Product Image */}
            <div className="shrink-0">
              <div className="relative w-48 h-48 lg:w-56 lg:h-56 bg-white rounded-xl border border-slate-700 shadow-xl">
                <Image
                  src={medicine.productImage || "/placeholder.svg"}
                  alt={medicine.title}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Description & How It Works */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {medicine.productDetails.description && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                Description
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {medicine.productDetails.description}
              </p>
            </div>
          )}

          {medicine.productDetails.howItWorks && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple-600" />
                </div>
                How It Works
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {medicine.productDetails.howItWorks}
              </p>
            </div>
          )}
        </div>

        {/* Indication */}
        {medicine.productDetails.indication && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              Medical Indication
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {medicine.productDetails.indication}
            </p>
          </div>
        )}

        {/* Side Effects & When Not to Use */}
        {(medicine.productDetails.sideEffects ||
          medicine.productDetails.whenNotToUse) && (
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {medicine.productDetails.sideEffects && (
              <div className="bg-rose-50 rounded-xl shadow-sm border border-rose-200 p-6">
                <h2 className="text-lg font-semibold text-rose-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  Side Effects
                </h2>
                <p className="text-rose-800 leading-relaxed">
                  {medicine.productDetails.sideEffects}
                </p>
              </div>
            )}

            {medicine.productDetails.whenNotToUse && (
              <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-6">
                <h2 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  When Not to Use
                </h2>
                <p className="text-amber-800 leading-relaxed">
                  {medicine.productDetails.whenNotToUse}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Precautions & Warnings */}
        {(medicine.productDetails.precautions ||
          medicine.productDetails.warning1 ||
          medicine.productDetails.warning2 ||
          medicine.productDetails.warning3) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              Precautions & Warnings
            </h2>
            <div className="space-y-4">
              {medicine.productDetails.precautions && (
                <div className="p-4 bg-slate-50 rounded-lg border-l-3 border-l-orange-300">
                  <h3 className="font-medium text-slate-900 mb-2 text-sm">
                    General Precautions
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {medicine.productDetails.precautions}
                  </p>
                </div>
              )}
              {(medicine.productDetails.warning1 ||
                medicine.productDetails.warning2 ||
                medicine.productDetails.warning3) && (
                <div className="grid md:grid-cols-3 gap-3">
                  {medicine.productDetails.warning1 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-medium text-orange-900 mb-1">
                        Warning 1
                      </p>
                      <p className="text-sm text-orange-800 leading-relaxed">
                        {medicine.productDetails.warning1}
                      </p>
                    </div>
                  )}
                  {medicine.productDetails.warning2 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-medium text-orange-900 mb-1">
                        Warning 2
                      </p>
                      <p className="text-sm text-orange-800 leading-relaxed">
                        {medicine.productDetails.warning2}
                      </p>
                    </div>
                  )}
                  {medicine.productDetails.warning3 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-medium text-orange-900 mb-1">
                        Warning 3
                      </p>
                      <p className="text-sm text-orange-800 leading-relaxed">
                        {medicine.productDetails.warning3}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drug Interactions, Storage & Pregnancy */}
        {(medicine.productDetails.drugInteractions ||
          medicine.productDetails.storageYesOrNo ||
          medicine.productDetails.pregnancyCategory) && (
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {medicine.productDetails.drugInteractions && (
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple-600" />
                </div>
                Drug Interactions
              </h2>
                <p className="text-slate-700 leading-relaxed">
                  {medicine.productDetails.drugInteractions}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {medicine.productDetails.storageYesOrNo && (
                <div className="bg-cyan-100 rounded-xl shadow-sm border border-cyan-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                      <Thermometer className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="font-medium text-slate-800 text-sm">
                      Storage
                    </h3>
                  </div>
                  <p className="text-slate-700 text-sm">
                    {medicine.productDetails.storageYesOrNo}
                  </p>
                </div>
              )}

              {medicine.productDetails.pregnancyCategory && (
                <div className="bg-pink-100 rounded-xl shadow-sm border border-pink-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                      <Baby className="w-4 h-4 text-pink-600" />
                    </div>
                    <h3 className="font-medium text-slate-800 text-sm">
                      Pregnancy
                    </h3>
                  </div>
                  <p className="text-slate-700 text-sm font-medium">
                    {medicine.productDetails.pregnancyCategory}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                User Reviews
              </h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-amber-400 text-sm">
                  {averageRating > 0 ? (
                    <>
                      {"★".repeat(Math.round(averageRating))}
                      {"☆".repeat(5 - Math.round(averageRating))}
                    </>
                  ) : (
                    "☆☆☆☆☆"
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </div>
              </div>
            </div>

            {/* Review Form - Only show if user hasn't reviewed yet or is editing their review */}
            {(!userHasReviewed || editingReview) && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-medium text-slate-900 mb-4">
                  {editingReview ? "Edit Your Review" : "Leave a Review"}
                </h3>

                {reviewError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{reviewError}</AlertDescription>
                  </Alert>
                )}

                {reviewSuccess && (
                  <Alert className="mb-4 bg-emerald-50 border-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">
                      {reviewSuccess}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() => setReviewRating(i)}
                          disabled={submittingReview}
                          className={`text-2xl transition-colors disabled:opacity-50 ${
                            reviewRating >= i
                              ? "text-amber-400"
                              : "text-slate-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">
                      Your Review (10-1000 characters)
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this medicine..."
                      disabled={submittingReview}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none min-h-24 text-slate-700 disabled:opacity-50 disabled:bg-slate-50"
                      maxLength={1000}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {reviewComment.length}/1000 characters
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || reviewComment.length < 10}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {editingReview ? "Updating..." : "Submitting..."}
                        </>
                      ) : editingReview ? (
                        "Update Review"
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                    {editingReview && (
                      <Button
                        onClick={handleCancelEdit}
                        disabled={submittingReview}
                        variant="outline"
                        className="px-4"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message when user has already reviewed */}
            {userHasReviewed && !editingReview && (
              <div className="border-t border-slate-200 pt-6">
                <Alert className="bg-slate-100 border-slate-200">
                  <Info className="h-4 w-4 text-slate-600" />
                  <AlertDescription className="text-slate-700">
                    You have already reviewed this medicine. You can edit or
                    delete your review below.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Review List */}
          <div className="space-y-3">
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-8 text-center">
                <p className="text-slate-500">
                  No reviews yet. Be the first to review this medicine!
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const isOwnReview = user && review.userId === user.id;
                const isPending = !review.isApproved;

                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-700">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-medium border border-amber-200">
                              <Clock className="w-3 h-3" />
                              Pending Approval
                            </span>
                          )}
                          {isOwnReview && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                              Your Review
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <span>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.createdAt !== review.updatedAt && (
                            <>
                              <span>•</span>
                              <span className="text-xs">Edited</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-amber-400 text-sm">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        {isOwnReview && (
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleEditReview(review)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteReview(review.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {review.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
