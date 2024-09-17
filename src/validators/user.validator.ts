import Joi from "joi";

import { IUser } from "../interfaces/user.interface";

export class UserValidator {
  public static schemaForCreateUser: Joi.ObjectSchema<Partial<IUser>> =
    Joi.object({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string()
        .regex(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
        .lowercase()
        .trim()
        .required(),
      phone: Joi.string(),
      password: Joi.string()
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{5,}$/,
        )
        .trim()
        .required(),
      age: Joi.number().min(12).max(100),
    });

  public static schemaFoUpdateUser: Joi.ObjectSchema<Partial<IUser>> =
    Joi.object({
      name: Joi.string().min(3).max(20),
      phone: Joi.string().trim(),
      age: Joi.number().min(12).max(100),
    });
}
