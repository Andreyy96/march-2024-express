import fsPromise from "node:fs/promises";
import path from "node:path";

import { IUser } from "../interfaces/user.interface";

const pathToFile = path.join(process.cwd(), "db.json");

export const reader = async (): Promise<IUser[]> => {
  try {
    const data = await fsPromise.readFile(pathToFile, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.log("ERROR", e.message);
  }
};

export const writer = async (users: IUser[]): Promise<void> => {
  try {
    await fsPromise.writeFile(pathToFile, JSON.stringify(users));
  } catch (e) {
    console.log("ERROR", e.message);
  }
};

module.exports = { reader, writer };
