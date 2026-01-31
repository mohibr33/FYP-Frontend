"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, FileText, TrendingUp, Share2, Download, Printer, Trash2, AlertCircle, CheckCircle, XCircle, Plus, AlertTriangle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-context";
import { getLabReports, deleteLabReport, shareLabReportWithDoctor } from "@/lib/api/labReports";
import type { LabReport } from "@/lib/types";

function generateMonthlyData(reports: LabReport[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthCounts = Array(12).fill(0);
  
  reports.forEach(report => {
    const date = new Date(report.uploadedAt);
    monthCounts[date.getMonth()]++;
  });
  
  return months.map((month, index) => ({
    month,
    count: monthCounts[index],
  })).filter(item => item.count > 0 || item.month === months[new Date().getMonth()]);
}

export default function LabAnalyzerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, page]);

  async function fetchReports() {
    try {
      setLoading(true);
      const response = await getLabReports(page, 10);
      setReports(response.data.reports);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load lab reports");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(reportId: string) {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await deleteLabReport(reportId);
      toast.success("Lab report deleted successfully");
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete report");
    }
  }

  async function handleShare() {
    if (!selectedReport || !doctorEmail) return;

    try {
      setSharing(true);
      await shareLabReportWithDoctor(selectedReport.id, doctorEmail);
      toast.success("Lab report shared successfully");
      setShowShareModal(false);
      setDoctorEmail("");
      setSelectedReport(null);
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to share report");
    } finally {
      setSharing(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "abnormal":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "normal":
        return "bg-emerald-100 text-emerald-800";
      case "abnormal":
        return "bg-amber-100 text-amber-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  }

  function getStatusBg(status: string) {
    switch (status) {
      case "normal":
        return "bg-emerald-50 border-emerald-200";
      case "abnormal":
        return "bg-amber-50 border-amber-200";
      case "critical":
        return "bg-red-50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!user) return null;
  const filteredReports = reports.filter((r) => {
    const titleMatch = r.title?.toLowerCase().includes(searchQuery.toLowerCase());
    let fromOk = true;
    let toOk = true;
    const uploaded = new Date(r.uploadedAt);
    if (dateFrom) {
      const from = new Date(dateFrom);
      fromOk = uploaded >= from;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      // include entire day
      to.setHours(23, 59, 59, 999);
      toOk = uploaded <= to;
    }
    return titleMatch && fromOk && toOk;
  });

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-teal-900 rounded-2xl shadow-2xl p-10 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Lab Test Analyzer</h1>
              <p className="text-slate-300 text-lg">
                Upload and analyze your lab reports with AI-powered insights
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">Total Reports</p>
                <p className="text-4xl font-bold text-blue-900">{reports.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 mb-2 uppercase tracking-wide">Abnormal Results</p>
                <p className="text-4xl font-bold text-amber-900">
                  {reports.filter(r => r.overallStatus === "abnormal").length}
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Critical Alerts</p>
                <p className="text-4xl font-bold text-red-900">
                  {reports.filter(r => r.overallStatus === "critical").length}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Overall Trend Line Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Reports Timeline & Status Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={generateMonthlyData(reports)}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  cursor={{ stroke: "#14b8a6" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={{ fill: "#0ea5e9", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Reports"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">All Lab Reports</h2>
              <p className="text-slate-600 text-sm mt-1">Search and filter your reports</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by report name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => { setSearchQuery(""); setDateFrom(""); setDateTo(""); }}
                className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200"
              >
                Clear
              </button>
            </div>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-6 text-lg font-medium">No lab reports uploaded yet</p>
              <p className="text-slate-500 mb-8">Start by uploading your first lab report to get AI-powered insights</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Upload Your First Report
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        {getStatusIcon(report.overallStatus)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{report.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(report.uploadedAt).toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "short", 
                            day: "numeric" 
                          })} • {report.labName || "Unknown Lab"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(report.overallStatus)} shadow-sm`}>
                        {report.overallStatus.toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                          setShowShareModal(true);
                        }}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Share with doctor"
                      >
                        <Share2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/lab-analyzer/${report.id}`);
                        }}
                        className="ml-2 px-3 py-1 text-sm text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Upload Lab Report</h2>
                <p className="text-slate-600 text-sm mt-1">Share your lab test results for AI analysis</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <UploadForm onClose={() => setShowUploadModal(false)} onSuccess={fetchReports} />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Share with Doctor</h2>
                <p className="text-slate-600 text-sm mt-1">Grant access to your lab report</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Report
                </label>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-800 font-medium">{selectedReport.title}</p>
                  <p className="text-slate-500 text-sm mt-1">{new Date(selectedReport.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Doctor's Email
                </label>
                <input
                  type="email"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleShare}
                disabled={!doctorEmail || sharing}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {sharing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && uploadError && (
        <ErrorModal
          message={uploadError}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </main>
  );
}

function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Upload Failed</h2>
            <p className="text-slate-600 text-sm mt-1">Something went wrong</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-medium text-sm">{message}</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-6">
          Please upload a clear lab report image or PDF containing test results.
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function UploadForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [testDate, setTestDate] = useState("");
  const [labName, setLabName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    try {
      setUploading(true);
      await import("@/lib/api/labReports").then((m) =>
        m.uploadLabReport(file, { title, testDate, labName })
      );
      toast.success("Lab report uploaded and analyzed successfully");
      onClose();
      onSuccess();
      setShowErrorModal(false);
      setUploadError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to upload report";
      setUploadError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Lab Report Image/PDF
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive ? "border-teal-500 bg-teal-50" : "border-slate-300 hover:border-slate-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div>
              <div className="inline-block p-3 bg-teal-100 rounded-lg mb-3">
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-600 text-sm mt-3 hover:text-red-700 font-medium transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-700 font-medium mb-1">
                Drag and drop your lab report here
              </p>
            <p className="text-sm text-slate-500">
              Supports: JPG, PNG, GIF, BMP, TIFF, WEBP, PDF
            </p>
              <label className="inline-block mt-5 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg cursor-pointer font-medium transition-all shadow-md hover:shadow-lg">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Report Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Annual Blood Test"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Test Date (Optional)
          </label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Lab Name (Optional)
          </label>
          <input
            type="text"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            placeholder="e.g., Quest Diagnostics"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100 transition-all text-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!file || uploading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload & Analyze
            </>
          )}
        </button>
      </div>
    </form>
  );
}
