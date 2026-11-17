(function () {
    'use strict';

    angular
        .module('ib-what-to-do-module')
        .controller('WhatToDoController', WhatToDoController);

    WhatToDoController.$inject = ['$scope'];
    function WhatToDoController ($scope) {
        const vm = this;
        vm.selectedOption = selectedOption;

        vm.$onInit = activate;

        ////////////////

        function activate () {
        }

        function selectedOption (option, status) {
            $scope.$emit('selectedShuttleOption', option, status);
        }

    }
})();