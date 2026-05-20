"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { createStressAssessment, getStressHistory, getStressTrend } from "@/lib/api/stress-wellness";
import type { StressAssessment, StressTrend } from "@/lib/types";
import { toast } from "sonner";

const STRESS_QUESTIONS = [
  "How often have you felt overwhelmed by your responsibilities?",
  "How often have you found it difficult to relax?",
  "How often have you felt irritable or short-tempered?",
  "How often have you had trouble sleeping due to worrying?",
  "How often have you felt unable to control important things in your life?",
  "How often have you felt nervous or anxious?",
  "How often have you had difficulty concentrating?",
  "How often have you felt tired or low on energy?",
];

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  moderate: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  severe: "bg-red-100 text-red-700",
};

export default function StressAssessmentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [history, setHistory] = useState<StressAssessment[]>([]);
  const [trend, setTrend] = useState<StressTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastResult, setLastResult] = useState<StressAssessment | null>(null);
  const [view, setView] = useState<"assess" | "history" | "trends">("assess");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [histRes, trendRes] = await Promise.all([
        getStressHistory(30),
        getStressTrend(),
      ]);
      if (histRes.success) setHistory(histRes.data || []);
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

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < STRESS_QUESTIONS.length) {
      toast.error(`Please answer all ${STRESS_QUESTIONS.length} questions`);
      return;
    }
    try {
      setSaving(true);
      const formatted = STRESS_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] }));
      const res = await createStressAssessment({ answers: formatted });
      if (res.success && res.data) {
        setLastResult(res.data);
        toast.success("Assessment completed!");
        fetchData();
      }
    } catch {
      toast.error("Failed to submit assessment");
    } finally {
      setSaving(false);
    }
  };

  const getAdvice = (level: string) => {
    switch (level) {
      case "low": return "Your stress levels appear low. Keep up your healthy habits!";
      case "moderate": return "You're experiencing some stress. Consider relaxation techniques like deep breathing.";
      case "high": return "Stress levels are elevated. We recommend speaking with someone you trust or a professional.";
      case "severe": return "Your stress levels are severe. Please reach out to a mental health professional for support.";
      default: return "";
    }
  };

  if (authLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => router.push("/stress-wellness")} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Wellness
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Stress Assessment</h1>
            <p className="text-sm text-slate-500">Evaluate your stress levels and track changes over time</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(["assess", "history", "trends"] as const).map((v) => (
            <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="capitalize">
              {v === "assess" ? "Take Assessment" : v === "history" ? "History" : "Trends"}
            </Button>
          ))}
        </div>

        {view === "assess" && (
          <>
            {lastResult && (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Assessment Complete</h3>
                  <Badge className={`${SEVERITY_COLORS[lastResult.level]} border-0 text-sm px-4 py-1 mb-2`}>
                    {lastResult.level.toUpperCase()} - Score: {lastResult.score}/100
                  </Badge>
                  <p className="text-slate-600">{getAdvice(lastResult.level)}</p>
                  <Button variant="outline" className="mt-3" onClick={() => { setLastResult(null); setAnswers({}); }}>
                    Take Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {!lastResult && (
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Rate your experience over the past two weeks</CardTitle>
                  <CardDescription>0 = Never, 5 = Very Often</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {STRESS_QUESTIONS.map((q, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-slate-700 mb-2">{i + 1}. {q}</p>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => setAnswers((prev) => ({ ...prev, [i]: val }))}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                              answers[i] === val
                                ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleSubmit} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Submit Assessment
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {view === "history" && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : history.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No assessments yet.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${a.level === "severe" ? "text-red-500" : a.level === "high" ? "text-orange-500" : a.level === "moderate" ? "text-yellow-500" : "text-emerald-500"}`} />
                        <div>
                          <Badge className={`${SEVERITY_COLORS[a.level]} border-0`}>{a.level}</Badge>
                          <p className="text-xs text-slate-400 mt-1">Score: {a.score}/100</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {view === "trends" && trend && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-2xl font-bold text-slate-800">{trend.averageScore}</p>
                <p className="text-xs text-slate-400">/ 100</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-slate-500">Current Level</p>
                <Badge className={`${SEVERITY_COLORS[trend.currentLevel]} border-0 text-sm mt-1`}>{trend.currentLevel}</Badge>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-slate-500">Assessments</p>
                <p className="text-2xl font-bold text-slate-800">{trend.assessments.length}</p>
                <p className="text-xs text-slate-400">last 30 days</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
