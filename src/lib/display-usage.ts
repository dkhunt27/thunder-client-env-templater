export const displayUsage = () => {
  console.log('');
  console.log('thunder-client-env-templater');
  console.log('');
  console.log(
    'Utility for setting up thunder client environment files.  (i.e. update secrets from ssm)',
  );
  console.log('');
  console.log('Usage:');
  console.log('    thunder-client-env-templater OPTION[S]');
  console.log('');
  console.log('OPTIONS:');
  console.log('        --help               displays help');
  console.log('    -c  --config             path to config file');
  console.log('');
  console.log('Examples:');
  console.log(
    '    yarn thunder-client-env-templater --config=./thunder-client/config.json',
  );
  console.log('');
};
