import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { userRepository } from "../repositories/user.repository";

class UserMiddleware {
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

export const userMiddleware = new UserMiddleware();
