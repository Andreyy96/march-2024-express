import Joi from "joi";

import { regexConstant } from "../constants/regex.constant";
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
}
