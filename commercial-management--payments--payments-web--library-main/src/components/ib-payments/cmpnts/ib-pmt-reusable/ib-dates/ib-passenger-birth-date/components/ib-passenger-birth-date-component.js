(function () {
    'use strict';

    // Usage: <ib-passenger-birth-date years-from="0" years-to="100"></ib-passenger-birth-date>
    //
    // Creates: An input text with 3 select box for select a day, a month and a year. The allowed values to select are defined between <yearsFrom-yearsTo> attributes
    // The component throws an event ('dateSelected') when a select box value is selected by the user. The event contains the user selected day, month and year in separates attributes
    // of an object. There are also 3 two-way bindings (day,month and year) to initialize and update the select box value.
    // finally the component has a two-way binding to pass the container form to check component validations.
    //

    /* istanbul ignore next */
    angular.module('ib-passenger-birth-date-module')
        .component('ibPassengerBirthDate', {
            controller: 'IbPassengerBirthDateController',
            controllerAs: 'pasBirthCtrl',
            bindings: {
                yearsFrom: '@', // value binding
                yearsTo: '@',
                day: '=?', //two-way binding
                month: '=?',
                year: '=?',
                containerForm: '=?', //two-way binding
                haveBirthDate: '=',
                submittedTab: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-passenger-birth-date-view.html';
            }]
        });

})();