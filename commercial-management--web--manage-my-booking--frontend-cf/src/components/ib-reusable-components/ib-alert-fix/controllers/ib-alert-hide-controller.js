(function () {
    'use strict';
    angular
        .module('ib-alert-hide-module')
        .controller('AlertHideController', AlertHideController);

    AlertHideController.$inject = ['$timeout'];
    function AlertHideController($timeout) {
        var vm = this;
        vm.showAlert = true;

        $timeout(hideMessage, 3000);

        ////////////////////////////////

        function hideMessage() {
            vm.showAlert = false;
        }
    }
})();
