import { UserEntity } from "../entities/user.entity";
import { AuthRepository } from "../repositories/auth.repository";

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string, nombre?: string): Promise<UserEntity> {
    return this.authRepository.register(email, password, nombre);
  }
}
