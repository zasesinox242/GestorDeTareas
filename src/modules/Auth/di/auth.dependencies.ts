import { AuthFirebaseDataSourceImpl } from "../data/data-sources/remote/auth.firebase.ds";
import { GoogleAuthRemoteDataSourceImpl } from "../data/data-sources/remote/google-auth.remote.ds";
import { AuthRepositoryImpl } from "../data/repositories/auth.repository.impl";
import { LoginUseCase } from "../domain/use-cases/login.use-case";
import { LoginWithGoogleUseCase } from "../domain/use-cases/loginWithGoogle.use-case";
import { RegisterUseCase } from "../domain/use-cases/register.use-case";
import { LogoutUseCase } from "../domain/use-cases/logout.use-case";

// Data sources
const authDataSource = new AuthFirebaseDataSourceImpl();
const googleAuthDataSource = new GoogleAuthRemoteDataSourceImpl();

// Repositories
const authRepository = new AuthRepositoryImpl(authDataSource, googleAuthDataSource);

// Use Cases
export const loginUseCase = new LoginUseCase(authRepository);
export const loginWithGoogleUseCase = new LoginWithGoogleUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export { authRepository };
