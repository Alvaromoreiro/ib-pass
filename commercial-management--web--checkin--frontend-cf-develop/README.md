Instructions to develop
=======================

Set up environment
------------------
Is necessary update nodeJs version to 14.17.6, in case to have other nodeJs version for the other project you must install nvm-windows and use the corresponding version.

    $> nvm on
    $> nvm install 14.17.6
    $> nvm use 14.17.6
    $> git clone git@git.corp.iberia.es:ib-web/web-checkin.git
    $> cd web-checkin 
    $> git checkout develop
    $> npm install

Start application for development
---------------------------------

    $> npm run start -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder
    
Or alternatively:

    $> npm run build-watch  -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder

This command makes the build folder and open default browser. You can disable to automatically open the browser with open=false after the env. This does not create the build folder with the compiled code. It is recommended tu run this together with de IDE debugger for easier debug.


Generate build folder with code
-------------------------------

To generate the build folder for production but without minimizing the code run the simple command:

    $> npm run build -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder

To generate the build folder for production with minimized code and hidden source map:

    $> npm run build-pro -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder

If it is necessary to generate the build folder with the code as it is to check, just run:

    $> npm run build-dev -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder

Run the compilated code from build
----------------------------------

It is possible to run in a local server the build folder to check the compilation with:

    $> npm run check-build


Test application
----------------

For launching tests, the developer has to execute:

    $> npm run test

The tests can be executed in watch mode in development with:

    $> npm run test-watch


Regular steps with a new feature
--------------------------------
**Prerequisites:** the developer has a develop branch in his git working directory and the working directory is empty means all previous changes are committed

The developer get a new feature from Jira and execute following command:

    $> git switch -c feature/XX

Where XX is the feature's identifier. This command creates the features/XX branch in the working directory and publish to GitLab server

When the developer is proud of his code and the feature works in his local environment, he can test in the integration environment for that he has to execute this command:

    $> git switch integration/YYYY
    $> git merge feature/XX

This command merge the changes with develop branch and push to the GitLab server. In a few seconds the developer can check the feature in the integration server.


Regular steps with a new hotfix
--------------------------------
**Prerequisites:** the developer has a master branch and a develop branch in his git working directory and the working directory is empty means all previous changes are committed

The developer get a new production bug XX:

    $> npm run hotfix-start -- --hotfix=XX

Where XX is the bug's identifier. This command creates the hotfix/XX branch, updating its version 0.0.X in one, in the working directory and publish to GitLab server

The developer makes some changes fixing the bug that can be checked in his local server executing this command:

    $> npm run start -- --env (dev, pre, uata, ...) These enviroments are defined in config/environments folder

When the developer has fixed the bug in his local environment and pass the whole tests:

    $> npm run hotfix-finish -- --hotfix=XX

This command merge the changes with master and develop branch and push to the GitLab server, and remove the hotfix/XX branch

If everything is Ok, in that moment, the developer has to have two branches develop and master. He can check with:

    $> git branch
    
