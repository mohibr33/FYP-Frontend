import { apiClient } from "../api-config";
import type { ApiResponse } from "../types";

export interface RegisteredUser {
  userId: string;
  email: string;
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<RegisteredUser> {
  const response = await apiClient.post<ApiResponse<RegisteredUser>>(
    "/api/users/register",
    data
  );
  return response.data.data;
}

export async function verifyOtp(data: {
  email: string;
  otp: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<ApiResponse<undefined>>(
    "/api/users/verify-otp",
    data
  );
  return {
    success: response.data.success,
    message: response.data.message || "Verified",
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/api/users/login",
    data
  );
  return response.data.data;
}

export async function getProfile(): Promise<AuthUser> {
  const response = await apiClient.get<ApiResponse<any>>("/api/users/profile");
  console.log("getProfile raw response:", response.data);

  // The API returns the user nested in response.data.data.user
  const userData = response.data.data?.user || response.data.data;
  console.log("getProfile userData:", userData);

  // Map the API response to AuthUser format
  return {
    id: userData.id,
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    role: userData.role,
    isVerified: userData.isVerified,
    createdAt: userData.createdAt,
  };
}

export async function requestPasswordReset(data: {
  email: string;
}): Promise<{ message: string }> {
  const response = await apiClient.post<ApiResponse<undefined>>(
    "/api/users/request-password-reset",
    data
  );
  return { message: response.data.message || "OTP sent" };
}

export async function resetPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await apiClient.post<ApiResponse<undefined>>(
    "/api/users/reset-password",
    data
  );
  return { message: response.data.message || "Password reset" };
}
