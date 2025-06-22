export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  searchTerm?: string;
}

export interface ProductSortOptions {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
}

// Authentication types
export interface User {
  id: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TwoFactorVerification {
  code: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loginStep: 'credentials' | 'twoFactor' | 'completed';
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
  code?: string;
}