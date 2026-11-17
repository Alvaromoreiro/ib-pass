(function () {
    'use strict';
    angular
        .module('ib-list-checkin-module')
        .directive('ibListCheckIn', ibListCheckIn);

    ibListCheckIn.$inject = ['ComponentUtils','$timeout'];

    function ibListCheckIn(ComponentUtils, $timeout) {
        return {
            restrict: 'A',
            link: link
        }
        function link() {
            $timeout(function(){
                ComponentUtils.resizeHeightListElements('.ibe-ckeckin__list-box');
            }, 500);
            
        }
    }
})();
