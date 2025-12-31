"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import { Search, AlertCircle, Pill, X, AlertTriangle, ShieldAlert, ChevronDown, Plus, ShieldCheck, Heart, User } from "lucide-react";
import {
  getAllMedicines,
  searchMedicines,
  getMedicineBrands,
  getAllMedicinesWithRisk,
  searchMedicinesWithRisk,
} from "@/lib/api/medicines";
import type { Medicine } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-context";
import { RiskBadge, RiskNotifierCard } from "@/components/medicines/risk-notifier";

export default function MedicinesPage() {
  const { token, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Allergy/Intolerance state
  const [allergies, setAllergies] = useState<string[]>([]);
  const [appliedAllergies, setAppliedAllergies] = useState<string[]>([]); // Only used after clicking Apply
  const [allergyInput, setAllergyInput] = useState("");
  const [showAllergyPanel, setShowAllergyPanel] = useState(false);

  // Risk assessment mode
  const [riskMode, setRiskMode] = useState(false);
  const [hasHealthProfile, setHasHealthProfile] = useState(false);

  useEffect(() => {
    fetchBrands();
    fetchMedicines();
  }, [page, riskMode]);

  const fetchBrands = async () => {
    try {
      const response = await getMedicineBrands();
      setBrands(response.brands);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (riskMode && token) {
        // Use risk-aware endpoint
        response = await getAllMedicinesWithRisk(page, limit);
        setHasHealthProfile(response.hasHealthProfile ?? false);
      } else {
        // Use regular endpoint with manual allergies
        response = await getAllMedicines(page, limit, appliedAllergies);
      }
      
      setMedicines(response.medicines);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch medicines. Please try again later."
      );
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    // Apply allergies when searching (only if not in risk mode)
    if (!riskMode) {
      setAppliedAllergies([...allergies]);
    }
    
    try {
      setLoading(true);
      setError(null);
      setPage(1);
      
      let response;
      
      if (riskMode && token) {
        // Use risk-aware endpoints
        if (!searchTerm.trim()) {
          response = await getAllMedicinesWithRisk(1, limit);
        } else {
          response = await searchMedicinesWithRisk(searchTerm, 1, limit);
        }
        setHasHealthProfile(response.hasHealthProfile ?? false);
      } else {
        // Use regular endpoints with manual allergies
        if (!searchTerm.trim()) {
          response = await getAllMedicines(1, limit, allergies);
        } else {
          response = await searchMedicines(searchTerm, 1, limit, allergies);
        }
      }
      
      setMedicines(response.medicines);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Search failed. Please try again."
      );
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // Add allergy tag
  const addAllergy = () => {
    const trimmed = allergyInput.trim().toLowerCase();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
      setAllergyInput("");
    }
  };

  // Remove allergy tag
  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  // Handle allergy input keydown
  const handleAllergyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAllergy();
    }
  };

  // Check if medicine has allergy warnings (use backend response or calculate locally)
  const getMedicineAllergyWarnings = (medicine: Medicine): string[] => {
    // First check if backend already provided warnings
    if (medicine.allergyWarnings && medicine.allergyWarnings.length > 0) {
      return medicine.allergyWarnings;
    }
    
    // Fallback to local calculation using APPLIED allergies only
    if (appliedAllergies.length === 0) return [];
    
    const warnings: string[] = [];
    const fieldsToCheck = [
      medicine.productDetails?.generics,
      medicine.productDetails?.whenNotToUse,
      medicine.productDetails?.sideEffects,
      medicine.productDetails?.drugInteractions,
      medicine.productDetails?.precautions,
      medicine.title,
    ];

    for (const allergy of appliedAllergies) {
      for (const field of fieldsToCheck) {
        if (field && field.toLowerCase().includes(allergy.toLowerCase())) {
          if (!warnings.includes(allergy)) {
            warnings.push(allergy);
          }
          break;
        }
      }
    }

    return warnings;
  };

  // Clear all allergies
  const clearAllAllergies = () => {
    setAllergies([]);
    if (appliedAllergies.length > 0) {
      setAppliedAllergies([]);
      // Refetch without allergies
      if (searchTerm.trim()) {
        searchMedicines(searchTerm, 1, limit, []).then(response => {
          setMedicines(response.medicines);
          setTotalPages(response.pagination.totalPages);
          setTotal(response.pagination.total);
        });
      } else {
        getAllMedicines(1, limit, []).then(response => {
          setMedicines(response.medicines);
          setTotalPages(response.pagination.totalPages);
          setTotal(response.pagination.total);
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title + Search Combined */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Pill className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Drug Encyclopedia</h1>
              <p className="text-sm text-slate-400">Search medications, dosages, side effects & usage guidelines</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search medicines, brands, or generics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Allergy/Intolerance Filter */}
          <div className="mt-4 flex flex-wrap gap-3">
            {/* Manual Allergy Filter Toggle */}
            {!riskMode && (
              <button
                onClick={() => setShowAllergyPanel(!showAllergyPanel)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  showAllergyPanel || appliedAllergies.length > 0
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="font-medium">Allergy & Intolerance Filter</span>
                {appliedAllergies.length > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {appliedAllergies.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllergyPanel ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Risk Assessment Mode Toggle */}
            {token && (
              <button
                onClick={() => {
                  setRiskMode(!riskMode);
                  setShowAllergyPanel(false);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  riskMode
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="font-medium">Health Profile Risk Assessment</span>
                {riskMode && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            )}

            {/* Login prompt for risk assessment */}
            {!token && (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200 text-sm"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Login for personalized risk assessment</span>
              </Link>
            )}
          </div>

          {/* Risk Mode Active Banner */}
          {riskMode && (
            <div className="mt-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium">Risk assessment active</span>
                <span className="text-emerald-400/70">•</span>
                <span className="text-emerald-400/70">
                  {hasHealthProfile 
                    ? "Using your health profile for personalized warnings"
                    : "Create a health profile for better results"}
                </span>
                {!hasHealthProfile && (
                  <Link href="/meal-planner/profile" className="ml-auto text-xs underline hover:text-white">
                    Create Profile
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Expanded Allergy Panel - Only show when not in risk mode */}
          {showAllergyPanel && !riskMode && (
            <div className="mt-3 p-4 bg-slate-700/60 rounded-xl border border-slate-600/50">
              {/* Info Text */}
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Add allergies then click Search to highlight matching medicines</span>
              </div>
              
              {/* Input Section */}
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g., Penicillin, Aspirin, Sulfa..."
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={handleAllergyKeyDown}
                  className="h-10 bg-slate-600/50 border-slate-500/50 text-white placeholder:text-slate-400 focus:border-teal-400 rounded-lg text-sm"
                />
                <Button
                  onClick={addAllergy}
                  size="sm"
                  className="h-10 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Allergy Tags */}
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 text-rose-300 rounded-lg text-sm border border-rose-500/30"
                    >
                      <span className="capitalize">{allergy}</span>
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearAllAllergies}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Allergies Badge (when panel is closed and not in risk mode) */}
          {!showAllergyPanel && !riskMode && appliedAllergies.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Active filters:</span>
              {appliedAllergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-medium border border-rose-500/30"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span className="capitalize">{allergy}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State - Skeleton Cards with Pill Animation */}
        {loading ? (
          <div className="space-y-8">
            {/* Pill Animation */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 animate-bounce">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-2xl bg-teal-500/20 animate-ping" />
              </div>
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading medicines...</p>
            </div>
            
            {/* Skeleton Cards */}
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Image skeleton */}
                  <div className="w-full h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                  {/* Content skeleton */}
                  <div className="p-3 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded" />
                    <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                    <div className="h-6 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Active Allergy Filter Indicator - Only when not in risk mode */}
            {!riskMode && appliedAllergies.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 rounded-lg border border-rose-200 mb-6 w-fit">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-medium text-rose-700">
                  Filtering for {appliedAllergies.length} allerg{appliedAllergies.length > 1 ? 'ies' : 'y'}
                </span>
              </div>
            )}

            {/* Risk Mode Active Indicator */}
            {riskMode && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-lg border border-emerald-200 mb-6 w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Personalized risk assessment active
                </span>
              </div>
            )}

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {medicines.map((medicine) => {
                const allergyWarnings = getMedicineAllergyWarnings(medicine);
                const hasAllergyWarning = !riskMode && allergyWarnings.length > 0;
                const riskEval = medicine.riskEvaluation;
                const hasRiskWarning = riskMode && riskEval && riskEval.level !== "safe";
                
                // Determine card styling based on mode
                const getCardBorderClass = () => {
                  if (riskMode && riskEval) {
                    if (riskEval.level === "high_risk") return "border-rose-400 border-2 ring-2 ring-rose-400/20 bg-gradient-to-b from-rose-50 to-white";
                    if (riskEval.level === "caution") return "border-amber-400 border-2 ring-2 ring-amber-400/20 bg-gradient-to-b from-amber-50 to-white";
                    return "border-emerald-300 border bg-gradient-to-b from-emerald-50/50 to-white";
                  }
                  if (hasAllergyWarning) return "border-rose-400 border-2 ring-2 ring-rose-400/20 bg-gradient-to-b from-rose-50 to-white";
                  return "border-slate-200 hover:border-slate-300";
                };
                
                return (
                <Link key={medicine.id} href={`/medicines/${medicine.slug}`}>
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${getCardBorderClass()}`}>
                    {/* Risk Evaluation Banner - In Risk Mode */}
                    {riskMode && riskEval && (
                      <RiskNotifierCard risk={riskEval} />
                    )}

                    {/* Allergy Warning Banner - In Manual Mode */}
                    {!riskMode && hasAllergyWarning && (
                      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-2.5 flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wide">Allergy Alert</p>
                          <p className="text-xs opacity-90 truncate capitalize">
                            {allergyWarnings.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Product Image */}
                    <div className={`w-full h-32 relative overflow-hidden ${
                      hasAllergyWarning || (riskEval?.level === "high_risk") ? 'bg-rose-50' : 
                      riskEval?.level === "caution" ? 'bg-amber-50' :
                      riskEval?.level === "safe" && riskMode ? 'bg-emerald-50/50' :
                      'bg-slate-100'
                    }`}>
                      <Image
                        src={medicine.productImage || "/placeholder.svg"}
                        alt={medicine.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    </div>

                    <CardHeader className="p-3">
                      <CardTitle className="text-sm text-slate-800 line-clamp-2 leading-tight group-hover:text-teal-700 transition-colors">
                        {medicine.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        {medicine.brand}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-2">
                      {medicine.productDetails.generics && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">
                            Generic
                          </p>
                          <p className="text-xs font-medium text-slate-700 line-clamp-1">
                            {medicine.productDetails.generics}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs line-clamp-1">
                          {medicine.usedFor}
                        </span>
                      </div>
                      {medicine.productDetails.requiresPrescriptionYesNo ===
                        "Yes" && (
                        <span className="block bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs text-center font-medium">
                          Rx Required
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )})}
            </div>
            {medicines.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  No medicines found matching your search.
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
                  className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
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
                  className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
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
