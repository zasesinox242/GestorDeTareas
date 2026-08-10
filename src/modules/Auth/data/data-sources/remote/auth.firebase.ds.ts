import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { auth } from "@/config/firebase";
import { AuthLocalDataSource } from "../local/auth.local.ds";
import { mapFirebaseAuthError } from "../../errors/firebase-auth.error";
import { UserModel } from "../../models/user.model";

export class AuthFirebaseDataSourceImpl implements AuthLocalDataSource {
  async login(email: string, password: string): Promise<UserModel> {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      return UserModel.fromFirebaseUser(credential.user);
    } catch (error) {
      throw mapFirebaseAuthError(error, "No se pudo iniciar sesión");
    }
  }

  async register(email: string, password: string, nombre?: string): Promise<UserModel> {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      const displayName = nombre?.trim();

      if (displayName) {
        try {
          await updateProfile(credential.user, { displayName });
        } catch (profileError) {
          try {
            await deleteUser(credential.user);
          } catch {
            await signOut(auth).catch(() => undefined);
            throw new Error(
              "La cuenta fue creada, pero no se pudo guardar el nombre. Inicia sesión para continuar",
            );
          }
          throw profileError;
        }
      }

      return UserModel.fromFirebaseUser(credential.user);
    } catch (error) {
      throw mapFirebaseAuthError(error, "No se pudo crear la cuenta");
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw mapFirebaseAuthError(error, "No se pudo cerrar sesión");
    }
  }

  async getCurrentUser(): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      let unsubscribe: Unsubscribe | undefined;
      const stopListening = () => unsubscribe?.();

      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          stopListening();
          resolve(user ? UserModel.fromFirebaseUser(user) : null);
        },
        (error) => {
          stopListening();
          reject(mapFirebaseAuthError(error, "No se pudo recuperar la sesión"));
        },
      );
    });
  }
}
