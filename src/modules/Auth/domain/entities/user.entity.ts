export type AuthProvider = "password" | "google";

export interface UserEntity {
  id?: string;
  email: string;
  nombre?: string;
  fotoUrl?: string;
  proveedor?: AuthProvider;
}
