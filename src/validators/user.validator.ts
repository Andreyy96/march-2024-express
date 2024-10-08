import Joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { OrderEnum } from "../enums/order.enum";
import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";
import { IUser } from "../interfaces/user.interface";

export class UserValidator {
  public static schemaForCreateUser: Joi.ObjectSchema<Partial<IUser>> =
    Joi.object({
      name: Joi.string().min(3).max(20).trim().required(),
      email: Joi.string()
        .regex(regexConstant.EMAIL)
        .lowercase()
        .trim()
        .required(),
      phone: Joi.string().regex(regexConstant.PHONE),
      password: Joi.string().regex(regexConstant.PASSWORD).trim().required(),
      age: Joi.number().min(12).max(100),
      deviceId: Joi.string().required(),
    });

  public static schemaFoUpdateUser: Joi.ObjectSchema<Partial<IUser>> =
    Joi.object({
      name: Joi.string().min(3).max(20),
      phone: Joi.string().trim(),
      age: Joi.number().min(12).max(100),
    });

  public static schemaForLoginUser: Joi.ObjectSchema<Partial<IUser>> =
    Joi.object({
      email: Joi.string()
        .regex(regexConstant.EMAIL)
        .lowercase()
        .trim()
        .required(),
      password: Joi.string().regex(regexConstant.PASSWORD).trim().required(),
      deviceId: Joi.string().required(),
    });

  public static forgotPassword = Joi.object({
    email: Joi.string()
      .regex(regexConstant.EMAIL)
      .lowercase()
      .trim()
      .required(),
    deviceId: Joi.string().required(),
  });

  public static setForgotPassword = Joi.object({
    password: Joi.string().regex(regexConstant.PASSWORD).trim().required(),
    token: Joi.string().required(),
  });

  public static changePassword = Joi.object({
    oldPassword: Joi.string().regex(regexConstant.PASSWORD).trim().required(),
    password: Joi.string().regex(regexConstant.PASSWORD).trim().required(),
  });

  public static listQuery = Joi.object({
    limit: Joi.number().min(1).max(100).default(10),
    page: Joi.number().min(1).default(1),
    search: Joi.string().trim().lowercase(),
    order: Joi.string()
      .valid(...Object.values(OrderEnum))
      .default(OrderEnum.ASC),
    orderBy: Joi.string().valid(...Object.values(UserListOrderByEnum)),
  });
}
