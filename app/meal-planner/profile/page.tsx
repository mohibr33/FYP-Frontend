"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  createOrUpdateHealthProfile,
  getHealthProfile,
  HealthProfile,
} from "@/lib/api/meal-planner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Loader2, 
  User, 
  Heart, 
  Utensils, 
  Target, 
  ChefHat,
  Check,
  Plus,
  X,
  AlertCircle
} from "lucide-react";

const STEP_INFO = [
  { icon: User, label: "Personal" },
  { icon: Heart, label: "Health" },
  { icon: Utensils, label: "Dietary" },
  { icon: Target, label: "Lifestyle" },
  { icon: ChefHat, label: "Cooking" },
];

export default function HealthProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [formData, setFormData] = useState<HealthProfile>({
    age: 25,
    height: 170,
    weight: 70,
    medicalConditions: [],
    allergies: [],
    dislikedFoods: [],
    activityLevel: "Moderately Active",
    dietaryPreference: "Non-Vegetarian",
    primaryGoal: "Maintenance",
    mealsPerDay: 3,
    cookingSkill: "Intermediate",
    sleepQuality: "Good",
  });

  const [medicalConditionInput, setMedicalConditionInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [dislikedFoodInput, setDislikedFoodInput] = useState("");

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
          setFormData({
            age: response.data.age,
            height: response.data.height,
            weight: response.data.weight,
            targetWeight: response.data.targetWeight,
            medicalConditions: response.data.medicalConditions || [],
            medications: response.data.medications,
            specialConditions: response.data.specialConditions || [],
            allergies: response.data.allergies || [],
            dietaryPreference: response.data.dietaryPreference as any,
            dislikedFoods: response.data.dislikedFoods || [],
            activityLevel: response.data.activityLevel as any,
            occupation: response.data.occupation,
            sleepHours: response.data.sleepHours,
            sleepQuality: response.data.sleepQuality as any,
            waterIntake: response.data.waterIntake,
            primaryGoal: response.data.primaryGoal as any,
            timeline: response.data.timeline,
            mealsPerDay: response.data.mealsPerDay,
            regionalPreference: response.data.regionalPreference,
            fastingRequirements: response.data.fastingRequirements,
            monthlyBudget: response.data.monthlyBudget,
            cookingSkill: response.data.cookingSkill as any,
            maxPrepTime: response.data.maxPrepTime,
            eatingOutFrequency: response.data.eatingOutFrequency,
            city: response.data.city,
            currentHabits: response.data.currentHabits,
          });
        }
      } catch (err: any) {
        console.log("No existing profile, using defaults");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user, router, authLoading]);

  const addArrayItem = (
    field: keyof HealthProfile,
    value: string,
    setter: (val: string) => void
  ) => {
    if (value.trim()) {
      const currentArray = (formData[field] as string[]) || [];
      setFormData({ ...formData, [field]: [...currentArray, value.trim()] });
      setter("");
    }
  };

  const removeArrayItem = (field: keyof HealthProfile, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (formData.age < 1 || formData.age > 120) {
        throw new Error("Age must be between 1 and 120");
      }
      if (formData.height < 50 || formData.height > 300) {
        throw new Error("Height must be between 50 and 300 cm");
      }
      if (formData.weight < 20 || formData.weight > 300) {
        throw new Error("Weight must be between 20 and 300 kg");
      }
      if (formData.mealsPerDay < 2 || formData.mealsPerDay > 6) {
        throw new Error("Meals per day must be between 2 and 6");
      }

      const cleanedData: any = { ...formData };
      Object.keys(cleanedData).forEach((key) => {
        if (
          cleanedData[key] === undefined ||
          cleanedData[key] === null ||
          cleanedData[key] === ""
        ) {
          delete cleanedData[key];
        }
      });

      const response = await createOrUpdateHealthProfile(cleanedData);
      if (response.success) {
        setSuccess("Health profile saved successfully!");
        setTimeout(() => {
          router.push("/meal-planner");
        }, 1500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to save profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!user) return null;

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  const CurrentStepIcon = STEP_INFO[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Health Profile</h1>
              <p className="text-slate-400">
                Tell us about yourself to get personalized meal plans
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Progress Indicator */}
          <div className="mb-8 bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              {STEP_INFO.map((step, index) => {
                const StepIcon = step.icon;
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                
                return (
                  <div key={stepNum} className="flex items-center flex-1 last:flex-none">
                    <button
                      onClick={() => setCurrentStep(stepNum)}
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center font-semibold shrink-0 transition-all duration-200 ${
                        isCompleted
                          ? "bg-black text-white"
                          : isCurrent
                          ? "bg-black text-white ring-4 ring-slate-200"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </button>
                    {stepNum < 5 && (
                      <div
                        className={`flex-1 h-0.5 mx-3 transition-colors ${
                          stepNum < currentStep ? "bg-black" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3">
              {STEP_INFO.map((step, index) => (
                <span 
                  key={index} 
                  className={`text-xs font-medium w-11 text-center ${
                    index + 1 <= currentStep ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-black border-slate-700">
              <Check className="h-4 w-4 text-white" />
              <AlertDescription className="text-white">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 bg-black border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                  <CurrentStepIcon className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Health Status"}
                    {currentStep === 3 && "Dietary Preferences"}
                    {currentStep === 4 && "Lifestyle & Goals"}
                    {currentStep === 5 && "Cooking Preferences"}
                  </h2>
                  <p className="text-slate-400 text-sm">Step {currentStep} of 5</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="age" className="text-slate-700 text-sm">
                        Age <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="weight" className="text-slate-700 text-sm">
                        Weight (kg) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        min="20"
                        max="300"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weight: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="height" className="text-slate-700 text-sm">
                        Height (cm) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        min="50"
                        max="300"
                        value={formData.height}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            height: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="targetWeight" className="text-slate-700 text-sm">
                        Target Weight (kg)
                      </Label>
                      <Input
                        id="targetWeight"
                        type="number"
                        min="20"
                        max="300"
                        value={formData.targetWeight || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetWeight: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Optional"
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-slate-700 text-sm">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="e.g., Lahore, Karachi"
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="occupation" className="text-slate-700 text-sm">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, occupation: e.target.value })
                      }
                      placeholder="e.g., Software Engineer"
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Health Status */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-700 text-sm">Medical Conditions</Label>
                    <div className="flex gap-2">
                      <Input
                        value={medicalConditionInput}
                        onChange={(e) => setMedicalConditionInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem(
                              "medicalConditions",
                              medicalConditionInput,
                              setMedicalConditionInput
                            );
                          }
                        }}
                        placeholder="e.g., Diabetes, High blood pressure"
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                      <Button
                        type="button"
                        className="h-10 px-3 bg-black hover:bg-slate-700 text-white"
                        onClick={() =>
                          addArrayItem(
                            "medicalConditions",
                            medicalConditionInput,
                            setMedicalConditionInput
                          )
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.medicalConditions?.map((condition, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {condition}
                          <button
                            onClick={() => removeArrayItem("medicalConditions", idx)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="medications" className="text-slate-700 text-sm">Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, medications: e.target.value })
                      }
                      placeholder="e.g., Metformin 500mg twice daily"
                      rows={3}
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 text-sm">Allergies</Label>
                    <div className="flex gap-2">
                      <Input
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("allergies", allergyInput, setAllergyInput);
                          }
                        }}
                        placeholder="e.g., Peanuts, Shellfish"
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                      <Button
                        type="button"
                        className="h-10 px-3 bg-black hover:bg-slate-700 text-white"
                        onClick={() =>
                          addArrayItem("allergies", allergyInput, setAllergyInput)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies?.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {allergy}
                          <button
                            onClick={() => removeArrayItem("allergies", idx)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="sleepHours" className="text-slate-700 text-sm">Sleep Hours</Label>
                      <Input
                        id="sleepHours"
                        type="number"
                        min="0"
                        max="24"
                        value={formData.sleepHours || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sleepHours: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="e.g., 7"
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="sleepQuality" className="text-slate-700 text-sm">Sleep Quality</Label>
                      <Select
                        value={formData.sleepQuality}
                        onValueChange={(value) =>
                          setFormData({ ...formData, sleepQuality: value as any })
                        }
                      >
                        <SelectTrigger className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="waterIntake" className="text-slate-700 text-sm">
                      Water Intake (glasses/day)
                    </Label>
                    <Input
                      id="waterIntake"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.waterIntake || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          waterIntake: parseInt(e.target.value) || undefined,
                        })
                      }
                      placeholder="e.g., 8"
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Dietary Preferences */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="dietaryPreference" className="text-slate-700 text-sm">
                      Dietary Preference <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.dietaryPreference}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dietaryPreference: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                        <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                        <SelectItem value="Halal only">Halal only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 text-sm">Disliked Foods</Label>
                    <div className="flex gap-2">
                      <Input
                        value={dislikedFoodInput}
                        onChange={(e) => setDislikedFoodInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem(
                              "dislikedFoods",
                              dislikedFoodInput,
                              setDislikedFoodInput
                            );
                          }
                        }}
                        placeholder="e.g., Bitter gourd, Okra"
                        className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                      <Button
                        type="button"
                        className="h-10 px-3 bg-black hover:bg-slate-700 text-white"
                        onClick={() =>
                          addArrayItem(
                            "dislikedFoods",
                            dislikedFoodInput,
                            setDislikedFoodInput
                          )
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.dislikedFoods?.map((food, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {food}
                          <button
                            onClick={() => removeArrayItem("dislikedFoods", idx)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="regionalPreference" className="text-slate-700 text-sm">
                      Regional Preference
                    </Label>
                    <Input
                      id="regionalPreference"
                      value={formData.regionalPreference || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regionalPreference: e.target.value,
                        })
                      }
                      placeholder="e.g., Punjabi cuisine, South Asian"
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Checkbox
                      id="fastingRequirements"
                      checked={formData.fastingRequirements}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          fastingRequirements: !!checked,
                        })
                      }
                      className="border-slate-400 data-[state=checked]:bg-black data-[state=checked]:border-slate-800"
                    />
                    <Label
                      htmlFor="fastingRequirements"
                      className="cursor-pointer text-slate-700 text-sm"
                    >
                      I have fasting requirements (e.g., Ramadan)
                    </Label>
                  </div>
                </>
              )}

              {/* Step 4: Lifestyle & Goals */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="activityLevel" className="text-slate-700 text-sm">
                      Activity Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.activityLevel}
                      onValueChange={(value) =>
                        setFormData({ ...formData, activityLevel: value as any })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedentary">Sedentary (little to no exercise)</SelectItem>
                        <SelectItem value="Lightly Active">Lightly Active (1-3 days/week)</SelectItem>
                        <SelectItem value="Moderately Active">Moderately Active (3-5 days/week)</SelectItem>
                        <SelectItem value="Very Active">Very Active (6-7 days/week)</SelectItem>
                        <SelectItem value="Athlete">Athlete (training twice/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="primaryGoal" className="text-slate-700 text-sm">
                      Primary Goal <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.primaryGoal}
                      onValueChange={(value) =>
                        setFormData({ ...formData, primaryGoal: value as any })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                        <SelectItem value="Muscle Building">Muscle Building</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Disease Management">Disease Management</SelectItem>
                        <SelectItem value="Improved Energy">Improved Energy</SelectItem>
                        <SelectItem value="Better Digestion">Better Digestion</SelectItem>
                        <SelectItem value="Overall Health">Overall Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mealsPerDay" className="text-slate-700 text-sm">
                      Meals per Day <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mealsPerDay"
                      type="number"
                      min="2"
                      max="6"
                      value={formData.mealsPerDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mealsPerDay: parseInt(e.target.value) || 3,
                        })
                      }
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="eatingOutFrequency" className="text-slate-700 text-sm">
                      Eating Out Frequency
                    </Label>
                    <Input
                      id="eatingOutFrequency"
                      value={formData.eatingOutFrequency || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eatingOutFrequency: e.target.value,
                        })
                      }
                      placeholder="e.g., 2-3 times per week"
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </>
              )}

              {/* Step 5: Cooking Preferences */}
              {currentStep === 5 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="cookingSkill" className="text-slate-700 text-sm">
                      Cooking Skill Level
                    </Label>
                    <Select
                      value={formData.cookingSkill}
                      onValueChange={(value) =>
                        setFormData({ ...formData, cookingSkill: value as any })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Have a cook">Have a cook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="maxPrepTime" className="text-slate-700 text-sm">
                      Max Prep Time (minutes)
                    </Label>
                    <Input
                      id="maxPrepTime"
                      type="number"
                      min="0"
                      max="180"
                      value={formData.maxPrepTime || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxPrepTime: parseInt(e.target.value) || undefined,
                        })
                      }
                      placeholder="e.g., 45"
                      className="h-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>

                  {/* Summary Preview */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-medium text-slate-800 mb-3 text-sm">Profile Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Age:</span>
                        <span className="text-slate-700">{formData.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Weight:</span>
                        <span className="text-slate-700">{formData.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Height:</span>
                        <span className="text-slate-700">{formData.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Goal:</span>
                        <span className="text-slate-700">{formData.primaryGoal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Diet:</span>
                        <span className="text-slate-700">{formData.dietaryPreference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Activity:</span>
                        <span className="text-slate-700">{formData.activityLevel}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-5 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-5 border-slate-300 text-slate-700 hover:bg-slate-100"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {currentStep < 5 ? (
                  <Button 
                    type="button" 
                    className="h-10 px-5 bg-black hover:bg-slate-700 text-white"
                    onClick={nextStep}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    className="h-10 px-5 bg-black hover:bg-slate-700 text-white" 
                    onClick={handleSubmit} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
