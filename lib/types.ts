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

// User Medicine Adherence Types
export type DoseStatus = "pending" | "taken" | "missed";

export interface UserMedicine {
  id: string;
  userId: string;
  name: string;
  doctorName: string | null;
  duration: number;
  isLifetime: boolean;
  intakeTimes: string[];
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoseSchedule {
  id: string;
  userMedicineId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: DoseStatus;
  takenAt: string | null;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  medicine?: UserMedicine;
}

export interface Reminder {
  id: string;
  medicineName: string;
  scheduledTime: string;
  scheduledDate: string;
  status: DoseStatus;
  takenAt: string | null;
}

export interface SummaryReport {
  totalMedicines: number;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  pendingDoses: number;
  adherenceRate: number;
  dailyBreakdown: {
    date: string;
    total: number;
    taken: number;
    missed: number;
    pending: number;
  }[];
  medicineBreakdown: {
    medicineId: string;
    medicineName: string;
    total: number;
    taken: number;
    missed: number;
    adherenceRate: number;
  }[];
}

// ─── Stress & Wellness Module ──────────────────────────────────────────────

export type MoodLevel = "very_bad" | "bad" | "neutral" | "good" | "very_good";
export type StressLevel = "low" | "moderate" | "high" | "severe";
export type ScreeningType = "phq9" | "gad7";
export type ScreeningSeverity = "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
export type MeditationType = "guided_meditation" | "breathing" | "relaxation" | "stress_relief";
export type ResourceCategory = "mental_health" | "stress_management" | "self_care" | "healthy_lifestyle";

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodLevel;
  note: string | null;
  date: string;
  createdAt: string;
}

export interface MoodTrend {
  entries: MoodEntry[];
  averageMood: number;
  trend: "improving" | "declining" | "stable";
  weeklySummary: { date: string; averageMood: number }[];
  monthlySummary: { week: string; averageMood: number }[];
}

export interface StressAssessment {
  id: string;
  userId: string;
  score: number;
  level: StressLevel;
  answers: { question: string; answer: number }[];
  date: string;
  createdAt: string;
}

export interface StressTrend {
  assessments: StressAssessment[];
  averageScore: number;
  currentLevel: StressLevel;
  weeklySummary: { date: string; averageScore: number }[];
  monthlySummary: { week: string; averageScore: number }[];
}

export interface AnxietyScreening {
  id: string;
  userId: string;
  testType: ScreeningType;
  score: number;
  severity: ScreeningSeverity;
  answers: { question: string; answer: number }[];
  recommendation: string | null;
  aiGeneratedSuggestion: string | null;
  createdAt: string;
}

export interface WellnessJournalEntry {
  id: string;
  userId: string | null;
  title: string | null;
  content: string;
  isAnonymous: boolean;
  sentiment: SentimentAnalysis | null;
  analyzedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SentimentAnalysis {
  overallSentiment: "positive" | "negative" | "neutral" | "mixed";
  score: number;
  emotions: { emotion: string; intensity: number }[];
  stressIndicators: string[];
  anxietyIndicators: string[];
  recommendations: string[];
}

export interface MeditationSession {
  id: string;
  userId: string;
  type: MeditationType;
  duration: number;
  title: string;
  description: string | null;
  audioUrl: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  typeBreakdown: Record<string, number>;
}

export interface WellnessResource {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  author: string | null;
  readTime: number | null;
  tags: string[] | null;
  sourceLink: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessResourcesResponse {
  resources: WellnessResource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WellnessSummary {
  moodEntriesThisWeek: number;
  stressAssessmentsThisWeek: number;
  lastScreening: AnxietyScreening | null;
  communityPostsThisMonth: number;
  meditationSessionsThisWeek: number;
}

// ─── Anonymous Community ───────────────────────────────────────────────────

export type PostCategory = "stress" | "anxiety" | "studies" | "work_pressure" | "general";
export type PostReaction = "supportive" | "empathetic" | "grateful" | "hopeful" | "thoughtful" | "encouraging";

export interface CommunityPost {
  id: string;
  userId: string | null;
  title: string | null;
  content: string;
  category: PostCategory;
  isAnonymous: boolean;
  reactionCount: number;
  commentCount: number;
  userReaction: PostReaction | null;
  comments?: CommunityComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string | null;
  parentId: string | null;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  replies?: CommunityComment[];
}

export interface CommunityPostsResponse {
  posts: CommunityPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
  myPosts: number;
  categoryBreakdown: Record<string, number>;
}

// ─── Chronic Disease Management ──────────────────────────────────────────────

export type ChronicCondition = "Diabetes" | "Hypertension" | "Asthma" | "Obesity" | "Heart Disease" | "Arthritis";

export interface PatientCondition {
  id: string;
  userId: string;
  condition: ChronicCondition;
  diagnosedAt: string | null;
  severity: string | null;
  notes: string | null;
  createdAt: string;
}

export interface DailyHealthLog {
  id: string;
  logDate: string;
  symptoms: string[];
  painLevel: number | null;
  painLocation: string[] | null;
  mobilityIssues: string[] | null;
  fatigueLevel: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  bloodSugar: number | null;
  heartRate: number | null;
  oxygenLevel: number | null;
  weight: number | null;
  temperature: number | null;
  medicationTaken: any;
  notes: string | null;
  condition?: { id: string; condition: string } | null;
  alerts?: HealthAlert[];
  createdAt: string;
}

export interface HealthAlert {
  id: string;
  type: string;
  severity: string;
  metric: string;
  value: string;
  threshold: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface HealthReport {
  id: string;
  title: string;
  dateRange: { from: string; to: string };
  data: any;
  pdfUrl: string | null;
  createdAt: string;
}

export interface ChronicDashboard {
  conditions: Array<{
    id: string;
    condition: string;
    severity: string | null;
    diagnosedAt: string | null;
    logCount: number;
    lastLog: string | null;
  }>;
  recentLogs: DailyHealthLog[];
  alerts: HealthAlert[];
  stats: {
    totalLogs: number;
    totalAlerts: number;
    activeConditions: number;
    thisWeekLogs: number;
  };
}

export interface TrendData {
  dates: string[];
  values: number[];
  metric: string;
  unit: string;
}

export interface HealthPrediction {
  type: "trend_warning" | "abnormal_pattern" | "improvement";
  severity: "info" | "warning" | "critical";
  metric: string;
  message: string;
  trend: "increasing" | "decreasing" | "stable";
  percentageChange: number;
  consecutiveDays: number;
  currentValue: string;
  recommendation: string;
}
