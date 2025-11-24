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
  CardDescription,
  CardHeader,
  CardTitle,
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
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";

export default function HealthProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
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

  // Temporary state for multi-select inputs
  const [medicalConditionInput, setMedicalConditionInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [dislikedFoodInput, setDislikedFoodInput] = useState("");

  useEffect(() => {
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
        // Profile doesn't exist yet, use defaults
        console.log("No existing profile, using defaults");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user, router]);

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
      // Validate required fields
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

      const response = await createOrUpdateHealthProfile(formData);
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

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Health Profile
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to get personalized meal plans
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 md:w-24 h-1 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Personal</span>
            <span>Health</span>
            <span>Dietary</span>
            <span>Lifestyle</span>
            <span>Cooking</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Health Status"}
              {currentStep === 3 && "Dietary Preferences"}
              {currentStep === 4 && "Lifestyle & Goals"}
              {currentStep === 5 && "Cooking & Budget"}
            </CardTitle>
            <CardDescription>Step {currentStep} of 5</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm) *</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
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
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g., Lahore, Karachi"
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    placeholder="e.g., Software Engineer"
                  />
                </div>
              </>
            )}

            {/* Step 2: Health Status */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label>Medical Conditions</Label>
                  <div className="flex gap-2 mb-2">
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
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        addArrayItem(
                          "medicalConditions",
                          medicalConditionInput,
                          setMedicalConditionInput
                        )
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.medicalConditions?.map((condition, idx) => (
                      <span
                        key={idx}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {condition}
                        <button
                          onClick={() =>
                            removeArrayItem("medicalConditions", idx)
                          }
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="medications">Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, medications: e.target.value })
                    }
                    placeholder="e.g., Metformin 500mg twice daily"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Allergies</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addArrayItem(
                            "allergies",
                            allergyInput,
                            setAllergyInput
                          );
                        }
                      }}
                      placeholder="e.g., Peanuts, Shellfish"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        addArrayItem("allergies", allergyInput, setAllergyInput)
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies?.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {allergy}
                        <button
                          onClick={() => removeArrayItem("allergies", idx)}
                          className="hover:text-orange-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sleepHours">Sleep Hours</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Select
                      value={formData.sleepQuality}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sleepQuality: value as any })
                      }
                    >
                      <SelectTrigger>
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

                <div>
                  <Label htmlFor="waterIntake">
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
                  />
                </div>
              </>
            )}

            {/* Step 3: Dietary Preferences */}
            {currentStep === 3 && (
              <>
                <div>
                  <Label htmlFor="dietaryPreference">
                    Dietary Preference *
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non-Vegetarian">
                        Non-Vegetarian
                      </SelectItem>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="Halal only">Halal only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Disliked Foods</Label>
                  <div className="flex gap-2 mb-2">
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
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        addArrayItem(
                          "dislikedFoods",
                          dislikedFoodInput,
                          setDislikedFoodInput
                        )
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.dislikedFoods?.map((food, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {food}
                        <button
                          onClick={() => removeArrayItem("dislikedFoods", idx)}
                          className="hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="regionalPreference">
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
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fastingRequirements"
                    checked={formData.fastingRequirements}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        fastingRequirements: !!checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="fastingRequirements"
                    className="cursor-pointer"
                  >
                    I have fasting requirements (e.g., Ramadan)
                  </Label>
                </div>
              </>
            )}

            {/* Step 4: Lifestyle & Goals */}
            {currentStep === 4 && (
              <>
                <div>
                  <Label htmlFor="activityLevel">Activity Level *</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, activityLevel: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedentary">
                        Sedentary (little to no exercise)
                      </SelectItem>
                      <SelectItem value="Lightly Active">
                        Lightly Active (1-3 days/week)
                      </SelectItem>
                      <SelectItem value="Moderately Active">
                        Moderately Active (3-5 days/week)
                      </SelectItem>
                      <SelectItem value="Very Active">
                        Very Active (6-7 days/week)
                      </SelectItem>
                      <SelectItem value="Athlete">
                        Athlete (training twice/day)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primaryGoal">Primary Goal *</Label>
                  <Select
                    value={formData.primaryGoal}
                    onValueChange={(value) =>
                      setFormData({ ...formData, primaryGoal: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                      <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                      <SelectItem value="Muscle Building">
                        Muscle Building
                      </SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Disease Management">
                        Disease Management
                      </SelectItem>
                      <SelectItem value="Improved Energy">
                        Improved Energy
                      </SelectItem>
                      <SelectItem value="Better Digestion">
                        Better Digestion
                      </SelectItem>
                      <SelectItem value="Overall Health">
                        Overall Health
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, timeline: e.target.value })
                    }
                    placeholder="e.g., 3 months, 6 weeks"
                  />
                </div>

                <div>
                  <Label htmlFor="mealsPerDay">Meals per Day *</Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="eatingOutFrequency">
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
                  />
                </div>
              </>
            )}

            {/* Step 5: Cooking & Budget */}
            {currentStep === 5 && (
              <>
                <div>
                  <Label htmlFor="cookingSkill">Cooking Skill Level</Label>
                  <Select
                    value={formData.cookingSkill}
                    onValueChange={(value) =>
                      setFormData({ ...formData, cookingSkill: value as any })
                    }
                  >
                    <SelectTrigger>
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

                <div>
                  <Label htmlFor="maxPrepTime">Max Prep Time (minutes)</Label>
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
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyBudget">Monthly Budget (PKR)</Label>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    min="0"
                    value={formData.monthlyBudget || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyBudget: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="e.g., 25000"
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
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
  );
}
