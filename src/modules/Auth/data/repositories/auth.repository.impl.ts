import { UserEntity } from "../../domain/entities/user.entity";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { AuthLocalDataSource } from "../data-sources/local/auth.local.ds";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authLocalDataSource: AuthLocalDataSource) {}

  async login(email: string, password: string): Promise<UserEntity> {
    return this.authLocalDataSource.login(email, password);
  }

  async register(email: string, password: string, nombre?: string): Promise<UserEntity> {
    return this.authLocalDataSource.register(email, password, nombre);
  }

  async logout(): Promise<void> {
    return this.authLocalDataSource.logout();
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    return this.authLocalDataSource.getCurrentUser();
  }
}
