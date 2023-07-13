import {
  SSMClient,
  SSMClientConfig,
  GetParameterCommand,
  GetParameterCommandInput,
  GetParameterCommandOutput,
} from '@aws-sdk/client-ssm';

export const processSsmInstruction = async (params: {
  envVarValue: string;
  ssmConfig: SSMClientConfig;
}): Promise<string> => {
  const { envVarValue, ssmConfig } = params;

  const valueParts = envVarValue.split(':'); // expecting ssm:Name:WithDecryption
  if (valueParts.length !== 3) {
    throw new Error(
      `processSsmInstruction envVarValue not in expected format (${envVarValue})`,
    );
  }

  const input: GetParameterCommandInput = {
    Name: valueParts[1],
    WithDecryption: valueParts[2] === 'true',
  };

  const client = new SSMClient(ssmConfig);
  const command = new GetParameterCommand(input);

  let result: GetParameterCommandOutput;
  try {
    result = await client.send<
      GetParameterCommandInput,
      GetParameterCommandOutput
    >(command);
  } catch (err: any) {
    console.error(
      `ERROR: processSsmInstruction ${err?.message || err} ${JSON.stringify(
        params,
      )}`,
    );
    throw err;
  }

  return result.Parameter?.Value || '';
};
