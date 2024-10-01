import * as bcrypt from "bcrypt";

import { configs } from "../config/configs";
import { ApiError } from "../errors/api-error";
import { oldPasswordRepository } from "../repositories/old-password.repository";

class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +configs.HASH_ROUNDS);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async checkOldPassword(password: string, userId: string): Promise<void> {
    const userOldPasswords =
      await oldPasswordRepository.getManyByUserId(userId);

    for (const userOldPassword of userOldPasswords) {
      const isPasswordExist = await passwordService.comparePassword(
        password,
        userOldPassword.password,
      );

      if (isPasswordExist) {
        throw new ApiError("The password exist", 209);
      }
    }
  }
}

export const passwordService = new PasswordService();
