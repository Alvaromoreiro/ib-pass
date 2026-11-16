Instructions to develop
=======================

Set up environment
------------------
Is necessary to install volta package manager. Once installed this app will get the node and npm version from the configuration set into the package.json

    $> Follow the instructions to install volta (https://docs.volta.sh/guide/getting-started) 
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

To generate the build folder for development enviroment:

    $> npm run build-dev -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder

To generate the build folder for preproduction enviroment:

    $> npm run build-pre -- --env (dev, pre, uata, ...) These environments are defined in config/environments folder

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
The developer needs to follow the steps defined on DEVELEOPERS.md for github flow. and PULL_REQUEST_TEMPLATE.md

Booking application flows 
--------------------------------
**Prerequisites:**

    The flows available in booking application are:
    1.Obtention
        This is a basic flow in booking application basically is a search of flights between two cities.
        The acces is trought https://www.iberia.com/. The user should select departure city and destination city, the fligths dates and the types passengers.This page redirection to booking application and show all offers your selection.

    2.Redemption
        This is a basic flow allowed when you are register first. In this case you can pay with avios.

    3.Metasearch
        The Metasearch are pages external to Iberia that allow you to search and buy flights. The user can access through them the booking applications and continue with the flow.
        Providers metasearch are: 
            https://www.google.com/flights
            https://www.kayak.es/
            https://www.skyscanner.es/

    4.Multiples trip
        Multipath flights are basically the selection of several different destinations in the same booking flow. You can select up to four different flights.
        Access to the flow of multiple trips is made through the 'Home' of iberia, in the multiple trips section (https://www.iberia.com/be/flight-search-engine/multiple-legs/)  The user can select a maximum of 4 different destinations.
        The user can search a multiple trip through metasearch:
            https://www.google.com/flights
            https://www.kayak.es/
            https://www.skyscanner.es/

    5.PA Obtencion
        Flights between MAD and BCN when select open bills.
    6.PA Redemption
        Flights between MAD and BCN when select open bills but in this case you must select pay with avios.
    7.OnBusiness
        This is a type of Frequent Flyer program for SMEs (PyMes). By entering the On Business ID in the booking points are earned.
    8.OnHold
        This is a flow in booking application to save the reservation before complete the payment. The user only need to pay a bit quantity and later in a time of two days it can be confirmed. 
