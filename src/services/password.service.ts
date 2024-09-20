import * as bcrypt from "bcrypt";

import { configs } from "../config/configs";

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
}

export const passwordService = new PasswordService();
