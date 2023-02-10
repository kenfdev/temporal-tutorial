import * as wf from '@temporalio/workflow';
import type * as activities from './activities';

const acts = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function subscriptionWorkflow(email: string, trialPeriod: string | number): Promise<void> {
  await acts.sendWelcomeEmail(email);
  await wf.sleep(trialPeriod);
  await acts.sendSubscriptionOverEmail(email);
}
