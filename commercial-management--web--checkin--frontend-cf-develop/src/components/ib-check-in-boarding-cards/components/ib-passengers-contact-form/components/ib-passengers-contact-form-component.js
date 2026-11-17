(function () {
    'use strict';

    // Usage: <ib-passengers-contact-form contact-form-model prefix-list pass-info-form></ib-passengers-contact-form>
    // Creates:
    // Receives an object with four settings, contactEmail, contactPrefix,contactPhone and isNewsLetter.
    // The user writes his email on the box twice and his Phone number with his prefix too.
    // The component checks that the email of the user is written properly.

    /* istanbul ignore next */
    angular.module('ib-passengers-contact-form-module')
        .component('ibPassengersContactForm', {
            controller: 'IbPassengersContactFormController',
            controllerAs: 'pasContactCtrl',
            bindings: {
                contactFormModel: '=',
                prefixList: '<',
                passInfoForm: '=',
                tabIndex: '<',
                passengerIndex: '<',
                showEmail: '<',
                showPhone: '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-passengers-contact-form-view.html';
            }]
        });

})();