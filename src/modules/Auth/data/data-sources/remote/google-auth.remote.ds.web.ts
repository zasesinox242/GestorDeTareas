import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { UserModel } from "../../models/user.model";
import { mapFirebaseAuthError } from "../../errors/firebase-auth.error";
import type { GoogleAuthRemoteDataSource } from "./google-auth.remote.ds";

export class GoogleAuthRemoteDataSourceImpl implements GoogleAuthRemoteDataSource {
  async signIn(): Promise<UserModel | null> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      return UserModel.fromFirebaseUser(result.user);
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/popup-closed-by-user"
      ) {
        return null;
      }

      throw mapFirebaseAuthError(
        error,
        "No se pudo iniciar sesión con Google",
      );
    }
  }

  async signOut(): Promise<void> {
    // Firebase Auth ya cerró la sesión; el proveedor web no mantiene otra sesión local.
  }
}
