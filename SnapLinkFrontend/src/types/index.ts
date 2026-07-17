export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface ShortLink {
  id: number;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
  clickCount: number;
  createdAt: string;
  deleted: boolean;
  deletedAt?: string;
}

export interface ClickAnalytics {
  id: number;
  ipAddress: string;
  browser: string;
  operatingSystem: string;
  device: string;
  referrer?: string;
  clickedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateShortLinkRequest {
  originalUrl: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
}

export interface UpdateShortLinkRequest {
  originalUrl?: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
}

export interface AuthResponse {
  token: string | null;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ShortLinkResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
}

export interface DashboardResponse {
  totalLinks: number;
  activeLinks: number;
  deletedLinks: number;
  totalClicks: number;
  topLinks: ShortLinkResponse[];
}

export interface AnalyticsResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
  deleted: boolean;
}
