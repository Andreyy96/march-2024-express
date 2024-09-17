import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";
import { userRepository } from "../repositories/user.repository";

class CommonMiddleware {
  public isIdValid(key: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!isObjectIdOrHexString(req.params[key])) {
          throw new ApiError("Invalid ID", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isBodyValid(schema: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await schema.validateAsync(req.body);
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async isUserExistById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;

      const user = await userRepository.getById(userId);

      if (!user) {
        throw new ApiError("User not found", 404);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
