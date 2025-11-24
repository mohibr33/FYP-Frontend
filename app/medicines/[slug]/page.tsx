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
} from "lucide-react";
import { getMedicineBySlug } from "@/lib/api/medicines";
import type { Medicine } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SAMPLE_REVIEWS = [
  {
    id: 1,
    author: "John Patient",
    rating: 5,
    date: "2025-11-20",
    title: "Excellent Results",
    comment:
      "This medicine has significantly improved my condition. No major side effects.",
  },
  {
    id: 2,
    author: "Sarah User",
    rating: 4,
    date: "2025-11-18",
    title: "Good but expensive",
    comment:
      "Works well but I wish it was more affordable. Worth the cost for the results.",
  },
  {
    id: 3,
    author: "Mike Johnson",
    rating: 4,
    date: "2025-11-15",
    title: "Consistent Performance",
    comment:
      "Been using this for 6 months. Consistent results and manageable side effects.",
  },
];

export default function MedicinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
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
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load medicine details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !medicine) {
    return (
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/medicines"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Medicines
          </Link>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Medicine not found"}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  const avgRating = (
    SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / SAMPLE_REVIEWS.length
  ).toFixed(1);

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/medicines"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Medicines
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Main Info - Left Side */}
            <div className="flex-1 space-y-6">
              {/* Title, Brand, Generic */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-slate-900">
                  {medicine.title}
                </h1>
                <div className="space-y-1">
                  <p className="text-lg text-slate-600">
                    Brand:{" "}
                    <span className="font-semibold text-slate-800">
                      {medicine.brand}
                    </span>
                  </p>
                  {medicine.productDetails.generics && (
                    <p className="text-lg text-slate-600">
                      Generic:{" "}
                      <span className="font-semibold text-slate-800">
                        {medicine.productDetails.generics}
                      </span>
                    </p>
                  )}
                  {medicine.productDetails.dosage && (
                    <p className="text-lg text-slate-600">
                      Dosage:{" "}
                      <span className="font-semibold text-slate-800">
                        {medicine.productDetails.dosage}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200">
                  <Pill className="w-4 h-4" />
                  {medicine.usedFor}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-200">
                  <Info className="w-4 h-4" />
                  {medicine.childCategory}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    medicine.productDetails.requiresPrescriptionYesNo === "Yes"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Rx: {medicine.productDetails.requiresPrescriptionYesNo}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="font-semibold text-lg text-slate-700">
                  {avgRating}
                </span>
                <span className="text-sm text-slate-500">
                  ({SAMPLE_REVIEWS.length} reviews)
                </span>
              </div>
            </div>

            {/* Product Image - Right Side */}
            <div className="shrink-0">
              <div className="relative w-64 h-64 bg-slate-50 rounded-xl border border-slate-200">
                <Image
                  src={medicine.productImage || "/placeholder.svg"}
                  alt={medicine.title}
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description & How It Works */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {medicine.productDetails.description && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
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
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-teal-600" />
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
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
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
                        ⚠️ Warning 1
                      </p>
                      <p className="text-sm text-orange-800 leading-relaxed">
                        {medicine.productDetails.warning1}
                      </p>
                    </div>
                  )}
                  {medicine.productDetails.warning2 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-medium text-orange-900 mb-1">
                        ⚠️ Warning 2
                      </p>
                      <p className="text-sm text-orange-800 leading-relaxed">
                        {medicine.productDetails.warning2}
                      </p>
                    </div>
                  )}
                  {medicine.productDetails.warning3 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-medium text-orange-900 mb-1">
                        ⚠️ Warning 3
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
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
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
                <div className="bg-cyan-50 rounded-xl shadow-sm border border-cyan-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                      <Thermometer className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="font-medium text-cyan-900 text-sm">
                      Storage
                    </h3>
                  </div>
                  <p className="text-cyan-800 text-sm">
                    {medicine.productDetails.storageYesOrNo}
                  </p>
                </div>
              )}

              {medicine.productDetails.pregnancyCategory && (
                <div className="bg-violet-50 rounded-xl shadow-sm border border-violet-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                      <Baby className="w-4 h-4 text-violet-600" />
                    </div>
                    <h3 className="font-medium text-violet-900 text-sm">
                      Pregnancy
                    </h3>
                  </div>
                  <p className="text-violet-800 text-sm font-medium">
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
                  {avgRating}
                </div>
                <div className="text-amber-400 text-sm">★★★★★</div>
                <div className="text-xs text-slate-500">
                  {SAMPLE_REVIEWS.length} reviews
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-medium text-slate-900 mb-4">
                Leave a Review
              </h3>
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
                        className={`text-2xl transition-colors ${
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
                    Your Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this medicine..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-24 text-slate-700"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors">
                  Submit Review
                </Button>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-3">
            {SAMPLE_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {review.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <span className="font-medium text-slate-700">
                        {review.author}
                      </span>
                      <span>•</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-amber-400 text-sm">
                    {"★".repeat(review.rating)}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
