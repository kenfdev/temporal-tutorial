import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  const worker = await Worker.create({
    connection: await NativeConnection.connect({ address: 'temporal:7233' }),
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'child-workflows',
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
