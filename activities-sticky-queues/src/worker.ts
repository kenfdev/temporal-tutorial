import { NativeConnection, Worker } from '@temporalio/worker';
import { createStickyActivities, createNonStickyActivities } from './activities';
import { v4 as uuid } from 'uuid';

async function run() {
  const uniqueWorkerTaskQueue = uuid();

  const workers = await Promise.all([
    Worker.create({
      connection: await NativeConnection.connect({ address: 'temporal:7233' }),
      workflowsPath: require.resolve('./workflows'),
      activities: createNonStickyActivities(uniqueWorkerTaskQueue),
      taskQueue: 'sticky-activity-tutorial',
    }),
    Worker.create({
      // No workflows for this queue
      connection: await NativeConnection.connect({ address: 'temporal:7233' }),
      activities: createStickyActivities(),
      taskQueue: uniqueWorkerTaskQueue,
    }),
  ]);
  await Promise.all(workers.map((w) => w.run()));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
