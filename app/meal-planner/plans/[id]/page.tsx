"use client";

import { useState, useEffect } from "react";
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

export default function MealPlanDetailPage() {
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Meal plan not found"}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => router.push("/meal-planner")}>
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
  const shoppingItemsCount = Object.values(shoppingList).reduce(
    (acc, category) => {
      if (Array.isArray(category)) return acc + category.length;
      if (typeof category === "object" && category !== null)
        return acc + Object.keys(category).length;
      return acc;
    },
    0
  );

  console.log("Days:", days);
  console.log("Shopping List:", shoppingList);
  console.log("Summary:", summary);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {totalDays}-Day Meal Plan
              </h1>
              <p className="text-gray-600">
                Generated on {new Date(plan.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={plan.status}
                onValueChange={(val) => handleStatusChange(val as any)}
                disabled={updating}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="archived">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-gray-600" />
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

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalDays}
                    </p>
                    <p className="text-xs text-gray-600">Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Flame className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {plan.totalCalories > 0 
                        ? Math.round(plan.totalCalories / totalDays)
                        : summary?.totalCaloriesPerDay || 0}
                    </p>
                    <p className="text-xs text-gray-600">Avg Calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary?.macroBreakdown?.proteinPercent ||
                        summary?.macronutrients?.protein ||
                        summary?.macroDistribution?.protein ||
                        0}%
                    </p>
                    <p className="text-xs text-gray-600">Protein</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {shoppingItemsCount}
                    </p>
                    <p className="text-xs text-gray-600">Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="meals">Meal Schedule</TabsTrigger>
            <TabsTrigger value="shopping">Shopping List</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* Meals Tab */}
          <TabsContent value="meals">
            <div className="mb-6">
              <Select
                value={selectedDay.toString()}
                onValueChange={(val) => setSelectedDay(parseInt(val))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((dayData: any, index: number) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      Day {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <div className="space-y-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-900">
                              {calculateDayCalories()}
                            </p>
                            <p className="text-sm text-blue-700">
                              Total Calories
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-900">
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
                            <p className="text-sm text-blue-700">Meals</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
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
                          <Card key={idx}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <Badge variant="outline" className="mb-2">
                                    {meal.mealTime || meal.mealType || "Meal"}
                                  </Badge>
                                  <CardTitle className="text-xl">
                                    {meal.dishName ||
                                      meal.mealName ||
                                      meal.name ||
                                      `${
                                        meal.mealType || meal.mealTime || "Meal"
                                      }`}
                                  </CardTitle>
                                </div>
                                <Badge variant="secondary">
                                  <Flame className="h-3 w-3 mr-1" />
                                  {meal.nutrition?.calories || meal.calories || 0} cal
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2 text-sm">
                                  Ingredients:
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {Array.isArray(meal.ingredients) &&
                                    meal.ingredients
                                      .slice(0, 5)
                                      .map((ing: any, i: number) => (
                                        <li key={i}>• {typeof ing === 'string' ? ing : (ing?.name || ing?.item || JSON.stringify(ing))}</li>
                                      ))}
                                  {Array.isArray(meal.ingredients) &&
                                    meal.ingredients.length > 5 && (
                                      <li className="text-blue-600">
                                        + {meal.ingredients.length - 5} more...
                                      </li>
                                    )}
                                </ul>
                              </div>

                              <details className="text-sm">
                                <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700">
                                  View Instructions
                                </summary>
                                <div className="mt-2 text-gray-700">
                                  {(() => {
                                    const recipeData = meal.recipe || meal.instructions;
                                    
                                    // Handle string instructions
                                    if (typeof recipeData === "string") {
                                      return <p className="whitespace-pre-line">{recipeData}</p>;
                                    }
                                    
                                    // Handle object with steps, tips, cookTime, prepTime
                                    if (typeof recipeData === "object" && recipeData !== null) {
                                      return (
                                        <div className="space-y-3">
                                          {recipeData.prepTime && (
                                            <p><span className="font-medium">Prep Time:</span> {recipeData.prepTime}</p>
                                          )}
                                          {recipeData.cookTime && (
                                            <p><span className="font-medium">Cook Time:</span> {recipeData.cookTime}</p>
                                          )}
                                          {recipeData.steps && (
                                            <div>
                                              <p className="font-medium mb-1">Steps:</p>
                                              <ol className="list-decimal list-inside space-y-1">
                                                {Array.isArray(recipeData.steps) 
                                                  ? recipeData.steps.map((step: string, i: number) => (
                                                      <li key={i}>{step}</li>
                                                    ))
                                                  : <li>{String(recipeData.steps)}</li>
                                                }
                                              </ol>
                                            </div>
                                          )}
                                          {recipeData.tips && (
                                            <div>
                                              <p className="font-medium mb-1">Tips:</p>
                                              <ul className="list-disc list-inside space-y-1">
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
                                    
                                    return <p>No instructions available</p>;
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
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(shoppingList)
                .filter(
                  ([category]) =>
                    category !== "totalCost" &&
                    category !== "totalEstimatedCost"
                )
                .map(([category, items]) => {
                  // Handle both array of objects and object with key-value pairs
                  let itemsList: any[] = [];

                  if (Array.isArray(items)) {
                    itemsList = items;
                  } else if (typeof items === "object" && items !== null) {
                    // Convert object to array, handling nested objects
                    itemsList = Object.entries(items).map(
                      ([key, value]: [string, any]) => {
                        // If value is an object with name/quantity properties, use it directly
                        if (typeof value === "object" && value !== null && (value.name || value.quantity)) {
                          return value;
                        }
                        // Otherwise, treat key as name and value as quantity
                        return {
                          name: key,
                          quantity: typeof value === "string" ? value : "",
                        };
                      }
                    );
                  }

                  if (itemsList.length === 0) return null;

                  return (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-blue-600" />
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </CardTitle>
                        <CardDescription>
                          {itemsList.length} items
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {itemsList.map((item, idx) => {
                            // Handle different item structures
                            let itemName = "";
                            let itemQuantity = "";

                            if (typeof item === "string") {
                              itemName = item;
                            } else if (typeof item === "object" && item !== null) {
                              // Skip if this is a cost-related item
                              if (
                                item.name?.toLowerCase?.().includes("cost") ||
                                item.cost !== undefined
                              ) {
                                return null;
                              }

                              // Extract name - handle nested structures
                              if (typeof item.name === "string") {
                                itemName = item.name;
                              } else if (typeof item.name === "object" && item.name !== null) {
                                itemName = item.name.name || item.name.nameUrdu || JSON.stringify(item.name);
                              } else {
                                itemName = item.nameUrdu || item.item || "Unknown item";
                              }

                              // Extract quantity - handle nested structures
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

                            // Skip items with PKR in name or quantity (cost items)
                            if (
                              itemName.includes("PKR") ||
                              itemQuantity.includes("PKR")
                            ) {
                              return null;
                            }

                            return (
                              <li
                                key={idx}
                                className="flex justify-between items-center py-2 border-b last:border-0"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{itemName}</p>
                                  {itemQuantity && (
                                    <p className="text-sm text-gray-600">
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
                })}{" "}
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weeklyTips.map((tip: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {typeof tip === "string" ? tip : (tip?.text || tip?.tip || tip?.message || JSON.stringify(tip))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Macronutrient Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-900">
                        {summary?.macroBreakdown?.proteinPercent ||
                          summary?.macronutrients?.protein ||
                          summary?.macroDistribution?.protein ||
                          0}%
                      </p>
                      <p className="text-sm text-blue-700 mt-1">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-900">
                        {summary?.macroBreakdown?.carbsPercent ||
                          summary?.macronutrients?.carbs ||
                          summary?.macroDistribution?.carbs ||
                          0}%
                      </p>
                      <p className="text-sm text-green-700 mt-1">Carbs</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-900">
                        {summary?.macroBreakdown?.fatsPercent ||
                          summary?.macronutrients?.fats ||
                          summary?.macroDistribution?.fats ||
                          0}%
                      </p>
                      <p className="text-sm text-purple-700 mt-1">Fats</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Nutrition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-900">
                      {plan.totalCalories
                        ? plan.totalCalories.toLocaleString()
                        : 0}
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      Total Calories ({totalDays} days)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {healthWarnings.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-900">
                      Health Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {healthWarnings.map((warning: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-900">
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
                <Alert>
                  <AlertDescription className="text-sm text-gray-600">
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
            onClick={() => router.push("/meal-planner")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
