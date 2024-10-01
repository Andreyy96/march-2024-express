import { RoleEnum } from "../enums/role.enum";
import { IToken } from "./token.interface";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  age: number;
  role: RoleEnum;
  isVerified: boolean;
  isDeleted: boolean;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISignUp {
  name: string;
  email: string;
  password: string;
  age: number;
  phone?: string;
  deviceId: string;
}

export interface ISignIn {
  email: string;
  password: string;
  deviceId: string;
}

export interface IAggregateUser extends IUser {
  tokens: IToken[];
}

export type IResetPasswordSend = Pick<IUser, "email"> & { deviceId: string };

export type IResetPasswordSet = Pick<IUser, "password"> & { token: string };

export type IChangePassword = Pick<IUser, "password"> & { oldPassword: string };

// export type ISignIn = Pick<IUser, "email" | "password">;
