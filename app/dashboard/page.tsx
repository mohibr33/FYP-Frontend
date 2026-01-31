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
  Activity,
  Search,
  Target,
  User,
  TicketPlus,
  HelpCircle,
} from "lucide-react";
import { getActiveMealPlan, getHealthProfile, getAllMealPlans } from "@/lib/api/meal-planner";
import type { MealPlan, HealthProfileResponse } from "@/lib/api/meal-planner";
import { getMyTickets } from "@/lib/api/tickets";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingMealPlans, setLoadingMealPlans] = useState(true);
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [activePlans, setActivePlans] = useState<MealPlan[]>([]);
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
      // Fetch all meal plans
      const allPlansResponse = await getAllMealPlans();
      if (allPlansResponse.success && allPlansResponse.data?.mealPlans) {
        // Filter only active plans
        const active = allPlansResponse.data.mealPlans.filter(
          (plan) => plan.status === "active"
        );
        setActivePlans(active);
        // Set the first active plan as the main active plan
        if (active.length > 0) {
          setActivePlan(active[0]);
        }
      }
    } catch (err: any) {
      // 404 means no plans - this is normal
      if (err.response?.status !== 404) {
        console.error("Failed to fetch meal plans:", err);
      }
      setActivePlan(null);
      setActivePlans([]);
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
    if (bmi < 18.5) return { label: "Underweight", color: "text-slate-600" };
    if (bmi < 25) return { label: "Normal", color: "text-emerald-600" };
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
    if (!activePlan?.mealPlanData) return 0;
    
    // Check for new format (days array)
    if (activePlan.mealPlanData.days && activePlan.mealPlanData.days.length > 0) {
      return activePlan.mealPlanData.days.length;
    }
    
    // Check for legacy format (mealPlan.dailyMeals)
    if (activePlan.mealPlanData.mealPlan?.dailyMeals && activePlan.mealPlanData.mealPlan.dailyMeals.length > 0) {
      return activePlan.mealPlanData.mealPlan.dailyMeals.length;
    }
    
    // Fallback: check duration field (e.g., "7" days)
    if (activePlan.duration) {
      return parseInt(activePlan.duration) || 7;
    }
    
    return 7; // Default to 7 days if nothing else works
  };

  // Get days for a specific plan
  const getPlanDays = (plan: MealPlan) => {
    if (!plan?.mealPlanData) return 0;
    
    if (plan.mealPlanData.days && plan.mealPlanData.days.length > 0) {
      return plan.mealPlanData.days.length;
    }
    
    if (plan.mealPlanData.mealPlan?.dailyMeals && plan.mealPlanData.mealPlan.dailyMeals.length > 0) {
      return plan.mealPlanData.mealPlan.dailyMeals.length;
    }
    
    if (plan.duration) {
      return parseInt(plan.duration) || 7;
    }
    
    return 7;
  };

  // Get plan ID (handles both _id and id)
  const getPlanId = (plan: MealPlan) => {
    return plan.id || plan._id || "";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section with Greeting - Dark Background */}
        <div className="bg-slate-800 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}, {user.name?.split(" ")[0] || "User"}!
              </h1>
              <div className="flex items-center gap-4 text-slate-300">
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
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800 self-start md:self-auto"
            >
              View Profile
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar - 3 Cards with colored top borders */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <div className="h-1 bg-orange-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Plan Status</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {loadingMealPlans ? "-" : activePlans.length > 0 ? "Active" : "None"}
                  </p>
                </div>
                <Utensils className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <div className="h-1 bg-emerald-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Plans</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {loadingMealPlans ? "-" : activePlans.length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <div className="h-1 bg-rose-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Health Score</p>
                  <p className="text-2xl font-bold text-slate-800">-</p>
                </div>
                <TrendingUp className="w-8 h-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Module Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Meal Planner Card */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">Meal Planner</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                      AI-powered personalized meal plans
                    </CardDescription>
                  </div>
                </div>
                {activePlans.length > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                    {activePlans.length} Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {loadingMealPlans ? (
                <div className="flex justify-center py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : activePlans.length > 0 ? (
                <div className="space-y-2">
                  {activePlans.slice(0, 2).map((plan, index) => (
                    <div
                      key={getPlanId(plan) || index}
                      onClick={() => router.push(`/meal-planner/plans/${getPlanId(plan)}`)}
                      className="p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {getPlanDays(plan)}-Day Meal Plan
                        </p>
                        <p className="text-xs text-slate-500">
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={() => router.push("/meal-planner/generate")}
                      size="sm"
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      New Plan
                    </Button>
                    <Button
                      onClick={() => router.push("/meal-planner")}
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                    >
                      All Plans
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">No active meal plan. Create one to get started!</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push("/meal-planner/generate")}
                      size="sm"
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Generate Plan
                    </Button>
                    <Button
                      onClick={() => router.push("/meal-planner/profile")}
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                    >
                      Health Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medicines Card */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800">Medicines</CardTitle>
                  <CardDescription className="text-slate-500 text-xs">
                    Comprehensive medicine database
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-2">
              <div className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                <p className="text-sm font-medium text-teal-800">Know Your Medicines</p>
                <p className="text-xs text-slate-600">
                  Understanding your medications helps you stay safe and healthy.
                </p>
              </div>
              <Button
                onClick={() => router.push("/medicines")}
                size="sm"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Medicines
              </Button>
            </CardContent>
          </Card>

          {/* Lab Analysis Card */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">Lab Analyzer</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">AI-powered report analysis</CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-2">
              <p className="text-sm text-slate-500">
                Upload and analyze your lab reports with AI assistance.
              </p>
              <Button
                onClick={() => router.push("/lab-analyzer")}
                size="sm"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white"
              >
                <FlaskConical className="w-4 h-4 mr-2" />
                Analyze Reports
              </Button>
            </CardContent>
          </Card>

          {/* Medical Chat Card */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">Medical Chat</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">24/7 AI consultation</CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-2">
              <p className="text-sm text-slate-500">
                Get instant medical advice from our AI-powered chatbot.
              </p>
              <Button 
                onClick={() => router.push("/medical-chat")}
                size="sm"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Summary Widget */}
        <Card className="bg-white border-0 shadow-sm overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800 text-lg">Health Summary</CardTitle>
                  <CardDescription className="text-slate-500">
                    Your health profile at a glance
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={() => router.push("/meal-planner/profile")}
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
              >
                {healthProfile ? "Edit Profile" : "Set Up Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Profile Status */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">Profile Status</p>
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xl font-bold text-slate-800 mb-1">
                  {loadingHealthProfile
                    ? "-"
                    : healthProfile
                    ? "Complete"
                    : "Not Set Up"}
                </p>
                {healthProfile ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-emerald-600 font-medium">Active</span>
                  </div>
                ) : !loadingHealthProfile && (
                  <Button
                    onClick={() => router.push("/meal-planner/profile")}
                    variant="link"
                    className="p-0 h-auto text-slate-600 hover:text-slate-900 text-sm"
                  >
                    Complete Profile →
                  </Button>
                )}
              </div>

              {/* BMI Status */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">BMI Status</p>
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                {loadingHealthProfile ? (
                  <p className="text-xl font-bold text-slate-800">-</p>
                ) : calculateBMI() ? (
                  <>
                    <p className={`text-xl font-bold ${getBMICategory(parseFloat(calculateBMI()!)).color}`}>
                      {calculateBMI()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-600">
                        {getBMICategory(parseFloat(calculateBMI()!)).label}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({healthProfile?.height}cm · {healthProfile?.weight}kg)
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-slate-800">-</p>
                    <Button
                      onClick={() => router.push("/meal-planner/profile")}
                      variant="link"
                      className="p-0 h-auto text-slate-600 hover:text-slate-900 text-sm"
                    >
                      Add measurements →
                    </Button>
                  </>
                )}
              </div>

              {/* Primary Goal */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">Primary Goal</p>
                  <Target className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xl font-bold text-slate-800 mb-1">
                  {loadingHealthProfile
                    ? "-"
                    : healthProfile?.primaryGoal || "-"}
                </p>
                {healthProfile?.primaryGoal && (
                  <span className="text-xs text-slate-500">
                    {healthProfile.activityLevel}
                  </span>
                )}
                {!healthProfile?.primaryGoal && !loadingHealthProfile && (
                  <Button
                    onClick={() => router.push("/meal-planner/profile")}
                    variant="link"
                    className="p-0 h-auto text-slate-600 hover:text-slate-900 text-sm"
                  >
                    Set your goal →
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Center Card */}
        <Card className="bg-white border-0 shadow-sm overflow-hidden">
          <div className="h-1 bg-slate-700" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800 text-lg">Support Center</CardTitle>
                  <CardDescription className="text-slate-500">Get help when you need it</CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => router.push("/support")} 
                variant="outline" 
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800"
              >
                View Tickets
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Open Tickets */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">Open Tickets</p>
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {loadingTickets ? "-" : openTicketsCount}
                </p>
                {!loadingTickets && openTicketsCount > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-xs text-amber-600 font-medium">Pending</span>
                  </div>
                )}
                {!loadingTickets && openTicketsCount === 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-emerald-600 font-medium">All resolved</span>
                  </div>
                )}
              </div>

              {/* Create Ticket */}
              <div 
                onClick={() => router.push("/support")}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">New Ticket</p>
                  <TicketPlus className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Having an issue? Let us know.
                </p>
                <span className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Create ticket →
                </span>
              </div>

              {/* Quick Help */}
              <div 
                onClick={() => router.push("/medical-chat")}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">Quick Help</p>
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Get instant AI assistance.
                </p>
                <span className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Start chat →
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
