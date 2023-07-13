import fg from 'fast-glob';
import {
  appendEnvTemplateToEnvironment,
  backupThunderClientEnvironmentFile,
  parseConfig,
  processEnvTemplate,
} from './lib/template';
import path from 'path';
import { ProcessedVariablesType } from './types/index.js';
import { writeFileSync } from 'fs';
import { displayUsage } from '@/display-usage.js';

export const execute = async (args: any): Promise<void> => {
  if (Object.keys(args).length <= 1 || args.help) {
    displayUsage();
  } else {
    console.log(' ');
    console.log(' thunder-client-env-templater executing...');

    // parse config
    const configFile =
      args.c || args['config'] || 'thunder-client-env-templater.config.json';

    const config = parseConfig(path.join(process.cwd(), configFile));

    // list of env templates
    const envTemplateFiles = await fg(config.templateFiles);
    console.log('... templates to process', envTemplateFiles);

    let tcEnvironment: ProcessedVariablesType[] = [];

    // loop through them and template
    for (const templateFile of envTemplateFiles) {
      const templated = await processEnvTemplate({
        templateFullPath: templateFile,
        awsRegion: config.awsRegion,
      });

      tcEnvironment = appendEnvTemplateToEnvironment({
        templated,
        thunderClientEnvironment: tcEnvironment,
      });
    }

    // overwrite environment file
    const outputPath = path.join(
      config.thunderClientEnvironmentFileDir,
      'thunderEnvironment.json',
    );
    backupThunderClientEnvironmentFile(outputPath);
    writeFileSync(outputPath, JSON.stringify(tcEnvironment, null, 2));
    console.log(` ... creating thunder client environment file: ${outputPath}`);
  }
};
