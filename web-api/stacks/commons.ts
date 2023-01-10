import { Stack } from '@serverless-stack/resources';

export const APP_NAME: string = 'open_source_sst';
export const SERVICE_NAME: string = 'node_api';

export function getResourceName(stack?: Stack, name?: string) {
  let resourceName = `${APP_NAME}`;

  if (stack) {
    resourceName = `${stack.stage}-${APP_NAME}`;
  }
  if (name) {
    resourceName += `-${name}`;
  }

  return resourceName;
}
