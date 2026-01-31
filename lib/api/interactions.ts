import { apiClient } from "../api-config";
import type {
  ApiResponse,
  InteractionScanResult,
  InteractionScanResultWithId,
  MedicineSearchResult,
  MedicineInput,
  HealthProfileSnapshot,
  ScanHistoryItem,
  Pagination,
} from "../types";

/**
 * Check interactions between medicines (full analysis with AI)
 * Returns result with ID (saved to database)
 */
export async function checkInteractions(
  medicines: MedicineInput[],
  includeAI = true
): Promise<InteractionScanResultWithId> {
  const response = await apiClient.post<ApiResponse<InteractionScanResultWithId>>(
    "/api/interactions/check",
    { medicines, includeAI }
  );
  return response.data.data;
}

/**
 * Quick check interactions without AI analysis
 */
export async function quickCheckInteractions(
  medicines: MedicineInput[]
): Promise<InteractionScanResult> {
  const response = await apiClient.post<ApiResponse<InteractionScanResult>>(
    "/api/interactions/quick-check",
    { medicines }
  );
  return response.data.data;
}

/**
 * Search medicines for interaction checker autocomplete
 */
export async function searchMedicinesForInteraction(
  query: string
): Promise<MedicineSearchResult[]> {
  const response = await apiClient.get<ApiResponse<MedicineSearchResult[]>>(
    "/api/interactions/search",
    { params: { q: query } }
  );
  return response.data.data;
}

/**
 * Get user's health profile summary for interaction checking
 */
export async function getHealthProfileSummary(): Promise<HealthProfileSnapshot | null> {
  const response = await apiClient.get<ApiResponse<HealthProfileSnapshot | null>>(
    "/api/interactions/health-profile"
  );
  return response.data.data;
}

/**
 * Get user's scan history
 */
export async function getScanHistory(
  page = 1,
  limit = 10
): Promise<{ scans: ScanHistoryItem[]; pagination: Pagination }> {
  const response = await apiClient.get<{
    success: boolean;
    data: ScanHistoryItem[];
    pagination: Pagination;
  }>("/api/interactions/history", {
    params: { page, limit },
  });
  return {
    scans: response.data.data,
    pagination: response.data.pagination,
  };
}

/**
 * Get user's latest scan
 */
export async function getLatestScan(): Promise<InteractionScanResult | null> {
  const response = await apiClient.get<ApiResponse<InteractionScanResult | null>>(
    "/api/interactions/latest"
  );
  return response.data.data;
}

/**
 * Get a specific scan by ID
 */
export async function getScanById(scanId: string): Promise<InteractionScanResult | null> {
  const response = await apiClient.get<ApiResponse<InteractionScanResult | null>>(
    `/api/interactions/${scanId}`
  );
  return response.data.data;
}

/**
 * Delete a scan
 */
export async function deleteScan(scanId: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/interactions/${scanId}`
  );
  return response.data.success;
}
