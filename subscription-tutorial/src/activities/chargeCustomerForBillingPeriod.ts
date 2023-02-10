import { Customer } from '../types';

export async function chargeCustomerForBillingPeriod(customer: Customer) {
  console.log(`Charging ${customer.email} amount ${customer.subscription.initialBillingPeriodCharge} for their billing period`);
}
