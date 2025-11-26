import { apiClient } from "../api-config";

// ==================== USER MANAGEMENT ====================

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getAllUsers(page = 1, limit = 10) {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminUsersResponse;
  }>(`/api/admin/users?page=${page}&limit=${limit}`);
  return response.data.data;
}

export async function searchUsers(query: string) {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminUsersResponse;
  }>(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
}

export async function getUserById(id: string) {
  const response = await apiClient.get<{ success: boolean; data: AdminUser }>(
    `/api/admin/users/${id}`
  );
  return response.data.data;
}

export async function updateUser(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    role?: string;
    isVerified?: boolean;
  }
) {
  const response = await apiClient.put<{ success: boolean; data: AdminUser }>(
    `/api/admin/users/${id}`,
    data
  );
  return response.data.data;
}

export async function deleteUser(id: string) {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/api/admin/users/${id}`);
  return response.data;
}

// ==================== ARTICLE MANAGEMENT ====================

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  author: string;
  imageUrl?: string;
  readTime?: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AdminArticlesResponse {
  articles: AdminArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getAllArticles(page = 1, limit = 10) {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminArticlesResponse;
  }>(`/api/articles?page=${page}&limit=${limit}`);
  return response.data.data;
}

export async function searchArticles(query: string, page = 1, limit = 10) {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminArticlesResponse;
  }>(
    `/api/articles/search?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );
  return response.data.data;
}

export async function createArticle(data: {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  author: string;
  imageUrl?: string;
  readTime?: number;
  tags?: string[];
}) {
  const response = await apiClient.post<{
    success: boolean;
    data: AdminArticle;
  }>(`/api/admin/articles`, data);
  return response.data.data;
}

export async function updateArticle(id: string, data: Partial<AdminArticle>) {
  const response = await apiClient.put<{
    success: boolean;
    data: AdminArticle;
  }>(`/api/admin/articles/${id}`, data);
  return response.data.data;
}

export async function deleteArticle(id: string) {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/api/admin/articles/${id}`);
  return response.data;
}

// ==================== TICKET MANAGEMENT ====================

export interface AdminTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  adminResponse?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResponseTime: string;
}

export async function getAllTickets(
  page = 1,
  limit = 10,
  status?: string,
  priority?: string
) {
  let url = `/api/admin/tickets?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (priority) url += `&priority=${priority}`;

  const response = await apiClient.get<{
    success: boolean;
    data: { tickets: AdminTicket[]; pagination: any };
  }>(url);
  return response.data.data;
}

export async function getTicketStats() {
  const response = await apiClient.get<{ success: boolean; data: TicketStats }>(
    `/api/admin/tickets/stats`
  );
  return response.data.data;
}

export async function resolveTicket(
  id: string,
  data: { resolutionNote: string }
) {
  const response = await apiClient.put<{ success: boolean; data: AdminTicket }>(
    `/api/admin/tickets/${id}/resolve`,
    data
  );
  return response.data.data;
}

export async function deleteTicket(id: string) {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/api/admin/tickets/${id}`);
  return response.data;
}

// ==================== MEDICINE MANAGEMENT ====================

export interface AdminMedicine {
  id: string;
  productId: string;
  slug: string;
  title: string;
  productImage: string;
  brand: string;
  usedFor?: string | null;
  childCategory?: string | null;
  productDetails: {
    howItWorks?: string | null;
    description?: string | null;
    generics?: string | null;
    usedFor?: string | null;
    requiresPrescriptionYesNo?: string;
    indication?: string | null;
    sideEffects?: string | null;
    whenNotToUse?: string | null;
    dosage?: string | null;
    storageYesOrNo?: string | null;
    precautions?: string | null;
    warning1?: string | null;
    warning2?: string | null;
    warning3?: string | null;
    pregnancyCategory?: string | null;
    drugInteractions?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminMedicinesResponse {
  medicines: AdminMedicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getAllMedicines(page = 1, limit = 10) {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminMedicinesResponse;
  }>(`/api/medicines?page=${page}&limit=${limit}`);
  return response.data.data;
}

export async function searchMedicines(query: string, page = 1, limit = 10) {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminMedicinesResponse;
  }>(
    `/api/medicines/search?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );
  return response.data.data;
}

export async function createMedicine(data: {
  title: string;
  brand: string;
  productImage?: string;
  usedFor?: string;
  childCategory?: string;
  productDetails?: {
    description?: string;
    generics?: string;
    requiresPrescriptionYesNo?: string;
    indication?: string;
    sideEffects?: string;
    dosage?: string;
    precautions?: string;
    warning1?: string;
  };
}) {
  const response = await apiClient.post<{
    success: boolean;
    data: AdminMedicine;
  }>(`/api/admin/medicines`, data);
  return response.data.data;
}

export async function updateMedicine(id: string, data: Partial<AdminMedicine>) {
  const response = await apiClient.put<{
    success: boolean;
    data: AdminMedicine;
  }>(`/api/admin/medicines/${id}`, data);
  return response.data.data;
}

export async function deleteMedicine(id: string) {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/api/admin/medicines/${id}`);
  return response.data;
}

// ==================== REVIEW MANAGEMENT ====================

export interface AdminReview {
  id: string;
  userId: string;
  medicineId: string;
  rating: number;
  message: string;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  medicine?: {
    id: string;
    title: string;
    slug: string;
    brand: string;
  };
}

export interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
  averageRating: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export async function getAllReviews(params?: {
  page?: number;
  limit?: number;
  medicineId?: string;
  rating?: number;
  isApproved?: boolean;
  isPublished?: boolean;
  orderBy?: string;
  order?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.medicineId) queryParams.append("medicineId", params.medicineId);
  if (params?.rating) queryParams.append("rating", params.rating.toString());
  if (params?.isApproved !== undefined)
    queryParams.append("isApproved", params.isApproved.toString());
  if (params?.isPublished !== undefined)
    queryParams.append("isPublished", params.isPublished.toString());
  if (params?.orderBy) queryParams.append("orderBy", params.orderBy);
  if (params?.order) queryParams.append("order", params.order);

  const response = await apiClient.get<{
    success: boolean;
    data: { reviews: AdminReview[]; pagination: any };
  }>(`/api/reviews/admin/all?${queryParams.toString()}`);
  return response.data.data;
}

export async function getReviewStats() {
  const response = await apiClient.get<{ success: boolean; data: ReviewStats }>(
    `/api/reviews/admin/stats`
  );
  return response.data.data;
}

export async function approveReview(id: string, isApproved: boolean) {
  const response = await apiClient.patch<{
    success: boolean;
    data: AdminReview;
  }>(`/api/reviews/admin/${id}/approve`, { isApproved });
  return response.data.data;
}

export async function publishReview(id: string, isPublished: boolean) {
  const response = await apiClient.patch<{
    success: boolean;
    data: AdminReview;
  }>(`/api/reviews/admin/${id}/publish`, { isPublished });
  return response.data.data;
}

export async function deleteReview(id: string) {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/api/reviews/admin/${id}`);
  return response.data;
}
