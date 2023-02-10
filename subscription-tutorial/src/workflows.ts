import * as wf from '@temporalio/workflow';
import type * as activities from './activities';
import { Customer } from './types';

const acts = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const cancelSubscription = wf.defineSignal('cancelSignal');

export async function subscriptionWorkflow(customer: Customer, trialPeriod: string | number): Promise<void> {
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true));

  await acts.sendWelcomeEmail(customer);
  if (await wf.condition(() => isCanceled, trialPeriod)) {
    await acts.sendCancellationEmailDuringTrialPeriod(customer);
  } else {
    await acts.sendSubscriptionOverEmail(customer);
  }
}
