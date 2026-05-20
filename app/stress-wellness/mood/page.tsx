"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, ArrowLeft, TrendingUp, Calendar, PieChart as PieIcon, BarChart3 } from "lucide-react";
import { createMoodEntry, getMoodHistory, getMoodTrend } from "@/lib/api/stress-wellness";
import type { MoodEntry, MoodTrend } from "@/lib/types";
import { toast } from "sonner";

export default function MoodTrackerPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <MoodTrackerPage />
    </Suspense>
  );
}

const MOOD_ORDER = ["very_bad", "bad", "neutral", "good", "very_good"] as const;
const MOOD_MAP: Record<string, { label: string; emoji: string; value: number; color: string }> = {
  very_bad: { label: "Very Bad", emoji: "😞", value: 1, color: "#ef4444" },
  bad: { label: "Bad", emoji: "😟", value: 2, color: "#f97316" },
  neutral: { label: "Neutral", emoji: "😐", value: 3, color: "#94a3b8" },
  good: { label: "Good", emoji: "🙂", value: 4, color: "#84cc16" },
  very_good: { label: "Very Good", emoji: "😊", value: 5, color: "#22c55e" },
};

const MOODS = [
  { value: "very_bad", label: "Very Bad", emoji: "😞", color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200" },
  { value: "bad", label: "Bad", emoji: "😟", color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" },
  { value: "good", label: "Good", emoji: "🙂", color: "bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200" },
  { value: "very_good", label: "Very Good", emoji: "😊", color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200" },
];

const CHART_COLORS = ["#ef4444", "#f97316", "#94a3b8", "#84cc16", "#22c55e"];

function MoodTrackerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>(searchParams.get("preselect") || "");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [trend, setTrend] = useState<MoodTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"log" | "history" | "trends">("log");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [historyRes, trendRes] = await Promise.all([
        getMoodHistory(30),
        getMoodTrend(),
      ]);
      if (historyRes.success) {
        const sorted = (historyRes.data || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHistory(sorted);
      }
      if (trendRes.success) setTrend(trendRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleSave = async () => {
    if (!selectedMood) return;
    try {
      setSaving(true);
      const res = await createMoodEntry({ mood: selectedMood, note: note || undefined });
      if (res.success) {
        toast.success("Mood logged!");
        setSelectedMood("");
        setNote("");
        fetchData();
      }
    } catch {
      toast.error("Failed to log mood");
    } finally {
      setSaving(false);
    }
  };

  // Chart data helpers
  const dailyChartData = history.map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: MOOD_MAP[e.mood]?.value || 3,
    label: MOOD_MAP[e.mood]?.label || e.mood,
  }));

  const distributionData = MOOD_ORDER.map((m) => {
    const count = history.filter((e) => e.mood === m).length;
    return { name: MOOD_MAP[m].label, value: count, color: MOOD_MAP[m].color };
  }).filter((d) => d.value > 0);

  const weeklyChartData = trend?.weeklySummary?.map((w) => ({
    week: w.date.slice(5),
    avgMood: w.averageMood,
  })) || [];

  if (authLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => router.push("/stress-wellness")} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Wellness
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mood Tracker</h1>
            <p className="text-sm text-slate-500">Log, track, and understand your emotional patterns</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(["log", "history", "trends"] as const).map((v) => (
            <Button
              key={v}
              variant={view === v ? "default" : "outline"}
              size="sm"
              onClick={() => setView(v)}
              className={view === v ? "capitalize bg-teal-600 hover:bg-teal-700" : "capitalize border-slate-200 text-slate-600 hover:bg-slate-100"}
            >
              {v === "log" ? "Log Mood" : v === "history" ? "History" : "Trends"}
            </Button>
          ))}
        </div>

        {view === "log" && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">How are you feeling?</CardTitle>
              <CardDescription>Select your current mood and add an optional note</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-3">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      selectedMood === m.value ? "ring-2 ring-teal-500 border-teal-500 " + m.color : m.color
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Add a note about how you're feeling (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleSave} disabled={!selectedMood || saving} className="w-full bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Log Mood
              </Button>
            </CardContent>
          </Card>
        )}

        {view === "history" && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Mood History</CardTitle>
              <CardDescription>Your recent mood entries</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : history.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No mood entries yet. Start logging your mood!</p>
              ) : (
                <div className="space-y-3">
                  {[...history].reverse().map((entry) => {
                    const mood = MOODS.find((m) => m.value === entry.mood);
                    return (
                      <div key={entry.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <span className="text-2xl">{mood?.emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{mood?.label}</p>
                          {entry.note && <p className="text-sm text-slate-500">{entry.note}</p>}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {view === "trends" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            {trend && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-slate-500">Average Mood</p>
                    <p className="text-2xl font-bold text-slate-800">{trend.averageMood || "-"}</p>
                    <p className="text-xs text-slate-400">/ 5.0</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-slate-500">Trend</p>
                    <p className={`text-2xl font-bold capitalize ${trend.trend === "improving" ? "text-emerald-600" : trend.trend === "declining" ? "text-red-600" : "text-slate-600"}`}>
                      {trend.trend}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-slate-500">Entries</p>
                    <p className="text-2xl font-bold text-slate-800">{trend.entries.length}</p>
                    <p className="text-xs text-slate-400">last 30 days</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Daily Mood Line Chart */}
            {dailyChartData.length > 1 && (
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" /> Daily Mood Trend
                  </CardTitle>
                  <CardDescription>Your mood scores over time (1=Very Bad, 5=Very Good)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                      <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        formatter={(value: number, _name: string, props: any) => [props.payload.label, "Mood"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#14b8a6" }}
                        activeDot={{ r: 6, fill: "#14b8a6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Weekly Bar Chart */}
            {weeklyChartData.length > 0 && (
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" /> Weekly Mood Averages
                  </CardTitle>
                  <CardDescription>Average mood score by week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="avgMood" name="Average Mood" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Mood Distribution Pie */}
            {distributionData.length > 0 && (
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-teal-600" /> Mood Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of your mood entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {distributionData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Fallback when no trend data */}
            {!trend && loading && (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
            )}
            {!loading && (!trend || trend.entries.length === 0) && (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No trend data yet. Start logging your mood to see patterns!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
