import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { fileConstants } from "../constants/file.constants";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api-error";

class FileMiddleware {
  public isFileValid(type: FileItemTypeEnum) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const avatar = req.files?.avatar as UploadedFile;
        let size: number;
        let mimetypes: string[];

        switch (type) {
          case FileItemTypeEnum.USER:
            size = fileConstants.AVATAR_MAX_SIZE;
            mimetypes = fileConstants.AVATAR_MIMETYPE;
            break;
        }

        if (!avatar) {
          throw new ApiError("Empty file", 400);
        }

        if (Array.isArray(avatar) && FileItemTypeEnum.USER) {
          throw new ApiError("Single file", 400);
        }

        if (!mimetypes.includes(avatar.mimetype)) {
          throw new ApiError("Invalid file format", 400);
        }
        if (avatar.size > size) {
          throw new ApiError("File is too large", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const fileMiddleware = new FileMiddleware();
