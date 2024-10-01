import { configs } from "../config/configs";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
  ISignIn,
  ISignUp,
  IUser,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: ISignUp,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await this.isEmailExistOrThrow(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      name: dto.name,
      age: dto.age,
      phone: dto.phone,
      email: dto.email,
      password,
    });

    const tokens = tokenService.generateTokens({
      userId: user._id,
      deviceId: dto.deviceId,
      role: user.role,
    });

    await tokenRepository.create({
      ...tokens,
      deviceId: dto.deviceId,
      _userId: user._id,
    });

    const actionToken = tokenService.generateActionTokens(
      { userId: user._id, deviceId: dto.deviceId, role: user.role },
      ActionTokenTypeEnum.VERIFY,
    );

    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.VERIFY,
      _userId: user._id,
      token: actionToken,
    });

    await emailService.sendMail(EmailTypeEnum.WELCOME, user.email, {
      name: user.name,
      frontUrl: configs.FRONT_URL,
      actionToken,
    });

    return { user, tokens };
  }

  public async signIn(
    dto: ISignIn,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    await tokenRepository.deleteByParams({
      _userId: user._id,
      deviceId: dto.deviceId,
    });

    const tokens = tokenService.generateTokens({
      userId: user._id,
      deviceId: dto.deviceId,
      role: user.role,
    });
    await tokenRepository.create({
      ...tokens,
      deviceId: dto.deviceId,
      _userId: user._id,
    });
    return { user, tokens };
  }

  public async refresh(
    jwtPayload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: jwtPayload.userId,
      deviceId: jwtPayload.deviceId,
      role: jwtPayload.role,
    });
    await tokenRepository.create({
      ...tokens,
      deviceId: jwtPayload.deviceId,
      _userId: jwtPayload.userId,
    });
    return tokens;
  }

  public async logOut(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);

    await tokenRepository.deleteByParams({
      _userId: jwtPayload.userId,
      deviceId: jwtPayload.deviceId,
    });

    await emailService.sendMail(EmailTypeEnum.LOGOUT, user.email, {
      name: user.name,
      deviceId: jwtPayload.deviceId,
    });
  }

  public async fullLogOut(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);

    await tokenRepository.deleteManyByUserId(jwtPayload.userId);

    await emailService.sendMail(EmailTypeEnum.FULL_LOGOUT, user.email, {
      name: user.name,
    });
  }

  public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const token = tokenService.generateActionTokens(
      { userId: user._id, deviceId: dto.deviceId, role: user.role },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });

    await emailService.sendMail(EmailTypeEnum.FORGOT_PASSWORD, user.email, {
      frontUrl: configs.FRONT_URL,
      actionToken: token,
    });
  }

  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hashPassword(dto.password);
    await userRepository.updateById(jwtPayload.userId, { password });

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteManyByUserId(jwtPayload.userId);
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }

  public async verify(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.VERIFY,
    });

    await userRepository.updateById(jwtPayload.userId, { isVerified: true });
  }

  public async changePassword(
    jwtPayload: ITokenPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError("Invalid previous password", 401);
    }

    await passwordService.checkOldPassword(dto.password, user._id);

    const password = await passwordService.hashPassword(dto.password);

    await oldPasswordRepository.create({
      password: user.password,
      _userId: user._id,
    });

    await userRepository.updateById(jwtPayload.userId, { password });
    await tokenRepository.deleteManyByUserId(jwtPayload.userId);
  }
}

export const authService = new AuthService();
