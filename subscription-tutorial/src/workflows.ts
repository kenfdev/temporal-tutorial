import { sleep, proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { sendWelcomeEmail, sendSubscriptionOverEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function subscriptionWorkflow(email: string, trialPeriod: string | number): Promise<void> {
  await sendWelcomeEmail(email);
  await sleep(trialPeriod);
  await sendSubscriptionOverEmail(email);
}
