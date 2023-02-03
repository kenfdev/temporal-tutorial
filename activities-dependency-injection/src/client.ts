import { Client, Connection } from '@temporalio/client';
import { dependencyWF } from './workflows';

async function run(): Promise<void> {
  const client = new Client({
    connection: await Connection.connect({ address: 'temporal:7233' }),
  });

  const result = await client.workflow.execute(dependencyWF, {
    taskQueue: 'dependency-injection',
    workflowId: 'dependency-injection',
  });
  console.log(result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
