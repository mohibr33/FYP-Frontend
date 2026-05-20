import { apiClient } from "../api-config";
import type { ApiResponse } from "../types";

export const getProgress = async (): Promise<ApiResponse<any[]>> => {
  const res = await apiClient.get("/api/rehab/progress");
  return res.data;
};

export const updateProgress = async (exerciseId: string): Promise<ApiResponse<any>> => {
  const res = await apiClient.post("/api/rehab/progress", { exerciseId });
  return res.data;
};

export const getChecklist = async (date: string): Promise<ApiResponse<any>> => {
  const res = await apiClient.get(`/api/rehab/checklist/${date}`);
  return res.data;
};

export const saveChecklist = async (date: string, items: any[]): Promise<ApiResponse<any>> => {
  const res = await apiClient.post("/api/rehab/checklist", { date, items });
  return res.data;
};
