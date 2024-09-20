import { Router } from "express";

import { userController } from "../controllers/user.contoller";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getList);

router.get(
  "/me",
  // authMiddleware.checkAccessToken,
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  userController.getMe,
);

router.put(
  "/me",
  // authMiddleware.checkAccessToken,
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  commonMiddleware.isBodyValid(UserValidator.schemaFoUpdateUser),
  userController.updateMe,
);

router.delete(
  "/me",
  // authMiddleware.checkAccessToken,
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  userController.deleteMe,
);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.isUserExistById,
  userController.getById,
);

export const userRouter = router;
