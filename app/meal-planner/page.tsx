"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import {
  getActiveMealPlan,
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
  Calendar,
  ShoppingCart,
  TrendingUp,
  Plus,
  Edit,
} from "lucide-react";

export default function MealPlannerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
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

        // Try to get active meal plan
        try {
          const planResponse = await getActiveMealPlan();
          if (planResponse.success && planResponse.data) {
            setActivePlan(planResponse.data);
          }
        } catch (err) {
          // No active plan
          setActivePlan(null);
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Case 1: No health profile - Show CTA to create profile
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <ChefHat className="h-20 w-20 mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Meal Planner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized meal plans tailored to your health goals, dietary
              preferences, and lifestyle.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
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
                  <h3 className="font-semibold mb-1">Create Profile</h3>
                  <p className="text-sm text-gray-600">
                    Tell us about your health and preferences
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Generate Plan</h3>
                  <p className="text-sm text-gray-600">
                    AI creates personalized meals
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Reach Goals</h3>
                  <p className="text-sm text-gray-600">
                    Track progress and stay healthy
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/meal-planner/profile">
                  <Button className="w-full" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Health Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Case 2: Has profile but no active plan - Show CTA to generate plan
  if (!activePlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AI Meal Planner
            </h1>
            <p className="text-gray-600">
              Ready to create your first personalized meal plan?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Generate New Plan
                </CardTitle>
                <CardDescription>
                  Create a 7-day or 30-day AI-powered meal plan based on your
                  health profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/meal-planner/generate">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Meal Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-purple-600" />
                  Update Profile
                </CardTitle>
                <CardDescription>
                  Modify your health information, dietary preferences, or goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/meal-planner/profile">
                  <Button variant="outline" className="w-full">
                    Edit Health Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Previous Plans</CardTitle>
              <CardDescription>View all your past meal plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meal-planner/plans">
                <Button variant="outline" className="w-full">
                  View All Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Case 3: Has active plan - Show plan overview
  const today = new Date();
  const planStartDate = new Date(activePlan.createdAt);
  const daysSinceStart = Math.floor(
    (today.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentDay = Math.min(
    daysSinceStart + 1,
    activePlan.mealPlanData?.mealPlan?.dailyMeals?.length || 7
  );
  const planId = activePlan.id || activePlan._id;

  // Get totals from the actual structure
  const totalDays = activePlan.mealPlanData?.mealPlan?.dailyMeals?.length || 7;
  const averageDailyCalories =
    activePlan.totalCalories ||
    activePlan.mealPlanData?.mealPlan?.summary?.totalCalories ||
    0;
  const shoppingListCount = activePlan.mealPlanData?.mealPlan?.shoppingList
    ? Object.values(activePlan.mealPlanData.mealPlan.shoppingList).reduce(
        (acc, category) => acc + Object.keys(category).length,
        0
      )
    : 0;
  const estimatedCost = activePlan.estimatedCost || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Active Meal Plan
            </h1>
            <p className="text-gray-600">
              Day {currentDay} of {totalDays}
            </p>
          </div>
          <Link href="/meal-planner/generate">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Plan
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
                <p className="text-sm text-gray-600">Days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <ChefHat className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {averageDailyCalories}
                </p>
                <p className="text-sm text-gray-600">Avg Calories/Day</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {shoppingListCount}
                </p>
                <p className="text-sm text-gray-600">Shopping Items</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Meals */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>Day {currentDay}</CardDescription>
              </div>
              <Link href={`/meal-planner/plans/${planId}`}>
                <Button variant="outline">View Full Plan</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activePlan.mealPlanData?.days?.[currentDay - 1] ||
            activePlan.mealPlanData?.mealPlan?.dailyMeals?.[currentDay - 1] ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  // Support both new (days) and old (mealPlan.dailyMeals) structure
                  const dayData =
                    activePlan.mealPlanData.days?.[currentDay - 1] ||
                    activePlan.mealPlanData.mealPlan?.dailyMeals?.[
                      currentDay - 1
                    ];
                  const mealsData = dayData?.meals;
                  let mealsArray: any[] = [];

                  // Handle meals as object (breakfast, lunch, dinner keys)
                  if (
                    typeof mealsData === "object" &&
                    mealsData !== null &&
                    !Array.isArray(mealsData)
                  ) {
                    mealsArray = Object.entries(mealsData).map(
                      ([mealType, meal]: [string, any]) => ({
                        ...meal,
                        mealType:
                          mealType.charAt(0).toUpperCase() + mealType.slice(1),
                        mealTime:
                          meal.mealTime ||
                          mealType.charAt(0).toUpperCase() + mealType.slice(1),
                      })
                    );
                  } else if (Array.isArray(mealsData)) {
                    mealsArray = mealsData;
                  }

                  if (mealsArray.length === 0) {
                    return (
                      <p className="text-gray-600 text-center py-8 col-span-full">
                        No meals available for this day
                      </p>
                    );
                  }

                  return mealsArray.map((meal: any, idx: number) => (
                    <Card key={idx} className="border">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="w-fit mb-2">
                          {meal.dishName ||
                            meal.mealName ||
                            meal.name ||
                            "Meal"}
                        </Badge>
                        <CardTitle className="text-lg">
                          {meal.dishName ||
                            meal.mealName ||
                            meal.name ||
                            "Meal"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {Array.isArray(meal.ingredients)
                            ? meal.ingredients.slice(0, 2).join(", ")
                            : ""}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {meal.calories || 0} cal
                          </span>
                          <span className="text-gray-600">
                            {Array.isArray(meal.ingredients)
                              ? meal.ingredients.length
                              : 0}{" "}
                            items
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ));
                })()}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                Plan completed or invalid day
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>Get your ingredients ready</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/meal-planner/plans/${planId}?tab=shopping`}>
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Shopping List
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Plans</CardTitle>
              <CardDescription>Browse your meal plan history</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meal-planner/plans">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Plans
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
              <CardDescription>Modify your health information</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meal-planner/profile">
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
