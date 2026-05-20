"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  getMealPlanById,
  updateMealPlanStatus,
  deleteMealPlan,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Clock,
  DollarSign,
  Flame,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Archive,
  ArrowLeft,
  Utensils,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function MealPlanDetailContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "meals"
  );
  const [selectedDay, setSelectedDay] = useState(1);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadPlan = async () => {
      try {
        const response = await getMealPlanById(params.id as string);
        if (response.success && response.data) {
          console.log("Meal Plan Data:", response.data);
          console.log("MealPlanData structure:", response.data.mealPlanData);
          setPlan(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load meal plan");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [user, router, params.id, authLoading]);

  const handleStatusChange = async (
    newStatus: "active" | "completed" | "archived"
  ) => {
    if (!plan) return;
    setUpdating(true);

    try {
      const planId = plan._id || plan.id || (params.id as string);
      const response = await updateMealPlanStatus(planId, {
        status: newStatus,
      });
      if (response.success && response.data) {
        setPlan(response.data);
        // Redirect to all meal plans page after status change
        router.push("/meal-planner/plans");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!plan) return;

    try {
      const planId = plan._id || plan.id || (params.id as string);
      await deleteMealPlan(planId);
      router.push("/meal-planner/plans");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete plan");
    }
  };

  if (!user) return null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Dark header skeleton */}
        <div className="bg-black py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-slate-700 rounded mb-6"></div>
              <div className="h-10 w-1/2 bg-slate-700 rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Dark header for error state */}
        <div className="bg-black py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/meal-planner")}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Meal Plan Not Found</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Meal plan not found"}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button className="bg-black hover:bg-slate-700 text-white" onClick={() => router.push("/meal-planner")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Support both new API structure (days) and old structure (mealPlan.dailyMeals)
  const days =
    plan.mealPlanData?.days || plan.mealPlanData?.mealPlan?.dailyMeals || [];
  const shoppingList =
    plan.mealPlanData?.shoppingList?.items ||
    plan.mealPlanData?.mealPlan?.shoppingList?.items ||
    plan.mealPlanData?.shoppingList ||
    plan.mealPlanData?.mealPlan?.shoppingList ||
    {};
  const summary =
    plan.mealPlanData?.summary || plan.mealPlanData?.mealPlan?.summary;
  const weeklyTips =
    plan.mealPlanData?.weeklyTips ||
    plan.mealPlanData?.mealPlan?.weeklyTips ||
    [];
  const healthWarnings =
    plan.mealPlanData?.healthWarnings ||
    plan.mealPlanData?.mealPlan?.healthWarnings ||
    [];
  const totalDays = days.length;
  
  // Calculate total calories for all days from daily meals data
  const calculateTotalCalories = () => {
    let total = 0;
    days.forEach((day: any) => {
      // Try to get from dailyTotals first
      if (day.dailyTotals?.calories) {
        total += day.dailyTotals.calories;
      } else if (day.meals) {
        // Calculate from individual meals
        const mealsArray = Array.isArray(day.meals) ? day.meals : Object.values(day.meals);
        mealsArray.forEach((meal: any) => {
          total += meal.nutrition?.calories || meal.calories || 0;
        });
      }
    });
    return total;
  };

  const totalCaloriesForAllDays = calculateTotalCalories();
  
  // Calculate shopping items count - handle both array and object structures
  const calculateShoppingItemsCount = () => {
    // If shoppingList is an array, return its length
    if (Array.isArray(shoppingList)) {
      return shoppingList.length;
    }
    
    // If shoppingList is an object with categories
    if (typeof shoppingList === "object" && shoppingList !== null) {
      let count = 0;
      Object.entries(shoppingList).forEach(([key, value]) => {
        // Skip non-item keys like totalCost
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
  
  const shoppingItemsCount = calculateShoppingItemsCount();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          bgColor: "bg-emerald-500/20",
          textColor: "text-emerald-300",
          borderColor: "border-emerald-500/30",
        };
      case "completed":
        return {
          bgColor: "bg-blue-500/20",
          textColor: "text-blue-300",
          borderColor: "border-blue-500/30",
        };
      case "archived":
        return {
          bgColor: "bg-slate-500/20",
          textColor: "text-slate-300",
          borderColor: "border-slate-500/30",
        };
      default:
        return {
          bgColor: "bg-amber-500/20",
          textColor: "text-amber-300",
          borderColor: "border-amber-500/30",
        };
    }
  };

  const statusConfig = getStatusConfig(plan.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50">
      {/* Dark Hero Header */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/meal-planner/plans")}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Plans
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1.5 rounded-lg text-sm font-medium border ${statusConfig.borderColor} capitalize`}
              >
                {plan.status === "active" && <CheckCircle2 className="w-4 h-4" />}
                {plan.status === "completed" && <CheckCircle2 className="w-4 h-4" />}
                {plan.status === "archived" && <Archive className="w-4 h-4" />}
                {plan.status}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {totalDays}-Day Meal Plan
              </h1>

              {/* Meta info */}
              <p className="text-slate-400">
                Generated on {new Date(plan.createdAt).toLocaleDateString()}
              </p>

              {/* Stats in header */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-semibold">{totalDays} Days</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="font-semibold">
                    {totalCaloriesForAllDays > 0 && totalDays > 0
                      ? Math.round(totalCaloriesForAllDays / totalDays)
                      : summary?.totalCaloriesPerDay || 0} Cal/day
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="font-semibold">{shoppingItemsCount} Items</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Select
                value={plan.status}
                onValueChange={(val) => handleStatusChange(val as any)}
                disabled={updating}
              >
                <SelectTrigger className="w-40 bg-white/10 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-slate-600" />
                      Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="archived">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-slate-500" />
                      Archived
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Meal Plan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your meal plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100">
            <TabsTrigger value="meals" className="data-[state=active]:bg-white">
              Meal Schedule
            </TabsTrigger>
            <TabsTrigger value="shopping" className="data-[state=active]:bg-white">
              Shopping List
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-white">
              Summary
            </TabsTrigger>
          </TabsList>

          {/* Meals Tab */}
          <TabsContent value="meals">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {days.map((_dayData: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDay === index + 1
                        ? "bg-black text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    Day {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {days[selectedDay - 1] &&
              (() => {
                const currentDayData = days[selectedDay - 1];
                console.log(`Selected Day ${selectedDay}:`, currentDayData);

                // Calculate total calories for the day
                const calculateDayCalories = () => {
                  const mealsData = currentDayData.meals;
                  let totalCalories = 0;

                  if (
                    typeof mealsData === "object" &&
                    mealsData !== null &&
                    !Array.isArray(mealsData)
                  ) {
                    // Handle meals as object (breakfast, lunch, dinner keys)
                    Object.values(mealsData).forEach((meal: any) => {
                      totalCalories += meal.nutrition?.calories || meal.calories || 0;
                    });
                  } else if (Array.isArray(mealsData)) {
                    // Handle meals as array
                    mealsData.forEach((meal: any) => {
                      totalCalories += meal.nutrition?.calories || meal.calories || 0;
                    });
                  }

                  return (
                    totalCalories ||
                    currentDayData.dailyTotal?.calories ||
                    currentDayData.dailyCalories ||
                    currentDayData.totalCalories ||
                    0
                  );
                };

                return (
                  <div className="space-y-5">
                    <Card className="bg-white border border-slate-200 shadow-sm">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-6 text-center">
                          <div className="p-4">
                            <p className="text-3xl font-bold text-slate-800">
                              {calculateDayCalories()}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              Total Calories
                            </p>
                          </div>
                          <div className="p-4 border-l border-slate-200">
                            <p className="text-3xl font-bold text-slate-800">
                              {(() => {
                                const mealsData = currentDayData.meals;
                                if (Array.isArray(mealsData))
                                  return mealsData.length;
                                if (
                                  typeof mealsData === "object" &&
                                  mealsData !== null
                                )
                                  return Object.keys(mealsData).length;
                                return 0;
                              })()}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">Meals</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-5">
                      {(() => {
                        const mealsData = currentDayData.meals;
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
                                mealType.charAt(0).toUpperCase() +
                                mealType.slice(1),
                              mealTime:
                                meal.mealTime ||
                                mealType.charAt(0).toUpperCase() +
                                  mealType.slice(1),
                              // Preserve the actual dish name from the meal object
                              dishName:
                                meal.dishName ||
                                meal.mealName ||
                                meal.name ||
                                "Meal",
                            })
                          );
                        } else if (Array.isArray(mealsData)) {
                          mealsArray = mealsData;
                        }

                        return mealsArray.map((meal: any, idx: number) => (
                          <Card key={idx} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                            {/* Subtle accent bar */}
                            <div className="h-1 bg-emerald-500" />
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <Badge variant="outline" className="mb-2 text-xs font-medium text-slate-600 border-slate-300">
                                    {meal.mealTime || meal.mealType || "Meal"}
                                  </Badge>
                                  <CardTitle className="text-lg text-slate-800">
                                    {meal.dishName ||
                                      meal.mealName ||
                                      meal.name ||
                                      `${meal.mealType || meal.mealTime || "Meal"}`}
                                  </CardTitle>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Flame className="h-3 w-3 mr-1" />
                                  {meal.nutrition?.calories || meal.calories || 0} cal
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                              {/* Nutrition stats - subtle gray boxes */}
                              {meal.nutrition && (
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-sm font-semibold text-slate-700">{meal.nutrition.protein || 0}g</p>
                                    <p className="text-xs text-slate-500">Protein</p>
                                  </div>
                                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-sm font-semibold text-slate-700">{meal.nutrition.carbs || 0}g</p>
                                    <p className="text-xs text-slate-500">Carbs</p>
                                  </div>
                                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <p className="text-sm font-semibold text-slate-700">{meal.nutrition.fats || meal.nutrition.fat || 0}g</p>
                                    <p className="text-xs text-slate-500">Fats</p>
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="font-medium mb-2 text-sm text-slate-700">
                                  Ingredients
                                </h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                  {Array.isArray(meal.ingredients) &&
                                    meal.ingredients
                                      .slice(0, 5)
                                      .map((ing: any, i: number) => (
                                        <li key={i} className="flex items-center gap-2">
                                          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                          {typeof ing === 'string' ? ing : (ing?.name || ing?.item || JSON.stringify(ing))}
                                        </li>
                                      ))}
                                  {Array.isArray(meal.ingredients) &&
                                    meal.ingredients.length > 5 && (
                                      <li className="text-slate-400 text-xs pl-3">
                                        + {meal.ingredients.length - 5} more
                                      </li>
                                    )}
                                </ul>
                              </div>

                              <details className="text-sm">
                                <summary className="cursor-pointer font-medium text-slate-600 hover:text-slate-800 flex items-center gap-2 py-2 border-t border-slate-100">
                                  <ChevronRight className="h-4 w-4 transition-transform [details[open]>&]:rotate-90" />
                                  View Instructions
                                </summary>
                                <div className="mt-2 p-3 bg-slate-50 rounded-lg text-slate-600">
                                  {(() => {
                                    const recipeData = meal.recipe || meal.instructions;
                                    
                                    if (typeof recipeData === "string") {
                                      return <p className="whitespace-pre-line">{recipeData}</p>;
                                    }
                                    
                                    if (typeof recipeData === "object" && recipeData !== null) {
                                      return (
                                        <div className="space-y-3">
                                          {(recipeData.prepTime || recipeData.cookTime) && (
                                            <div className="flex gap-3 text-xs">
                                              {recipeData.prepTime && (
                                                <span className="text-slate-500">
                                                  <span className="font-medium">Prep:</span> {recipeData.prepTime}
                                                </span>
                                              )}
                                              {recipeData.cookTime && (
                                                <span className="text-slate-500">
                                                  <span className="font-medium">Cook:</span> {recipeData.cookTime}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                          {recipeData.steps && (
                                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                              {Array.isArray(recipeData.steps) 
                                                ? recipeData.steps.map((step: string, i: number) => (
                                                    <li key={i}>{step}</li>
                                                  ))
                                                : <li>{String(recipeData.steps)}</li>
                                              }
                                            </ol>
                                          )}
                                          {recipeData.tips && (
                                            <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                                              <p className="font-medium mb-1">Tips:</p>
                                              <ul className="list-disc list-inside space-y-0.5">
                                                {Array.isArray(recipeData.tips)
                                                  ? recipeData.tips.map((tip: string, i: number) => (
                                                      <li key={i}>{tip}</li>
                                                    ))
                                                  : <li>{String(recipeData.tips)}</li>
                                                }
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                    
                                    return <p className="text-slate-400 italic">No instructions available</p>;
                                  })()}
                                </div>
                              </details>
                            </CardContent>
                          </Card>
                        ));
                      })()}
                    </div>
                  </div>
                );
              })()}
          </TabsContent>

          {/* Shopping List Tab */}
          <TabsContent value="shopping">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Handle array structure (new format) */}
              {Array.isArray(shoppingList) ? (
                (() => {
                  // Group items by category
                  const groupedItems: Record<string, any[]> = {};
                  shoppingList.forEach((item: any) => {
                    const category = item.category || "others";
                    if (!groupedItems[category]) {
                      groupedItems[category] = [];
                    }
                    groupedItems[category].push(item);
                  });

                  return Object.entries(groupedItems).map(([category, items]) => (
                    <Card key={category} className="border border-slate-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
                          <ShoppingCart className="h-4 w-4 text-emerald-600" />
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                          {items.length} items
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {items.map((item: any, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {item.item || item.name || "Unknown item"}
                                </p>
                                {item.quantity && (
                                  <p className="text-xs text-slate-500">
                                    {item.quantity}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ));
                })()
              ) : (
                /* Handle object structure (old format) */
                (() => {
                  return Object.entries(shoppingList)
                    .filter(
                      ([category]) =>
                        category !== "totalCost" &&
                        category !== "totalEstimatedCost"
                    )
                    .map(([category, items]) => {
                      let itemsList: any[] = [];

                      if (Array.isArray(items)) {
                        itemsList = items;
                      } else if (typeof items === "object" && items !== null) {
                        itemsList = Object.entries(items).map(
                          ([key, value]: [string, any]) => {
                            if (typeof value === "object" && value !== null && (value.name || value.quantity)) {
                              return value;
                            }
                            return {
                              name: key,
                              quantity: typeof value === "string" ? value : "",
                            };
                          }
                        );
                      }

                      if (itemsList.length === 0) return null;

                      return (
                        <Card key={category} className="border border-slate-200 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base text-slate-800">
                              <ShoppingCart className="h-4 w-4 text-emerald-600" />
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </CardTitle>
                            <CardDescription className="text-slate-500">
                              {itemsList.length} items
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="space-y-2">
                              {itemsList.map((item, idx) => {
                                let itemName = "";
                                let itemQuantity = "";

                                if (typeof item === "string") {
                                  itemName = item;
                                } else if (typeof item === "object" && item !== null) {
                                  if (
                                    item.name?.toLowerCase?.().includes("cost") ||
                                    item.cost !== undefined
                                  ) {
                                    return null;
                                  }

                                  if (typeof item.name === "string") {
                                    itemName = item.name;
                                  } else if (typeof item.name === "object" && item.name !== null) {
                                    itemName = item.name.name || item.name.nameUrdu || JSON.stringify(item.name);
                                  } else {
                                    itemName = item.nameUrdu || item.item || "Unknown item";
                                  }

                                  if (typeof item.quantity === "string") {
                                    itemQuantity = item.quantity;
                                  } else if (typeof item.quantity === "object" && item.quantity !== null) {
                                    itemQuantity = item.quantity.quantity || item.quantity.amount || "";
                                  } else if (typeof item.quantity === "number") {
                                    itemQuantity = String(item.quantity);
                                  } else if (item.amount) {
                                    itemQuantity = String(item.amount);
                                  }
                                }

                                if (
                                  itemName.includes("PKR") ||
                                  itemQuantity.includes("PKR")
                                ) {
                                  return null;
                                }

                                return (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <div>
                                      <p className="text-sm font-medium text-slate-700">{itemName}</p>
                                      {itemQuantity && (
                                        <p className="text-xs text-slate-500">
                                          {itemQuantity}
                                        </p>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    });
                })()
              )}
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="space-y-5">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800">Weekly Tips</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weeklyTips.map((tip: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-medium">{idx + 1}</span>
                        <span className="text-sm text-slate-600">
                          {typeof tip === "string" ? tip : (tip?.text || tip?.tip || tip?.message || JSON.stringify(tip))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800">Macronutrient Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-800">
                        {summary?.macroBreakdown?.proteinPercent ||
                          summary?.macronutrients?.protein ||
                          summary?.macroDistribution?.protein ||
                          0}%
                      </p>
                      <p className="text-sm text-slate-500 mt-1">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-800">
                        {summary?.macroBreakdown?.carbsPercent ||
                          summary?.macronutrients?.carbs ||
                          summary?.macroDistribution?.carbs ||
                          0}%
                      </p>
                      <p className="text-sm text-slate-500 mt-1">Carbs</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-800">
                        {summary?.macroBreakdown?.fatsPercent ||
                          summary?.macronutrients?.fats ||
                          summary?.macroDistribution?.fats ||
                          0}%
                      </p>
                      <p className="text-sm text-slate-500 mt-1">Fats</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800">Total Nutrition</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-800">
                      {totalCaloriesForAllDays > 0
                        ? totalCaloriesForAllDays.toLocaleString()
                        : plan.totalCalories
                        ? plan.totalCalories.toLocaleString()
                        : 0}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Total Calories for {totalDays} days
                    </p>
                  </div>
                </CardContent>
              </Card>

              {healthWarnings.length > 0 && (
                <Card className="border border-amber-200 bg-amber-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-amber-800">Health Warnings</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {healthWarnings.map((warning: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                          <ChevronRight className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {typeof warning === "string" ? warning : (warning?.text || warning?.warning || warning?.message || JSON.stringify(warning))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {(plan.mealPlanData?.disclaimer ||
                plan.mealPlanData?.mealPlan?.disclaimer) && (
                <Alert className="border-slate-200">
                  <AlertDescription className="text-sm text-slate-600">
                    {plan.mealPlanData?.disclaimer ||
                      plan.mealPlanData?.mealPlan?.disclaimer}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800"
            onClick={() => router.push("/meal-planner")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-slate-700 rounded mb-6"></div>
            <div className="h-10 w-1/2 bg-slate-700 rounded mb-4"></div>
            <div className="h-6 w-1/4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    </div>
  );
}

export default function MealPlanDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MealPlanDetailContent />
    </Suspense>
  );
}
