import { App } from '@serverless-stack/resources';

import { AwsCdkStack } from './AwsCdkStack';
import { SstStack } from './SstStack';

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
  });

  app.stack(SstStack);
  app.stack(AwsCdkStack);
}
