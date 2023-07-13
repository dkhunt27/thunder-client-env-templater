# thunder-client-env-templater

Creating thunder client collections using environments so you can easily switch between dev, test, beta, prod, etc is a great thing. Makes it easy to to test and work with your code across all the environments you support. However, most api calls require some sort of secret information like an api key or auth credentials. And you should not check that information into the repo. And maybe Postman Cloud is not a solution that you can use. Now when you use the environment for the first time or you want to pull in any updates to it, you will need to look up that secret information and update your local environments, but also, ensure your local copies with the secrets do not accidentally get check back into the repo.

This is where thunder-client-env-templates helps. You save your secrets to SSM and update your env templates to have the ssm path. You can save your templates to the repo. The logic takes the template, looks up any SSM params needed, and then creates the real thunder client environment file with the secret values. Lastly, you use gitignore to ensure that real environment file do not get checked into the repo.

### Install

- If using yarn, run `yarn add thunder-client-env-templater`
- If using npm, run `npm install thunder-client-env-templater`

### Usage

- Create a thunder client folder (TCF) for you thunder client files (.thunder-client)
- Create a folder in your TCF for your env templates (.thunder-client/env-templates)
- Create a json file for each environment that will be templated (.thunder-client/env-templates/env-abc.json)
- Update the environment file with all the environment variables required. If the variable is not a secret, just add the name/value in plain text (knowing this will be saved to your repo in plain text). If the variable is a secret, save the secret value to SSM and then add the name and ssm path as the value in the environmet template file.

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
      "name": "4TEMPLATER:username",
      "value": "ssm:/projectA/dev/username:false",  #:true means it is encrypted ssm value; :false means it is not encrypted
    },
    {
      "key": "4TEMPLATER:password",
      "value": "ssm:/projectA/dev/password:true"
    }
  ]
}

```

- Update .gitignore and add your final thunder-client environment file so it doesn't get checked into your repo. `thunder-tests/thunderEnvironment.json` is the path default for thunder client

```bash
#.gitignore
.thunder-client/thunder-tests/thunderEnvironment.json
```

- Create thunder-client config
- Add script to your package.json
