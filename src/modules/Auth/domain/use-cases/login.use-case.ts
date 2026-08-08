import { UserEntity } from "../entities/user.entity";
import { AuthRepository } from "../repositories/auth.repository";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<UserEntity> {
    return this.authRepository.login(email, password);
  }
}
