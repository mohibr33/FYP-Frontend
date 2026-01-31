import { apiClient } from "../api-config";
import type {
  ApiResponse,
  MedicationSchedule,
  ScheduledDose,
  CreateScheduleInput,
  UpdateScheduleInput,
  AdherenceStats,
  DailyAdherence,
  WeeklyReport,
  MedicineAdherence,
  DosageCalculation,
  ConfirmDoseResult,
} from "../types";

// ============================================
// Schedule CRUD
// ============================================

/**
 * Create a new medication schedule
 */
export async function createSchedule(
  data: CreateScheduleInput
): Promise<MedicationSchedule> {
  const response = await apiClient.post<ApiResponse<MedicationSchedule>>(
    "/api/adherence/schedules",
    data
  );
  return response.data.data;
}

/**
 * Get all medication schedules for the current user
 */
export async function getSchedules(): Promise<MedicationSchedule[]> {
  const response = await apiClient.get<ApiResponse<MedicationSchedule[]>>(
    "/api/adherence/schedules"
  );
  return response.data.data;
}

/**
 * Get a specific schedule by ID
 */
export async function getScheduleById(
  scheduleId: string
): Promise<MedicationSchedule | null> {
  const response = await apiClient.get<ApiResponse<MedicationSchedule>>(
    `/api/adherence/schedules/${scheduleId}`
  );
  return response.data.data;
}

/**
 * Update an existing schedule
 */
export async function updateSchedule(
  scheduleId: string,
  data: UpdateScheduleInput
): Promise<MedicationSchedule> {
  const response = await apiClient.put<ApiResponse<MedicationSchedule>>(
    `/api/adherence/schedules/${scheduleId}`,
    data
  );
  return response.data.data;
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(scheduleId: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/adherence/schedules/${scheduleId}`
  );
  return response.data.success;
}

// ============================================
// Dose Management
// ============================================

/**
 * Get today's doses for the current user
 */
export async function getTodaysDoses(): Promise<ScheduledDose[]> {
  const response = await apiClient.get<ApiResponse<ScheduledDose[]>>(
    "/api/adherence/doses/today"
  );
  return response.data.data;
}

/**
 * Get doses within a date range
 */
export async function getDosesByDateRange(
  startDate: string,
  endDate: string
): Promise<ScheduledDose[]> {
  const response = await apiClient.get<ApiResponse<ScheduledDose[]>>(
    "/api/adherence/doses",
    { params: { startDate, endDate } }
  );
  return response.data.data;
}

/**
 * Confirm a dose was taken (public endpoint for email buttons)
 */
export async function confirmDose(token: string): Promise<ConfirmDoseResult> {
  const response = await apiClient.get<ApiResponse<ConfirmDoseResult>>(
    "/api/adherence/doses/confirm",
    { params: { token } }
  );
  return response.data.data;
}

/**
 * Skip a dose (public endpoint for email buttons)
 */
export async function skipDose(token: string): Promise<ConfirmDoseResult> {
  const response = await apiClient.get<ApiResponse<ConfirmDoseResult>>(
    "/api/adherence/doses/skip",
    { params: { token } }
  );
  return response.data.data;
}

/**
 * Mark a dose as taken (authenticated endpoint for UI)
 */
export async function markDoseTaken(doseId: string): Promise<ScheduledDose> {
  const response = await apiClient.post<ApiResponse<ScheduledDose>>(
    `/api/adherence/doses/${doseId}/take`
  );
  return response.data.data;
}

/**
 * Mark a dose as skipped (authenticated endpoint for UI)
 */
export async function markDoseSkipped(
  doseId: string,
  notes?: string
): Promise<ScheduledDose> {
  const response = await apiClient.post<ApiResponse<ScheduledDose>>(
    `/api/adherence/doses/${doseId}/skip`,
    { notes }
  );
  return response.data.data;
}

// ============================================
// Analytics
// ============================================

/**
 * Get adherence stats for a given number of days
 */
export async function getAdherenceStats(days = 7): Promise<AdherenceStats> {
  const response = await apiClient.get<ApiResponse<AdherenceStats>>(
    "/api/adherence/stats",
    { params: { days } }
  );
  return response.data.data;
}

/**
 * Get daily adherence breakdown
 */
export async function getDailyAdherence(days = 7): Promise<DailyAdherence[]> {
  const response = await apiClient.get<ApiResponse<DailyAdherence[]>>(
    "/api/adherence/daily",
    { params: { days } }
  );
  return response.data.data;
}

/**
 * Get weekly adherence report
 */
export async function getWeeklyReport(): Promise<WeeklyReport> {
  const response = await apiClient.get<ApiResponse<WeeklyReport>>(
    "/api/adherence/weekly-report"
  );
  return response.data.data;
}

/**
 * Get per-medicine adherence breakdown
 */
export async function getMedicineBreakdown(): Promise<MedicineAdherence[]> {
  const response = await apiClient.get<ApiResponse<MedicineAdherence[]>>(
    "/api/adherence/medicine-breakdown"
  );
  return response.data.data;
}

// ============================================
// Dosage Calculator
// ============================================

/**
 * Calculate dosage info for a schedule (remaining doses, refill date)
 */
export async function calculateDosage(
  scheduleId: string
): Promise<DosageCalculation> {
  const response = await apiClient.get<ApiResponse<DosageCalculation>>(
    `/api/adherence/calculate/${scheduleId}`
  );
  return response.data.data;
}
