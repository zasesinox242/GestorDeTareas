import { AuthFirebaseDataSourceImpl } from "../data/data-sources/remote/auth.firebase.ds";
import { AuthRepositoryImpl } from "../data/repositories/auth.repository.impl";
import { LoginUseCase } from "../domain/use-cases/login.use-case";
import { RegisterUseCase } from "../domain/use-cases/register.use-case";
import { LogoutUseCase } from "../domain/use-cases/logout.use-case";

// Data sources
const authDataSource = new AuthFirebaseDataSourceImpl();

// Repositories
const authRepository = new AuthRepositoryImpl(authDataSource);

// Use Cases
export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export { authRepository };
