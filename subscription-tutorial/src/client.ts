import { Connection, Client } from '@temporalio/client';
import { subscriptionWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  const connection = await Connection.connect({ address: 'temporal:7233' });

  const client = new Client({ connection });

  const handle = await client.workflow.start(subscriptionWorkflow, {
    args: ['hoge@example.com', '30 seconds'],
    taskQueue: 'subscription-tutorial',
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
