import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailPayloadCombined } from "./email-payload-combined.type";
import { PickRequired } from "./pick-required.type";

export type EmailTypeToPayload = {
  [EmailTypeEnum.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombined,
    "frontUrl" | "actionToken"
  >;

  [EmailTypeEnum.FULL_LOGOUT]: PickRequired<EmailPayloadCombined, "name">;

  [EmailTypeEnum.LOGOUT]: PickRequired<
    EmailPayloadCombined,
    "name" | "deviceId"
  >;

  [EmailTypeEnum.OLD_VISIT]: PickRequired<
    EmailPayloadCombined,
    "name" | "frontUrl"
  >;

  [EmailTypeEnum.WELCOME]: PickRequired<
    EmailPayloadCombined,
    "name" | "frontUrl" | "actionToken"
  >;
};
