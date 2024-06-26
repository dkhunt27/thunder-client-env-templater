import fg from 'fast-glob';
import {
  createEnvTemplateInEnvironmentFolder,
  backupThunderClientEnvironmentFolder,
  parseConfig,
  processEnvTemplate,
} from './lib/template';
import path from 'path';
import { displayUsage } from './lib/display-usage';

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

    // backup existing environments folder
    const envFolderPath = path.join(
      config.thunderClientEnvironmentFileDir,
      'environments',
    );
    backupThunderClientEnvironmentFolder(envFolderPath);

    // loop through them and template
    let defaultTrueAlready = false;
    const sortNumList: number[] = [];
    for (const [index, templateFile] of envTemplateFiles.entries()) {
      const templated = await processEnvTemplate({
        templateFullPath: templateFile,
        awsRegion: config.awsRegion,
      });

      // ensure only one env template has default set to true
      if (templated.default) {
        if (defaultTrueAlready) {
          throw new Error(
            `Only one env-template can have default set to true: ${templateFile}`,
          );
        }
        defaultTrueAlready = true;
        console.log(
          ` ... env-template with default set to true: ${templateFile}`,
        );
      }

      // ensure unique sort numbers in env templates
      if (templated.sortNum) {
        if (sortNumList.includes(templated.sortNum)) {
          throw new Error(
            `Sort number ${templated.sortNum} must be unique: ${templateFile}`,
          );
        }
        sortNumList.push(templated.sortNum);
      }

      createEnvTemplateInEnvironmentFolder({
        templated,
        config,
        envFolderPath,
        index,
      });
    }
  }
};
