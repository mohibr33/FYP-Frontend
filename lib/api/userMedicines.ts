import { apiClient } from "../api-config";
import type { ApiResponse, UserMedicine, DoseSchedule, Reminder, SummaryReport } from "../types";

export interface Guideline {
  id: string;
  medicineId: string | null;
  title: string;
  category: string;
  content: string;
  severity: string | null;
  isGlobal: boolean;
}

export interface DosageCalculatorInput {
  medicineName: string;
  frequency: number;
  duration: number;
  timesPerDay: number;
  intakeTimes?: string[];
}

export interface DosageCalculatorResult {
  medicineName: string;
  frequency: number;
  duration: number;
  timesPerDay: number;
  totalDoses: number;
  schedule: { date: string; time: string }[];
}

export interface AddMedicineData {
  name: string;
  doctorName?: string;
  duration: number;
  isLifetime: boolean;
  intakeTimes: string[];
  notes?: string;
}

export async function addMedicine(data: AddMedicineData): Promise<UserMedicine> {
  const response = await apiClient.post<ApiResponse<UserMedicine>>(
    "/api/user-medicines",
    data
  );
  return response.data.data;
}

export async function getMedicines(
  includeInactive = false
): Promise<UserMedicine[]> {
  const response = await apiClient.get<ApiResponse<UserMedicine[]>>(
    `/api/user-medicines?includeInactive=${includeInactive}`
  );
  return response.data.data;
}

export async function getMedicineById(id: string): Promise<UserMedicine> {
  const response = await apiClient.get<ApiResponse<UserMedicine>>(
    `/api/user-medicines/${id}`
  );
  return response.data.data;
}

export async function updateMedicine(
  id: string,
  data: Partial<AddMedicineData>
): Promise<UserMedicine> {
  const response = await apiClient.put<ApiResponse<UserMedicine>>(
    `/api/user-medicines/${id}`,
    data
  );
  return response.data.data;
}

export async function deleteMedicine(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(`/api/user-medicines/${id}`);
}

export async function getReminders(date?: string): Promise<Reminder[]> {
  const url = date
    ? `/api/user-medicines/reminders?date=${date}`
    : "/api/user-medicines/reminders";
  const response = await apiClient.get<ApiResponse<Reminder[]>>(url);
  return response.data.data;
}

export async function markDoseTaken(doseId: string): Promise<DoseSchedule> {
  const response = await apiClient.patch<ApiResponse<DoseSchedule>>(
    `/api/user-medicines/${doseId}/take`
  );
  return response.data.data;
}

export async function getDoseHistory(
  medicineId?: string,
  limit = 50
): Promise<DoseSchedule[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (medicineId) params.append("medicineId", medicineId);

  const response = await apiClient.get<ApiResponse<DoseSchedule[]>>(
    `/api/user-medicines/history?${params.toString()}`
  );
  return response.data.data;
}

export async function getGuidelines(medicineId?: string): Promise<Guideline[]> {
  const url = medicineId
    ? `/api/user-medicines/guidelines?medicineId=${medicineId}`
    : "/api/user-medicines/guidelines";
  const response = await apiClient.get<ApiResponse<Guideline[]>>(url);
  return response.data.data;
}

export async function getSummaryReport(days = 15): Promise<SummaryReport> {
  const response = await apiClient.get<ApiResponse<SummaryReport>>(
    `/api/user-medicines/summary?days=${days}`
  );
  return response.data.data;
}

export async function calculateDosage(
  data: DosageCalculatorInput
): Promise<DosageCalculatorResult> {
  const response = await apiClient.post<ApiResponse<DosageCalculatorResult>>(
    "/api/user-medicines/calculate-dosage",
    data
  );
  return response.data.data;
}

export interface SavedDosageCalculation {
  id: string;
  drugName: string;
  calculationMethod: string;
  inputs: Record<string, any>;
  result: string;
  unit: string;
  steps: string;
  createdAt: string;
}

export interface SaveDosageInput {
  drugName: string;
  calculationMethod: string;
  inputs: Record<string, any>;
  result: string;
  unit: string;
  steps: string;
}

export async function saveDosageCalculation(data: SaveDosageInput): Promise<SavedDosageCalculation> {
  const response = await apiClient.post<ApiResponse<SavedDosageCalculation>>(
    "/api/dosage-calculations",
    data
  );
  return response.data.data;
}

export async function getDosageCalculations(): Promise<SavedDosageCalculation[]> {
  const response = await apiClient.get<ApiResponse<SavedDosageCalculation[]>>(
    "/api/dosage-calculations"
  );
  return response.data.data;
}
