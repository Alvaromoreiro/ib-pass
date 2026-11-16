(function () {
    'use strict';

    // Usage: <ib-logged-booking-item booking-item-model="" ></ib-logged-booking-item>
    // 
    // Creates: an html5 article with the booking item information like its departure,arrival,date,pnr, etc
    //
    /* istanbul ignore next */
    angular
        .module('ib-logged-booking-item-module')
        .component('ibLoggedBookingItem', {
            controller: 'LoggedBookingItemController',
            controllerAs: 'itemCtrl',
            bindings: {
                bookingItemModel: '<',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-logged-booking-item-view.html';
            }]
        });

})();