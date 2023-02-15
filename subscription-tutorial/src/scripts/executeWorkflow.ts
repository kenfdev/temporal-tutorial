import { Connection, Client } from '@temporalio/client';
import { subscriptionWorkflow } from '../workflows';
import { Customer } from '../types';

async function run() {
  const connection = await Connection.connect({ address: 'temporal:7233' });

  const client = new Client({ connection });

  const customers = [1, 2, 3, 4, 5].map(
    (i) =>
      ({
        firstName: 'First Name' + i,
        lastName: 'Last Name' + i,
        email: `email-${i}@example.com`,
        subscription: {
          trialPeriod: 3000 + i * 10000, // 3+ seconds,
          billingPeriod: 3000 + i * 10000, // 3+ seconds,
          maxBillingPeriods: 3,
          initialBillingPeriodCharge: 120 + i * 10,
        },
        id: `id-${i}`,
      } as Customer)
  );

  const results = await Promise.all(
    customers.map((customer, index) =>
      client.workflow
        .start(subscriptionWorkflow, {
          args: [customer],
          taskQueue: 'subscription-tutorial',
          // in practice, use a meaningful business ID, like customerId or transactionId
          workflowId: 'workflow-' + index,
        })
        .catch((err) => console.error('Unable to execute workflow', err))
    )
  );

  results.forEach((result) => {
    console.log('Workflow result', result);
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
