import { Customer } from '../types';

export async function sendCancellationEmailDuringActiveSubscription(customer: Customer) {
  console.log(`Sending active subscriber cancellation email to ${customer.email}`);
}
