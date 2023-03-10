import { proxyActivities } from '@temporalio/workflow';

import type { createActivities } from './activities';

// Note usage of ReturnType<> generic since createActivities is a factory function
const { greet, greet_es } = proxyActivities<ReturnType<typeof createActivities>>({
  startToCloseTimeout: '30 seconds',
});

export async function dependencyWF(): Promise<string> {
  const english = await greet('Hello');
  const spanish = await greet_es('Hola');
  return `${english}\n${spanish}`;
}
