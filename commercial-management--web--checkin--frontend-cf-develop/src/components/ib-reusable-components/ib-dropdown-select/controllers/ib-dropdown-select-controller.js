(function () {
    'use strict';

    angular
        .module('ib-dropdown-select-module')
        .controller('ibDropdownSelectController', ibDropdownSelectController);

    ibDropdownSelectController.$inject = [];
    function ibDropdownSelectController() {
        var vm = this;

        vm.clickUsers = function (item, e) {
            vm.selectedUsers = item;
            e.preventDefault();
        };
        vm.selectedUsers = vm.users[0];
    }
})();