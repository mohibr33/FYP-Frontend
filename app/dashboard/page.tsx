"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  Utensils,
  Pill,
  FlaskConical,
  MessageSquare,
  HeartPulse,
  ArrowRight,
  Loader2,
  AlertCircle,
  Lock,
  Bell,
  TrendingUp,
  Target,
  Activity,
  Search,
} from "lucide-react";
import { getActiveMealPlan, getHealthProfile } from "@/lib/api/meal-planner";
import type { MealPlan, HealthProfileResponse } from "@/lib/api/meal-planner";
import { getMyTickets } from "@/lib/api/tickets";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingMealPlans, setLoadingMealPlans] = useState(true);
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [healthProfile, setHealthProfile] =
    useState<HealthProfileResponse | null>(null);
  const [loadingHealthProfile, setLoadingHealthProfile] = useState(true);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Fetch meal plans
  useEffect(() => {
    if (user) {
      fetchMealPlans();
      fetchTickets();
      fetchHealthProfile();
    }
  }, [user]);

  const fetchMealPlans = async () => {
    try {
      setLoadingMealPlans(true);
      const response = await getActiveMealPlan();
      if (response.success && response.data) {
        setActivePlan(response.data);
      }
    } catch (err: any) {
      // 404 means no active plan - this is normal
      if (err.response?.status !== 404) {
        console.error("Failed to fetch active meal plan:", err);
      }
      setActivePlan(null);
    } finally {
      setLoadingMealPlans(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const response = await getMyTickets(1, 100, "open");
      setOpenTicketsCount(response.pagination.total);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setOpenTicketsCount(0);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchHealthProfile = async () => {
    try {
      setLoadingHealthProfile(true);
      const response = await getHealthProfile();
      if (response.success && response.data) {
        setHealthProfile(response.data);
      }
    } catch (err: any) {
      // 404 means no profile - this is normal
      if (err.response?.status !== 404) {
        console.error("Failed to fetch health profile:", err);
      }
      setHealthProfile(null);
    } finally {
      setLoadingHealthProfile(false);
    }
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (!healthProfile || !healthProfile.height || !healthProfile.weight) {
      return null;
    }
    const heightInMeters = healthProfile.height / 100;
    const bmi = healthProfile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Overweight", color: "text-amber-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate days remaining in active plan
  const getDaysRemaining = () => {
    if (!activePlan?.mealPlanData?.days) return 0;
    return activePlan.mealPlanData.days.length;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section with Greeting */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}, {user.name?.split(" ")[0] || "User"}!
              </h1>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(currentTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatTime(currentTime)}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/profile")}
              variant="secondary"
              className="self-start md:self-auto"
            >
              View Profile
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Plan Status</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loadingMealPlans ? "-" : activePlan ? "Active" : "None"}
                  </p>
                </div>
                <Utensils className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Plan</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {activePlan ? "Yes" : "No"}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Days Left</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loadingMealPlans ? "-" : getDaysRemaining()}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Health Score</p>
                  <p className="text-2xl font-bold text-slate-900">-</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Module Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Meal Planner Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Meal Planner</CardTitle>
                    <CardDescription>
                      AI-powered personalized meal plans
                    </CardDescription>
                  </div>
                </div>
                {activePlan && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingMealPlans ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : activePlan ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Current Plan
                    </p>
                    <p className="text-xs text-blue-700">
                      {getDaysRemaining()} days • Created{" "}
                      {new Date(activePlan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        router.push(`/meal-planner/plans/${activePlan.id}`)
                      }
                      className="flex-1"
                    >
                      View Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => router.push("/meal-planner")}
                      variant="outline"
                    >
                      All Plans
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No active meal plan. Create one to get started!
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push("/meal-planner/generate")}
                      className="flex-1"
                    >
                      Generate Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => router.push("/meal-planner/profile")}
                      variant="outline"
                    >
                      Health Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medicines Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Medicines</CardTitle>
                  <CardDescription>
                    Comprehensive medicine database
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">
                  Quick Search
                </p>
                <p className="text-xs text-purple-700">
                  Find medicines, check interactions, read reviews
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/medicines")}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Medicines
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lab Analysis Card - Coming Soon */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Lab Analysis</CardTitle>
                    <CardDescription>
                      AI-powered report analysis
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Coming Soon
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  Upload and analyze your lab reports with AI assistance for
                  better health insights.
                </p>
              </div>
              <Button disabled className="w-full" variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </CardContent>
          </Card>

          {/* Live Medical Chat Card - Coming Soon */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Medical Chat</CardTitle>
                    <CardDescription>24/7 AI consultation</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Coming Soon
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  Get instant medical advice and health guidance from our
                  AI-powered chatbot.
                </p>
              </div>
              <Button disabled className="w-full" variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Summary Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <CardTitle>Health Summary</CardTitle>
                  <CardDescription>
                    Your health profile at a glance
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={() => router.push("/meal-planner/profile")}
                variant="outline"
                size="sm"
              >
                {healthProfile ? "Edit Profile" : "Set Up Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Profile Status</p>
                <p className="text-lg font-semibold text-slate-900">
                  {loadingHealthProfile
                    ? "-"
                    : healthProfile
                    ? "Complete"
                    : "Not Set Up"}
                </p>
                {!healthProfile && !loadingHealthProfile && (
                  <Button
                    onClick={() => router.push("/meal-planner/profile")}
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                  >
                    Complete Profile →
                  </Button>
                )}
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">BMI Status</p>
                {loadingHealthProfile ? (
                  <p className="text-lg font-semibold text-slate-900">-</p>
                ) : calculateBMI() ? (
                  <>
                    <p
                      className={`text-lg font-semibold ${
                        getBMICategory(parseFloat(calculateBMI()!)).color
                      }`}
                    >
                      {calculateBMI()} -{" "}
                      {getBMICategory(parseFloat(calculateBMI()!)).label}
                    </p>
                    <p className="text-xs text-slate-500">
                      Height: {healthProfile?.height}cm, Weight:{" "}
                      {healthProfile?.weight}kg
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-slate-900">-</p>
                    <Button
                      onClick={() => router.push("/meal-planner/profile")}
                      variant="link"
                      className="p-0 h-auto text-xs text-blue-600"
                    >
                      Add height & weight →
                    </Button>
                  </>
                )}
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Primary Goal</p>
                <p className="text-lg font-semibold text-slate-900">
                  {loadingHealthProfile
                    ? "-"
                    : healthProfile?.primaryGoal || "-"}
                </p>
                {healthProfile?.primaryGoal && (
                  <p className="text-xs text-slate-500">
                    Activity: {healthProfile.activityLevel}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Center Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Support Center</CardTitle>
                  <CardDescription>Get help when you need it</CardDescription>
                </div>
              </div>
              <Button onClick={() => router.push("/support")} variant="outline">
                View Tickets
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-900">
                  {loadingTickets ? "-" : openTicketsCount}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Quick Actions</p>
                <Button
                  onClick={() => router.push("/support")}
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                >
                  Create New Ticket →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
