"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { generateMealPlan, getHealthProfile } from "@/lib/api/meal-planner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChefHat, Calendar, Sparkles, Check } from "lucide-react";

export default function GenerateMealPlanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const checkProfile = async () => {
      try {
        const response = await getHealthProfile();
        setHasProfile(!!response.data);
      } catch (err) {
        setHasProfile(false);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user, router, authLoading]);

  useEffect(() => {
    if (generating) {
      // Simulate progress for better UX (slower progression for 1-3 min wait)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) return prev; // Cap at 85% until actual completion
          return prev + Math.random() * 5; // Slower increment
        });
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [generating]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setProgress(0);

    try {
      const response = await generateMealPlan({ duration: "7" });
      if (response.success && response.data) {
        setProgress(100);
        // API returns 'id' not '_id'
        const planId = response.data.id || response.data._id;
        setTimeout(() => {
          router.push(`/meal-planner/plans/${planId}`);
        }, 500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to generate meal plan. Please try again."
      );
      setGenerating(false);
      setProgress(0);
    }
  };

  if (!user) return null;

  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">Health Profile Required</CardTitle>
              <CardDescription>
                You need to create a health profile before generating a meal
                plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/meal-planner/profile")}
                className="w-full bg-black hover:bg-slate-700 text-white"
              >
                Create Health Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-black py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Generate AI Meal Plan
          </h1>
          <p className="text-slate-300">
            Let AI create a personalized 7-day meal plan based on your health profile
          </p>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border border-slate-200 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-black via-black to-slate-700 text-white py-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8" />
              <div>
                <CardTitle className="text-white text-2xl">7-Day Meal Plan</CardTitle>
                <CardDescription className="text-slate-300">
                  A week of personalized Pakistani meals tailored to your goals
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Personalized Nutrition</p>
                  <p className="text-sm text-slate-500">Based on your health profile and goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Pakistani Cuisine</p>
                  <p className="text-sm text-slate-500">Traditional recipes with local ingredients</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Shopping List</p>
                  <p className="text-sm text-slate-500">Complete grocery list with estimated costs</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Detailed Recipes</p>
                  <p className="text-sm text-slate-500">Step-by-step cooking instructions</p>
                </div>
              </div>
            </div>

            {generating && (
              <div className="space-y-4 py-6 bg-slate-50 rounded-lg px-4 border border-slate-100">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
                  <p className="text-lg font-medium text-slate-700">
                    AI is creating your personalized meal plan...
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-700 h-2 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-slate-600">
                  {progress < 20 &&
                    "Analyzing your health profile and dietary needs..."}
                  {progress >= 20 &&
                    progress < 40 &&
                    "AI is selecting personalized recipes for you..."}
                  {progress >= 40 &&
                    progress < 60 &&
                    "Generating culturally relevant Pakistani meals..."}
                  {progress >= 60 &&
                    progress < 80 &&
                    "Calculating nutrition, portions, and costs..."}
                  {progress >= 80 &&
                    "Almost done! Finalizing your meal plan..."}
                </p>
                <p className="text-center text-xs text-slate-500 mt-2">
                  This typically takes 1-3 minutes. Please don&apos;t close this page.
                </p>
              </div>
            )}

            {!generating && (
              <div className="pt-2">
                <Button onClick={handleGenerate} className="w-full bg-black hover:bg-slate-700 text-white" size="lg">
                  <ChefHat className="h-5 w-5 mr-2 text-orange-400" />
                  Generate 7-Day Meal Plan
                </Button>
                <p className="text-xs text-slate-500 text-center mt-3">
                  AI generation takes 1-3 minutes • Creates personalized Pakistani meals
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => router.push("/meal-planner")} className="border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800">
            Back to Dashboard
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
