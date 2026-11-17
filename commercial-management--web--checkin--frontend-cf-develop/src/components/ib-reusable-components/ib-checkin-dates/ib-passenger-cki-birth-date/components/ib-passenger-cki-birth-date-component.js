(function () {
    'use strict';

    // Usage: <ib-passenger-cki-birth-date years-from="0" years-to="100"></ib-passenger-cki-birth-date>
    //
    // Creates: An input text with 3 select box for select a day, a month and a year. The allowed values to select are defined between <yearsFrom-yearsTo> attributes
    // The component throws an event ('dateSelected') when a select box value is selected by the user. The event contains the user selected day, month and year in separates attributes
    // of an object. There are also 3 two-way bindings (day,month and year) to initialize and update the select box value.
    // finally the component has a two-way binding to pass the container form to check component validations.
    //

    /* istanbul ignore next */
    angular.module('ib-passenger-cki-birth-date-module')
        .component('ibPassengerCkiBirthDate', {
            controller: 'PassengerCkiBirthDateController',
            controllerAs: 'pasBirthCtrl',
            bindings: {
                yearsFrom: '<', // value binding
                yearsTo: '<',
                day : '=?', //two-way binding
                month: '=?',
                year: '=?',
                index : '@',
                containerForm: '=?',//two-way binding,
                nameId: '=',
                isRequired: '<'
            },
            templateUrl: ['$attrs', 'CheckinRouterConstants',function ($attrs, CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + ($attrs.template || 'ib-passenger-cki-birth-date-view.html');
            }]
        });

})();
