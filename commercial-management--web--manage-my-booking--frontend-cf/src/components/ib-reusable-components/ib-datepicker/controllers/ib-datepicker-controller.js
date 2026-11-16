import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(updateLocale);

(function () {
    'use strict';

    angular
        .module('ib-datepicker')
        .controller('ibMmbDatepickerController', ibMmbDatepickerController);

    ibMmbDatepickerController.$inject = ['$rootScope'];

    function ibMmbDatepickerController($rootScope) {
        var vm = this;

        vm.dateOptions = {
            showWeeks: false,
            maxMode: 'day'
        };

        dayjs.updateLocale('es', {
            longDateFormat: {
                LL: 'D [de] MMMM, YYYY',
            }
        });
        vm.today = new dayjs().locale($rootScope.appLang).format('LL');
    }
})();
