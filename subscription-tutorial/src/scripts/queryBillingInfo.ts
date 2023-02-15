import { Connection, WorkflowClient } from '@temporalio/client';

async function run() {
  const connection = await Connection.connect({ address: 'temporal:7233' });
  const client = new WorkflowClient({
    connection,
  });
  for (let i = 0; i < 5; i++) {
    const handle = await client.getHandle('workflow-' + i);
    const result = await handle.query<number>('BillingPeriodNumber');
    const result2 = await handle.query<number>('BillingPeriodChargeAmount');

    console.log('Workflow:', 'Id', handle.workflowId);
    console.log('Billing Results', 'Billing Period', result);
    console.log('Billing Results', 'Billing Period Charge', result2);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
