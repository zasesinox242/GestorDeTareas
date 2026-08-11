import type { UserEntity } from "../entities/user.entity";

export type GoogleLoginResult =
  | { status: "authenticated"; user: UserEntity }
  | { status: "cancelled" };
