import { Connection, Client } from '@temporalio/client';

async function run() {
  const client = new Client({
    connection: await Connection.connect({ address: 'temporal:7233' }),
  });

  const handle = client.schedule.getHandle('sample-schedule');
  await handle.delete();

  console.log(`Schedule is now deleted.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
