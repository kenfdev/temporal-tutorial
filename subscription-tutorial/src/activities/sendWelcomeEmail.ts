import { Customer } from '../types';

export async function sendWelcomeEmail(customer: Customer) {
  console.log(`Sending welcome email to ${customer.email}`);
}
