import type {
  AuthProvider,
  UserEntity,
} from "../../domain/entities/user.entity";
import { UserDtoLocalResponse } from "../dtos/user.local.dto";
import type { User } from "firebase/auth";

export class UserModel implements UserEntity {
  constructor(
    public email: string,
    public id?: string,
    public nombre?: string,
    public fotoUrl?: string,
    public proveedor?: AuthProvider,
  ) {}

  static fromLocalDTO(dto: UserDtoLocalResponse): UserModel {
    return new UserModel(dto.email, dto.id, dto.nombre, undefined, "password");
  }

  static fromEntity(entity: UserEntity): UserModel {
    return new UserModel(
      entity.email,
      entity.id,
      entity.nombre,
      entity.fotoUrl,
      entity.proveedor,
    );
  }

  static fromFirebaseUser(user: User): UserModel {
    const provider: AuthProvider = user.providerData.some(
      ({ providerId }) => providerId === "google.com",
    )
      ? "google"
      : "password";

    return new UserModel(
      user.email ?? "",
      user.uid,
      user.displayName ?? undefined,
      user.photoURL ?? undefined,
      provider,
    );
  }
}
