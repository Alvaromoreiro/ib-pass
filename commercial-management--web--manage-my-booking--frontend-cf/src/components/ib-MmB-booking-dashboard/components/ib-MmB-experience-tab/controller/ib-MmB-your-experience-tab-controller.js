(function () {
    'use strict';

    angular
        .module('ib-MmB-your-experience-tab-module')
        .controller('MmBYourExperienceTabController', MmBYourExperienceTabController);

    MmBYourExperienceTabController.$inject = ['localStorageService'];
    function MmBYourExperienceTabController(localStorageService) {
        const vm = this;

        vm.$onInit = activate;
        function activate () {
            const bookingInfo = localStorageService.get('bookingInfo'), arrivalCity = bookingInfo.order.slices[0].segments[bookingInfo.order.slices[0].segments.length - 1].arrivalCity;
            vm.city = arrivalCity.description;
            vm.activityDate = new Date(vm.model[0].activityDate);
        }
    }
})();
