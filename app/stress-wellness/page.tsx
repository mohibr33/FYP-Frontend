"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Smile,
  Activity,
  Brain,
  BookHeart,
  Sparkles,
  Heart,
  ArrowRight,
  Sun,
  Star,
} from "lucide-react";
import { getWellnessSummary } from "@/lib/api/stress-wellness";
import type { WellnessSummary } from "@/lib/types";

const modules = [
  {
    title: "Mood Tracker",
    desc: "Log your daily mood and track emotional patterns over time",
    icon: Smile,
    href: "/stress-wellness/mood",
    color: "teal" as const,
    statKey: "moodEntriesThisWeek" as const,
    suffix: "this week",
  },
  {
    title: "Stress Assessment",
    desc: "Complete stress questionnaires and monitor your stress levels",
    icon: Activity,
    href: "/stress-wellness/stress-assessment",
    color: "slate" as const,
    statKey: "stressAssessmentsThisWeek" as const,
    suffix: "this week",
  },
  {
    title: "Mental Health Screening",
    desc: "PHQ-9 & GAD-7 assessments with AI-powered wellness suggestions",
    icon: Brain,
    href: "/stress-wellness/screening",
    color: "teal" as const,
    statKey: null as const,
  },
  {
    title: "Anonymous Community",
    desc: "Share, support, and connect with others anonymously",
    icon: BookHeart,
    href: "/stress-wellness/journal",
    color: "emerald" as const,
    statKey: "communityPostsThisMonth" as const,
    suffix: "this month",
  },
  {
    title: "Meditation & Exercises",
    desc: "Guided meditation, breathing exercises, and stress relief activities",
    icon: Sparkles,
    href: "/stress-wellness/meditation",
    color: "cyan" as const,
    statKey: "meditationSessionsThisWeek" as const,
    suffix: "this week",
  },
  {
    title: "Wellness Resources",
    desc: "Articles and guides for mental health, self-care, and healthy living",
    icon: Heart,
    href: "/stress-wellness/resources",
    color: "slate" as const,
    statKey: null as const,
  },
];

const colorMap: Record<string, { iconBg: string; text: string; accent: string; lightBg: string }> = {
  teal: { iconBg: "bg-teal-100", text: "text-teal-600", accent: "bg-teal-500", lightBg: "bg-teal-50" },
  emerald: { iconBg: "bg-emerald-100", text: "text-emerald-600", accent: "bg-emerald-500", lightBg: "bg-emerald-50" },
  cyan: { iconBg: "bg-cyan-100", text: "text-cyan-600", accent: "bg-cyan-500", lightBg: "bg-cyan-50" },
  slate: { iconBg: "bg-black/5", text: "text-black/60", accent: "bg-black", lightBg: "bg-black/[0.02]" },
};

const statCards = [
  { label: "Mood Entries", icon: Sun, valueKey: "moodEntriesThisWeek" as const },
  { label: "Assessments", icon: Activity, valueKey: "stressAssessmentsThisWeek" as const },
  { label: "Community Posts", icon: BookHeart, valueKey: "communityPostsThisMonth" as const },
  { label: "Meditation", icon: Sparkles, valueKey: "meditationSessionsThisWeek" as const },
];

const moods = [
  { key: "very_bad", emoji: "😞", label: "Very Bad" },
  { key: "bad", emoji: "😟", label: "Bad" },
  { key: "neutral", emoji: "😐", label: "Neutral" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "very_good", emoji: "😊", label: "Very Good" },
];

export default function StressWellnessPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<WellnessSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchSummary();
  }, [user]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await getWellnessSummary();
      if (res.success && res.data) setSummary(res.data);
    } catch {
    } finally {
      setLoading(false);
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

  const getStatValue = (statKey: string | null): number | string | null => {
    if (!statKey || !summary) return null;
    if (statKey === "stressAssessmentsThisWeek") return summary.stressAssessmentsThisWeek;
    if (statKey === "moodEntriesThisWeek") return summary.moodEntriesThisWeek;
    if (statKey === "communityPostsThisMonth") return summary.communityPostsThisMonth;
    if (statKey === "meditationSessionsThisWeek") return summary.meditationSessionsThisWeek;
    return null;
  };

  const getScreeningStat = (): string | null => {
    if (!summary?.lastScreening) return null;
    return "Last: " + new Date(summary.lastScreening.createdAt).toLocaleDateString();
  };

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

          <div
            className="hidden md:block absolute top-8 right-8 bg-white/[0.05] backdrop-blur-md rounded-2xl p-4 border border-white/[0.08] animate-float"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-white/[0.06]">
                <Heart className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Wellness</p>
                <p className="font-semibold text-white text-lg">Tracked</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] text-sm text-slate-400 mb-5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Your Wellness Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Stress & Wellness
              <span className="block text-teal-400">Support</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-xl leading-relaxed">
              Your personal space for mental wellbeing, emotional health, and self-care.
            </p>
          </div>
        </section>

        {/* ─── Stat Cards ─── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border border-black/10 shadow-sm overflow-hidden">
                <div className="h-1 bg-black/10" />
                <CardContent className="py-4 text-center">
                  <div className="w-16 h-4 bg-slate-200 rounded mx-auto mb-2 animate-shimmer" />
                  <div className="w-10 h-3 bg-slate-100 rounded mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ animation: "fadeInUp 0.6s ease-out 0.15s both" }}
          >
            {statCards.map((s, i) => {
              const val = summary?.[s.valueKey] ?? 0;
              return (
                <Card
                  key={s.label}
                  className="group border border-black/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
                  style={{ animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.1}s both` }}
                >
                  <div className="h-1 bg-black transition-all duration-300 group-hover:h-1.5" />
                  <CardContent className="py-4 text-center">
                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform duration-300 group-hover:scale-110">
                      <s.icon className="w-5 h-5 text-black/60" />
                    </div>
                    <p className="text-xl font-bold text-black">{val}</p>
                    <p className="text-xs text-black/50">{s.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── Quick Check-In ─── */}
        <section style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}>
          <Card className="border border-black/10 shadow-sm overflow-hidden">
            <div className="h-1 bg-black" />
            <CardContent className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center">
                  <Sun className="w-4 h-4 text-black/60" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-black">Quick Check-In</h2>
                  <p className="text-xs text-black/50">How are you feeling right now?</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.key}
                    onClick={() => router.push(`/stress-wellness/mood?preselect=${mood.key}`)}
                    className="group flex flex-col items-center gap-1 py-3 px-2 rounded-2xl bg-white hover:bg-black/5 hover:shadow-sm transition-all duration-200 border border-black/10 hover:border-black/30"
                  >
                    <span className="text-2xl transition-transform duration-200 group-hover:scale-125">
                      {mood.emoji}
                    </span>
                    <span className="text-[10px] text-black/50 group-hover:text-black/70 font-medium">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── Module Cards ─── */}
        <section style={{ animation: "fadeInUp 0.6s ease-out 0.55s both" }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod, index) => {
              const Icon = mod.icon;
              const colors = colorMap[mod.color];
              const statValue = mod.statKey ? getStatValue(mod.statKey) : (mod.title === "Mental Health Screening" ? getScreeningStat() : null);
              const statLabel = statValue !== null && mod.suffix ? `${statValue} ${mod.suffix}` : statValue;

              return (
                <button
                  key={mod.href}
                  onClick={() => router.push(mod.href)}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden text-left border border-black/10 hover:-translate-y-1 w-full"
                  style={{ animation: `fadeInUp 0.5s ease-out ${0.6 + index * 0.1}s both` }}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${colors.accent} transition-all duration-300 group-hover:h-1.5`} />

                  <div className={`absolute -bottom-4 -right-4 w-28 h-28 ${colors.lightBg} rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
                    <Icon className={`w-14 h-14 ${colors.text} opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-black text-base">{mod.title}</h3>
                      <p className="text-sm text-black/50 leading-relaxed mt-0.5">{mod.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {statLabel ? (
                        <Badge variant="secondary" className={`text-xs font-normal ${colors.lightBg} ${colors.text} border-0`}>
                          {statLabel}
                        </Badge>
                      ) : (
                        <span />
                      )}
                      <div className={`inline-flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all duration-200`}>
                        Open <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Bottom CTA ─── */}
        <section
          className="relative overflow-hidden rounded-2xl bg-black p-6 md:p-8 text-center"
          style={{ animation: "fadeInUp 0.6s ease-out 1.2s both" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-3 left-8 w-2 h-2 bg-teal-500/30 rounded-full" />
          <div className="absolute bottom-6 right-12 w-1.5 h-1.5 bg-teal-500/20 rounded-full" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-sm text-slate-500 mb-3">
              <Star className="w-3.5 h-3.5 text-teal-400" />
              Self-Care Reminder
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Take a moment for yourself
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
              Even a few minutes of mindfulness can make a difference in your day.
            </p>
            <Button
              onClick={() => router.push("/stress-wellness/meditation")}
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
            >
              Start a Session
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
