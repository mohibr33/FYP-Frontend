import { apiClient } from "../api-config";
import type {
  ApiResponse,
  Medicine,
  MedicinesResponse,
  BrandsResponse,
  CategoryResponse,
} from "../types";

/**
 * Get all medicines with pagination
 */
export async function getAllMedicines(
  page = 1,
  limit = 20,
  allergies: string[] = []
): Promise<MedicinesResponse> {
  const response = await apiClient.get<ApiResponse<MedicinesResponse>>(
    "/api/medicines",
    {
      params: { 
        page, 
        limit,
        ...(allergies.length > 0 && { allergies: allergies.join(",") })
      },
    }
  );
  return response.data.data;
}

/**
 * Get all medicines with risk evaluation (requires auth)
 */
export async function getAllMedicinesWithRisk(
  page = 1,
  limit = 20
): Promise<MedicinesResponse> {
  const response = await apiClient.get<ApiResponse<MedicinesResponse>>(
    "/api/medicines/with-risk/list",
    {
      params: { page, limit },
    }
  );
  return response.data.data;
}

/**
 * Search medicines by query
 */
export async function searchMedicines(
  query: string,
  page = 1,
  limit = 20,
  allergies: string[] = []
): Promise<MedicinesResponse> {
  const response = await apiClient.get<ApiResponse<MedicinesResponse>>(
    "/api/medicines/search",
    {
      params: { 
        q: query, 
        page, 
        limit,
        ...(allergies.length > 0 && { allergies: allergies.join(",") })
      },
    }
  );
  return response.data.data;
}

/**
 * Search medicines with risk evaluation (requires auth)
 */
export async function searchMedicinesWithRisk(
  query: string,
  page = 1,
  limit = 20
): Promise<MedicinesResponse> {
  const response = await apiClient.get<ApiResponse<MedicinesResponse>>(
    "/api/medicines/with-risk/search",
    {
      params: { q: query, page, limit },
    }
  );
  return response.data.data;
}

/**
 * Get all medicine brands
 */
export async function getMedicineBrands(): Promise<BrandsResponse> {
  const response = await apiClient.get<ApiResponse<BrandsResponse>>(
    "/api/medicines/brands"
  );
  return response.data.data;
}

/**
 * Get medicines by category
 */
export async function getMedicinesByCategory(
  category: string,
  page = 1,
  limit = 20
): Promise<CategoryResponse> {
  const response = await apiClient.get<ApiResponse<CategoryResponse>>(
    `/api/medicines/category/${encodeURIComponent(category)}`,
    {
      params: { page, limit },
    }
  );
  return response.data.data;
}

/**
 * Get medicines by brand
 */
export async function getMedicinesByBrand(
  brand: string,
  page = 1,
  limit = 20
): Promise<CategoryResponse> {
  const response = await apiClient.get<ApiResponse<CategoryResponse>>(
    `/api/medicines/brand/${encodeURIComponent(brand)}`,
    {
      params: { page, limit },
    }
  );
  return response.data.data;
}

/**
 * Get single medicine by slug
 */
export async function getMedicineBySlug(slug: string): Promise<Medicine> {
  const response = await apiClient.get<ApiResponse<Medicine>>(
    `/api/medicines/slug/${slug}`
  );
  return response.data.data;
}

/**
 * Get single medicine by slug with risk evaluation (requires auth)
 */
export async function getMedicineBySlugWithRisk(slug: string): Promise<Medicine> {
  const response = await apiClient.get<ApiResponse<Medicine>>(
    `/api/medicines/with-risk/slug/${slug}`
  );
  return response.data.data;
}
