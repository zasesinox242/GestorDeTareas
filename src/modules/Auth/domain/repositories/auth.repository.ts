import { UserEntity } from "../entities/user.entity";

export interface AuthRepository {
  login: (email: string, password: string) => Promise<UserEntity>;
  register: (email: string, password: string, nombre?: string) => Promise<UserEntity>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<UserEntity | null>;
}
