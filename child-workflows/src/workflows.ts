import { executeChild, proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

export async function parentWorkflow(...names: string[]): Promise<string> {
  const responseArray = await Promise.all(
    names.map((name) =>
      executeChild(childWorkflow, {
        args: [name],
        // workflowId, // add business-meaningful workflow id here
        // // regular workflow options apply here, with two additions (defaults shown):
        // cancellationType: ChildWorkflowCancellationType.WAIT_CANCELLATION_COMPLETED,
        // parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_TERMINATE
      })
    )
  );
  return responseArray.join('\n');
}

export async function childWorkflow(name: string): Promise<string> {
  const { greet } = proxyActivities<typeof activities>({ startToCloseTimeout: '1 minute' });

  return greet(name);
}
