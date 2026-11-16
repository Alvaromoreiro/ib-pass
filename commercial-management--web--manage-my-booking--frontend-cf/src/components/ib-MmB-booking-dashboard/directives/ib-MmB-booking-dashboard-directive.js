(function () {
    'use strict';

    angular
        .module('ib-MmB-booking-dashboard-module')
        .directive('collapseMenu', collapseMenu);

    collapseMenu.$inject = ['$document'];
    function collapseMenu($document) {
        return {
            restrict: 'AE',            
            link: link
        };
        function link(scope, elem, attrs) {
            scope.cancel = false;
            if (scope.$eval(attrs.outSideClick)) {
                $document.bind('click', function(event){
                    var isClickedElementChildOfMenu = angular.element(elem).find(event.target).length > 0;
                    if (isClickedElementChildOfMenu && !scope.cancel) return;
                    scope.hide = true;
                    scope.cancel = false;
                    scope.$apply();
                });
            }
        }

    }
})();