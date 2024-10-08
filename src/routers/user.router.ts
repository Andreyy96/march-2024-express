import { Router } from "express";

import { userController } from "../controllers/user.contoller";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getList,
);

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

router.post(
  "/me/avatar",
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  fileMiddleware.isFileValid(FileItemTypeEnum.USER),
  userController.uploadAvatar,
);

router.delete(
  "/me/avatar",
  authMiddleware.checkToken(TokenTypeEnum.ACCESS),
  userController.deleteAvatar,
);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.isUserExistById,
  userController.getById,
);

export const userRouter = router;
