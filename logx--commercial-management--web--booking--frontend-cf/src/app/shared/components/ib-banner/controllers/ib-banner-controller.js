(function () {


    angular
        .module('ib-banner-module')
        .controller('IbBookingBannerController', IbBookingBannerController);

    IbBookingBannerController.$inject = ['BookingModalService'];
    function IbBookingBannerController (BookingModalService) {
        const vm = this;
        vm.$onInit = activate;
        ////////////////

        function activate () {
        }

    }
})();