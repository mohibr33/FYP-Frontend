"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import {
  getAllMealPlans,
  getHealthProfile,
  MealPlan,
} from "@/lib/api/meal-planner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ChefHat,
  Edit,
  TrendingUp,
  Plus,
  Calendar,
  Eye,
  ShoppingCart,
} from "lucide-react";

export default function MealPlannerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activePlans, setActivePlans] = useState<MealPlan[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadData = async () => {
      try {
        // Check if user has a health profile
        const profileResponse = await getHealthProfile();
        setHasProfile(!!profileResponse.data);

        // Get all meal plans and filter for active ones
        try {
          const plansResponse = await getAllMealPlans();
          if (plansResponse.success && plansResponse.data?.mealPlans) {
            const active = plansResponse.data.mealPlans.filter(
              (plan) => plan.status === "active"
            );
            setActivePlans(active);
          }
        } catch (err) {
          // No plans
          setActivePlans([]);
        }
      } catch (err) {
        // No profile yet
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router, authLoading]);

  if (!user) return null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  // Case 1: No health profile - Show CTA to create profile
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Dark Header */}
        <div className="bg-black py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
              <ChefHat className="h-8 w-8 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              AI Meal Planner
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Get personalized meal plans tailored to your health goals, dietary
              preferences, and lifestyle.
            </p>
          </div>
        </div>

        <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto">

          <Card className="max-w-2xl mx-auto border border-slate-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-slate-800">Get Started</CardTitle>
              <CardDescription>
                Create your health profile to receive AI-powered meal
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Edit className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Create Profile</h3>
                  <p className="text-sm text-slate-500">
                    Tell us about your health and preferences
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Generate Plan</h3>
                  <p className="text-sm text-slate-500">
                    AI creates personalized meals
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Reach Goals</h3>
                  <p className="text-sm text-slate-500">
                    Track progress and stay healthy
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/meal-planner/profile">
                  <Button className="w-full bg-black hover:bg-slate-700 text-white" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Health Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    );
  }

  // Case 2: Has profile but no active plan - Show CTA to generate plan
  if (activePlans.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Dark Header */}
        <div className="bg-black py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
                  <ChefHat className="h-8 w-8 text-orange-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  AI Meal Planner
                </h1>
                <p className="text-slate-300">
                  Ready to create your first personalized meal plan?
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <Link href="/meal-planner/profile/view">
                  <Button className="bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:border-slate-500">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 px-4">
          <div className="max-w-4xl mx-auto">

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border border-slate-200 shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="h-1 bg-emerald-500 group-hover:bg-emerald-400 transition-colors" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  Generate New Plan
                </CardTitle>
                <CardDescription>
                  Create a 7-day AI-powered meal plan based on your
                  health profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/meal-planner/generate">
                  <Button className="w-full bg-black hover:bg-black text-white" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Meal Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div className="h-1 bg-emerald-500 group-hover:bg-emerald-400 transition-colors" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Edit className="h-5 w-5 text-emerald-600" />
                  </div>
                  Update Profile
                </CardTitle>
                <CardDescription>
                  Modify your health information, dietary preferences, or goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/meal-planner/profile">
                  <Button className="w-full bg-black hover:bg-black text-white" size="lg">
                    Edit Health Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="h-1 bg-emerald-500 group-hover:bg-emerald-400 transition-colors" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                Your Previous Plans
              </CardTitle>
              <CardDescription>View all your past meal plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meal-planner/plans">
                <Button className="w-full bg-black hover:bg-black text-white" size="lg">
                  View All Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Has active plans - Show all active plan overviews
  
  // Helper function to calculate shopping items count
  const calculateShoppingItemsCount = (plan: MealPlan) => {
    const shoppingList = 
      plan.mealPlanData?.mealPlan?.shoppingList ||
      plan.mealPlanData?.shoppingList ||
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

  // Helper function to get current day for a plan
  const getCurrentDay = (plan: MealPlan) => {
    const today = new Date();
    const planStartDate = new Date(plan.createdAt);
    const daysSinceStart = Math.floor(
      (today.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalDays = plan.mealPlanData?.mealPlan?.dailyMeals?.length || 7;
    return Math.min(daysSinceStart + 1, totalDays);
  };

  // Helper function to get meals for a specific day
  const getMealsForDay = (plan: MealPlan, dayIndex: number) => {
    const dayData =
      plan.mealPlanData?.days?.[dayIndex] ||
      plan.mealPlanData?.mealPlan?.dailyMeals?.[dayIndex];
    
    if (!dayData) return [];
    
    const mealsData = dayData.meals;
    
    if (typeof mealsData === "object" && mealsData !== null && !Array.isArray(mealsData)) {
      return Object.entries(mealsData).map(([mealType, meal]: [string, any]) => ({
        ...meal,
        mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      }));
    }
    
    return Array.isArray(mealsData) ? mealsData : [];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Your Active Meal Plans
              </h1>
              <p className="text-slate-300">
                {activePlans.length} active plan{activePlans.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/meal-planner/plans">
                <Button className="bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:border-slate-500">
                  <Calendar className="h-4 w-4 mr-2 text-white" />
                  All Plans
                </Button>
              </Link>
              <Link href="/meal-planner/profile/view">
                <Button className="bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:border-slate-500">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              <Link href="/meal-planner/generate">
                <Button className="bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:border-slate-500">
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  New Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">

        {/* All Active Plans */}
        <div className="space-y-8">
          {activePlans.map((plan, planIndex) => {
            const planId = plan.id || plan._id;
            const totalDays = plan.mealPlanData?.mealPlan?.dailyMeals?.length || 7;
            const currentDay = getCurrentDay(plan);
            const totalCalories = plan.totalCalories || 
              plan.mealPlanData?.mealPlan?.summary?.totalCaloriesPerDay || 0;
            const shoppingCount = calculateShoppingItemsCount(plan);
            const mealsForToday = getMealsForDay(plan, currentDay - 1);

            return (
              <Card key={planId} className="overflow-hidden border border-gray-200 shadow-lg rounded-2xl">
                {/* Header with subtle gradient */}
                <CardHeader className="bg-gradient-to-br from-black via-black to-slate-700 text-white py-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-emerald-500 text-white border-0 text-xs px-2 py-0.5">Active</Badge>
                        <Badge className="bg-white/15 text-white border-0 text-xs px-2 py-0.5">{totalDays} Days</Badge>
                      </div>
                      <CardTitle className="text-xl font-semibold text-white">
                        {totalDays}-Day Meal Plan
                      </CardTitle>
                      <CardDescription className="text-slate-300 mt-1">
                        Created {new Date(plan.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} • Day {currentDay} of {totalDays}
                      </CardDescription>
                    </div>
                    <Link href={`/meal-planner/plans/${planId}`}>
                      <Button className="bg-slate-700 text-white border border-slate-600 hover:bg-slate-600 hover:border-slate-500">
                        View Full Plan
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <Calendar className="h-5 w-5 mx-auto text-emerald-600 mb-2" />
                      <p className="text-2xl font-bold text-slate-800">{totalDays}</p>
                      <p className="text-xs text-slate-500 font-medium">Days</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <ChefHat className="h-5 w-5 mx-auto text-emerald-600 mb-2" />
                      <p className="text-2xl font-bold text-slate-800">{totalCalories}</p>
                      <p className="text-xs text-slate-500 font-medium">Total Calories</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <ShoppingCart className="h-5 w-5 mx-auto text-emerald-600 mb-2" />
                      <p className="text-2xl font-bold text-slate-800">{shoppingCount}</p>
                      <p className="text-xs text-slate-500 font-medium">Shopping Items</p>
                    </div>
                  </div>

                  {/* Today's Meals Preview */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-semibold text-slate-800 mb-3">
                      Today&apos;s Meals (Day {currentDay})
                    </h4>
                    {mealsForToday.length > 0 ? (
                      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {mealsForToday.slice(0, 5).map((meal: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wide">
                              {meal.mealType || meal.time || "Meal"}
                            </p>
                            <p className="font-medium text-sm text-slate-800 line-clamp-1">
                              {meal.name || meal.dishName || meal.mealName || "Meal"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {meal.nutrition?.calories || meal.calories || 0} cal
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No meals available for today</p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-4">
                    <Link href={`/meal-planner/plans/${planId}?tab=shopping`} className="flex-1">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800 transition-all" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2 text-teal-500" />
                        Shopping List
                      </Button>
                    </Link>
                    <Link href={`/meal-planner/plans/${planId}?tab=meals`} className="flex-1">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800 transition-all" size="sm">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        Meal Schedule
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
