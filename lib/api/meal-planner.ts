import { apiClient } from "../api-config";
import { ApiResponse } from "./users";

// Health Profile Types
export interface HealthProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  targetWeight?: number;
  medicalConditions?: string[];
  medications?: string;
  specialConditions?: string[];
  allergies?: string[];
  dietaryPreference:
    | "Non-Vegetarian"
    | "Vegetarian"
    | "Vegan"
    | "Pescatarian"
    | "Halal only";
  dislikedFoods?: string[];
  activityLevel:
    | "Sedentary"
    | "Lightly Active"
    | "Moderately Active"
    | "Very Active"
    | "Athlete";
  occupation?: string;
  sleepHours?: number;
  sleepQuality?: "Poor" | "Fair" | "Good" | "Excellent";
  waterIntake?: number;
  primaryGoal:
    | "Weight Loss"
    | "Weight Gain"
    | "Muscle Building"
    | "Maintenance"
    | "Disease Management"
    | "Improved Energy"
    | "Better Digestion"
    | "Overall Health";
  timeline?: string;
  mealsPerDay: number; // 2-6
  regionalPreference?: string;
  fastingRequirements?: boolean;
  monthlyBudget?: number;
  cookingSkill?: "Beginner" | "Intermediate" | "Advanced" | "Have a cook";
  maxPrepTime?: number;
  eatingOutFrequency?: string;
  city?: string;
  currentHabits?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
}

export interface HealthProfileResponse {
  id: string;
  userId: string;
  age: number;
  height: number;
  weight: number;
  bmi?: number;
  targetWeight?: number;
  medicalConditions?: string[];
  medications?: string;
  specialConditions?: string[];
  allergies?: string[];
  dietaryPreference: string;
  dislikedFoods?: string[];
  activityLevel: string;
  occupation?: string;
  sleepHours?: number;
  sleepQuality?: string;
  waterIntake?: number;
  primaryGoal: string;
  timeline?: string;
  mealsPerDay: number;
  regionalPreference?: string;
  fastingRequirements?: boolean;
  monthlyBudget?: number;
  cookingSkill?: string;
  maxPrepTime?: number;
  eatingOutFrequency?: string;
  city?: string;
  currentHabits?: any;
  createdAt: string;
  updatedAt: string;
}

// Meal Plan Types
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  mealType: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  recipe: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: string;
  cost: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  tags: string[];
  imageUrl?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  meals: Meal[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    cost: number;
  };
}

export interface ShoppingListItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  estimatedCost: number;
}

export interface MealPlan {
  _id?: string; // MongoDB uses _id
  id?: string; // API might return id
  userId: string;
  duration: string;
  status: "active" | "completed" | "archived";
  mealPlanData: {
    mealPlan: {
      summary: {
        totalCalories: number;
        macroDistribution: {
          protein: string;
          carbs: string;
          fats: string;
        };
      };
      dailyMeals: Array<{
        day: number;
        totalCalories: number;
        meals: Array<{
          mealType: string;
          mealName: string;
          calories: number;
          ingredients: string[];
          instructions: string;
        }>;
      }>;
      weeklyTips: string[];
      shoppingList: {
        [category: string]: {
          [item: string]: string;
        };
      };
      healthWarnings: string[];
      progressTracking?: any;
      substitutionGuide?: any;
    };
    disclaimer: string;
  };
  totalCalories: number;
  estimatedCost: number;
  generatedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GenerateMealPlanRequest {
  duration: "7" | "30";
}

export interface UpdateMealPlanStatusRequest {
  status: "active" | "completed" | "archived";
}

// API Functions
export const createOrUpdateHealthProfile = async (
  data: HealthProfile
): Promise<ApiResponse<HealthProfileResponse>> => {
  const response = await apiClient.post(
    "/api/meal-planner/health-profile",
    data
  );
  return response.data;
};

export const getHealthProfile = async (): Promise<
  ApiResponse<HealthProfileResponse>
> => {
  const response = await apiClient.get("/api/meal-planner/health-profile");
  return response.data;
};

export const generateMealPlan = async (
  data: GenerateMealPlanRequest
): Promise<ApiResponse<MealPlan>> => {
  const response = await apiClient.post("/api/meal-planner/generate", data);
  return response.data;
};

export const getAllMealPlans = async (): Promise<
  ApiResponse<{ mealPlans: MealPlan[] }>
> => {
  const response = await apiClient.get("/api/meal-planner/my-plans");
  return response.data;
};

export const getActiveMealPlan = async (): Promise<ApiResponse<MealPlan>> => {
  const response = await apiClient.get("/api/meal-planner/active");
  return response.data;
};

export const getMealPlanById = async (
  id: string
): Promise<ApiResponse<MealPlan>> => {
  const response = await apiClient.get(`/api/meal-planner/${id}`);
  return response.data;
};

export const updateMealPlanStatus = async (
  id: string,
  data: UpdateMealPlanStatusRequest
): Promise<ApiResponse<MealPlan>> => {
  const response = await apiClient.patch(
    `/api/meal-planner/${id}/status`,
    data
  );
  return response.data;
};

export const deleteMealPlan = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`/api/meal-planner/${id}`);
  return response.data;
};
