"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Scan, 
  Shield,
  ArrowRight,
  RotateCcw,
  Pill,
  AlertTriangle,
  Sparkles,
  Activity,
  FileWarning,
  ShieldAlert,
  Zap,
  History,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { MedicineSearchInput } from "@/components/interactions/medicine-search-input";
import { MedicineList } from "@/components/interactions/medicine-list";
import { HealthProfileBanner } from "@/components/interactions/health-profile-banner";
import { InteractionResults } from "@/components/interactions/interaction-results";
import { ScanHistory } from "@/components/interactions/scan-history";
import {
  checkInteractions,
  getHealthProfileSummary,
  getLatestScan,
} from "@/lib/api/interactions";
import type { MedicineInput, InteractionScanResult, HealthProfileSnapshot } from "@/lib/types";

type ViewMode = "history" | "new-scan" | "results";

export default function InteractionCheckerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("history");
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineInput[]>([]);
  const [results, setResults] = useState<InteractionScanResult | null>(null);
  const [healthProfile, setHealthProfile] = useState<HealthProfileSnapshot | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/interaction-checker");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadInitialData() {
      if (!user) return;
      
      try {
        // Load health profile and check for latest scan in parallel
        const [profile, latestScan] = await Promise.all([
          getHealthProfileSummary(),
          getLatestScan(),
        ]);
        
        setHealthProfile(profile);
        
        // If there's a latest scan, show history view
        if (latestScan) {
          setHasHistory(true);
          setViewMode("history");
        } else {
          // No history, show new scan view
          setViewMode("new-scan");
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setViewMode("new-scan");
      } finally {
        setIsLoadingProfile(false);
        setIsLoadingLatest(false);
      }
    }

    if (user) {
      loadInitialData();
    }
  }, [user]);

  function handleAddMedicine(medicine: MedicineInput) {
    setSelectedMedicines((prev) => [...prev, medicine]);
    setResults(null);
  }

  function handleRemoveMedicine(index: number) {
    setSelectedMedicines((prev) => prev.filter((_, i) => i !== index));
    setResults(null);
  }

  async function handleScan() {
    if (selectedMedicines.length < 2) {
      toast.error("Please select at least 2 medicines to check interactions");
      return;
    }

    setIsScanning(true);

    try {
      const result = await checkInteractions(selectedMedicines, true);
      setResults(result);
      setViewMode("results");
      setHasHistory(true);
      toast.success("Interaction analysis completed");
    } catch (error: any) {
      console.error("Error during scan:", error);
      toast.error(error.response?.data?.message || "Failed to check interactions");
    } finally {
      setIsScanning(false);
    }
  }

  function handleNewScan() {
    setSelectedMedicines([]);
    setResults(null);
    setViewMode("new-scan");
  }

  function handleViewHistoryScan(scan: InteractionScanResult) {
    setResults(scan);
    setViewMode("results");
  }

  function handleBackToHistory() {
    setResults(null);
    setViewMode("history");
  }

  if (authLoading || isLoadingLatest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-teal-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/30 border border-white/10">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Drug Interaction Checker</h1>
                <p className="text-slate-400 text-sm md:text-base mt-1">
                  AI-powered medication safety analysis
                </p>
              </div>
            </div>
            
            {/* Feature Highlights */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-medium text-slate-300">Drug Interactions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-medium text-slate-300">Safety Flags</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                <FileWarning className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-slate-300">Regulatory Risks</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-slate-300">Severity Levels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Health Profile Banner */}
        <HealthProfileBanner
          profile={healthProfile}
          isLoading={isLoadingProfile}
          className="mb-8"
        />

        {/* View Mode Tabs - Only show when not in results view */}
        {viewMode !== "results" && hasHistory && (
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={viewMode === "history" ? "default" : "outline"}
              onClick={() => setViewMode("history")}
              className={viewMode === "history" ? "bg-slate-800 hover:bg-slate-700" : ""}
            >
              <History className="w-4 h-4 mr-2" />
              Scan History
            </Button>
            <Button
              variant={viewMode === "new-scan" ? "default" : "outline"}
              onClick={handleNewScan}
              className={viewMode === "new-scan" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Scan
            </Button>
          </div>
        )}

        {/* History View */}
        {viewMode === "history" && (
          <ScanHistory
            onViewScan={handleViewHistoryScan}
            onNewScan={handleNewScan}
          />
        )}

        {/* New Scan View */}
        {viewMode === "new-scan" && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Medicine Selection */}
            <div className="lg:col-span-4 space-y-6">
              {/* Medicine Search Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">Add Medicines</h2>
                      <p className="text-slate-400 text-xs">Search or type medicine name</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-5">
                  <MedicineSearchInput
                    onSelect={handleAddMedicine}
                    selectedMedicines={selectedMedicines}
                    placeholder="Type medicine name..."
                  />
                  
                  <MedicineList
                    medicines={selectedMedicines}
                    onRemove={handleRemoveMedicine}
                  />

                  {/* Scan Button */}
                  {selectedMedicines.length >= 2 && (
                    <div className="pt-4 border-t border-slate-100">
                      <Button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Scan for Interactions
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {hasHistory && (
                    <Button
                      onClick={() => setViewMode("history")}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    >
                      <History className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  )}
                </div>
              </div>

              {/* What We Check Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">
                  What We Analyze
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                    <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-orange-800 text-sm">Drug Interactions</p>
                      <p className="text-orange-600 text-xs">Medicine-to-medicine conflicts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                    <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                      <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800 text-sm">Safety Flags</p>
                      <p className="text-red-600 text-xs">Black box warnings & alerts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                      <FileWarning className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 text-sm">Regulatory Risks</p>
                      <p className="text-blue-600 text-xs">Pregnancy, prescription flags</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                    <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-800 text-sm">Severity Levels</p>
                      <p className="text-purple-600 text-xs">Critical, major, moderate, minor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Disclaimer</p>
                    <p className="text-xs text-amber-700 mt-1">
                      This tool provides informational guidance only. Always consult your doctor or pharmacist before making medication decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Empty State */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 p-8 md:p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-slate-300">
                  <Scan className="w-14 h-14 text-slate-400" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                  {selectedMedicines.length === 0
                    ? "Add Medicines to Start"
                    : selectedMedicines.length === 1
                    ? "Add One More Medicine"
                    : "Ready to Scan"}
                </h3>
                
                <p className="text-slate-500 max-w-lg mb-8 leading-relaxed">
                  {selectedMedicines.length === 0
                    ? "Search and add medicines from the left panel to check for potential drug interactions, allergy alerts, and safety warnings."
                    : selectedMedicines.length === 1
                    ? "Add at least one more medicine to check for potential interactions between them."
                    : "Click the 'Scan for Interactions' button to run a comprehensive AI-powered safety analysis."}
                </p>
                
                {selectedMedicines.length >= 2 && (
                  <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl shadow-lg shadow-teal-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-teal-800 text-lg">
                        {selectedMedicines.length} medicines selected
                      </p>
                      <p className="text-sm text-teal-600">Ready for interaction scan</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-teal-500 ml-4" />
                  </div>
                )}

                {selectedMedicines.length === 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-8 w-full max-w-md">
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Interactions</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Safety</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileWarning className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Regulatory</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Severity</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {viewMode === "results" && results && (
          <div className="space-y-6">
            {/* Back buttons */}
            <div className="flex items-center gap-3">
              {hasHistory && (
                <Button
                  variant="outline"
                  onClick={handleBackToHistory}
                  className="border-slate-300"
                >
                  <History className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              )}
              <Button
                onClick={handleNewScan}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </div>

            <InteractionResults results={results} />
          </div>
        )}
      </div>
    </main>
  );
}
