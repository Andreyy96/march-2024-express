import { RoleEnum } from "../enums/role.enum";

export interface IToken {
  _id?: string;
  accessToken: string;
  refreshToken: string;
  _userId: string;
  deviceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  userId: string;
  deviceId: string;
  role: RoleEnum;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
