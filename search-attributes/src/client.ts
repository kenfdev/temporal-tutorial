import { Client, Connection } from '@temporalio/client';
import { example } from './workflows';

async function run() {
  const client = new Client({
    connection: await Connection.connect({ address: 'temporal:7233' }),
  });

  const handle = await client.workflow.start(example, {
    taskQueue: 'search-attributes',
    workflowId: 'search-attributes-example-0',
    searchAttributes: {
      CustomIntField: [2],
      CustomKeywordField: ['keywordA', 'keywordB'],
      CustomBoolField: [true],
      CustomDatetimeField: [new Date()],
      CustomStringField: [
        'String field is for text. When queried, it will be tokenized for partial match. StringTypeField cannot be used in Order By',
      ],
    },
  });

  const { searchAttributes } = await handle.describe();

  console.log('searchAttributes at start:', searchAttributes);
  console.log('searchAttributes at end:', await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
