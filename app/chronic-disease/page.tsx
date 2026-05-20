"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Activity, Heart, AlertTriangle, Plus, Trash2, FileText, TrendingUp, ClipboardList, LineChart as LineChartIcon, BarChart as BarChartIcon, X, CheckCircle2, Clock, AlertCircle, Pill, Weight, Thermometer, Droplets, Wind, Brain, Eye, Stethoscope, RefreshCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error-handler";
import { apiClient, API_BASE_URL } from "@/lib/api-config";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getDashboard,
  createCondition,
  getConditions,
  deleteCondition,
  createLog,
  getLogs,
  getAlerts,
  markAlertRead,
  getReports,
  generateReport,
  deleteReport,
  getTrends,
  getPredictions,
} from "@/lib/api/chronic-disease";
import type { ChronicDashboard, DailyHealthLog, PatientCondition, HealthAlert, HealthReport, TrendData, HealthPrediction } from "@/lib/types";

const CONDITIONS: string[] = ["Diabetes", "Hypertension", "Asthma", "Obesity", "Heart Disease", "Arthritis", "Other"];

const SEVERITIES: string[] = ["Mild", "Moderate", "Severe"];

const SYMPTOMS: string[] = [
  "Headache", "Fatigue", "Dizziness", "Nausea",
  "Shortness of breath", "Chest pain", "Joint pain", "Muscle pain",
  "Cough", "Fever", "Blurred vision", "Numbness", "Swelling", "Other",
];

const PAIN_LOCATIONS: string[] = [
  "Head", "Neck", "Shoulder", "Upper Back", "Lower Back",
  "Knee", "Hip", "Ankle", "Wrist", "Elbow",
  "Hand", "Foot", "Chest", "Abdomen", "Jaw",
];

const MOBILITY_ISSUES: string[] = [
  "Difficulty walking", "Stiffness", "Limited range of motion",
  "Difficulty standing", "Difficulty climbing stairs", "Joint swelling",
  "Muscle weakness", "Balance problems", "Difficulty gripping",
  "Reduced flexibility",
];

const statCards = [
  { label: "Total Logs", icon: ClipboardList, key: "totalLogs" as const, desc: "All time entries" },
  { label: "Active Conditions", icon: Activity, key: "activeConditions" as const, desc: "Tracked conditions" },
  { label: "Alerts", icon: AlertTriangle, key: "totalAlerts" as const, desc: "Unresolved alerts" },
  { label: "This Week", icon: TrendingUp, key: "thisWeekLogs" as const, desc: "Entries this week" },
];

const METRIC_LABELS: Record<string, string> = {
  bloodPressureSystolic: "Systolic BP",
  bloodPressureDiastolic: "Diastolic BP",
  bloodSugar: "Blood Sugar",
  heartRate: "Heart Rate",
  oxygenLevel: "Oxygen Level",
  weight: "Weight",
  temperature: "Temperature",
};

const METRIC_UNITS: Record<string, string> = {
  bloodPressureSystolic: "mmHg",
  bloodPressureDiastolic: "mmHg",
  bloodSugar: "mg/dL",
  heartRate: "bpm",
  oxygenLevel: "%",
  weight: "kg",
  temperature: "°F",
};

const METRIC_ICONS: Record<string, React.ComponentType<any>> = {
  bloodPressureSystolic: Heart,
  bloodPressureDiastolic: Heart,
  bloodSugar: Droplets,
  heartRate: Activity,
  oxygenLevel: Wind,
  weight: Weight,
  temperature: Thermometer,
};

const METRIC_KEYS = [
  "bloodPressureSystolic",
  "bloodPressureDiastolic",
  "bloodSugar",
  "heartRate",
  "oxygenLevel",
  "weight",
  "temperature",
] as const;

export default function ChronicDiseasePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<ChronicDashboard | null>(null);

  const [addConditionOpen, setAddConditionOpen] = useState(false);
  const [newCondition, setNewCondition] = useState("");
  const [newCustomCondition, setNewCustomCondition] = useState("");
  const [newSeverity, setNewSeverity] = useState("");
  const [newDiagnosedAt, setNewDiagnosedAt] = useState("");
  const [newConditionNotes, setNewConditionNotes] = useState("");
  const [addingCondition, setAddingCondition] = useState(false);

  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [logConditionId, setLogConditionId] = useState("");
  const [logSymptoms, setLogSymptoms] = useState<string[]>([]);
  const [logPainLevel, setLogPainLevel] = useState(0);
  const [logPainLocation, setLogPainLocation] = useState<string[]>([]);
  const [logMobilityIssues, setLogMobilityIssues] = useState<string[]>([]);
  const [logFatigueLevel, setLogFatigueLevel] = useState(0);
  const [logBPSystolic, setLogBPSystolic] = useState("");
  const [logBPDiastolic, setLogBPDiastolic] = useState("");
  const [logBloodSugar, setLogBloodSugar] = useState("");
  const [logHeartRate, setLogHeartRate] = useState("");
  const [logOxygenLevel, setLogOxygenLevel] = useState("");
  const [logWeight, setLogWeight] = useState("");
  const [logTemperature, setLogTemperature] = useState("");
  const [logMedication, setLogMedication] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  const [logs, setLogs] = useState<DailyHealthLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendMetric, setTrendMetric] = useState("bloodSugar");
  const [trendPeriod, setTrendPeriod] = useState<"day" | "week" | "month">("week");

  const [reports, setReports] = useState<HealthReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportFrom, setReportFrom] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);

  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      if (res.success && res.data) setDashboard(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await getLogs({ limit: 10 });
      if (res.success && res.data) setLogs(res.data.logs);
    } catch {
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const res = await getAlerts();
      if (res.success && res.data) setAlerts(res.data);
    } catch {
    } finally {
      setAlertsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTrends();
  }, [user, trendMetric, trendPeriod]);

  const fetchTrends = async () => {
    try {
      setTrendsLoading(true);
      const res = await getTrends({ period: trendPeriod });
      if (res.success && res.data) setTrendsData(res.data);
    } catch {
    } finally {
      setTrendsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  useEffect(() => {
    if (user) fetchPredictions();
  }, [user]);

  const fetchPredictions = async () => {
    try {
      setPredictionsLoading(true);
      const res = await getPredictions();
      if (res.success && res.data) setPredictions(res.data);
    } catch {
    } finally {
      setPredictionsLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const res = await getReports();
      if (res.success && res.data) setReports(res.data);
    } catch {
    } finally {
      setReportsLoading(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setLogSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAddCondition = async () => {
    const conditionToAdd = newCondition === "Other" ? newCustomCondition.trim() : newCondition;
    if (!conditionToAdd) {
      toast.error("Please select or enter a condition");
      return;
    }
    try {
      setAddingCondition(true);
      const res = await createCondition({
        condition: conditionToAdd,
        severity: newSeverity || undefined,
        diagnosedAt: newDiagnosedAt || undefined,
        notes: newConditionNotes || undefined,
      });
      if (res.success) {
        toast.success("Condition added");
        setAddConditionOpen(false);
        setNewCondition("");
        setNewCustomCondition("");
        setNewSeverity("");
        setNewDiagnosedAt("");
        setNewConditionNotes("");
        fetchAll();
        fetchPredictions();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAddingCondition(false);
    }
  };

  const handleDeleteCondition = async (conditionId: string) => {
    try {
      const res = await deleteCondition(conditionId);
      if (res.success) {
        toast.success("Condition removed");
        fetchAll();
        fetchPredictions();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSubmitLog = async () => {
    try {
      setSubmittingLog(true);
      const payload: any = {
        logDate: logDate || undefined,
        conditionId: logConditionId || undefined,
        symptoms: logSymptoms.length > 0 ? logSymptoms : undefined,
        painLevel: logPainLevel || undefined,
        painLocation: logPainLocation.length > 0 ? logPainLocation : undefined,
        mobilityIssues: logMobilityIssues.length > 0 ? logMobilityIssues : undefined,
        fatigueLevel: logFatigueLevel || undefined,
        bloodPressureSystolic: logBPSystolic ? Number(logBPSystolic) : undefined,
        bloodPressureDiastolic: logBPDiastolic ? Number(logBPDiastolic) : undefined,
        bloodSugar: logBloodSugar ? Number(logBloodSugar) : undefined,
        heartRate: logHeartRate ? Number(logHeartRate) : undefined,
        oxygenLevel: logOxygenLevel ? Number(logOxygenLevel) : undefined,
        weight: logWeight ? Number(logWeight) : undefined,
        temperature: logTemperature ? Number(logTemperature) : undefined,
        notes: logNotes || undefined,
      };
      if (logMedication) {
        const lines = logMedication.split("\n").filter(Boolean);
        payload.medicationTaken = lines.map((line) => ({ name: line }));
      }
      const res = await createLog(payload);
      if (res.success) {
        toast.success("Health log saved");
        setLogDialogOpen(false);
        setLogSymptoms([]);
        setLogPainLevel(0);
        setLogPainLocation([]);
        setLogMobilityIssues([]);
        setLogFatigueLevel(0);
        setLogBPSystolic("");
        setLogBPDiastolic("");
        setLogBloodSugar("");
        setLogHeartRate("");
        setLogOxygenLevel("");
        setLogWeight("");
        setLogTemperature("");
        setLogMedication("");
        setLogNotes("");
        fetchLogs();
        fetchAll();
        fetchPredictions();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleMarkAlertRead = async (alertId: string) => {
    try {
      const res = await markAlertRead(alertId);
      if (res.success) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        toast.success("Alert dismissed");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const res = await deleteReport(reportId);
      if (res.success) {
        toast.success("Report deleted");
        fetchReports();
      } else {
        toast.error(res.message || "Failed to delete report");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleGenerateReport = async () => {
    if (!reportFrom || !reportTo) {
      toast.error("Please select both start and end dates");
      return;
    }
    try {
      setGeneratingReport(true);
      const res = await generateReport(reportFrom, reportTo);
      if (res.success) {
        toast.success("Report generated");
        fetchReports();
        setReportFrom("");
        setReportTo("");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadPdf = async (reportId: string, filename: string) => {
    try {
      const response = await apiClient.get(`/api/chronic-disease/reports/download/${reportId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDownloadReport = async (from: string, to: string) => {
    if (!from || !to) {
      toast.error("Please select both start and end dates");
      return;
    }
    try {
      setGeneratingReport(true);
      const res = await generateReport(from, to);
      if (res.success && res.data?.id) {
        toast.success("Downloading report...");
        await downloadPdf(res.data.id, `health-report-${from}-${to}.pdf`);
        fetchReports();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGeneratingReport(false);
    }
  };

  const prepareChartData = (trend: TrendData) => {
    if (!trend || !trend.dates) return [];
    return trend.dates.map((date, i) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: trend.values[i] ?? 0,
    }));
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }
  if (!user) return null;

  const stats = dashboard?.stats;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-shimmer { background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ─── Hero Section ─── */}
        <section
          className="relative overflow-hidden rounded-2xl bg-black p-8 md:p-12"
          style={{ animation: "fadeInUp 0.6s ease-out" }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/[0.02] rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-6 right-16 w-20 h-20 border border-white/[0.06] rounded-full" />
          <div className="absolute bottom-12 right-32 w-3 h-3 bg-teal-500/30 rounded-full" />

          <div className="hidden md:block absolute top-8 right-8 bg-white/[0.05] backdrop-blur-md rounded-2xl p-4 border border-white/[0.08] animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-white/[0.06]">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Health</p>
                <p className="font-semibold text-white text-lg">Tracked</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] text-sm text-slate-400 mb-5">
              <Heart className="w-4 h-4 text-teal-400" />
              Condition Management
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Chronic Disease
              <span className="block text-teal-400">Management</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-xl leading-relaxed">
              Track your symptoms, monitor vital signs, and manage your chronic conditions in one place.
            </p>
          </div>
        </section>

        {/* ─── Tabs ─── */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-black/5 border border-black/10 rounded-lg p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-md">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-md">
              <ClipboardList className="w-4 h-4" />
              Log Health
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-md">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-md">
              <FileText className="w-4 h-4" />
              Summary
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════════════════════════
               DASHBOARD TAB
          ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Stats */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border border-black/10 shadow-sm overflow-hidden">
                    <div className="h-1 bg-teal-400" />
                    <CardContent className="py-4 text-center">
                      <div className="w-16 h-4 bg-slate-200 rounded mx-auto mb-2 animate-shimmer" />
                      <div className="w-10 h-3 bg-slate-100 rounded mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((s, i) => {
                  const cardColors = [
                    { bar: "bg-teal-500", iconBg: "bg-teal-100", icon: "text-teal-600" },
                    { bar: "bg-emerald-500", iconBg: "bg-emerald-100", icon: "text-emerald-600" },
                    { bar: "bg-cyan-500", iconBg: "bg-cyan-100", icon: "text-cyan-600" },
                    { bar: "bg-slate-500", iconBg: "bg-slate-100", icon: "text-slate-600" },
                  ];
                  const c = cardColors[i % 4];
                  return (
                    <Card
                      key={s.label}
                      className="group border border-black/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
                      style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
                    >
                      <div className={`h-1 ${c.bar} transition-all duration-300 group-hover:h-1.5`} />
                      <CardContent className="py-4 text-center">
                        <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform duration-300 group-hover:scale-110`}>
                          <s.icon className={`w-5 h-5 ${c.icon}`} />
                        </div>
                        <p className="text-xl font-bold text-slate-800">{stats?.[s.key] ?? 0}</p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* AI Predictions */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-black" />
                      AI Health Predictions
                    </CardTitle>
                    <CardDescription>AI-powered analysis of your health trends and early warnings</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchPredictions} disabled={predictionsLoading} className="border-black/20 text-black/60 hover:text-black">
                    {predictionsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                  </div>
                ) : predictions.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-6">Log more health data to get AI-powered predictions and trend analysis.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predictions.map((p, i) => {
                      const severityColors: Record<string, string> = {
                        info: "bg-black/5 border-black/10",
                        warning: "bg-amber-50/50 border-amber-200/50",
                        critical: "bg-red-50/50 border-red-200/50",
                      };
                      const iconColors: Record<string, string> = {
                        info: "text-black/60",
                        warning: "text-amber-600",
                        critical: "text-red-600",
                      };
                      const trendIcon = p.trend === "increasing" ? "↑" : p.trend === "decreasing" ? "↓" : "→";
                      const trendColor = p.trend === "increasing" ? "text-red-600" : p.trend === "decreasing" ? "text-amber-600" : "text-black/60";
                      return (
                        <div
                          key={i}
                          className={`rounded-xl border p-4 ${severityColors[p.severity]} transition-all duration-300 hover:shadow-md`}
                          style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-black/5 shrink-0 ${iconColors[p.severity]}`}>
                              {p.severity === "critical" ? <AlertTriangle className="w-5 h-5" /> : p.severity === "warning" ? <AlertCircle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 text-black/60 uppercase">
                                  {p.metric}
                                </span>
                                <span className={`text-sm font-mono ${trendColor}`}>
                                  {trendIcon} {p.percentageChange > 0 ? "+" : ""}{p.percentageChange}%
                                </span>
                              </div>
                              <p className="text-sm font-medium text-black">{p.message}</p>
                              <p className="text-xs text-black/50 mt-1">
                                Current: {p.currentValue} · {p.consecutiveDays} day{p.consecutiveDays !== 1 ? "s" : ""}
                              </p>
                              <div className="mt-2 p-2 rounded-lg bg-black/[0.03] border border-black/5">
                                <p className="text-xs text-black/60">
                                  <span className="font-medium text-black">Recommendation:</span> {p.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Conditions</CardTitle>
                    <CardDescription>Manage your tracked chronic conditions</CardDescription>
                  </div>
                  <Dialog open={addConditionOpen} onOpenChange={setAddConditionOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-black hover:bg-black/80 text-white gap-1">
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Condition</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label>Condition</Label>
                          <Select value={newCondition || undefined} onValueChange={(v) => { setNewCondition(v); if (v !== "Other") setNewCustomCondition(""); }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITIONS.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {newCondition === "Other" && (
                            <Input
                              placeholder="Enter your condition..."
                              value={newCustomCondition}
                              onChange={(e) => setNewCustomCondition(e.target.value)}
                              className="mt-2"
                              autoFocus
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Severity</Label>
                          <Select value={newSeverity || undefined} onValueChange={setNewSeverity}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select severity (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {SEVERITIES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Diagnosed Date</Label>
                          <Input type="date" value={newDiagnosedAt} onChange={(e) => setNewDiagnosedAt(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea value={newConditionNotes} onChange={(e) => setNewConditionNotes(e.target.value)} placeholder="Optional notes..." />
                        </div>
                        <Button onClick={handleAddCondition} disabled={addingCondition} className="w-full bg-black hover:bg-black/80 text-white">
                          {addingCondition ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Condition"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {!dashboard?.conditions || dashboard.conditions.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-6">No conditions tracked yet. Add your first condition above.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboard.conditions.map((cond, i) => (
                      <div
                        key={cond.id}
                        className="group rounded-xl border border-black/10 bg-white p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-black/10">
                            <Stethoscope className="w-6 h-6 text-black/60" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => { e.stopPropagation(); handleDeleteCondition(cond.id); }}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-black text-base mb-1">{cond.condition}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          {cond.severity && (
                            <Badge variant="secondary" className="text-[11px] px-2 py-0.5 border-0 bg-black/5 text-black/60 font-medium">
                              {cond.severity}
                            </Badge>
                          )}
                          {cond.diagnosedAt && (
                            <span className="text-[11px] text-black/40">
                              Since {new Date(cond.diagnosedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-black/50 border-t border-black/5 pt-3 mt-3">
                          <div className="flex items-center gap-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>{cond.logCount} log{cond.logCount !== 1 ? "s" : ""}</span>
                          </div>
                          {cond.lastLog && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(cond.lastLog).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Log Button */}
            <div className="flex justify-center">
              <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-black/80 text-white gap-2 px-8 py-6 text-base rounded-xl shadow-md">
                    <Plus className="w-5 h-5" />
                    Quick Health Log
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Log Daily Health</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Condition (optional)</Label>
                        <Select value={logConditionId || undefined} onValueChange={setLogConditionId}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {dashboard?.conditions.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.condition}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Symptoms</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SYMPTOMS.map((symptom) => (
                          <label key={symptom} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={logSymptoms.includes(symptom)}
                              onCheckedChange={() => toggleSymptom(symptom)}
                            />
                            {symptom}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pain Level (0-10): {logPainLevel}</Label>
                        <Input type="range" min={0} max={10} value={logPainLevel} onChange={(e) => setLogPainLevel(Number(e.target.value))} className="cursor-pointer" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fatigue Level (0-10): {logFatigueLevel}</Label>
                        <Input type="range" min={0} max={10} value={logFatigueLevel} onChange={(e) => setLogFatigueLevel(Number(e.target.value))} className="cursor-pointer" />
                      </div>
                    </div>

                    {/* ── Pain Location ── */}
                    <div className="space-y-2">
                      <Label>Pain Location</Label>
                      <div className="flex flex-wrap gap-2">
                        {PAIN_LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLogPainLocation((prev) =>
                              prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
                            )}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                              logPainLocation.includes(loc)
                                ? "bg-black text-white border-black"
                                : "bg-white text-black/60 border-black/20 hover:border-black/40"
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Mobility Issues ── */}
                    <div className="space-y-2">
                      <Label>Mobility Issues</Label>
                      <div className="flex flex-wrap gap-2">
                        {MOBILITY_ISSUES.map((issue) => (
                          <button
                            key={issue}
                            type="button"
                            onClick={() => setLogMobilityIssues((prev) =>
                              prev.includes(issue) ? prev.filter((m) => m !== issue) : [...prev, issue]
                            )}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                              logMobilityIssues.includes(issue)
                                ? "bg-black text-white border-black"
                                : "bg-white text-black/60 border-black/20 hover:border-black/40"
                            }`}
                          >
                            {issue}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Vitals</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">BP Systolic (mmHg)</Label>
                          <Input type="number" placeholder="120" value={logBPSystolic} onChange={(e) => setLogBPSystolic(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">BP Diastolic (mmHg)</Label>
                          <Input type="number" placeholder="80" value={logBPDiastolic} onChange={(e) => setLogBPDiastolic(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Blood Sugar (mg/dL)</Label>
                          <Input type="number" placeholder="100" value={logBloodSugar} onChange={(e) => setLogBloodSugar(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Heart Rate (bpm)</Label>
                          <Input type="number" placeholder="72" value={logHeartRate} onChange={(e) => setLogHeartRate(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Oxygen Level (%)</Label>
                          <Input type="number" placeholder="98" value={logOxygenLevel} onChange={(e) => setLogOxygenLevel(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Weight (kg)</Label>
                          <Input type="number" placeholder="70" value={logWeight} onChange={(e) => setLogWeight(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Temperature (°F)</Label>
                          <Input type="number" placeholder="98.6" step="0.1" value={logTemperature} onChange={(e) => setLogTemperature(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Medication Taken (one per line)</Label>
                      <Textarea value={logMedication} onChange={(e) => setLogMedication(e.target.value)} placeholder="Metformin 500mg&#10;Lisinopril 10mg" rows={3} />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea value={logNotes} onChange={(e) => setLogNotes(e.target.value)} placeholder="Any additional notes..." rows={3} />
                    </div>

                    <Button onClick={handleSubmitLog} disabled={submittingLog} className="w-full bg-black hover:bg-black/80 text-white">
                      {submittingLog ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Health Log"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Recent Logs */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <CardTitle>Recent Logs</CardTitle>
                <CardDescription>Your most recent health entries</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                  </div>
                ) : logs.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-6">No health logs yet. Start logging above.</p>
                ) : (
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log, i) => (
                      <div
                        key={log.id}
                        className="group rounded-xl border border-black/10 bg-white p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        style={{ animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                              <ClipboardList className="w-5 h-5 text-black/60" />
                            </div>
                            <div>
                              <p className="font-medium text-black text-sm">
                                {new Date(log.logDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                              </p>
                              {log.condition && (
                                <p className="text-xs text-black/50 mt-0.5">{log.condition.condition}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {log.painLevel != null && log.painLevel > 0 && (
                              <Badge variant="secondary" className={`text-[10px] border-0 font-medium ${log.painLevel >= 7 ? "bg-red-50 text-red-600" : log.painLevel >= 4 ? "bg-amber-50 text-amber-700" : "bg-black/5 text-black/60"}`}>
                                Pain {log.painLevel}/10
                              </Badge>
                            )}
                            {log.bloodSugar != null && (
                              <Badge variant="secondary" className={`text-[10px] border-0 font-medium ${log.bloodSugar > 180 ? "bg-red-50 text-red-600" : log.bloodSugar > 130 ? "bg-amber-50 text-amber-700" : "bg-black/5 text-black/60"}`}>
                                BG {log.bloodSugar}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {log.symptoms && log.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {log.symptoms.slice(0, 5).map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-black/60">{s}</span>
                            ))}
                            {log.symptoms.length > 5 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-black/40">+{log.symptoms.length - 5}</span>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs text-black/60">
                          {log.bloodPressureSystolic != null && (
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              <span>{log.bloodPressureSystolic}/{log.bloodPressureDiastolic ?? "?"} mmHg</span>
                            </div>
                          )}
                          {log.heartRate != null && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{log.heartRate} bpm</span>
                            </div>
                          )}
                          {log.oxygenLevel != null && (
                            <div className="flex items-center gap-1">
                              <Wind className="w-3 h-3" />
                              <span>{log.oxygenLevel}%</span>
                            </div>
                          )}
                          {log.weight != null && (
                            <div className="flex items-center gap-1">
                              <Weight className="w-3 h-3" />
                              <span>{log.weight} kg</span>
                            </div>
                          )}
                          {log.temperature != null && (
                            <div className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3" />
                              <span>{log.temperature}°C</span>
                            </div>
                          )}
                          {log.fatigueLevel != null && log.fatigueLevel > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">😴</span>
                              <span>Fatigue {log.fatigueLevel}/10</span>
                            </div>
                          )}
                          {log.painLocation && log.painLocation.length > 0 && (
                            <div className="flex items-center gap-1 col-span-full mt-1">
                              <span className="text-[10px] text-black/40">Pain locations: {log.painLocation.join(", ")}</span>
                            </div>
                          )}
                          {log.mobilityIssues && log.mobilityIssues.length > 0 && (
                            <div className="flex items-center gap-1 col-span-full">
                              <span className="text-[10px] text-black/40">Mobility: {log.mobilityIssues.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Health Alerts
                </CardTitle>
                <CardDescription>Abnormal readings that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                  </div>
                ) : alerts.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-6">No alerts. All readings are normal.</p>
                ) : (
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={cn("flex items-start justify-between p-3 rounded-lg border text-sm", getAlertSeverityColor(alert.severity))}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-xs mt-0.5 opacity-70">
                              {alert.metric}: {alert.value} (threshold: {alert.threshold})
                            </p>
                            <p className="text-xs mt-0.5 opacity-50">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleMarkAlertRead(alert.id)} className="shrink-0 hover:bg-white/50">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
               LOG HEALTH TAB
          ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="logs" className="space-y-6 mt-6">
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <CardTitle>Health Log History</CardTitle>
                <CardDescription>View all your logged health data</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-black/40" />
                  </div>
                ) : logs.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-12">No health logs yet. Use Quick Health Log to add one.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-teal-500 to-emerald-500">
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">Condition</th>
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">Symptoms</th>
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">BP</th>
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">Sugar</th>
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">HR</th>
                          <th className="text-left py-3 px-4 font-semibold text-white border-b border-white/20">O₂</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, i) => (
                          <tr key={log.id} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-teal-50/50 transition-colors`}>
                            <td className="py-3 px-4 border-b border-slate-100 font-medium text-slate-700">{new Date(log.logDate).toLocaleDateString()}</td>
                            <td className="py-3 px-4 border-b border-slate-100 text-slate-600">{log.condition?.condition || "-"}</td>
                            <td className="py-3 px-4 border-b border-slate-100">
                              {log.symptoms && log.symptoms.length > 0
                                ? <div className="flex flex-wrap gap-1">{log.symptoms.slice(0, 2).map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">{s}</span>)}{log.symptoms.length > 2 && <span className="text-[10px] text-slate-400">+{log.symptoms.length - 2}</span>}</div>
                                : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="py-3 px-4 border-b border-slate-100">
                              {log.bloodPressureSystolic ? (
                                <span className={`font-medium ${log.bloodPressureSystolic > 140 ? "text-red-600" : log.bloodPressureSystolic < 90 ? "text-amber-600" : "text-emerald-600"}`}>
                                  {log.bloodPressureSystolic}/{log.bloodPressureDiastolic || "?"}
                                </span>
                              ) : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="py-3 px-4 border-b border-slate-100">
                              {log.bloodSugar != null ? (
                                <span className={`font-medium ${log.bloodSugar > 180 ? "text-red-600" : log.bloodSugar > 130 ? "text-amber-600" : "text-emerald-600"}`}>
                                  {log.bloodSugar}
                                </span>
                              ) : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="py-3 px-4 border-b border-slate-100">
                              {log.heartRate != null ? (
                                <span className={`font-medium ${log.heartRate > 100 ? "text-red-600" : log.heartRate < 60 ? "text-amber-600" : "text-emerald-600"}`}>
                                  {log.heartRate}
                                </span>
                              ) : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="py-3 px-4 border-b border-slate-100">
                              {log.oxygenLevel != null ? (
                                <span className={`font-medium ${log.oxygenLevel < 90 ? "text-red-600" : log.oxygenLevel < 95 ? "text-amber-600" : "text-emerald-600"}`}>
                                  {log.oxygenLevel}%
                                </span>
                              ) : <span className="text-slate-400">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
               TRENDS TAB
          ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Health Trends</CardTitle>
                    <CardDescription>Visualize your health metrics over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={trendMetric} onValueChange={setTrendMetric}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {METRIC_KEYS.map((key) => (
                          <SelectItem key={key} value={key}>{METRIC_LABELS[key]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={trendPeriod} onValueChange={(v) => setTrendPeriod(v as "day" | "week" | "month")}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {trendsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-black/40" />
                  </div>
                ) : trendsData.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-12">No trend data available. Start logging to see trends.</p>
                ) : (
                  <div className="space-y-8">
                    {trendsData.map((trend) => {
                      const chartData = prepareChartData(trend);
                      const Icon = METRIC_ICONS[trend.metric] || Activity;
                      return (
                        <div key={trend.metric}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-800">{METRIC_LABELS[trend.metric] || trend.metric}</p>
                              <p className="text-xs text-slate-400">Unit: {trend.unit}</p>
                            </div>
                          </div>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <defs>
                                  <linearGradient id={`gradient-${trend.metric}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id={`line-${trend.metric}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#14b8a6" />
                                    <stop offset="100%" stopColor="#0d9488" />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} />
                                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} />
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
                                    background: "white",
                                  }}
                                  labelStyle={{ color: "#1e293b", fontWeight: 600 }}
                                />
                                <defs>
                                  <linearGradient id={`line-${trend.metric}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#14b8a6" />
                                    <stop offset="100%" stopColor="#0d9488" />
                                  </linearGradient>
                                </defs>
                                <Line type="monotone" dataKey="value" stroke={`url(#line-${trend.metric})`} strokeWidth={2.5} dot={{ fill: "#14b8a6", strokeWidth: 2, stroke: "#fff", r: 4 }} activeDot={{ r: 7, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════════
               REPORTS TAB
          ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="summary" className="space-y-6 mt-6">
            {/* Health Summary */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Health Summary
                </CardTitle>
                <CardDescription>Overview of your logged health data</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                  </div>
                ) : !dashboard ? (
                  <p className="text-sm text-black/50 text-center py-6">No health data available yet.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Total Logs", value: dashboard.stats.totalLogs, bar: "bg-teal-500", bg: "bg-teal-50", text: "text-teal-700", sub: "text-teal-500" },
                        { label: "Conditions", value: dashboard.stats.activeConditions, bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", sub: "text-emerald-500" },
                        { label: "Alerts", value: dashboard.stats.totalAlerts, bar: "bg-cyan-500", bg: "bg-cyan-50", text: "text-cyan-700", sub: "text-cyan-500" },
                        { label: "This Week", value: dashboard.stats.thisWeekLogs, bar: "bg-slate-500", bg: "bg-slate-50", text: "text-slate-700", sub: "text-slate-500" },
                      ].map((s, i) => (
                        <div key={s.label} className={`relative overflow-hidden rounded-xl ${s.bg} border border-transparent p-4 text-center`}>
                          <div className={`absolute top-0 left-0 w-full h-0.5 ${s.bar}`} />
                          <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                          <p className={`text-xs ${s.sub} mt-1`}>{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {dashboard.recentLogs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-black mb-2">Recent Symptoms</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const allSymptoms = dashboard.recentLogs.flatMap((l) => l.symptoms || []);
                            const counts = allSymptoms.reduce<Record<string, number>>((acc, s) => {
                              acc[s] = (acc[s] || 0) + 1;
                              return acc;
                            }, {});
                            return Object.entries(counts)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 8)
                              .map(([symptom, count]) => (
                                <span key={symptom} className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                                  {symptom} <span className="text-teal-400">({count})</span>
                                </span>
                              ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Predictions
                </CardTitle>
                <CardDescription>AI analysis of your health trends</CardDescription>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                  </div>
                ) : predictions.length === 0 ? (
                  <p className="text-sm text-black/50 text-center py-6">No predictions available. Log more data to get AI insights.</p>
                ) : (
                  <div className="space-y-3">
                    {predictions.map((p, i) => {
                      const colors: Record<string, string> = {
                        info: "border-black/10 bg-white",
                        warning: "border-amber-200/50 bg-amber-50/30",
                        critical: "border-red-200/50 bg-red-50/30",
                      };
                      const icons: Record<string, typeof AlertTriangle> = {
                        info: Activity,
                        warning: AlertCircle,
                        critical: AlertTriangle,
                      };
                      const Icon = icons[p.severity] || Activity;
                      return (
                        <div key={i} className={`rounded-xl border p-4 ${colors[p.severity]}`}>
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 mt-0.5 shrink-0 text-black/60" />
                            <div>
                              <p className="text-sm font-medium text-black">{p.message}</p>
                              <p className="text-xs text-black/50 mt-1">{p.currentValue}</p>
                              <p className="text-xs text-black/60 mt-2 italic">{p.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Download Report */}
            <Card className="border border-black/10 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Report
                </CardTitle>
                <CardDescription>Generate and download a PDF health report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">From</Label>
                    <Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">To</Label>
                    <Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} />
                  </div>
                  <Button onClick={() => handleDownloadReport(reportFrom, reportTo)} disabled={generatingReport} className="bg-black hover:bg-black/80 text-white shrink-0">
                    {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-1" /> Download</>}
                  </Button>
                </div>

                {reports.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-black/10">
                    <h4 className="text-sm font-medium text-black mb-3">Previous Reports</h4>
                    <div className="space-y-2">
                      {reports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] border border-black/5 text-sm">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-black/60" />
                            <span className="text-black/60 text-xs">{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => downloadPdf(report.id, `health-report-${new Date(report.createdAt).toISOString().split("T")[0]}.pdf`)} className="border-black/20 text-black/60 hover:text-black">
                              <Download className="w-3.5 h-3.5 mr-1" /> Download
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
