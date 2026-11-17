(function () {
    'use strict';

    angular
        .module('ib-toggle-switch')
        .controller('toggleSwitchController', toggleSwitchController);

    toggleSwitchController.$inject = [];
    function toggleSwitchController() {
        var vm = this;
        vm.focused = false;
        vm.isChecked = true;
    }
})();
