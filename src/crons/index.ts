import { removeOldPasswordCronJob } from "./remove-old-password.cron";
import { removeOldTokensCronJob } from "./remove-old-token.cron";
import { sendEmailCronJob } from "./send-email-old-visiters.cron";

export const cronRunner = () => {
  removeOldTokensCronJob.start();
  removeOldPasswordCronJob.start();
  sendEmailCronJob.start();
};
