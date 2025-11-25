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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ChefHat, Calendar, Sparkles } from "lucide-react";

export default function GenerateMealPlanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [duration, setDuration] = useState<"7" | "30">("7");
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
      const response = await generateMealPlan({ duration });
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Health Profile Required</CardTitle>
              <CardDescription>
                You need to create a health profile before generating a meal
                plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/meal-planner/profile")}
                className="w-full"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Sparkles className="h-16 w-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Generate AI Meal Plan
          </h1>
          <p className="text-gray-600">
            Choose your plan duration and let AI create personalized meals for
            you
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="">
          <CardHeader>
            <CardTitle>Select Plan Duration</CardTitle>
            <CardDescription>
              Choose how many days you'd like your personalized meal plan to
              cover
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={duration}
              onValueChange={(val) => setDuration(val as "7" | "30")}
              disabled={generating}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all ${
                    duration === "7" ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <RadioGroupItem
                        value="7"
                        id="duration-7"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="duration-7" className="cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-lg">
                              7-Day Plan
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Perfect for trying out personalized meal planning
                            and adjusting to new recipes
                          </p>
                          <div className="mt-3 space-y-1">
                            <p className="text-xs text-gray-500">
                              ✓ Weekly meal variety
                            </p>
                            <p className="text-xs text-gray-500">
                              ✓ Easier grocery shopping
                            </p>
                            <p className="text-xs text-gray-500">
                              ✓ Quick results
                            </p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${
                    duration === "30" ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <RadioGroupItem
                        value="30"
                        id="duration-30"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="duration-30" className="cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            <span className="font-semibold text-lg">
                              30-Day Plan
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Ideal for committed healthy eating and achieving
                            long-term fitness goals
                          </p>
                          <div className="mt-3 space-y-1">
                            <p className="text-xs text-gray-500">
                              ✓ Maximum variety
                            </p>
                            <p className="text-xs text-gray-500">
                              ✓ Better habit formation
                            </p>
                            <p className="text-xs text-gray-500">
                              ✓ Cost-effective planning
                            </p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>

            {generating && (
              <div className="space-y-4 py-8">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <p className="text-lg font-medium text-gray-700">
                    AI is creating your personalized meal plan...
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600">
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
                <p className="text-center text-xs text-gray-500 mt-2">
                  ⏱️ This typically takes 1-6 minutes. Please don't close this
                  page.
                </p>
              </div>
            )}

            {!generating && (
              <div className="pt-4">
                <Button onClick={handleGenerate} className="w-full" size="lg">
                  <ChefHat className="h-5 w-5 mr-2" />
                  Generate {duration}-Day Meal Plan
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  ⏱️ AI generation takes 1-3 minutes • Creates personalized
                  Pakistani meals
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => router.push("/meal-planner")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
