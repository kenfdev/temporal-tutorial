import { NativeConnection, Worker } from '@temporalio/worker';

import { createActivities } from './activities';

async function run() {
  // Mock DB connection initialization in Worker
  const db = {
    async get(_key: string) {
      return 'Temporal';
    },
  };

  const worker = await Worker.create({
    taskQueue: 'dependency-injection',
    workflowsPath: require.resolve('./workflows'),
    activities: createActivities(db),
    connection: await NativeConnection.connect({ address: 'temporal:7233' }),
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
