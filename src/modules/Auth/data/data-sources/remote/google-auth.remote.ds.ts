import Constants, { ExecutionEnvironment } from "expo-constants";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { UserModel } from "../../models/user.model";
import { mapFirebaseAuthError } from "../../errors/firebase-auth.error";
import {
  isGoogleCancellationError,
  mapGoogleSignInError,
} from "../../errors/google-signin.error";

export interface GoogleAuthRemoteDataSource {
  signIn: () => Promise<UserModel | null>;
  signOut: () => Promise<void>;
}

let isGoogleConfigured = false;

const loadGoogleModule = async () => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    throw new Error(
      "El acceso con Google requiere una compilación de desarrollo; no está disponible en Expo Go",
    );
  }

  return import("react-native-nitro-google-signin");
};

export class GoogleAuthRemoteDataSourceImpl implements GoogleAuthRemoteDataSource {
  private configure(
    googleModule: Awaited<ReturnType<typeof loadGoogleModule>>,
  ): void {
    if (isGoogleConfigured) return;

    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();

    if (!webClientId) {
      throw new Error(
        "Falta EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en el archivo .env",
      );
    }

    googleModule.GoogleOneTapSignIn.configure({
      webClientId,
      iosClientId: iosClientId || null,
      offlineAccess: false,
      autoSelectOnSignIn: false,
    });
    isGoogleConfigured = true;
  }

  async signIn(): Promise<UserModel | null> {
    try {
      const googleModule = await loadGoogleModule();
      this.configure(googleModule);

      await googleModule.GoogleOneTapSignIn.checkPlayServices();
      let response = await googleModule.GoogleOneTapSignIn.signIn();

      if (googleModule.isNoSavedCredentialFoundResponse(response)) {
        response = await googleModule.GoogleOneTapSignIn.createAccount();
      }

      if (googleModule.isNoSavedCredentialFoundResponse(response)) {
        response = await googleModule.GoogleOneTapSignIn.presentExplicitSignIn();
      }

      if (googleModule.isCancelledResponse(response)) return null;

      if (!googleModule.isSuccessResponse(response)) {
        throw new Error("Google no devolvió una credencial válida");
      }

      const firebaseCredential = GoogleAuthProvider.credential(
        response.data.idToken,
      );
      const result = await signInWithCredential(auth, firebaseCredential);
      return UserModel.fromFirebaseUser(result.user);
    } catch (error) {
      if (isGoogleCancellationError(error)) return null;
      if (error instanceof FirebaseError) {
        throw mapFirebaseAuthError(
          error,
          "No se pudo iniciar sesión con Google",
        );
      }
      throw mapGoogleSignInError(error);
    }
  }

  async signOut(): Promise<void> {
    if (
      Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
      !process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim()
    ) {
      return;
    }

    const googleModule = await loadGoogleModule();
    this.configure(googleModule);
    await googleModule.GoogleOneTapSignIn.signOut();
  }
}
