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
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  readTime: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
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
