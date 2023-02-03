import { Client, Connection } from '@temporalio/client';
import { unblockSignal } from './workflows';

async function run(): Promise<void> {
  const client = new Client({
    connection: await Connection.connect({ address: 'temporal:7233' }),
  });

  const handle = client.workflow.getHandle('unblock-or-cancel-0');

  await handle.signal(unblockSignal);
  console.log('unblockSignal sent');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
