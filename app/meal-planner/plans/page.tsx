"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { getAllMealPlans, MealPlan } from "@/lib/api/meal-planner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, ChefHat, Plus, TrendingUp } from "lucide-react";

export default function MealPlansLibraryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "archived"
  >("all");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadPlans = async () => {
      try {
        const response = await getAllMealPlans();
        if (response.success && response.data) {
          // API returns { data: { mealPlans: [] } }
          console.log("Meal Plans Response:", response.data.mealPlans);
          if (response.data.mealPlans?.length > 0) {
            console.log("First plan mealPlanData:", response.data.mealPlans[0].mealPlanData);
          }
          setPlans(response.data.mealPlans || []);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load meal plans");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [user, router, authLoading]);

  if (!user) return null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  const filteredPlans =
    filter === "all"
      ? plans || []
      : (plans || []).filter((plan) => plan.status === filter);

  const statusCounts = {
    all: (plans || []).length,
    active: (plans || []).filter((p) => p.status === "active").length,
    completed: (plans || []).filter((p) => p.status === "completed").length,
    archived: (plans || []).filter((p) => p.status === "archived").length,
  };

  // Helper function to calculate total calories from daily meals
  const calculateTotalCalories = (plan: MealPlan) => {
    const mealPlanData = plan.mealPlanData as any;
    if (!mealPlanData) return 0;
    
    const days = mealPlanData?.days || mealPlanData?.mealPlan?.dailyMeals || [];
    let total = 0;
    
    if (!Array.isArray(days) || days.length === 0) {
      // Fallback to summary if available
      const summary = mealPlanData?.summary || mealPlanData?.mealPlan?.summary;
      if (summary?.totalCaloriesPerDay) {
        const numDays = mealPlanData?.mealPlan?.dailyMeals?.length || 7;
        return summary.totalCaloriesPerDay * numDays;
      }
      return 0;
    }
    
    days.forEach((day: any) => {
      if (day.dailyTotals?.calories) {
        total += day.dailyTotals.calories;
      } else if (day.totalCalories) {
        total += day.totalCalories;
      } else if (day.meals) {
        const mealsArray = Array.isArray(day.meals) ? day.meals : Object.values(day.meals);
        mealsArray.forEach((meal: any) => {
          total += meal.nutrition?.calories || meal.calories || 0;
        });
      }
    });
    return total;
  };

  // Helper function to calculate total protein from daily meals
  const calculateTotalProtein = (plan: MealPlan) => {
    const mealPlanData = plan.mealPlanData as any;
    if (!mealPlanData) return 0;
    
    const days = mealPlanData?.days || mealPlanData?.mealPlan?.dailyMeals || [];
    const summary = mealPlanData?.summary || mealPlanData?.mealPlan?.summary;
    
    // Return protein percentage from summary if available
    if (summary?.macroBreakdown?.proteinPercent) {
      return summary.macroBreakdown.proteinPercent;
    }
    
    // Try to get from macroDistribution 
    if (summary?.macroDistribution?.protein) {
      const proteinStr = summary.macroDistribution.protein;
      const match = proteinStr.match(/(\d+)/);
      if (match) return parseInt(match[1]);
    }
    
    // If no percentage available, calculate total grams from meals
    if (!Array.isArray(days) || days.length === 0) {
      return 0;
    }
    
    let total = 0;
    days.forEach((day: any) => {
      if (day.dailyTotals?.protein) {
        total += day.dailyTotals.protein;
      } else if (day.meals) {
        const mealsArray = Array.isArray(day.meals) ? day.meals : Object.values(day.meals);
        mealsArray.forEach((meal: any) => {
          total += meal.nutrition?.protein || meal.protein || 0;
        });
      }
    });
    return Math.round(total);
  };

  // Helper function to calculate shopping items count
  const calculateShoppingItemsCount = (plan: MealPlan) => {
    const mealPlanData = plan.mealPlanData as any;
    if (!mealPlanData) return 0;
    
    const shoppingList = 
      mealPlanData?.shoppingList?.items ||
      mealPlanData?.mealPlan?.shoppingList?.items ||
      mealPlanData?.shoppingList ||
      mealPlanData?.mealPlan?.shoppingList ||
      null;
    
    if (!shoppingList) return 0;
    
    if (Array.isArray(shoppingList)) {
      return shoppingList.length;
    }
    
    if (typeof shoppingList === "object" && shoppingList !== null) {
      let count = 0;
      Object.entries(shoppingList).forEach(([key, value]) => {
        if (key === "totalCost" || key === "totalEstimatedCost") return;
        if (Array.isArray(value)) {
          count += value.length;
        } else if (typeof value === "object" && value !== null) {
          count += Object.keys(value).length;
        }
      });
      return count;
    }
    
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                My Meal Plans
              </h1>
              <p className="text-slate-300">
                Browse and manage all your meal plans
              </p>
            </div>
            <Link href="/meal-planner/generate">
              <Button className="bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:border-slate-500">
                <Plus className="h-4 w-4 mr-2" />
                Generate New Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs
          value={filter}
          onValueChange={(val) => setFilter(val as any)}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-white">
              Active ({statusCounts.active})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white">
              Completed ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-white">
              Archived ({statusCounts.archived})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredPlans.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="py-12 text-center">
              <ChefHat className="h-16 w-16 mx-auto text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {filter === "all" ? "No meal plans yet" : `No ${filter} plans`}
              </h3>
              <p className="text-slate-500 mb-6">
                {filter === "all"
                  ? "Generate your first AI-powered meal plan to get started"
                  : `You don't have any ${filter} meal plans`}
              </p>
              {filter === "all" && (
                <Link href="/meal-planner/generate">
                    <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Plus className="h-4 w-4 mr-2 text-emerald-400" />
                      Generate Meal Plan
                    </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlans.map((plan) => {
              const planId = plan.id || plan._id || "";
              
              return (
                <Card
                  key={planId}
                  className="hover:shadow-md transition-shadow border border-slate-200 cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/meal-planner/plans/${planId}`)}
                >
                  {/* Subtle accent bar */}
                  <div className="h-1 bg-emerald-500" />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className={
                          plan.status === "active"
                            ? "text-emerald-700 border-emerald-300"
                            : plan.status === "completed"
                            ? "text-blue-700 border-blue-300"
                            : "text-slate-500 border-slate-300"
                        }
                      >
                        {plan.status}
                      </Badge>
                      <Badge variant="outline" className="text-slate-600 border-slate-300">
                        {plan.mealPlanData?.mealPlan?.dailyMeals?.length || 7} Days
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-slate-800">
                      {plan.mealPlanData?.mealPlan?.dailyMeals?.length ||
                        plan.duration}
                      -Day Meal Plan
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Generated{" "}
                      {new Date(plan.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {calculateTotalCalories(plan).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            Total Calories
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {calculateTotalProtein(plan)}%
                          </p>
                          <p className="text-xs text-slate-500">Protein</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Shopping Items</span>
                        <span className="font-semibold text-slate-800">
                          {calculateShoppingItemsCount(plan)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-2 border-slate-200 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/meal-planner/plans/${planId}`);
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push("/meal-planner")} className="border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800">
            Back to Dashboard
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
