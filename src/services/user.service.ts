import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    const regEmail = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    const regPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{5,}$/;

    if (dto.name.length <= 3) {
      throw new ApiError("name min at 3 characters", 400);
    }

    if (!regEmail.test(dto.email)) {
      throw new ApiError("invalid email", 400);
    }

    if (!regPassword.test(dto.password)) {
      throw new ApiError("invalid password", 400);
    }

    return await userRepository.create(dto);
  }

  public async getUser(userId: number): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async getById(userId: number): Promise<IUser> {
    return await this.getUser(userId);
  }

  public async updateById(userId: number, dto: Partial<IUser>): Promise<IUser> {
    await this.getUser(userId);
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: number): Promise<void> {
    await this.getUser(userId);
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
