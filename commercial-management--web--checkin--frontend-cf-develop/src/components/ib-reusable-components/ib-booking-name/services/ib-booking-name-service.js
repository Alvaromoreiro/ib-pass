(function () {
    'use strict';

    angular
        .module('ib-booking-name')
        .service('BookingNameService', BookingNameService);

    BookingNameService.$inject = ['$uibModal', 'CheckinRouterConstants'];

    function BookingNameService ($uibModal, CheckinRouterConstants) {
        this.checkName = function (surname, flowId) {
            return $uibModal.open({
                controller: 'BookingNameModalController',
                templateUrl: CheckinRouterConstants.templatesRoute + 'ibcose.modal-name.html',
                controllerAs: 'modalCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: function () {
                        return {
                            surname: surname,
                            flowId: flowId
                        };
                    }
                }
            });
        };
    }
})();
