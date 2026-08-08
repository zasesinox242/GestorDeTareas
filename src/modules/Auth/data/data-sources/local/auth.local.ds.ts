import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDtoLocalResponse } from "../../dtos/user.local.dto";
import { UserModel } from "../../models/user.model";

/**
 * Implementación TEMPORAL mientras no se integra Firebase Authentication.
 * Guarda usuarios y la sesión activa en AsyncStorage (solo en el dispositivo).
 *
 * TODO (integración Firebase - ver rúbrica "Integración con Firebase"):
 *   Reemplazar el contenido de estos métodos por llamadas a
 *   `signInWithEmailAndPassword` / `createUserWithEmailAndPassword` /
 *   `signOut` / `onAuthStateChanged` de Firebase Auth (ver patrón usado
 *   en el repo de referencia del profesor, rama feature/integration-firebase,
 *   archivo src/modules/Auth/data/data-sources/remote/auth.remote.ds.ts).
 *   La interfaz pública (AuthLocalDataSource) NO debería cambiar, para que
 *   el resto de capas (repository, use-cases, presentation) no se toquen.
 */
const USERS_KEY = "@auth/users";
const SESSION_KEY = "@auth/session";

export interface AuthLocalDataSource {
  login: (email: string, password: string) => Promise<UserModel>;
  register: (email: string, password: string, nombre?: string) => Promise<UserModel>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<UserModel | null>;
}

export class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  private async getUsers(): Promise<UserDtoLocalResponse[]> {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private async saveUsers(users: UserDtoLocalResponse[]): Promise<void> {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async login(email: string, password: string): Promise<UserModel> {
    const users = await this.getUsers();
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      throw new Error("Credenciales incorrectas");
    }

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(found));
    return UserModel.fromLocalDTO(found);
  }

  async register(email: string, password: string, nombre?: string): Promise<UserModel> {
    const users = await this.getUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("Ya existe una cuenta con este correo");
    }

    const newUser: UserDtoLocalResponse = {
      id: Date.now().toString(),
      email,
      password,
      nombre,
    };

    await this.saveUsers([...users, newUser]);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return UserModel.fromLocalDTO(newUser);
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  async getCurrentUser(): Promise<UserModel | null> {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return UserModel.fromLocalDTO(JSON.parse(raw));
  }
}
