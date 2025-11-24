import { apiClient } from "../api-config";
import type { ApiResponse, Pagination } from "../types";

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
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

export interface TicketsResponse {
  tickets: Ticket[];
  pagination: Pagination;
}

export async function createTicket(data: {
  subject: string;
  description: string;
  category?: string;
}): Promise<Ticket> {
  const response = await apiClient.post<ApiResponse<Ticket>>(
    "/api/tickets",
    data
  );
  return response.data.data;
}

export async function getMyTickets(
  page = 1,
  limit = 10,
  status?: string
): Promise<TicketsResponse> {
  const response = await apiClient.get<ApiResponse<TicketsResponse>>(
    "/api/tickets/my-tickets",
    {
      params: { page, limit, status },
    }
  );
  return response.data.data;
}

export async function getTicketById(id: string): Promise<Ticket> {
  const response = await apiClient.get<ApiResponse<Ticket>>(
    `/api/tickets/${id}`
  );
  return response.data.data;
}
