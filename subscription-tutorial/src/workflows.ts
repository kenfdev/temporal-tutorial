import * as wf from '@temporalio/workflow';
import type * as activities from './activities';

const acts = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const cancelSubscription = wf.defineSignal('cancelSignal');

export async function subscriptionWorkflow(email: string, trialPeriod: string | number): Promise<void> {
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true));

  await acts.sendWelcomeEmail(email);
  if (await wf.condition(() => isCanceled, trialPeriod)) {
    await acts.sendCancellationEmailDuringTrialPeriod(email);
  } else {
    await acts.sendSubscriptionOverEmail(email);
  }
}
