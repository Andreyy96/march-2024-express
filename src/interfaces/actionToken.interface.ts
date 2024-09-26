import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { RoleEnum } from "../enums/role.enum";

export interface IActionToken {
  _id?: string;
  token: string;
  type: ActionTokenTypeEnum;
  _userId: string;
}

export interface IActionTokenPayload {
  userId: string;
  role: RoleEnum;
}
