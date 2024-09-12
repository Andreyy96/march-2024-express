import { IUser } from "../interfaces/user.interface";
import { reader, writer } from "../services/db.service";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await reader();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    const users = await reader();

    const newUser = {
      id: users.length ? users[users.length - 1]?.id + 1 : 1,
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
    users.push(newUser);
    await writer(users);

    return newUser;
  }

  public async getById(userId: number): Promise<IUser | null> {
    const users = await reader();
    return users.find((user) => user.id === userId);
  }

  public async updateById(userId: number, dto: Partial<IUser>): Promise<IUser> {
    const users = await reader();
    const regEmail = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    const regPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{5,}$/;

    const userIndex = users.findIndex((user) => user.id === userId);

    const { name, email, password } = dto;
    const user = users.find((user) => user.email === email);

    if (name.length >= 3) {
      users[userIndex].name = dto.name;
    }

    if (regEmail.test(email) && !user) {
      users[userIndex].email = email;
    }

    if (regPassword.test(password)) {
      users[userIndex].password = password;
    }

    await writer(users);

    return users[userIndex];
  }

  public async deleteById(userId: number): Promise<void> {
    const users = await reader();

    const userIndex = users.findIndex((user) => user.id === userId);

    users.splice(userIndex, 1);
    await writer(users);
  }
}

export const userRepository = new UserRepository();
