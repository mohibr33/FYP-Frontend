import { apiClient } from "../api-config";
import type { ApiResponse } from "../types";

export interface Review {
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
    email?: string;
  };
  medicine?: {
    id: string;
    title: string;
    slug: string;
    brand: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating?: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateReviewRequest {
  medicineId: string;
  rating: number;
  message: string;
}

export interface UpdateReviewRequest {
  rating: number;
  message: string;
}

// Create a new review
export const createReview = async (
  data: CreateReviewRequest
): Promise<ApiResponse<Review>> => {
  const response = await apiClient.post("/api/reviews", data);
  return response.data;
};

// Get all published reviews
export const getPublishedReviews = async (params?: {
  page?: number;
  limit?: number;
  medicineId?: string;
}): Promise<ApiResponse<ReviewsResponse>> => {
  const response = await apiClient.get("/api/reviews/published", { params });
  return response.data;
};

// Get reviews for a specific medicine
export const getMedicineReviews = async (
  medicineId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<ApiResponse<ReviewsResponse>> => {
  const response = await apiClient.get(`/api/reviews/medicine/${medicineId}`, {
    params,
  });
  return response.data;
};

// Get my reviews
export const getMyReviews = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ReviewsResponse>> => {
  const response = await apiClient.get("/api/reviews/my/reviews", { params });
  return response.data;
};

// Get review by ID
export const getReviewById = async (
  id: string
): Promise<ApiResponse<Review>> => {
  const response = await apiClient.get(`/api/reviews/${id}`);
  return response.data;
};

// Update a review
export const updateReview = async (
  id: string,
  data: UpdateReviewRequest
): Promise<ApiResponse<Review>> => {
  const response = await apiClient.put(`/api/reviews/${id}`, data);
  return response.data;
};

// Delete a review
export const deleteReview = async (
  id: string
): Promise<ApiResponse<undefined>> => {
  const response = await apiClient.delete(`/api/reviews/${id}`);
  return response.data;
};
