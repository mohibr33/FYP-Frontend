import { apiClient } from "../api-config";
import type {
  ApiResponse,
  CommunityPost,
  CommunityPostsResponse,
  CommunityComment,
  CommunityStats,
} from "../types";

const BASE = "/api/community/posts";

export const createPost = async (data: {
  title?: string;
  content: string;
  category?: string;
  isAnonymous?: boolean;
}): Promise<ApiResponse<CommunityPost>> => {
  const response = await apiClient.post(BASE, data);
  return response.data;
};

export const getPosts = async (params?: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<CommunityPostsResponse>> => {
  const response = await apiClient.get(BASE, { params });
  return response.data;
};

export const getPostById = async (postId: string): Promise<ApiResponse<CommunityPost>> => {
  const response = await apiClient.get(`${BASE}/${postId}`);
  return response.data;
};

export const deletePost = async (postId: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`${BASE}/${postId}`);
  return response.data;
};

export const getCommunityStats = async (): Promise<ApiResponse<CommunityStats>> => {
  const response = await apiClient.get(`${BASE}/stats`);
  return response.data;
};

export const addComment = async (
  postId: string,
  data: { content: string; isAnonymous?: boolean; parentId?: string }
): Promise<ApiResponse<CommunityComment>> => {
  const response = await apiClient.post(`${BASE}/${postId}/comments`, data);
  return response.data;
};

export const getComments = async (postId: string): Promise<ApiResponse<CommunityComment[]>> => {
  const response = await apiClient.get(`${BASE}/${postId}/comments`);
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`/api/community/comments/${commentId}`);
  return response.data;
};

export const toggleReaction = async (
  postId: string,
  reaction: string
): Promise<ApiResponse<{ reacted: boolean; reaction: string | null }>> => {
  const response = await apiClient.post(`${BASE}/${postId}/reactions`, { reaction });
  return response.data;
};
