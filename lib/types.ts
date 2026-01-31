// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Pagination
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  shortDescription?: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  readTime?: number;
  tags?: string[];
  sourceLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

export interface ArticlesCategoryResponse {
  category: string;
  articles: Article[];
  total: number;
}

export interface ArticleDetailResponse {
  article: Article;
}

// Medicine Types
export interface ProductDetails {
  howItWorks: string;
  description: string;
  generics: string;
  usedFor: string;
  requiresPrescriptionYesNo: string;
  indication: string;
  sideEffects: string;
  whenNotToUse: string;
  dosage: string;
  storageYesOrNo: string;
  precautions: string;
  warning1: string;
  warning2: string;
  warning3: string;
  pregnancyCategory: string;
  drugInteractions: string;
}

// Risk Evaluation Types
export type RiskLevel = "safe" | "caution" | "high_risk";

export interface RiskFactor {
  type: "allergy" | "condition" | "medication" | "pregnancy" | "side_effect";
  severity: RiskLevel;
  match: string;
  message: string;
}

export interface RiskEvaluation {
  level: RiskLevel;
  message: string;
  factors: RiskFactor[];
  hasProfile: boolean;
}

export interface Medicine {
  id: string;
  productId: string;
  slug: string;
  title: string;
  productImage: string;
  brand: string;
  usedFor: string;
  childCategory: string;
  productDetails: ProductDetails;
  allergyWarnings?: string[];
  riskEvaluation?: RiskEvaluation;
  createdAt: string;
  updatedAt: string;
}

export interface MedicinesResponse {
  medicines: Medicine[];
  pagination: Pagination;
  hasHealthProfile?: boolean;
}

export interface BrandsResponse {
  brands: string[];
  total: number;
}

export interface CategoryResponse {
  category: string;
  medicines: Medicine[];
  total: number;
}

// Medical Chat Types
export interface ChatAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  messageType: "text" | "voice" | "file";
  audioUrl?: string | null;
  audioDuration?: number | null;
  transcription?: string | null;
  tokens?: number | null;
  createdAt: string;
  attachments?: ChatAttachment[];
}

export interface MedicalChat {
  id: string;
  userId: string;
  title: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  _count?: {
    messages: number;
  };
}

export interface ChatsListResponse {
  chats: MedicalChat[];
  pagination: Pagination;
}

export interface ChatStatsResponse {
  totalChats: number;
  activeChats: number;
  archivedChats: number;
  totalMessages: number;
  avgMessagesPerChat: number;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  tokensUsed: number;
}

export interface SendVoiceMessageResponse extends SendMessageResponse {
  transcription: string;
  audioUrl: string;
}

// Drug Interaction Types
export type InteractionSeverity = "minor" | "moderate" | "major" | "contraindicated";
export type SafetyRiskLevel = "low" | "medium" | "high" | "critical";

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  description: string;
  mechanism?: string;
  clinicalEffects?: string;
  management?: string;
}

export interface AllergyAlert {
  medicine: string;
  allergen: string;
  severity: SafetyRiskLevel;
  message: string;
}

export interface ConditionConflict {
  medicine: string;
  condition: string;
  severity: SafetyRiskLevel;
  message: string;
  recommendation?: string;
}

export interface RegulatoryFlag {
  medicine: string;
  flag: string;
  category: "pregnancy" | "breastfeeding" | "pediatric" | "geriatric" | "controlled";
  severity: SafetyRiskLevel;
  details: string;
}

export interface SafetyFlag {
  medicine: string;
  type: "black_box_warning" | "fda_alert" | "recall" | "interaction_warning" | "dosage_warning";
  severity: SafetyRiskLevel;
  message: string;
  details?: string;
}

export interface HealthProfileSnapshot {
  allergies: string[];
  medicalConditions: string[];
  specialConditions: string[];
  age?: number;
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
}

export interface MedicineInput {
  id?: string;
  name: string;
  genericName?: string;
  slug?: string;
}

export interface InteractionSummary {
  totalInteractions: number;
  criticalCount: number;
  majorCount: number;
  moderateCount: number;
  minorCount: number;
  overallRisk: SafetyRiskLevel;
  hasHealthProfile: boolean;
  recommendation: string;
}

export interface InteractionScanResult {
  medicines: MedicineInput[];
  drugInteractions: DrugInteraction[];
  allergyAlerts: AllergyAlert[];
  conditionConflicts: ConditionConflict[];
  regulatoryFlags: RegulatoryFlag[];
  safetyFlags: SafetyFlag[];
  summary: InteractionSummary;
  aiAnalysis?: string;
  scannedAt: string;
}

export interface MedicineSearchResult {
  id: string;
  name: string;
  genericName?: string;
  slug: string;
  brand?: string;
  image?: string;
}

// Scan history item (summary view)
export interface ScanHistoryItem {
  id: string;
  medicines: MedicineInput[];
  summary: InteractionSummary;
  overallRisk: SafetyRiskLevel;
  healthProfileUsed: boolean;
  createdAt: string;
}

// Full scan result with ID (returned after scanning)
export interface InteractionScanResultWithId extends InteractionScanResult {
  id: string;
}

// Scan history response with pagination
export interface ScanHistoryResponse {
  scans: ScanHistoryItem[];
  pagination: Pagination;
}

export interface DosageCalculation {
  medicineName: string;
  totalDoses: number;
  dosesPerDay: number;
  daysRemaining: number;
  estimatedEndDate: string;
  refillDate?: string; // When to refill (7 days before end)
}

export interface ConfirmDoseResult {
  success: boolean;
  message: string;
  dose?: ScheduledDose;
}

// Lab Report Types
export interface Biomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "abnormal" | "critical";
  normalRange?: string;
  explanation?: string;
  causes?: string[];
  relatedConditions?: string[];
}

export interface ReportSummary {
  totalBiomarkers: number;
  normalCount: number;
  abnormalCount: number;
  criticalCount: number;
  overallStatus: "normal" | "abnormal" | "critical";
  keyFindings: string[];
}

export interface CriticalAlert {
  biomarker: string;
  value: string;
  normalRange: string;
  severity: "critical" | "high";
  message: string;
  recommendation: string;
}

export interface LabReport {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  biomarkers: Biomarker[];
  summary: ReportSummary;
  analysis?: string;
  overallStatus: string;
  criticalAlerts?: CriticalAlert[];
  flaggedConditions?: string[];
  flaggedMedications?: string[];
  personalizedRecommendations?: string;
  testDate?: string;
  labName?: string;
  uploadedAt: string;
  analyzedAt?: string;
  isSharedWithDoctor: boolean;
  doctorEmail?: string;
}

export interface LabReportsResponse {
  reports: LabReport[];
  pagination: Pagination;
}

export interface TrendDataPoint {
  date: string;
  value: string;
  unit: string;
  status: "normal" | "abnormal" | "critical";
  normalRange?: string;
}
