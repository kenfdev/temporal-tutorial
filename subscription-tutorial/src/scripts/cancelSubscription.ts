import { Connection, WorkflowClient } from '@temporalio/client';
import { cancelSubscription } from '../workflows';
import { argv } from 'process';

async function run() {
  const connection = await Connection.connect({ address: 'temporal:7233' });

  const workflowId = argv[2];
  console.log(`cancelling workflow: ${workflowId}`);
  const client = new WorkflowClient({ connection });

  const handle = await client.getHandle(workflowId);
  await handle.signal(cancelSubscription);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
