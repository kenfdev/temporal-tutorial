import { Customer } from '../types';

export async function chargeCustomerForBillingPeriod(customer: Customer, chargeAmount: number) {
  console.log(`Charging ${customer.email} amount ${chargeAmount} for their billing period`);
}
