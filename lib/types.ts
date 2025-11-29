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
  createdAt: string;
  updatedAt: string;
}

export interface MedicinesResponse {
  medicines: Medicine[];
  pagination: Pagination;
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
