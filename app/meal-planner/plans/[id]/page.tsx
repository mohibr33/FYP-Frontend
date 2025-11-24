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
  const { user } = useAuth();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "meals"
  );
  const [selectedDay, setSelectedDay] = useState(1);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadPlan = async () => {
      try {
        const response = await getMealPlanById(params.id as string);
        if (response.success && response.data) {
          setPlan(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load meal plan");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [user, router, params.id]);

  const handleStatusChange = async (
    newStatus: "active" | "completed" | "archived"
  ) => {
    if (!plan) return;
    setUpdating(true);

    try {
      const response = await updateMealPlanStatus(plan._id, {
        status: newStatus,
      });
      if (response.success && response.data) {
        setPlan(response.data);
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
      await deleteMealPlan(plan._id);
      router.push("/meal-planner/plans");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete plan");
    }
  };

  if (!user) return null;

  if (loading) {
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

  const shoppingList = plan.mealPlanData.mealPlan.shoppingList;
  const totalDays = plan.mealPlanData.mealPlan.dailyMeals.length;
  const shoppingItemsCount = Object.values(shoppingList).reduce(
    (acc, category) => acc + Object.keys(category).length,
    0
  );

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
          <div className="grid md:grid-cols-5 gap-4">
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
                      {Math.round(plan.totalCalories / totalDays)}
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
                      {
                        plan.mealPlanData.mealPlan.summary.macroDistribution
                          .protein
                      }
                      %
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

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      PKR {plan.estimatedCost.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Cost</p>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plan.mealPlanData.mealPlan.dailyMeals.map((dayData) => (
                    <SelectItem
                      key={dayData.day}
                      value={dayData.day.toString()}
                    >
                      Day {dayData.day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {plan.mealPlanData.mealPlan.dailyMeals[selectedDay - 1] && (
              <div className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-900">
                          {
                            plan.mealPlanData.mealPlan.dailyMeals[
                              selectedDay - 1
                            ].totalCalories
                          }
                        </p>
                        <p className="text-sm text-blue-700">Total Calories</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-900">
                          {
                            plan.mealPlanData.mealPlan.dailyMeals[
                              selectedDay - 1
                            ].meals.length
                          }
                        </p>
                        <p className="text-sm text-blue-700">Meals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  {plan.mealPlanData.mealPlan.dailyMeals[
                    selectedDay - 1
                  ].meals.map((meal, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {meal.mealType}
                            </Badge>
                            <CardTitle className="text-xl">
                              {meal.mealName}
                            </CardTitle>
                          </div>
                          <Badge variant="secondary">
                            <Flame className="h-3 w-3 mr-1" />
                            {meal.calories} cal
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            Ingredients:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {meal.ingredients.slice(0, 5).map((ing, i) => (
                              <li key={i}>• {ing}</li>
                            ))}
                            {meal.ingredients.length > 5 && (
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
                          <p className="mt-2 text-gray-700 whitespace-pre-line">
                            {meal.instructions}
                          </p>
                        </details>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Shopping List Tab */}
          <TabsContent value="shopping">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(shoppingList).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </CardTitle>
                    <CardDescription>
                      {Object.keys(items).length} items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {Object.entries(items).map(
                        ([itemName, quantity], idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center py-2 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{itemName}</p>
                              <p className="text-sm text-gray-600">
                                {quantity}
                              </p>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-green-900">
                      Total Estimated Cost
                    </p>
                    <p className="text-sm text-green-700">
                      For entire {totalDays}-day plan
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">
                    PKR {plan.estimatedCost.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
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
                    {plan.mealPlanData.mealPlan.weeklyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
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
                        {
                          plan.mealPlanData.mealPlan.summary.macroDistribution
                            .protein
                        }
                        %
                      </p>
                      <p className="text-sm text-blue-700 mt-1">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-900">
                        {
                          plan.mealPlanData.mealPlan.summary.macroDistribution
                            .carbs
                        }
                        %
                      </p>
                      <p className="text-sm text-green-700 mt-1">Carbs</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-900">
                        {
                          plan.mealPlanData.mealPlan.summary.macroDistribution
                            .fats
                        }
                        %
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-900">
                        {plan.totalCalories.toLocaleString()}
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        Total Calories ({totalDays} days)
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-900">
                        PKR {plan.estimatedCost.toFixed(0)}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Estimated Cost
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {plan.mealPlanData.mealPlan.healthWarnings &&
                plan.mealPlanData.mealPlan.healthWarnings.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="text-yellow-900">
                        Health Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.mealPlanData.mealPlan.healthWarnings.map(
                          (warning, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ChevronRight className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-yellow-900">{warning}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {plan.mealPlanData.disclaimer && (
                <Alert>
                  <AlertDescription className="text-sm text-gray-600">
                    {plan.mealPlanData.disclaimer}
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
