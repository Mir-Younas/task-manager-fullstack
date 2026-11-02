import { axiosInstance } from "../config/axios";

import type {
  ApiResponse,
  ForgotPasswordInput,
  LoginInput,
  LoginResponse,
  MeResponse,
  ResendVerificationInput,
  ResetPasswordInput,
  SignupInput,
  SignupResponse,
  VerifyEmailInput,
} from "../types/auth.types";

export const authService = {
  signup: async (data: SignupInput): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>(
      "/api/auth/signup",
      data,
    );

    return response.data;
  },

  login: async (data: LoginInput): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/api/auth/login",
      data,
    );

    return response.data;
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await axiosInstance.get<MeResponse>("/api/auth/me");

    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>("/api/auth/logout");

    return response.data;
  },

  verifyEmail: async (data: VerifyEmailInput): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(
      "/api/auth/verify-email",
      data,
    );

    return response.data;
  },

  resendVerification: async (
    data: ResendVerificationInput,
  ): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(
      "/api/auth/resend-verification",
      data,
    );

    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordInput): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(
      "/api/auth/forgot-password",
      data,
    );

    return response.data;
  },

  resetPassword: async (data: ResetPasswordInput): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(
      "/api/auth/reset-password",
      data,
    );

    return response.data;
  },

  googleLogin: (): void => {
    window.location.assign(
      new URL("/api/auth/google", import.meta.env.VITE_API_BASE_URL).toString(),
    );
  },
};
