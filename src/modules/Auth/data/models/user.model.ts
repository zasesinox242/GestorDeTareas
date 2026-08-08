import { UserEntity } from "../../domain/entities/user.entity";
import { UserDtoLocalResponse } from "../dtos/user.local.dto";

export class UserModel implements UserEntity {
  constructor(
    public email: string,
    public id?: string,
    public nombre?: string,
  ) {}

  static fromLocalDTO(dto: UserDtoLocalResponse): UserModel {
    return new UserModel(dto.email, dto.id, dto.nombre);
  }

  static fromEntity(entity: UserEntity): UserModel {
    return new UserModel(entity.email, entity.id, entity.nombre);
  }
}
