(function () {
    'use strict';

    /**
     *  Usage: <ib-passenger-data-contact-form></ib-passenger-data-contact-form>
     *  Creates: Creates the segment for information data contact
     * 
     * 
     * Bindings model detail:
     * contactFormModel:
     *  .number: Int
     *  .email: String
     * 
     */
    /* istanbul ignore next */
    angular
        .module('ib-passenger-data-contact-form-module')
        .component('ibPassengerDataContactForm', {
            controller: 'PassengerDataContactFormController',
            controllerAs: 'pasDataContcCtrl',
            bindings: {
                contactFormModel: '=',
                passengersModel: '=',
                originalDataModel: '<',
                optionalInformation: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-passenger-data-contact-form-view.html';
            }]
        });
})();