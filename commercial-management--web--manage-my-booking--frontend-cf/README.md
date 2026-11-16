Instructions to develop
=======================

Set up environment
------------------

    $> git clone git@git.corp.iberia.es:ib-web/web-manage-my-booking.git
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

    $> npm run build-check



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

If you have problems to launch application with the proxy you must to use this command

    $> npm start --env=uatb --ignore_proxy=true

When the developer has fixed the bug in his local environment and pass the whole tests:

    $> npm run hotfix-finish -- --hotfix=XX

This command merge the changes with master and develop branch and push to the GitLab server, and remove the hotfix/XX branch

If everything is Ok, in that moment, the developer has to have two branches develop and master. He can check with:

    $> git branch

## About Bag on Board component (BOB)
Bag on Board is an application integrated into the "Manage My Booking" flow as a web component. Its main purpose is to allow users to contract the luggage transfer service from the hotel to the airport. Currently, the service operates only at Madrid Airport, Spain, but it will be extended to more airports in the future.

### Setup and usage

Bag on Board is distributed as part of the ib-ancillaries-web package, which appears as a dependency in the package.json file of the main repository. This means that the usual steps of installing packages and running the project apply.

### How the component is loaded
The project imports HTML templates dynamically from both the external library (ib-web-ancillaries) and internal components using import.meta.webpackContext and a utility function called requireAll, making valid templates available at runtime.

``` bash
src\lazy-loading\ib-MmB-dashboard.ts

let modules = requireAll(
    import.meta.webpackContext(
        '../../node_modules/ib-web-ancillaries/dist',
        { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
    )
);


// Additional module imports...

```

### How the component is rendered in the main view
The web component ``` <ib-bob-box>``` is displayed in the ui view by declaring it in the template and passing the required data through its attributes. The rendering is controlled by directives from the controller scope.

``` bash
src\components\ib-MmB-booking-dashboard\components\ib-Mmb-customize-flights-tab\assets\ib-MmB-customize-flights-tab-view.html

<ib-bob-box 
  ng-if="ancillarieType === 'INTEGRATED_BOB' && custFlightTabCtrl.bobAvailable()" 
  bob-info="custFlightTabCtrl.bobInfo" 
  flow-app="custFlightTabCtrl.flowApp" 
  mmb-booked="custFlightTabCtrl.bobBooked">
</ib-bob-box>

```

### Relevant files involved
```bash
src/
 ├─ lazy-loading/
 │   └─ ib-MmB-dashboard.ts 
 ├─ components/
 │   └─ ib-MmB-booking-dashboard/
 │       └─ components/
 │           └─ ib-Mmb-customize-flights-tab/
 │               └─ assets/ib-MmB-customize-flights-tab-view.html

 ```
