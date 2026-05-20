import { apiClient } from "../api-config";
import type {
  ApiResponse,
  MoodEntry,
  MoodTrend,
  StressAssessment,
  StressTrend,
  AnxietyScreening,
  WellnessJournalEntry,
  SentimentAnalysis,
  MeditationSession,
  MeditationStats,
  WellnessResource,
  WellnessResourcesResponse,
  WellnessSummary,
} from "../types";

const BASE = "/api/stress-wellness";

// ─── Mood Tracker ─────────────────────────────────────────────────────────

export const createMoodEntry = async (data: {
  mood: string;
  note?: string;
  date?: string;
}): Promise<ApiResponse<MoodEntry>> => {
  const response = await apiClient.post(`${BASE}/mood`, data);
  return response.data;
};

export const getMoodHistory = async (days?: number): Promise<ApiResponse<MoodEntry[]>> => {
  const response = await apiClient.get(`${BASE}/mood`, { params: { days } });
  return response.data;
};

export const getMoodTrend = async (): Promise<ApiResponse<MoodTrend>> => {
  const response = await apiClient.get(`${BASE}/mood/trend`);
  return response.data;
};

// ─── Stress Assessment ────────────────────────────────────────────────────

export const createStressAssessment = async (data: {
  answers: { question: string; answer: number }[];
  date?: string;
}): Promise<ApiResponse<StressAssessment>> => {
  const response = await apiClient.post(`${BASE}/stress`, data);
  return response.data;
};

export const getStressHistory = async (days?: number): Promise<ApiResponse<StressAssessment[]>> => {
  const response = await apiClient.get(`${BASE}/stress`, { params: { days } });
  return response.data;
};

export const getStressTrend = async (): Promise<ApiResponse<StressTrend>> => {
  const response = await apiClient.get(`${BASE}/stress/trend`);
  return response.data;
};

// ─── Anxiety/Depression Screening ─────────────────────────────────────────

export const createScreening = async (data: {
  testType: "phq9" | "gad7";
  answers: { question: string; answer: number }[];
}): Promise<ApiResponse<AnxietyScreening>> => {
  const response = await apiClient.post(`${BASE}/screening`, data);
  return response.data;
};

export const getScreeningHistory = async (): Promise<ApiResponse<AnxietyScreening[]>> => {
  const response = await apiClient.get(`${BASE}/screening`);
  return response.data;
};

// ─── Anonymous Journaling ─────────────────────────────────────────────────

export const createJournalEntry = async (data: {
  title?: string;
  content: string;
  isAnonymous?: boolean;
}): Promise<ApiResponse<WellnessJournalEntry>> => {
  const response = await apiClient.post(`${BASE}/journal`, data);
  return response.data;
};

export const getJournalEntries = async (): Promise<ApiResponse<WellnessJournalEntry[]>> => {
  const response = await apiClient.get(`${BASE}/journal`);
  return response.data;
};

export const getJournalEntryById = async (entryId: string): Promise<ApiResponse<WellnessJournalEntry>> => {
  const response = await apiClient.get(`${BASE}/journal/${entryId}`);
  return response.data;
};

export const analyzeJournalEntry = async (entryId: string): Promise<ApiResponse<SentimentAnalysis>> => {
  const response = await apiClient.post(`${BASE}/journal/${entryId}/analyze`);
  return response.data;
};

export const deleteJournalEntry = async (entryId: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`${BASE}/journal/${entryId}`);
  return response.data;
};

// ─── Meditation & Exercises ───────────────────────────────────────────────

export const createMeditationSession = async (data: {
  type: string;
  duration: number;
  title: string;
  description?: string;
  audioUrl?: string;
  completedAt?: string;
}): Promise<ApiResponse<MeditationSession>> => {
  const response = await apiClient.post(`${BASE}/meditation`, data);
  return response.data;
};

export const getMeditationHistory = async (): Promise<ApiResponse<MeditationSession[]>> => {
  const response = await apiClient.get(`${BASE}/meditation`);
  return response.data;
};

export const getMeditationStats = async (): Promise<ApiResponse<MeditationStats>> => {
  const response = await apiClient.get(`${BASE}/meditation/stats`);
  return response.data;
};

// ─── Wellness Resources ───────────────────────────────────────────────────

export const getWellnessResources = async (params?: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<WellnessResourcesResponse>> => {
  const response = await apiClient.get(`${BASE}/resources`, { params });
  return response.data;
};

export const getWellnessResourceBySlug = async (slug: string): Promise<ApiResponse<WellnessResource>> => {
  const response = await apiClient.get(`${BASE}/resources/${slug}`);
  return response.data;
};

// ─── Dashboard ────────────────────────────────────────────────────────────

export const getWellnessSummary = async (): Promise<ApiResponse<WellnessSummary>> => {
  const response = await apiClient.get(`${BASE}/summary`);
  return response.data;
};
