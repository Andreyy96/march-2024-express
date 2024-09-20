import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }

  public async findByParams(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }
  public async deleteByUserId(_userId: string): Promise<void> {
    await Token.findOneAndDelete({ _userId });
  }
}

export const tokenRepository = new TokenRepository();
