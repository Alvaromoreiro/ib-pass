# Template Node CI CD codeatifact

## Summary

This workflow is used to upload your node artifact or dependency into the codeartifact repository.

![NODE CODEARTIFACT CICD WORKFLOW](https://github.com/Iberia-Ent/software-engineering--workflow--node--ci--cd-codeartifact/assets/87304455/eac6e42d-598d-4c0a-9274-58bce1fda975)

## Usage pipeline

Call directly from your workflow file like:

```
jobs:
	NODE:
		uses: Iberia-Ent/software-engineering--workflow--node--ci--cd-codeartifact/.github/workflows/ci-cd-node-codeartifact.yml@v1.0
		secrets: inherit
```

## Set up repository properties

### Environment's configuration

You need to create the following environments in your repository:

- ```Production```: We recommend to insert a reviewers to approve the deployment in this environment until your team is sufficiently mature.

### Variables configuration

On your repository, go to Settings > Secrets and Variables and add the following variables (repository scope):

- ```CODEQL_LANGUAGES```: This variable is used to set the languages to analyze with CodeQL. Example: javascript
- ```RUNNER_GROUP```: This variable is used to set your runner group. Example: my-group-runner
- ```RUNNER_LABELS```: This variable is used to set the runner labels. Example: "node", 'node', ["label1","label2"], ['label1','label2']
- ```DEPLOY_GITHUB_PAGES```: This variable is used to deploy your static code to github pages. Values: true | false
- `COV_FORMAT`: This variable is used to set the format of the coverage test. Example: lcov
- `COV_METRIC`: This variable is used to set the metric of the coverage test. Example: line-coverage
- `COV_FILE`: This variable is used to set the path of the file where is located the report. Example: ./reports/lcov.info
- `UPLOAD_CS_REPORT`: This variable is a boolean true or false, depends if you want to upload your code coverage report to codescene.

### Coverage report (this project)

Unit tests run with Karma coverage enabled (`angular.json` → `codeCoverage: true`).

Configuration: `config/karma/karma.conf.cjs`

| Output | Path | Purpose |
|--------|------|---------|
| LCOV | `./reports/lcov.info` | CodeScene / CI (`COV_FILE`) |
| HTML | `./reports/coverage/` | Local browsing (`index.html`) |
| Console | text-summary | Terminal summary after tests |

Generate the reports with:

```bash
npm test
# or
npm run test:coverage
```

Ensure repository variables for CodeScene use `COV_FILE=./reports/lcov.info`, `COV_FORMAT=lcov` and `UPLOAD_CS_REPORT=true` when the upload should run.
  
### Secrets configuration

- Create the secret **AWS_RESOURCES_COMMON_ROLE** (in secret section but repository scope) and add the value of the role of that account where you want to upload the artifacts.
- Create the secret **CS_ACCESS_TOKEN** (in secret section but repository scope) and add the value of the role of codescene with permissions to upload reports.
  
### Branches rules

1. You will use the github flow, so you need to have the following branches:
	* main
	* features
	* feat/my-branch (working feature branch)

2. Add some rules to main, develop and staging branch to make sure that you follow the flow and anyone can deploy in environments like preproduction or production.
	
	* main: 
		- Require a pull request before merging and check "Require approvals" option.
		- Require status checks to pass before merging and check "Require branches to be up to date before merging" option.
		- Do not allow bypassing the above settings
		- Restrict who can push to matching branches: Add to the engineer, release management and technical lead product team.

	* features: 
		- Require status checks to pass before merging and chech "Require branches to be up to date before merging" option and also add the status check of your pipeline for example: Initialize Environment, Continous Integration)

			> [!NOTE]
		  > For adding the status checks you should add them into pipeline code otherwise you couldn´t see it in rule branch section.

    - Do not allow bypassing the above settings
		- Restrict who can push to matching branches: Add to the engineer, release management and technical lead product team.

## Setup pipeline

### Pipeline files hierarchy 

You will use the github flow for building and uploading the distribution package.

You should have these files:

* .github/config/ci-config.json
* .github/workflows/cd-codeartifact.yml
* .github/workflows/dependabot.yml

You can modify these files:

* .github/config/ci-config.json

### Set up package.json
Make sure to have the following steps declarated in your package.json otherwise your pipeline will fail.

- `pre-install`: Use pre-install command if you need to install any artifact before install the dependencies. (Mandatory)
- `check:format`: Use check:format command in order to check the format in your code. (Mandatory)
- `lint`: Use lint command in order to search potential errors in your code. (Mandatory)
- `build`: Use build command in order to build your application and generate the distribuion folder called "dist". (Mandatory)
- `build:gh-pages`: Use build:gh-pages command in order to build your application and generate the distribuion folder called "storybook-static". (Mandatory)
- `test:unit`: Use test:unit command in order to execute your unit tests. (Mandatory)
- `test:contract`: Use test:contract command in order to execute your contract tests. (Mandatory)
- `test:acceptance`: Use test:acceptance command in order to execute your acceptance tests. (Mandatory)


**Example package.json**

```
{
  "name": "app-node-ecs",
  "version": "1.0.1",
  "description": "App node to deploy in ecs aws service.",
  "scripts": {
    "pre-install": "echo nothing to install",
    "build": "tsc --project tsconfig.json",
    "check:format": "prettier --check 'src/**/*.ts' 'test/**/*.ts'",
    "lint": "eslint 'src/**/*.ts' 'test/**/*.ts' --fix",
    "test:unit": "jest --config ./test/jest.config.cjs",
    "test:acceptance": "echo acceptance test",
    "test:contract": "echo contract test"
  },
  "devDependencies": {
    "@types/jest": "^29.5.2",
    "eslint": "^8.42.0",
    "jest": "^29.5.0",
    "prettier": "3.1.1",
    "ts-jest": "^29.1.0"
  }
}
```

> [!IMPORTANT]
> It is not allowed to download artefacts directly from any public repository, nexus or any other site than the product's own codeartifact.

### Set up ci-config.json file
#### Variables

Find the variables that you need to set up in the ci-config.json file:
	
| Variable | Required | Type | 
| --- | --- | --- | 
| AWS_RESOURCES_COMMON_ACCOUNT_ID  | yes  | string  |
| AWS_RESOURCES_COMMON_DOMAIN  | yes  | string  | 
| AWS_RESOURCES_COMMON_LIBRARY_REPOSITORY_FORMAT  | yes  | string  | 
| AWS_RESOURCES_COMMON_LIBRARY_REPOSITORY_NAME  | yes  | string  | 
| AWS_ECR_IMAGE_BASE  | yes  | string  | 
| AWS_ECR_REGISTRY  | yes  | string  | 
| AWS_ECR_REPOSITORY_NAME  | yes  | string  | 
| AWS_REGION  | yes  | string  | 
| NODE_VERSION  | yes  | string  | 
| S3_DEPLOY_BUCKET_REPOSITORY_NAME  | yes  | string  |
| S3_PACKAGE_DISTRIBUTION_FORMAT  | yes  | string  |
| S3_RELEASE_BUCKET_REPOSITORY_NAME  | yes  | string  |

For setting up the ci-config.json file with your custom properties of your project, go to your working feature branch and make the changes that you need using the above variables for example: 

```json
{
  "release": {
    "AWS_RESOURCES_COMMON_ACCOUNT_ID": "858599873024",
    "AWS_RESOURCES_COMMON_DOMAIN": "iberia",
    "AWS_RESOURCES_COMMON_LIBRARY_REPOSITORY_FORMAT": "npm",
    "AWS_RESOURCES_COMMON_LIBRARY_REPOSITORY_NAME": "npm-library-store",
    "AWS_ECR_IMAGE_BASE": "NA",
    "AWS_ECR_REGISTRY": "NA",
    "AWS_ECR_REPOSITORY_NAME": "NA",		
    "AWS_REGION": "eu-west-1",
    "NODE_VERSION": "18.x",
    "S3_DEPLOY_BUCKET_REPOSITORY_NAME": "NA",
    "S3_PACKAGE_DISTRIBUTION_FORMAT": "zip",
    "S3_RELEASE_BUCKET_REPOSITORY_NAME": "node-codeartifact-store-test"
  }
}
```

### Upload your static content in github pages
If you want to deploy your static content in github pages, you should add the following code in your workflow file:

- Make sure to have **DEPLOY_GITHUB_PAGES** variable in your repository.
- Make sure to have **S3_DEPLOY_BUCKET_REPOSITORY_NAME** property in the ci-config.json file.
- For building the static code, you need to have in the package.json the property: build:gh-pages
  ```
    "scripts": {
      ...
      "build:gh-pages": "storybook build",
      ...
    }
  ```
- For uploading this distribution, the pipeline will take the code from **storybook-static** folder so make sure that your distribution is built in this folder.
- Automatically, the pipeline will download your distribution folder and it will put it in the **_site** folder by default, folder where the github pages will take from there in order to deploy your static content.

### Upload your artifact to the codeartifact repository

- Create a working branch like feat/my-branch and insert and upload your code to the remote working branch.
- Create a "Pull Request", select base branch: features and compare branch: feat/my-branch (working feature branch created for yourself).
- Confirm your changes and the merge request. 
- Go to the "Action" tab and see if it has finished sucessfully or not and check the tag created automatically because you should create the release from that tag.
- For uploading the artifact to the codeartifact repository, go to "tags" tab and create the release. Click in the "Generate release note" button and automatically will fill up the release. Add some detail in the tittle and description like:

		Tittle: v1.0.0 - Added new code
		Descrition: This is my first commit.

- Go to "Actions" tab and see the status of the workflow, if it was sucessfully, your libraries are in production repository. 
- Create a "Pull Request" like:
	- Base branch: main 
	- Compare branch: feat/my-branch (working feature branch).

- Delete your custom branch. Example: feat/my-branch

## Contributing

Briefly explains how your team members or others can contribute to the project

For the contribution and workflow guide, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Maintainers

Contact information of the team member whose is responsible for the project, see [CONTRIBUTING.md](./CONTRIBUTING.md).
