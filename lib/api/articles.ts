import { apiClient } from "../api-config";
import type { ApiResponse, Article, ArticlesResponse } from "../types";

/**
 * Get all articles with pagination
 */
export async function getAllArticles(
  page = 1,
  limit = 10
): Promise<ArticlesResponse> {
  const response = await apiClient.get<ApiResponse<ArticlesResponse>>(
    "/api/articles",
    {
      params: { page, limit },
    }
  );
  return response.data.data;
}

/**
 * Search articles by query
 */
export async function searchArticles(
  query: string,
  page = 1,
  limit = 10
): Promise<ArticlesResponse> {
  const response = await apiClient.get<ApiResponse<ArticlesResponse>>(
    "/api/articles/search",
    {
      params: { q: query, page, limit },
    }
  );
  return response.data.data;
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  category: string,
  page = 1,
  limit = 10
): Promise<ArticlesResponse> {
  const response = await apiClient.get<ApiResponse<ArticlesResponse>>(
    `/api/articles/category/${category}`,
    {
      params: { page, limit },
    }
  );
  return response.data.data;
}

/**
 * Get single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article> {
  const response = await apiClient.get<ApiResponse<Article>>(
    `/api/articles/${slug}`
  );
  return response.data.data;
}

/**
 * Get single article by ID
 */
export async function getArticleById(id: string): Promise<Article> {
  const response = await apiClient.get<ApiResponse<Article>>(
    `/api/articles/${id}`
  );
  return response.data.data;
}
