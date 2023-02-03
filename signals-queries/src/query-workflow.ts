import { Client, Connection } from '@temporalio/client';
import { isBlockedQuery } from './workflows';

async function run(): Promise<void> {
  const client = new Client({
    connection: await Connection.connect({ address: 'temporal:7233' }),
  });

  const handle = client.workflow.getHandle('unblock-or-cancel-0');

  console.log('blocked?', await handle.query(isBlockedQuery));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
