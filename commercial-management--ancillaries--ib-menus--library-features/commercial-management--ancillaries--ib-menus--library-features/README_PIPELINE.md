# Upload your angular library to the codeartifact AWS.

## Summary

Be able to upload a single library to the repository located in AWS CodeArtifact.

![ANGULAR CODEARTIFACT CICD WORKFLOW](https://user-images.githubusercontent.com/87304455/221517753-8067cd78-7790-4b20-b377-d45ca50bed84.png)

## Usage pipeline
Call directly from your workflow file like:

Example without angular cache:
	
	jobs:    
		ANGULAR:
		  uses: Iberia-Ent/software-engineering--workflow-codeartifact-angular/.github/workflows/codeartifact-angular.yml@v1.1
		  secrets:
			  AWS_CODEARTIFACT_ROLE: ${{ secrets.AWS_CODEARTIFACT_ROLE }}
			  

Example with angular cache:

	jobs:    
		ANGULAR:
		  uses: Iberia-Ent/software-engineering--workflow-codeartifact-angular/.github/workflows/codeartifact-angular.yml@v1.1
		  with:
			enable-angular-cache: 'true'
		  secrets:
			AWS_CODEARTIFACT_ROLE: ${{ secrets.AWS_CODEARTIFACT_ROLE }}			  


Parameters:

		inputs:
			enable-angular-cache:
				required: false
				type: string
				default: 'false'
		secrets:
			AWS_CODEARTIFACT_ROLE:
				required: true

#### Note: It is not recommended to cache node_modules, as it can break across Node versions and won't work with npm ci or npm install. If this happens, please disable caching, as if you have it enabled, it will cache the node_modules folder.

#### Note: You can choose the pipeline version, branch name or commit hash. We recommend using version.

### Environment's configuration

1. Create an environment called "Production" and add the review team in charge to approve the deployment.

##### NOTE: the team has to be added in to Settings--> Manage Access before to add into enviroments section.
##### NOTE 2: add the value of AWS_CODEARTIFACT_ROLE (in secret section but repository scope).

### Branches rules

1. You will use the github flow, so you need to have two branches, main and features. If you don´t have them, create them and create your working feature branch.
   Branches:
   * main
   * features
   * feat/my-branch (working feature branch)

2. Add some rules to main and features branches to make sure that you follow the flow and anyone can deploy in environments like production or make a commit directly to main branch.
	* main: 
		- Require a pull request before merging and check "Require approvals" option.
		- Require status checks to pass before merging and check "Require branches to be up to date before merging" option.
		- Include administrators
		- Restrict who can push to matching branches: Add to the devops-operations team.
		
	* features: 
		- Require status checks to pass before merging and chech "Require branches to be up to date before merging" option and also add the status check of your pipeline for example: Initialize Environments, Continous Integration)
		  #### NOTE: For adding the status checks you should add them into pipeline code otherwise you couldn´t see it in rule branch section.
		- Include administrators
		- Restrict who can push to matching branches: Add to the devops-operations team and iberia developer team.   
   

## Set up angular pipeline

### Build angular project

This workflow use a custom action for compiling your angular library by environments. See commands allowed for each environment:

- **Integration:**		npm run build-int
- **Preproduction:**	npm run build-pre
- **Production:**		npm run build-prod

You have to add in the package.json the follow commands in the script section:

**Library:**

		"scripts": {
			"build-prod": "ng build"
		}

**NOTE:** The action will compile in production environment always because for npm you don´t have snapshot version.

### Pipeline files hierarchy 

You will use the github flow for uploading the artifact.

You should have this files:

* package.json
* .github/config/ci-config.json
* .github/config/.npmrc
* .github/workflows/codeartifact-angular.yml

You should modify this files:

* package.json (it has to be in the root path)
* .github/config/ci-config.json

If you don´t have the publishConfig block in your package.json, please insert it as below:

		"publishConfig": {
			"registry": "${AWS_CODEARTIFACT_LIBRARY_REPOSITORY_URL}"
		}
		
#### 	Note: The pipeline will replace the AWS_CODEARTIFACT_LIBRARY_REPOSITORY_URL variable automatically.

#### IMPORTANT: Don´t modify .npmrc, you can add whatever youu need but don´t overwrite it because the pipeline will stop working.


### Set up ci-config.json file

#### Variables
	
	
| Variable | Required | Type | Values |
| -------- | -------- | ---- | ------ |
| AWS_CODEARTIFACT_ACCOUNT_ID  | yes  | string  | NA  | 
| AWS_CODEARTIFACT_DOMAIN  | yes  | string  | NA  | 
| AWS_CODEARTIFACT_LIBRARY_REPOSITORY_NAME  | yes  | string  | NA  |
| AWS_CODEARTIFACT_LIBRARY_REPOSITORY_FORMAT  | yes  | string  | NA  |
| AWS_REGION  | yes  | string  | NA  |
| NODEJS_VERSION  | yes  | string  | NA  |

For setting up the ci-config.json file with your custom properties of your project, go to your working feature branch and make the changes that you need using the above variables for example: 

	{
		"release":	{
			"AWS_CODEARTIFACT_ACCOUNT_ID": "329066851743",
			"AWS_CODEARTIFACT_DOMAIN": "iberia",
			"AWS_CODEARTIFACT_LIBRARY_REPOSITORY_NAME": "angular-library-store",
			"AWS_CODEARTIFACT_LIBRARY_REPOSITORY_FORMAT":"npm",
			"AWS_REGION": "eu-west-1",
			"NODEJS_VERSION": "14"
		}
	}


## Usage angular github flow

![Angular GitHub Flow](https://user-images.githubusercontent.com/87304455/221517681-54d05318-9b79-48e1-b134-c6139c838948.png)

### Deploy your library to codeartifact

- Create a working branch like feat/my-branch and insert and upload your code to the remote working branch.
- Create a "Pull Request", select base branch: features and compare branch: feat/my-branch (working feature branch created for yourself).
- Confirm your changes and the merge request. 
- Go to the "Action" tab and see if it has finished sucessfully or not and check the tag created automatically because you should create the release from that tag.
- For uploading the artifact to the codeartifact repository, go to "tags" tab and create the release. Click in the "Generate release note" button and automatically will fill up the release. Add some detail in the tittle and description like:

		Tittle: v1.0.0 - Added new code
		Descrition: This is my first commit.

- Go to "Actions" tab and see the status of the workflow, if it was sucessfully, your libraries are in production repository. 

#### NOTE: For uploading the artifact you need an approval from release management team. 

- Create a "Pull Request" like:
	- Base branch: main 
	- Compare branch: feat/my-branch (working feature branch).

- Delete your custom branch. Example: feat/my-branch

### Testing

You must have test folder inside of your repository in the root path.

## Contributing

Briefly explains how your team members or others can contribute to the project

For the contribution and workflow guide, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Maintainers

Contact information of the team member whose is responsible for the project, see [CONTRIBUTING.md](./CONTRIBUTING.md).
