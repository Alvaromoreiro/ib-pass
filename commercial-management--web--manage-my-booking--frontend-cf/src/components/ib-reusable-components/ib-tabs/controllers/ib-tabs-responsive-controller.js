(function () {
    'use strict';

    angular
        .module('ib-tabs')
        .controller('tabResponsiveController', tabResponsiveController);

    tabResponsiveController.$inject = ['$window', '$rootScope'];
    function tabResponsiveController($window, $rootScope) {
        var vm = this;
    }
})();