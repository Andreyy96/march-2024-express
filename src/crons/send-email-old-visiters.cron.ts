import { CronJob } from "cron";

import { configs } from "../config/configs";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { timeHelper } from "../helpers/time.helper";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParams(10, "days");
    const users = await userRepository.getOldVisiters(date);
    const mapUsers = users.filter((user) => user.tokens.length <= 0);

    for (const user of mapUsers) {
      await emailService.sendMail(EmailTypeEnum.OLD_VISIT, user.email, {
        frontUrl: configs.FRONT_URL,
        name: user.name,
      });
    }
    console.log("send emails");
  } catch (error) {
    console.error(error);
  }
};
export const sendEmailCronJob = new CronJob("* * * 10 * *", handler);
