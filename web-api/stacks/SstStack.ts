import { StackContext, Function } from '@serverless-stack/resources';

import { getResourceName } from './commons';

export function SstStack({ stack }: StackContext) {

  const exampleLambdaName = 'example_lambda';
  const exampleLambda = new Function(stack, exampleLambdaName, {
    handler: 'src/lambdas/example.handler',
    functionName: getResourceName(stack, exampleLambdaName),
  });

  stack.addOutputs({
    ExampleLambdaArn: exampleLambda.functionArn,
  });
}
