import { apiClient } from "../api-config";
import type { ApiResponse, ChronicDashboard, DailyHealthLog, PatientCondition, HealthAlert, HealthReport, TrendData, HealthPrediction } from "../types";

const BASE = "/api/chronic-disease";

export const getDashboard = async (): Promise<ApiResponse<ChronicDashboard>> => {
  const res = await apiClient.get(`${BASE}/dashboard`);
  return res.data;
};

export const createCondition = async (data: {
  condition: string;
  diagnosedAt?: string;
  severity?: string;
  notes?: string;
}): Promise<ApiResponse<PatientCondition>> => {
  const res = await apiClient.post(`${BASE}/conditions`, data);
  return res.data;
};

export const getConditions = async (): Promise<ApiResponse<PatientCondition[]>> => {
  const res = await apiClient.get(`${BASE}/conditions`);
  return res.data;
};

export const deleteCondition = async (conditionId: string): Promise<ApiResponse<null>> => {
  const res = await apiClient.delete(`${BASE}/conditions/${conditionId}`);
  return res.data;
};

export const createLog = async (data: {
  conditionId?: string;
  logDate?: string;
  symptoms?: string[];
  painLevel?: number;
  painLocation?: string[];
  mobilityIssues?: string[];
  fatigueLevel?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugar?: number;
  heartRate?: number;
  oxygenLevel?: number;
  weight?: number;
  temperature?: number;
  medicationTaken?: Array<{ name: string; dose?: string; time?: string }>;
  notes?: string;
}): Promise<ApiResponse<DailyHealthLog>> => {
  const res = await apiClient.post(`${BASE}/logs`, data);
  return res.data;
};

export const getLogs = async (params?: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  conditionId?: string;
}): Promise<ApiResponse<{ logs: DailyHealthLog[]; total: number; page: number; totalPages: number }>> => {
  const res = await apiClient.get(`${BASE}/logs`, { params });
  return res.data;
};

export const getLogById = async (logId: string): Promise<ApiResponse<DailyHealthLog>> => {
  const res = await apiClient.get(`${BASE}/logs/${logId}`);
  return res.data;
};

export const getAlerts = async (): Promise<ApiResponse<HealthAlert[]>> => {
  const res = await apiClient.get(`${BASE}/alerts`);
  return res.data;
};

export const markAlertRead = async (alertId: string): Promise<ApiResponse<null>> => {
  const res = await apiClient.patch(`${BASE}/alerts/${alertId}/read`);
  return res.data;
};

export const getReports = async (): Promise<ApiResponse<HealthReport[]>> => {
  const res = await apiClient.get(`${BASE}/reports`);
  return res.data;
};

export const generateReport = async (from: string, to: string): Promise<ApiResponse<HealthReport>> => {
  const res = await apiClient.post(`${BASE}/reports/generate`, { from, to });
  return res.data;
};

export const getTrends = async (params?: {
  conditionId?: string;
  period?: "day" | "week" | "month";
}): Promise<ApiResponse<TrendData[]>> => {
  const res = await apiClient.get(`${BASE}/trends`, { params });
  return res.data;
};

export const deleteReport = async (reportId: string): Promise<ApiResponse<null>> => {
  const res = await apiClient.delete(`${BASE}/reports/${reportId}`);
  return res.data;
};

export const getPredictions = async (): Promise<ApiResponse<HealthPrediction[]>> => {
  const res = await apiClient.get(`${BASE}/predictions`);
  return res.data;
};
