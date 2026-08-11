import type { UserEntity } from "../entities/user.entity";
import type { GoogleLoginResult } from "../types/google-login-result.type";

export interface AuthRepository {
  login: (email: string, password: string) => Promise<UserEntity>;
  loginWithGoogle: () => Promise<GoogleLoginResult>;
  register: (email: string, password: string, nombre?: string) => Promise<UserEntity>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<UserEntity | null>;
}
