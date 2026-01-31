import { apiClient } from "../api-config";
import type { ApiResponse, LabReport, LabReportsResponse, TrendDataPoint } from "../types";

export async function uploadLabReport(
  file: File,
  metadata?: { title?: string; testDate?: string; labName?: string }
): Promise<ApiResponse<{ report: LabReport }>> {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata?.title) formData.append("title", metadata.title);
  if (metadata?.testDate) formData.append("testDate", metadata.testDate);
  if (metadata?.labName) formData.append("labName", metadata.labName);

  const response = await apiClient.post<ApiResponse<{ report: LabReport }>>(
    "/api/lab-reports/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function getLabReports(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<{ reports: LabReport[]; pagination: any }>> {
  const response = await apiClient.get<ApiResponse<{ reports: LabReport[]; pagination: any }>>("/api/lab-reports", {
    params: { page, limit },
  });
  return response.data;
}

export async function getLabReportById(id: string): Promise<ApiResponse<{ report: LabReport }>> {
  const response = await apiClient.get<ApiResponse<{ report: LabReport }>>(
    `/api/lab-reports/${id}`
  );
  return response.data;
}

export async function shareLabReportWithDoctor(
  id: string,
  doctorEmail: string
): Promise<ApiResponse<{ report: LabReport }>> {
  const response = await apiClient.post<ApiResponse<{ report: LabReport }>>(
    `/api/lab-reports/${id}/share`,
    { doctorEmail }
  );
  return response.data;
}

export async function deleteLabReport(id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete<ApiResponse<void>>(`/api/lab-reports/${id}`);
  return response.data;
}

export async function getTrendData(
  biomarker: string
): Promise<ApiResponse<{ trendData: TrendDataPoint[] }>> {
  const response = await apiClient.get<ApiResponse<{ trendData: TrendDataPoint[] }>>(
    `/api/lab-reports/trend/${biomarker}`
  );
  return response.data;
}
