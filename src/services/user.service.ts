import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.create(dto);
  }

  public async getUser(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async getById(userId: string): Promise<IUser> {
    return await this.getUser(userId);
  }

  public async updateById(userId: string, dto: IUser): Promise<IUser> {
    await this.getUser(userId);
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: string): Promise<void> {
    await this.getUser(userId);
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
