import { CronJob } from "cron";

import { timeHelper } from "../helpers/time.helper";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParams(90, "days");

    const deletedCount = await oldPasswordRepository.deleteBeforeDate(date);

    console.log(`Deleted ${deletedCount} old passwords`);
  } catch (error) {
    console.error(error);
  }
};
export const removeOldPasswordCronJob = new CronJob(
  "59 3 * 1,4,7,10 *",
  handler,
);
// export const removeOldPasswordCronJob = new CronJob("* * * * * *", handler,);
