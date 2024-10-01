import { IOldPassword } from "../interfaces/old-password.interface";
import { OldPassword } from "../models/old-password.model";

class OldPasswordRepository {
  public async create(dto: Partial<IOldPassword>): Promise<void> {
    await OldPassword.create(dto);
  }

  public async getManyByUserId(_userId: string): Promise<IOldPassword[]> {
    return await OldPassword.find({ _userId });
  }

  public async deleteBeforeDate(date: Date): Promise<number> {
    const { deletedCount } = await OldPassword.deleteMany({
      createdAt: { $lt: date },
    });
    return deletedCount;
  }
}

export const oldPasswordRepository = new OldPasswordRepository();
