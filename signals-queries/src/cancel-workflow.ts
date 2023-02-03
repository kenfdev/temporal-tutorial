import { Client, Connection } from '@temporalio/client';

async function run(): Promise<void> {
  const client = new Client({
    connection: await Connection.connect({ address: 'temporal:7233' }),
  });

  const handle = client.workflow.getHandle('unblock-or-cancel-0');

  await handle.cancel();
  console.log('workflow canceled');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
