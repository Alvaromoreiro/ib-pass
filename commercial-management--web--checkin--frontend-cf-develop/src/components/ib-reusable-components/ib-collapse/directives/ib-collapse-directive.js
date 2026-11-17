(function () {
    'use strict';
    angular
        .module('ib-collapse')
        .directive('collapse', collapse);

    collapse.$inject = [];
    function collapse() {
        return {
            restrict: 'AE',
            controller: 'ibCollapseController',
            link: link
        }
        function link(scope, elem, attrs) {
            if (scope.$eval(attrs.outSideClick)) {
                elem.bind('click', function(event){
                    var isClickedElementChildOfPopup = angular.element(elem).find(event.target).length > 0;
                    if (isClickedElementChildOfPopup) return;
                    scope.collapseCtrl.isCollapsed = false;
                    scope.$apply();
                });
                elem.bind('focusin',function(event){
                    var isClickedElementChildOfPopup = angular.element(elem).find(event.target).length > 0;
                    if (isClickedElementChildOfPopup) return;
                    scope.collapseCtrl.isCollapsed = false;
                    scope.$apply();
                });
            }
        }
    }
})();