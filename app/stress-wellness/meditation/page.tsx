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
import { Loader2, ArrowLeft, Sparkles, Timer, Play, Pause, RotateCcw } from "lucide-react";
import { createMeditationSession, getMeditationHistory, getMeditationStats } from "@/lib/api/stress-wellness";
import type { MeditationSession, MeditationStats } from "@/lib/types";
import { toast } from "sonner";

const EXERCISES = [
  {
    type: "breathing",
    title: "4-7-8 Breathing",
    desc: "Inhale for 4 seconds, hold for 7, exhale for 8. Calms the nervous system.",
    duration: 120,
    color: "bg-blue-100 text-blue-700",
    icon: "🌬️",
  },
  {
    type: "breathing",
    title: "Box Breathing",
    desc: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Used by Navy SEALs for stress control.",
    duration: 120,
    color: "bg-cyan-100 text-cyan-700",
    icon: "🔲",
  },
  {
    type: "relaxation",
    title: "Body Scan Relaxation",
    desc: "Gradually relax each part of your body from head to toe.",
    duration: 300,
    color: "bg-teal-100 text-teal-700",
    icon: "🧘",
  },
  {
    type: "guided_meditation",
    title: "Mindful Moments",
    desc: "A short guided meditation to bring you into the present moment.",
    duration: 300,
    color: "bg-indigo-100 text-indigo-700",
    icon: "🧠",
  },
  {
    type: "stress_relief",
    title: "Quick Stress Relief",
    desc: "A rapid stress-relief exercise for when you need it most.",
    duration: 180,
    color: "bg-rose-100 text-rose-700",
    icon: "💆",
  },
  {
    type: "guided_meditation",
    title: "Loving-Kindness Meditation",
    desc: "Cultivate compassion for yourself and others through gentle reflection.",
    duration: 600,
    color: "bg-pink-100 text-pink-700",
    icon: "💗",
  },
];

export default function MeditationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [stats, setStats] = useState<MeditationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeExercise, setActiveExercise] = useState<typeof EXERCISES[0] | null>(null);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [histRes, statsRes] = await Promise.all([
        getMeditationHistory(),
        getMeditationStats(),
      ]);
      if (histRes.success) setSessions(histRes.data || []);
      if (statsRes.success) setStats(statsRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    if (timer === 0 && isPlaying) {
      setIsPlaying(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const startExercise = (ex: typeof EXERCISES[0]) => {
    setActiveExercise(ex);
    setTimer(ex.duration);
    setIsPlaying(true);
  };

  const handleComplete = async () => {
    if (!activeExercise) return;
    try {
      setSaving(true);
      const res = await createMeditationSession({
        type: activeExercise.type,
        duration: activeExercise.duration,
        title: activeExercise.title,
      });
      if (res.success) {
        toast.success("Session completed! 🎉");
        fetchData();
      }
    } catch {
      toast.error("Failed to log session");
    } finally {
      setSaving(false);
      setActiveExercise(null);
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Meditation & Exercises</h1>
            <p className="text-sm text-slate-500">Guided sessions for relaxation and stress relief</p>
          </div>
        </div>

        {/* Active Exercise */}
        {activeExercise && (
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="pt-8 text-center space-y-6">
              <p className="text-4xl">{activeExercise.icon}</p>
              <h3 className="text-xl font-bold">{activeExercise.title}</h3>
              <div className="text-6xl font-mono font-bold">{formatTime(timer)}</div>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  onClick={() => { setIsPlaying(false); setTimer(activeExercise.duration); }}
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              </div>
              {saving && <p className="text-sm text-white/70">Saving session...</p>}
            </CardContent>
          </Card>
        )}

        {/* Exercise Library */}
        <div className="grid md:grid-cols-2 gap-4">
          {EXERCISES.map((ex, i) => (
            <Card
              key={i}
              className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => startExercise(ex)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ex.icon}</span>
                  <div>
                    <CardTitle className="text-base">{ex.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">{formatTime(ex.duration)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">{ex.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-slate-500">Total Sessions</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalSessions}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-slate-500">Minutes</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalMinutes}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-slate-500">Types Used</p>
                <p className="text-2xl font-bold text-slate-800">{Object.keys(stats.typeBreakdown).length}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History */}
        {sessions.length > 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Session History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{s.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{s.type.replace("_", " ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{Math.round(s.duration / 60)} min</p>
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
}
