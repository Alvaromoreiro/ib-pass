(function () {
    'use strict';

    angular
        .module('ib-MmB-time-line-module')
        .controller('TimeLineController', TimeLineController);

    TimeLineController.$inject = [];
    function TimeLineController() {
        var vm = this;
        vm.$onInit = activate;


        ////////////////

        function activate() { }
    }
})();