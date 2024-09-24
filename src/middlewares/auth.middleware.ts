import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IToken } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  // public async checkAccessToken(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const header = req.headers.authorization;
  //     if (!header) {
  //       throw new ApiError("Token is not provided", 401);
  //     }
  //     const accessToken = header.split("Bearer ")[1];
  //     const payload = tokenService.verifyToken(
  //       accessToken,
  //       TokenTypeEnum.ACCESS,
  //     );
  //
  //     const pair = await tokenRepository.findByParams({ accessToken });
  //     if (!pair) {
  //       throw new ApiError("Token is not valid", 401);
  //     }
  //     req.res.locals.jwtPayload = payload;
  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // }
  //
  // public async checkRefreshToken(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const header = req.headers.authorization;
  //     if (!header) {
  //       throw new ApiError("Token is not provided", 401);
  //     }
  //     const refreshToken = header.split("Bearer ")[1];
  //     const payload = tokenService.verifyToken(
  //       refreshToken,
  //       TokenTypeEnum.REFRESH,
  //     );
  //
  //     const pair = await tokenRepository.findByParams({ refreshToken });
  //     if (!pair) {
  //       throw new ApiError("Token is not valid", 401);
  //     }
  //     req.res.locals.jwtPayload = payload;
  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  public checkToken(tokenType: TokenTypeEnum) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const header = req.headers.authorization;

        if (!header) {
          throw new ApiError("Token is not provided", 401);
        }

        const token = header.split("Bearer ")[1];

        const payload = tokenService.verifyToken(token, tokenType);

        let pair: IToken;

        switch (tokenType) {
          case TokenTypeEnum.ACCESS:
            pair = await tokenRepository.findByParams({ accessToken: token });
            break;
          case TokenTypeEnum.REFRESH:
            pair = await tokenRepository.findByParams({ refreshToken: token });
            break;
        }

        if (!pair) {
          throw new ApiError("Token is not valid", 401);
        }

        req.res.locals.jwtPayload = payload;

        if (TokenTypeEnum.REFRESH) {
          req.res.locals.refreshToken = token;
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
