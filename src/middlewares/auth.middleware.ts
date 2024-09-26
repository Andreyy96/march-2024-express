import { NextFunction, Request, Response } from "express";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IActionTokenPayload } from "../interfaces/actionToken.interface";
import { IToken } from "../interfaces/token.interface";
import { IResetPasswordSet } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
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

  public checkActionToken(type: ActionTokenTypeEnum) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req.body as IResetPasswordSet | { token: string };

        if (!token) {
          throw new ApiError("Token is not provided", 401);
        }
        let payload: IActionTokenPayload;

        switch (type) {
          case ActionTokenTypeEnum.FORGOT_PASSWORD:
            payload = tokenService.verifyActionToken(
              token,
              ActionTokenTypeEnum.FORGOT_PASSWORD,
            );
            break;
          case ActionTokenTypeEnum.VERIFY:
            payload = tokenService.verifyActionToken(
              token,
              ActionTokenTypeEnum.VERIFY,
            );
            break;
        }

        const tokenEntity = await actionTokenRepository.getByToken(token);

        if (!tokenEntity) {
          throw new ApiError("Token is not valid", 401);
        }

        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
