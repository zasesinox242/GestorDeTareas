import type { UserEntity } from "../../domain/entities/user.entity";
import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { GoogleLoginResult } from "../../domain/types/google-login-result.type";
import { AuthLocalDataSource } from "../data-sources/local/auth.local.ds";
import type { GoogleAuthRemoteDataSource } from "../data-sources/remote/google-auth.remote.ds";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly authDataSource: AuthLocalDataSource,
    private readonly googleAuthDataSource: GoogleAuthRemoteDataSource,
  ) {}

  async login(email: string, password: string): Promise<UserEntity> {
    return this.authDataSource.login(email, password);
  }

  async loginWithGoogle(): Promise<GoogleLoginResult> {
    const user = await this.googleAuthDataSource.signIn();
    return user
      ? { status: "authenticated", user }
      : { status: "cancelled" };
  }

  async register(email: string, password: string, nombre?: string): Promise<UserEntity> {
    return this.authDataSource.register(email, password, nombre);
  }

  async logout(): Promise<void> {
    await this.authDataSource.logout();
    await this.googleAuthDataSource.signOut().catch(() => undefined);
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    return this.authDataSource.getCurrentUser();
  }
}
