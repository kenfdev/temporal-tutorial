import { Customer } from '../types';

export async function sendSubscriptionOverEmail(customer: Customer) {
  console.log(`Sending subscription over email to ${customer.email}`);
}
