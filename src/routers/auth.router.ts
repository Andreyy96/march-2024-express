import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
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
  authMiddleware.checkToken(TokenTypeEnum.REFRESH),
  authController.refresh,
);

router.delete(
  "/logout",
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  authController.logOut,
);

router.delete(
  "/full-logout",
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  authController.fullLogOut,
);

router.post(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  authController.forgotPasswordSendEmail,
);

router.put(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.setForgotPassword),
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authController.forgotPasswordSet,
);

router.put(
  "/verify",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY),
  authController.verify,
);

router.post(
  "/change-password",
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authController.changePassword,
);

export const authRouter = router;
