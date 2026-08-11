import type { AuthRepository } from "../repositories/auth.repository";
import type { GoogleLoginResult } from "../types/google-login-result.type";

export class LoginWithGoogleUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<GoogleLoginResult> {
    return this.authRepository.loginWithGoogle();
  }
}
