import { SSMClientConfig } from '@aws-sdk/client-ssm';

export const setupAwsConfig = (params: { region: string }): SSMClientConfig => {
  const { region } = params;

  const awsConfig: SSMClientConfig = {
    region: region,
  };

  return awsConfig;
};
