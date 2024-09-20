import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async getById(userId: string): Promise<IUser> {
    return await userRepository.getById(userId);
  }

  public async updateMe(userId: string, dto: IUser): Promise<IUser> {
    return await userRepository.updateById(userId, dto);
  }

  public async deleteMe(userId: string): Promise<void> {
    await userRepository.deleteById(userId);
    await tokenRepository.deleteByUserId(userId);
  }
}

export const userService = new UserService();
