import { apiClient } from "../api-config";
import type {
  ApiResponse,
  MedicalChat,
  ChatsListResponse,
  ChatMessage,
  SendMessageResponse,
  SendVoiceMessageResponse,
  ChatAttachment,
  ChatStatsResponse,
} from "../types";

const MEDICAL_CHAT_BASE = "/api/medical-chat";

/**
 * Create a new medical chat session
 */
export const createChat = async (
  firstMessage?: string
): Promise<ApiResponse<MedicalChat>> => {
  const response = await apiClient.post(MEDICAL_CHAT_BASE, {
    firstMessage,
  });
  return response.data;
};

/**
 * Get all chat sessions for the logged-in user
 */
export const getAllChats = async (params?: {
  page?: number;
  limit?: number;
  status?: "active" | "archived";
}): Promise<ApiResponse<ChatsListResponse>> => {
  const response = await apiClient.get(MEDICAL_CHAT_BASE, { params });
  return response.data;
};

/**
 * Get a specific chat by ID with full message history
 */
export const getChatById = async (
  chatId: string
): Promise<ApiResponse<MedicalChat>> => {
  const response = await apiClient.get(`${MEDICAL_CHAT_BASE}/${chatId}`);
  return response.data;
};

/**
 * Send a text message and receive AI response (with optional file attachments)
 */
export const sendTextMessage = async (
  chatId: string,
  message: string,
  files?: File[]
): Promise<ApiResponse<SendMessageResponse>> => {
  // If files are provided, use FormData
  if (files && files.length > 0) {
    const formData = new FormData();
    formData.append("message", message);
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post(
      `${MEDICAL_CHAT_BASE}/${chatId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Text-only message
  const response = await apiClient.post(
    `${MEDICAL_CHAT_BASE}/${chatId}/messages`,
    { message }
  );
  return response.data;
};

/**
 * Send a voice message with automatic transcription
 */
export const sendVoiceMessage = async (
  chatId: string,
  audioBlob: Blob
): Promise<ApiResponse<SendVoiceMessageResponse>> => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await apiClient.post(
    `${MEDICAL_CHAT_BASE}/${chatId}/voice`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Update chat status (active or archived)
 */
export const updateChatStatus = async (
  chatId: string,
  status: "active" | "archived"
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.patch(
    `${MEDICAL_CHAT_BASE}/${chatId}/status`,
    { status }
  );
  return response.data;
};

/**
 * Delete a chat session permanently
 */
export const deleteChat = async (
  chatId: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`${MEDICAL_CHAT_BASE}/${chatId}`);
  return response.data;
};

/**
 * Get chat statistics for the user
 */
export const getChatStats = async (): Promise<
  ApiResponse<ChatStatsResponse>
> => {
  const response = await apiClient.get(`${MEDICAL_CHAT_BASE}/stats`);
  return response.data;
};
