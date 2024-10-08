import { FilterQuery, SortOrder } from "mongoose";

import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";
import {
  IAggregateUser,
  IUser,
  IUserListQuery,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    const filterObj: FilterQuery<IUser> = { isDeleted: false };
    const sortObj: { [key: string]: SortOrder } = {};

    if (query.search) {
      filterObj.name = { $regex: query.search, $options: "i" };
      // filterObj.$or = [
      //   { name: { $regex: query.search, $options: "i" } },
      //   { email: { $regex: query.search, $options: "i" } },
      // ];
    }

    if (query.orderBy && query.order) {
      switch (query.orderBy) {
        case UserListOrderByEnum.NAME:
          sortObj.name = query.order;
          break;
        case UserListOrderByEnum.AGE:
          sortObj.age = query.order;
          break;
      }
    }
    const skip = query.limit * (query.page - 1);
    return await Promise.all([
      User.find(filterObj).limit(query.limit).skip(skip).sort(sortObj),
      User.countDocuments(filterObj),
    ]);
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select("+password");
  }

  public async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  public async deleteById(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  public async getOldVisiters(date: Date): Promise<IAggregateUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: "tokens",
          let: { userId: "$_id" },
          as: "tokens",
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
        },
      },
      {
        $match: { tokens: { $size: 0 } },
      },
    ]);
  }
}

export const userRepository = new UserRepository();
