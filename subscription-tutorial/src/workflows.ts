import * as wf from '@temporalio/workflow';
import type * as activities from './activities';
import { Customer } from './types';

const acts = wf.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const cancelSubscription = wf.defineSignal('cancelSignal');

export async function subscriptionWorkflow(customer: Customer): Promise<string> {
  const customerIdName = querySignalState('CustomerIdName', 'customerid');
  const billingPeriodNumber = querySignalState('BillingPeriodNumber', 0);
  const billingPeriodChargeAmount = querySignalState(
    'BillingPeriodChargeAmount',
    customer.subscription.initialBillingPeriodCharge
  );
  wf.setHandler(customerIdName.query, () => customer.id);

  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true));

  await acts.sendWelcomeEmail(customer);
  if (await wf.condition(() => isCanceled, customer.subscription.trialPeriod)) {
    await acts.sendCancellationEmailDuringTrialPeriod(customer);
    return `Cancelled subscription for ${customer.id} during trial period`;
  } else {
    const totalCharged = await billingCycle(customer, billingPeriodNumber, billingPeriodChargeAmount);
    return `Completed subscription for ${customer.id}, total charged: $${totalCharged}`;
  }
}

async function billingCycle(
  customer: Customer,
  billingPeriodNumber: ReturnType<typeof querySignalState<number>>,
  billingPeriodChargeAmount: ReturnType<typeof querySignalState<number>>
): Promise<number> {
  let totalCharged = 0;
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true)); // reuse signals

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (billingPeriodNumber.value >= customer.subscription.maxBillingPeriods) break;
    console.log('charging', customer.id, billingPeriodChargeAmount.value);

    // Wait 1 billing period to charge customer or if they cancel subscription
    // whichever comes first
    if (await wf.condition(() => isCanceled, customer.subscription.billingPeriod)) {
      // If customer cancelled their subscription send notification email
      await acts.sendCancellationEmailDuringActiveSubscription(customer);
      break;
    }

    await acts.chargeCustomerForBillingPeriod(customer, billingPeriodChargeAmount.value);
    totalCharged += billingPeriodChargeAmount.value;

    billingPeriodNumber.value++;
  }

  // if we get here the subscription period is over
  if (!isCanceled) {
    await acts.sendSubscriptionOverEmail(customer);
  }

  return totalCharged;
}

function querySignalState<T = any>(name: string, initialValue: T) {
  const signal = wf.defineSignal<[T]>(name);
  const query = wf.defineQuery<T>(name);
  let state: T = initialValue;
  wf.setHandler(signal, (newValue: T) => {
    console.log('updating ', name, newValue);
    state = newValue;
  });
  wf.setHandler(query, () => state);
  return {
    signal,
    query,
    get value() {
      // need to use closure because function doesn't rerun unlike React Hooks
      return state;
    },
    set value(newVal: T) {
      state = newVal;
    },
  };
}
