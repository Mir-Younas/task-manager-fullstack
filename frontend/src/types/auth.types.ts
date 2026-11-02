export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface SignupResponse extends ApiResponse {
  emailSent: boolean;
  data: Pick<AuthUser, "id" | "name" | "email">;
}

export interface LoginResponse extends ApiResponse {
  user: AuthUser;
}

export interface MeResponse {
  success: boolean;
  user: AuthUser;
}
