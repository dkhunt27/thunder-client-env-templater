import {
  ConfigType,
  ProcessedVariablesType,
  TemplateVariablesType,
} from '../types/index';
import { SSMClientConfig } from '@aws-sdk/client-ssm';
import { existsSync, readFileSync, renameSync } from 'fs';
import { processSsmInstruction } from './process-ssm-instruction';
import { v4 as uuidv4 } from 'uuid';
import { setupAwsConfig } from './setup-aws-config.js';

export const assertFileExists = (filePath: string) => {
  if (!existsSync(filePath)) {
    console.error(`ERROR: No such file or directory '${filePath}'`);
    throw new Error(`No such file or directory '${filePath}'`);
  }
};

export const parseFileAsJson = (filePath: string): Record<string, unknown> => {
  assertFileExists(filePath);
  try {
    const contents = readFileSync(filePath).toString();
    return JSON.parse(contents);
  } catch (err: any) {
    console.error(
      `ERROR: Could not parse file as json '${filePath}': ${err.message}`,
    );
    throw new Error(
      `Could not parse file as json '${filePath}': ${err.message}`,
    );
  }
};

export const appendEnvTemplateToEnvironment = (params: {
  templated: TemplateVariablesType;
  thunderClientEnvironment: ProcessedVariablesType[];
}): ProcessedVariablesType[] => {
  console.log(` ... appending env template: ${params.templated.name}`);

  const processed: ProcessedVariablesType = {
    ...params.templated,
    _id: uuidv4(),
    default: params.thunderClientEnvironment.length === 0,
    sortNum: 10000 * (params.thunderClientEnvironment.length + 1),
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };

  params.thunderClientEnvironment.push(processed);

  return params.thunderClientEnvironment;
};

export const processEnvTemplate = async (params: {
  templateFullPath: string;
  awsRegion: string;
}): Promise<TemplateVariablesType> => {
  console.log(` ... processing env template: ${params.templateFullPath}`);

  const envTemplate = parseFileAsJson(
    params.templateFullPath,
  ) as TemplateVariablesType;

  const awsConfig = setupAwsConfig({ region: params.awsRegion });
  const templated = await template({ envTemplate, awsConfig });

  return templated;
};

export const template = async (params: {
  envTemplate: TemplateVariablesType;
  awsConfig: SSMClientConfig;
}): Promise<TemplateVariablesType> => {
  const { envTemplate, awsConfig } = params;

  const templated: TemplateVariablesType = JSON.parse(
    JSON.stringify(envTemplate),
  );

  for (const item of templated.data) {
    if (item.name.indexOf('4TEMPLATER:') === 0) {
      const keyParts = item.name.split(':');

      if (keyParts.length !== 2) {
        throw new Error(
          'key not in expected format 4TEMPLATER:newKeyName (' +
            item.name +
            ')',
        );
      }

      // replace the key with the name minus the 4TEMPLATER:
      item.name = keyParts[1];

      const valueParts = item.value.split(':');

      switch (valueParts[0]) {
        case 'ssm': {
          item.value = await processSsmInstruction({
            envVarValue: item.value,
            ssmConfig: awsConfig,
          });
          break;
        }
        default:
          throw new Error('instruction unknown (' + item.value + ')');
      }
    }
  }

  return templated;
};

export const backupThunderClientEnvironmentFile = (filePath: string) => {
  if (existsSync(filePath)) {
    console.log(
      ` ... backing up existing thunder client environments file: ${filePath}`,
    );
    renameSync(
      filePath,
      filePath.replace('.json', `.backup.${Date.now()}.json`),
    );
  }
};

export const parseConfig = (configFullPath: string): ConfigType => {
  console.log(` ... parsing config: ${configFullPath}`);

  if (!existsSync(configFullPath)) {
    console.error(`ERROR: No such file or directory '${configFullPath}'`);
    throw new Error(`No such file or directory '${configFullPath}'`);
  } else {
    const configContents = readFileSync(configFullPath).toString();
    const config = JSON.parse(configContents);
    return config;
  }
};
