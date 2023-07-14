# thunder-client-env-templater

Creating thunder client collections using environments so you can easily switch between dev, test, beta, prod, etc is a great thing. Makes it easy to to test and work with your code across all the environments you support. However, most api calls require some sort of secret information like an api key or auth credentials. And you should not check that information into the repo. And maybe Postman Cloud is not a solution that you can use. Now when you use the environment for the first time or you want to pull in any updates to it, you will need to look up that secret information and update your local environments, but also, ensure your local copies with the secrets do not accidentally get check back into the repo.

This is where thunder-client-env-templates helps. You save your secrets to SSM and update your env templates to have the ssm path. You can save your templates to the repo. The logic takes the template, looks up any SSM params needed, and then creates the real thunder client environment file with the secret values. Lastly, you use gitignore to ensure that real environment file do not get checked into the repo.

### Version

Thunder client updated how the environment configuration is saved. Not sure which TC version made the change assuming it was 2.7 or 2.8, but the environment files are saved as separate files in the environments folder. Previously, there was one thunderEnvironments.json file which had all environments.

- Version 2.0.0+ outputs in the new environments folder format (assuming TC version post 2.7)
- Version 1.0.0 outputs in the old single environment file format (assuming TC version pre 2.7)

### Publishing

When new changes are complete and pass build and test.

- run `yarn version`
- enter new version number
- this will build, test, lint, create change log, bump version, create tag, push changes and tag, and finally npm publish

### Install

- If using yarn, run `yarn add thunder-client-env-templater`
- If using npm, run `npm install thunder-client-env-templater`

### Run/Test locally

- run `ts-node src/runner.ts`. Will require ts-node installed globally

### Usage

- Create a thunder client folder (TCF) for you thunder client files (.thunder-client)
- Create a folder in your TCF for your env templates (.thunder-client/env-templates)
- Create a json file for each environment that will be templated (.thunder-client/env-templates/env-abc.json)
- Update the environment file with all the environment variables required. If the variable is not a secret, just add the name/value in plain text (knowing this will be saved to your repo in plain text). If the variable is a secret, save the secret value to SSM and then add the name and ssm path as the value in the environment template file.

```bash
# env template
{
  "name": "[dev or test or prod etc]",
  "data": [
    {
      "name": "baseUrl",
      "value": "https://dev-api.projecta.com/api"
    },
    {
      "name": "4TEMPLATER:username", # use 4TEMPLATER: to identify this is one for the templates to process
      "value": "ssm:/projectA/dev/username:false",  #:true means it is encrypted ssm value; :false means it is not encrypted
    },
    {
      "key": "4TEMPLATER:password",
      "value": "ssm:/projectA/dev/password:true"
    }
  ]
}


# outputted to environment file or folder
{
  "name": "[dev or test or prod etc]",
  "data": [
    {
      "name": "baseUrl",
      "value": "https://dev-api.projecta.com/api"
    },
    {
      "name": "username",
      "value": "[the value in ssm at path /projectA/dev/username]",
    },
    {
      "key": "password",
      "value": "[the value in ssm at path /projectA/dev/password decrypted]"
    }
  ]
}

```

- Update .gitignore and add the outputted thunder-client environment file/folder so it doesn't get checked into your repo.

```bash
# .thunder-client/.gitignore
thunderEnvironment*.json
environments-backup*/
tc_env_*.json
thunderActivity.json
```

- Create thunder-client config to ease the templater execution

```bash
# .thunder-client/config.json
# project setup to put all thunder client files in .thunder-client folder
{
  "awsRegion": "us-east-2",
  "thunderClientEnvironmentFileDir": "./.thunder-client/thunder-tests",
  "templateFiles": ["./.thunder-client/env-templates/*.json"]
}
```

- Add script to your package.json

```bash
{
  ...
  "scripts": {
    ...
      "tc:template": "yarn thunder-client-env-templater --config ./.thunder-client/config.json",
    ...
  }
  ...
}
```

- Run `yarn tc:template` when needed to create/update thunder client environment file/folder. If using ssm, make sure to update ~/.aws/credentials before
