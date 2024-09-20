import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.schemaForCreateUser),
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(UserValidator.schemaForLoginUser),
  authController.signIn,
);

router.post(
  "/refresh",
  // authMiddleware.checkRefreshToken,
  authMiddleware.checkToken(TokenTypeEnum.REFRESH),
  authController.refresh,
);

export const authRouter = router;
