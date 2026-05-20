"use client";

import { useState, useEffect } from "react";
import {
  History,
  Clock,
  Pill,
  AlertTriangle,
  ChevronRight,
  Trash2,
  Loader2,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getScanHistory, deleteScan, getScanById } from "@/lib/api/interactions";
import type { ScanHistoryItem, InteractionScanResult, SafetyRiskLevel } from "@/lib/types";

interface ScanHistoryProps {
  onViewScan: (scan: InteractionScanResult) => void;
  onNewScan: () => void;
}

const riskConfig: Record<
  SafetyRiskLevel,
  { icon: typeof ShieldCheck; bg: string; text: string; border: string; label: string }
> = {
  low: {
    icon: ShieldCheck,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    label: "Low Risk",
  },
  medium: {
    icon: AlertCircle,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    label: "Moderate",
  },
  high: {
    icon: ShieldAlert,
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    label: "High Risk",
  },
  critical: {
    icon: ShieldX,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    label: "Critical",
  },
};

export function ScanHistory({ onViewScan, onNewScan }: ScanHistoryProps) {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingScan, setIsLoadingScan] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setIsLoading(true);
      const { scans } = await getScanHistory(1, 10);
      setHistory(scans);
    } catch (error) {
      console.error("Error loading scan history:", error);
      toast.error("Failed to load scan history");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleViewScan(scanId: string) {
    try {
      setIsLoadingScan(scanId);
      const scan = await getScanById(scanId);
      if (scan) {
        onViewScan(scan);
      } else {
        toast.error("Scan not found");
      }
    } catch (error) {
      console.error("Error loading scan:", error);
      toast.error("Failed to load scan details");
    } finally {
      setIsLoadingScan(null);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteScan(deleteId);
      setHistory((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("Scan deleted successfully");
    } catch (error) {
      console.error("Error deleting scan:", error);
      toast.error("Failed to delete scan");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
        <p className="text-slate-500">Loading scan history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <History className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Scan History</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          You haven't performed any drug interaction scans yet. Start by adding medicines and running your first scan.
        </p>
        <Button
          onClick={onNewScan}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start New Scan
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Scan History</h2>
                <p className="text-slate-400 text-xs">{history.length} previous scans</p>
              </div>
            </div>
            <Button
              onClick={onNewScan}
              size="sm"
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Scan
            </Button>
          </div>
        </div>

        {/* History List */}
        <div className="divide-y divide-slate-100">
          {history.map((scan) => {
            const config = riskConfig[scan.overallRisk];
            const RiskIcon = config.icon;

            return (
              <div
                key={scan.id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Risk Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}
                  >
                    <RiskIcon className={`w-6 h-6 ${config.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Medicines */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {scan.medicines.slice(0, 3).map((med, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium"
                        >
                          <Pill className="w-3 h-3" />
                          {med.name.length > 20 ? med.name.slice(0, 20) + "..." : med.name}
                        </span>
                      ))}
                      {scan.medicines.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-xs font-medium">
                          +{scan.medicines.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className={`font-medium ${config.text}`}>
                        {config.label}
                      </span>
                      {scan.summary.totalInteractions > 0 && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {scan.summary.totalInteractions} interaction{scan.summary.totalInteractions > 1 ? "s" : ""}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(scan.createdAt), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteId(scan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleViewScan(scan.id)}
                      disabled={isLoadingScan === scan.id}
                    >
                      {isLoadingScan === scan.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
