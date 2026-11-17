Instructions to develop
=======================


Be sure of reading [the OnBoarding Iberia guide before developing.](https://transform.atlassian.net/wiki/spaces/CCP/pages/3807937054/Tools+front)

Set up environment
------------------

    $> git clone git@git.corp.iberia.es:ib-web/ib-web-commons.git
    $> git switch develop
    $> npm install

Start application
-----------------

    $> npm run start

Or alternatively:

    $> npm run build

Or with watch mode:

    $> npm run build-dev

This command makes the dist folder.

Refresh build folder with changes
---------------------------------

You can run the next command for update the library dist in another folder, additionally every change you make is going to refresh the build folder with your changes.

For node_modules libraries:

    $> npm run build-watch -- --env project=XXX

Where XXX is the name of the FOLDER of your project, both projects have to be in the same root folder.
(It runs with this structure ../XXX/node_modules)

Test application
----------------

For launching tests, the developer has to execute:

    $> npm run test

The tests can be executed in watch mode in development with:

    $> npm run test-watch

You can debug tests with the command:

    $> npm run test-debug

And then click in the browser in debug and do it with the console browser as you would normally do. Alternatively you can [attach a debugger](https://stackoverflow.com/a/43192322) to port 9333 with your IDE.

Regular steps with a new feature
--------------------------------
**Prerequisites:** the developer has a develop branch in his git working directory and the working directory is empty means all previous changes are committed

The developer get a new feature from Jira and execute following command:

    $> git branch feature/XX
    $> git switch feature/XX

Where XX is the feature's identifier. This command creates the features/XX branch in the working directory and publish to GitLab server

When the developer is proud of his code and the feature works in his local environment, he can test in the integration environment for that he has to execute this command:

    $> git switch integration/YYYY
    $> git merge feature/XX

This command merge the changes with develop branch and push to the GitLab server. In a few seconds the developer can check the feature in the integration server.


**Stylelint**

This project has stylelint integration when commited. To improve the development experience it
is recommended to download the VSCode extension.
You can then update the .vscode settings.json of the project or the global settings.json of vscode:

```
    "stylelint.enable": true,
    "stylelint.validate": ["css", "scss"],
    "stylelint.configFile": "stylelint.config.cjs"
```

If you want to stylelint to fix error on save add the next lane too:

```
    "editor.codeActionsOnSave": {
        "source.fixAll.stylelint": true
    }
```