import { NativeConnection, Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    connection: await NativeConnection.connect({ address: 'temporal:7233' }),
    workflowsPath: require.resolve('./workflows'),
    taskQueue: 'continue-as-new',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
