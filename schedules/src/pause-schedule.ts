import { Connection, Client } from '@temporalio/client';

async function run() {
  const client = new Client({
    connection: await Connection.connect({
      address: 'temporal:7233',
    }),
  });

  const handle = client.schedule.getHandle('sample-schedule');
  await handle.pause();

  console.log(`Schedule is now paused.`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });