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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Meal Plans
            </h1>
            <p className="text-gray-600">
              Browse and manage all your meal plans
            </p>
          </div>
          <Link href="/meal-planner/generate">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Plan
            </Button>
          </Link>
        </div>

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({statusCounts.active})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived ({statusCounts.archived})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredPlans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === "all" ? "No meal plans yet" : `No ${filter} plans`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "Generate your first AI-powered meal plan to get started"
                  : `You don't have any ${filter} meal plans`}
              </p>
              {filter === "all" && (
                <Link href="/meal-planner/generate">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Meal Plan
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const planId = plan.id || plan._id || "";
              return (
                <Card
                  key={planId}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/meal-planner/plans/${planId}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant={
                          plan.status === "active"
                            ? "default"
                            : plan.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {plan.status}
                      </Badge>
                      <Badge variant="outline">
                        {plan.duration === "7" ? "7 Days" : "30 Days"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {plan.mealPlanData?.mealPlan?.dailyMeals?.length ||
                        plan.duration}
                      -Day Meal Plan
                    </CardTitle>
                    <CardDescription>
                      Generated{" "}
                      {new Date(plan.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {plan.totalCalories ||
                              plan.mealPlanData?.mealPlan?.summary
                                ?.totalCalories ||
                              0}
                          </p>
                          <p className="text-xs text-gray-600">
                            Total Calories
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {plan.mealPlanData?.mealPlan?.summary
                              ?.macroDistribution?.protein || "0%"}
                          </p>
                          <p className="text-xs text-gray-600">Protein</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-600">Shopping Items</span>
                        <span className="font-semibold text-gray-900">
                          {plan.mealPlanData?.mealPlan?.shoppingList
                            ? Object.values(
                                plan.mealPlanData.mealPlan.shoppingList
                              ).reduce(
                                (acc, category) =>
                                  acc + Object.keys(category).length,
                                0
                              )
                            : 0}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-2"
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
          <Button variant="link" onClick={() => router.push("/meal-planner")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
