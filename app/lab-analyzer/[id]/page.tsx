"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer, Share2, AlertTriangle, CheckCircle, AlertCircle, TrendingUp, FileText, XCircle, BarChart3, Activity, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-context";
import { getLabReportById, shareLabReportWithDoctor, getTrendData } from "@/lib/api/labReports";
import type { LabReport, TrendDataPoint } from "@/lib/types";

export default function LabReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [selectedBiomarker, setSelectedBiomarker] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [resolvedParams, setResolvedParams] = useState<{ id: string }>({ id: "" });

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && resolvedParams.id && resolvedParams.id !== "") {
      fetchReport();
    }
  }, [user, resolvedParams.id]);

  async function fetchReport() {
    try {
      setLoading(true);
      const response = await getLabReportById(resolvedParams.id);
      if (response.success && response.data) {
        setReport(response.data.report);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load lab report");
      router.push("/lab-analyzer");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!report || !doctorEmail) return;

    try {
      setSharing(true);
      await shareLabReportWithDoctor(report.id, doctorEmail);
      toast.success("Lab report shared successfully");
      setShowShareModal(false);
      setDoctorEmail("");
      fetchReport();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to share report");
    } finally {
      setSharing(false);
    }
  }

  async function fetchTrendData(biomarkerName: string) {
    try {
      const response = await getTrendData(biomarkerName);
      if (response.success && response.data) {
        setTrendData(response.data.trendData);
        setSelectedBiomarker(biomarkerName);
      }
    } catch (err: any) {
      toast.error("Failed to load trend data");
    }
  }

  function printReport() {
    window.print();
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
        return null;
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Analyzing your lab report...</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 print:py-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 print:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lab Reports
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-black via-black to-teal-900 rounded-2xl shadow-2xl p-10 text-white mb-8 print:border print:border-slate-300">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">{report.title}</h1>
              <div className="flex items-center gap-5 text-slate-300">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {new Date(report.uploadedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                {report.labName && <span className="flex items-center gap-2"><span>•</span> {report.labName}</span>}
                {report.testDate && <span className="flex items-center gap-2"><span>•</span> {new Date(report.testDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 hover:bg-slate-100 rounded-lg"
                title="Share with doctor"
              >
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={printReport}
                className="p-2 hover:bg-slate-100 rounded-lg"
                title="Print report"
              >
                <Printer className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {report.criticalAlerts && report.criticalAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-800">Critical Values Detected</h2>
            </div>
            <div className="space-y-3">
              {report.criticalAlerts.map((alert, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-red-800">{alert.biomarker}</h3>
                      <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{alert.value}</p>
                      <p className="text-xs text-slate-500">Normal: {alert.normalRange}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Recommendation:</span> {alert.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Test Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-2 uppercase">Total Biomarkers</p>
              <p className="text-3xl font-bold text-blue-900">{report.summary.totalBiomarkers}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <p className="text-sm text-emerald-600 font-semibold mb-2 uppercase">Normal</p>
              <p className="text-3xl font-bold text-emerald-900">{report.summary.normalCount}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <p className="text-sm text-amber-600 font-semibold mb-2 uppercase">Abnormal</p>
              <p className="text-3xl font-bold text-amber-900">{report.summary.abnormalCount}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <p className="text-sm text-red-600 font-semibold mb-2 uppercase">Critical</p>
              <p className="text-3xl font-bold text-red-900">{report.summary.criticalCount}</p>
            </div>
          </div>

          {/* Biomarker Distribution Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Biomarker Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Normal", count: report.summary.normalCount, fill: "#10b981" },
                  { name: "Abnormal", count: report.summary.abnormalCount, fill: "#f59e0b" },
                  { name: "Critical", count: report.summary.criticalCount, fill: "#ef4444" },
                ]}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }}
                  cursor={{ fill: "rgba(20, 184, 166, 0.1)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {report.summary.keyFindings.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Key Findings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.summary.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Health Profile Integration */}
        {(report.flaggedConditions?.length || report.flaggedMedications?.length) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Health Profile Integration</h2>
            
            {report.flaggedConditions && report.flaggedConditions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900 text-lg">Related Conditions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.flaggedConditions.map((condition, index) => (
                    <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-800 font-medium">{condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {report.flaggedMedications && report.flaggedMedications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900 text-lg">Medication Interactions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.flaggedMedications.map((med, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 font-medium">{med}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Personalized Recommendations */}
        {report.personalizedRecommendations && (
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/20 rounded-xl flex-shrink-0">
                <FileText className="w-6 h-6 text-teal-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-teal-900 mb-4">Personalized Recommendations</h2>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">{report.personalizedRecommendations}</p>
              </div>
            </div>
          </div>
        )}

        {/* Biomarkers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Detailed Biomarkers Analysis</h2>
          <div className="space-y-4">
            {report.biomarkers.map((biomarker, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all ${getStatusBg(biomarker.status)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(biomarker.status)}
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{biomarker.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                        biomarker.status === "normal" ? "bg-emerald-100 text-emerald-800" :
                        biomarker.status === "abnormal" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {biomarker.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchTrendData(biomarker.name)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    title="View trend"
                  >
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Your Value</p>
                    <p className="text-2xl font-bold text-slate-900">{biomarker.value} <span className="text-sm text-slate-600">{biomarker.unit}</span></p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Reference Range</p>
                    <p className="text-sm text-slate-700 font-semibold">{biomarker.referenceRange}</p>
                  </div>
                </div>
                {biomarker.explanation && (
                  <p className="text-sm text-slate-700 mb-4 p-3 bg-white/50 rounded-lg">{biomarker.explanation}</p>
                )}
                {biomarker.causes && biomarker.causes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-800 mb-2">Possible Causes:</p>
                    <ul className="space-y-1">
                      {biomarker.causes.map((cause, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {biomarker.relatedConditions && biomarker.relatedConditions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-2">Related Conditions:</p>
                    <div className="flex flex-wrap gap-2">
                      {biomarker.relatedConditions.map((condition, i) => (
                        <span key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-full font-medium text-slate-700">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        {report.analysis && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-300 p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-200/50 rounded-xl flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">AI Analysis</h2>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed text-sm">{report.analysis}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trend Chart */}
        {selectedBiomarker && trendData.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedBiomarker} Trend
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">Historical data and progress tracking</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBiomarker(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={trendData.map(point => ({
                  date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                  value: point.value,
                  status: point.status,
                  unit: point.unit,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }}
                  cursor={{ stroke: "#14b8a6" }}
                  formatter={(value, name, props) => [
                    `${value} ${props.payload?.unit || ""}`,
                    "Value"
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: "#0ea5e9", r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Value"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Latest Value</p>
                <p className="text-2xl font-bold text-blue-900">{trendData[trendData.length - 1]?.value} {trendData[0]?.unit}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Average</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(trendData.reduce((sum, d) => sum + d.value, 0) / trendData.length).toFixed(2)} {trendData[0]?.unit}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Observations</p>
                <p className="text-2xl font-bold text-emerald-900">{trendData.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Share Information */}
        {report.isSharedWithDoctor && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-200/50 rounded-xl flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 text-lg">Shared with Doctor</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  {report.doctorEmail} · {new Date(report.sharedAt!).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Share with Doctor</h2>
                <p className="text-slate-600 text-sm mt-1">Grant access to this lab report</p>
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
    </main>
  );
}
