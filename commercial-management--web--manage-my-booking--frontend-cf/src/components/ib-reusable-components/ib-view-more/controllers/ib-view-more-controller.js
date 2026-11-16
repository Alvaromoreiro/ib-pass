(function () {
    'use strict';
    angular
        .module('ib-view-more-module')
        .controller('ViewMoreController', ViewMoreController);

    function ViewMoreController() {
        var vm = this;
        vm.text = 'READ_MORE';
        vm.active = false;
        vm.changeText = changeText;

        function changeText(currentState) {
            vm.active = !currentState;
            vm.text = currentState && 'READ_MORE' || 'READ_LESS';
        }
    }
})();