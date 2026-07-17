import client from "../api/client";
import {
  RegisterRequest,
  LoginRequest,
  CreateShortLinkRequest,
  UpdateShortLinkRequest,
  AuthResponse,
  ApiResponse,
  Page,
  ShortLinkResponse,
  DashboardResponse,
  AnalyticsResponse,
  User
} from "../types";

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await client.post<ApiResponse<AuthResponse>>("/auth/register", data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await client.post<ApiResponse<AuthResponse>>("/auth/login", data);
    return response.data;
  }
};

export const linkService = {
  async createShortLink(data: CreateShortLinkRequest): Promise<ApiResponse<ShortLinkResponse>> {
    const response = await client.post<ApiResponse<ShortLinkResponse>>("/links", data);
    return response.data;
  },

  async getMyLinks(
    page = 0,
    size = 5,
    sortBy = "id",
    direction = "asc",
    search = ""
  ): Promise<ApiResponse<Page<ShortLinkResponse>>> {
    const response = await client.get<ApiResponse<Page<ShortLinkResponse>>>("/links/my", {
      params: {
        page,
        size,
        sortBy,
        direction,
        search
      }
    });
    return response.data;
  },

  async updateLink(id: number, data: UpdateShortLinkRequest): Promise<ApiResponse<ShortLinkResponse>> {
    const response = await client.put<ApiResponse<ShortLinkResponse>>(`/links/${id}`, data);
    return response.data;
  },

  async deleteLink(id: number): Promise<void> {
    await client.delete(`/links/${id}`);
  }
};

export const dashboardService = {
  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    const response = await client.get<ApiResponse<DashboardResponse>>("/dashboard");
    return response.data;
  }
};

export const analyticsService = {
  async getAnalytics(id: number): Promise<ApiResponse<AnalyticsResponse>> {
    const response = await client.get<ApiResponse<AnalyticsResponse>>(`/links/${id}/analytics`);
    return response.data;
  }
};

export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await client.get<ApiResponse<User>>("/users/me");
    return response.data;
  }
};
