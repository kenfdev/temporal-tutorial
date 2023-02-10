import { Customer } from '../types';

export async function sendCancellationEmailDuringTrialPeriod(customer: Customer) {
  console.log(`Sending trial cancellation email to ${customer.email}`);
}
