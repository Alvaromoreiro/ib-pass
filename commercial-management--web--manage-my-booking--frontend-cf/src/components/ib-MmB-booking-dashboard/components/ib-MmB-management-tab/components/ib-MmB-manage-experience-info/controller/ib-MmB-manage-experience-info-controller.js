(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-experience-info-module')
        .controller('MmBManageExperienceInfoController', MmBManageExperienceInfoController);

    MmBManageExperienceInfoController.$inject = ['localStorageService'];
    function MmBManageExperienceInfoController(localStorageService) {
        const vm = this;

        vm.$onInit = activate;
        function activate () {
            const bookingInfo = localStorageService.get('bookingInfo');
            vm.arrivalCity = bookingInfo.order.slices[0].segments[bookingInfo.order.slices[0].segments.length - 1].arrivalCity.description;
            vm.activityDate = new Date(vm.model[0].activityDate);
        }
    }
})();
