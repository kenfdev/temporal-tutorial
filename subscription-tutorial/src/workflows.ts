import * as wf from '@temporalio/workflow';
import type * as activities from './activities';
import { Customer } from './types';

const acts = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const cancelSubscription = wf.defineSignal('cancelSignal');

export async function subscriptionWorkflow(customer: Customer): Promise<void> {
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true));

  await acts.sendWelcomeEmail(customer);
  if (await wf.condition(() => isCanceled, customer.subscription.trialPeriod)) {
    await acts.sendCancellationEmailDuringTrialPeriod(customer);
  } else {
    await billingCycle(customer);
  }
}

async function billingCycle(customer: Customer) {
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true)); // reuse signals
  await acts.chargeCustomerForBillingPeriod(customer);
  for (let num = 0; num < customer.subscription.maxBillingPeriods; num++) {
    // Wait 1 billing period to charge customer or if they cancel subscription
    // whichever comes first
    if (await wf.condition(() => isCanceled, customer.subscription.billingPeriod)) {
      // If customer cancelled their subscription send notification email
      await acts.sendCancellationEmailDuringActiveSubscription(customer);
      break;
    }

    await acts.chargeCustomerForBillingPeriod(customer);
  }

  // if we get here the subscription period is over
  if (!isCanceled) {
    await acts.sendSubscriptionOverEmail(customer);
  }
}
