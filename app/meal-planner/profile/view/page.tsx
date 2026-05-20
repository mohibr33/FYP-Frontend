"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { getHealthProfile, HealthProfileResponse } from "@/lib/api/meal-planner";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Heart,
  Utensils,
  Activity,
  Target,
  Edit,
  ArrowLeft,
  MapPin,
  Droplets,
  Moon,
  ChefHat,
} from "lucide-react";

export default function ViewHealthProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [healthProfile, setHealthProfile] = useState<HealthProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await getHealthProfile();
        if (response.success && response.data) {
          setHealthProfile(response.data);
        } else {
          router.push("/meal-planner/profile");
        }
      } catch (err) {
        router.push("/meal-planner/profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router, authLoading]);

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600", bg: "bg-blue-50" };
    if (bmi < 25) return { label: "Normal", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (bmi < 30) return { label: "Overweight", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Obese", color: "text-red-600", bg: "bg-red-50" };
  };

  if (!user) return null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!healthProfile) {
    return null;
  }

  const bmi = healthProfile.bmi || (healthProfile.weight / Math.pow(healthProfile.height / 100, 2));
  const bmiCategory = getBmiCategory(bmi);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/meal-planner">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-8 w-px bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Your Health Profile</h1>
                  <p className="text-slate-400 text-sm">Overview of your health information</p>
                </div>
              </div>
            </div>
            <Link href="/meal-planner/profile">
              <Button className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-black" />
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Personal Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-3xl font-bold text-slate-800">{healthProfile.age}</p>
                  <p className="text-sm text-slate-500 mt-1">Years Old</p>
                </div>
                <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-3xl font-bold text-slate-800">{healthProfile.height}</p>
                  <p className="text-sm text-slate-500 mt-1">Height (cm)</p>
                </div>
                <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-3xl font-bold text-slate-800">{healthProfile.weight}</p>
                  <p className="text-sm text-slate-500 mt-1">Weight (kg)</p>
                </div>
                <div className={`text-center p-5 rounded-xl border ${bmiCategory.bg} border-slate-100`}>
                  <p className={`text-3xl font-bold ${bmiCategory.color}`}>{bmi.toFixed(1)}</p>
                  <p className="text-sm text-slate-500 mt-1">BMI ({bmiCategory.label})</p>
                </div>
              </div>
              
              {(healthProfile.targetWeight || healthProfile.city || healthProfile.occupation) && (
                <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-slate-100">
                  {healthProfile.targetWeight && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                      <Target className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Target Weight: <span className="font-semibold text-slate-800">{healthProfile.targetWeight} kg</span></span>
                    </div>
                  )}
                  {healthProfile.city && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Location: <span className="font-semibold text-slate-800">{healthProfile.city}</span></span>
                    </div>
                  )}
                  {healthProfile.occupation && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-600">Occupation: <span className="font-semibold text-slate-800">{healthProfile.occupation}</span></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Health Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-black" />
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Health Status</h2>
            </div>
            <div className="p-6">
              {(healthProfile.medicalConditions?.length || healthProfile.allergies?.length || healthProfile.medications) ? (
                <div className="space-y-5">
                  {healthProfile.medicalConditions && healthProfile.medicalConditions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Medical Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {healthProfile.medicalConditions.map((condition, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm border border-slate-200">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {healthProfile.allergies.map((allergy, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm border border-slate-200">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {healthProfile.medications && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Medications</p>
                      <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {healthProfile.medications}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No health conditions recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Dietary Preferences Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-black" />
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Dietary Preferences</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Diet Type</p>
                  <p className="font-semibold text-slate-800 mt-1">{healthProfile.dietaryPreference}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Meals per Day</p>
                  <p className="font-semibold text-slate-800 mt-1">{healthProfile.mealsPerDay} meals</p>
                </div>
                {healthProfile.regionalPreference && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Regional</p>
                    <p className="font-semibold text-slate-800 mt-1">{healthProfile.regionalPreference}</p>
                  </div>
                )}
                {healthProfile.cookingSkill && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cooking Skill</p>
                    <p className="font-semibold text-slate-800 mt-1">{healthProfile.cookingSkill}</p>
                  </div>
                )}
                {healthProfile.maxPrepTime && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Max Prep Time</p>
                    <p className="font-semibold text-slate-800 mt-1">{healthProfile.maxPrepTime} mins</p>
                  </div>
                )}
                {healthProfile.fastingRequirements && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fasting</p>
                    <p className="font-semibold text-slate-800 mt-1">Required</p>
                  </div>
                )}
              </div>
              
              {healthProfile.dislikedFoods && healthProfile.dislikedFoods.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-2">Disliked Foods</p>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.dislikedFoods.map((food, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm border border-slate-200">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lifestyle & Goals Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-black" />
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Lifestyle & Goals</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Activity Level</p>
                  <p className="font-semibold text-slate-800 mt-1">{healthProfile.activityLevel}</p>
                </div>
                <div className="p-4 bg-black rounded-xl">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Primary Goal</p>
                  <p className="font-semibold text-white mt-1">{healthProfile.primaryGoal}</p>
                </div>
                {healthProfile.sleepHours && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Moon className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sleep</p>
                    </div>
                    <p className="font-semibold text-slate-800">{healthProfile.sleepHours} hrs</p>
                    {healthProfile.sleepQuality && (
                      <p className="text-xs text-slate-500">{healthProfile.sleepQuality}</p>
                    )}
                  </div>
                )}
                {healthProfile.waterIntake && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Water</p>
                    </div>
                    <p className="font-semibold text-slate-800">{healthProfile.waterIntake} glasses</p>
                    <p className="text-xs text-slate-500">per day</p>
                  </div>
                )}
                {healthProfile.eatingOutFrequency && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Eating Out</p>
                    <p className="font-semibold text-slate-800 mt-1">{healthProfile.eatingOutFrequency}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Link href="/meal-planner">
              <Button variant="outline" className="h-11 px-6 border-slate-300 text-slate-600 hover:bg-black hover:text-white hover:border-slate-800 rounded-lg">
                Back to Meal Planner
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
