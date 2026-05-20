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
import { Loader2, ArrowLeft, Brain, AlertTriangle, HeartHandshake } from "lucide-react";
import { createScreening, getScreeningHistory } from "@/lib/api/stress-wellness";
import type { AnxietyScreening } from "@/lib/types";
import { toast } from "sonner";

type TestType = "phq9" | "gad7";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const SEVERITY_COLORS: Record<string, string> = {
  minimal: "bg-emerald-100 text-emerald-700",
  mild: "bg-yellow-100 text-yellow-700",
  moderate: "bg-orange-100 text-orange-700",
  moderately_severe: "bg-red-100 text-red-700",
  severe: "bg-rose-100 text-rose-700",
};

const ANSWER_LABELS = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

export default function ScreeningPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [testType, setTestType] = useState<TestType>("phq9");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [history, setHistory] = useState<AnxietyScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastResult, setLastResult] = useState<AnxietyScreening | null>(null);

  const questions = testType === "phq9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const maxScore = testType === "phq9" ? 27 : 21;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getScreeningHistory();
      if (res.success) setHistory(res.data || []);
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
    const answered = Object.keys(answers).length;
    if (answered < questions.length) {
      toast.error(`Please answer all ${questions.length} questions`);
      return;
    }
    try {
      setSaving(true);
      const formatted = questions.map((q, i) => ({ question: q, answer: answers[i] }));
      const res = await createScreening({ testType, answers: formatted });
      if (res.success && res.data) {
        setLastResult(res.data);
        toast.success("Screening completed!");
        fetchData();
      }
    } catch {
      toast.error("Failed to submit screening");
    } finally {
      setSaving(false);
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
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mental Health Screening</h1>
            <p className="text-sm text-slate-500">Confidential PHQ-9 and GAD-7 assessments with AI support</p>
          </div>
        </div>

        {lastResult ? (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <HeartHandshake className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Assessment Complete</h3>
                <Badge className={`${SEVERITY_COLORS[lastResult.severity]} border-0 text-sm px-4 py-1 mb-1`}>
                  {lastResult.severity.replace("_", " ").toUpperCase()} - Score: {lastResult.score}/{maxScore}
                </Badge>
              </div>
              {lastResult.aiGeneratedSuggestion && (
                <div className="p-4 bg-white rounded-xl border border-indigo-100">
                  <p className="text-sm font-medium text-indigo-800 mb-1">AI Suggestion</p>
                  <p className="text-sm text-slate-600">{lastResult.aiGeneratedSuggestion}</p>
                </div>
              )}
              {(lastResult.severity === "moderate" || lastResult.severity === "moderately_severe" || lastResult.severity === "severe") && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      Your results suggest you may benefit from speaking with a mental health professional.
                      Consider reaching out to a counselor, psychologist, or psychiatrist.
                      <br /><br />
                      <strong>Pakistan Mental Health Helpline:</strong> 0311-7786264
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setLastResult(null); setAnswers({}); }}>
                  Take Another Test
                </Button>
                <Button className="flex-1" onClick={() => setViewHistory()}>
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex gap-2">
              {(["phq9", "gad7"] as const).map((t) => (
                <Button
                  key={t}
                  variant={testType === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setTestType(t); setAnswers({}); }}
                >
                  {t === "phq9" ? "PHQ-9 (Depression)" : "GAD-7 (Anxiety)"}
                </Button>
              ))}
            </div>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {testType === "phq9" ? "Patient Health Questionnaire (PHQ-9)" : "Generalized Anxiety Disorder (GAD-7)"}
                </CardTitle>
                <CardDescription>
                  Over the last 2 weeks, how often have you been bothered by the following problems?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {questions.map((q, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-slate-700 mb-2">{i + 1}. {q}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {ANSWER_LABELS.map((label, val) => (
                        <button
                          key={val}
                          onClick={() => setAnswers((prev) => ({ ...prev, [i]: val }))}
                          className={`p-2 rounded-lg text-xs font-medium transition-all ${
                            answers[i] === val
                              ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button onClick={handleSubmit} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Submit Screening
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {history.length > 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Screening History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">{s.testType}</Badge>
                      <Badge className={`${SEVERITY_COLORS[s.severity]} border-0`}>{s.severity.replace("_", " ")}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">Score: {s.score}</p>
                      <p className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );

  function setViewHistory() {
    setLastResult(null);
  }
}
