(function () {
    'use strict';

    angular
        .module('ib-popover-module')
        .directive('popOver', popover);

    popover.$inject = ['$document'];
    function popover($document) {
        return {
            restrict: 'AE',
            controller: 'IbPopoverController',
            controllerAs: 'popoverCtrl',
            link: link
        };
        function link(scope, elem, attrs) {
            if (scope.$eval(attrs.outSideClick)) {
                $document.bind('click', function(event){
                    var isClickedElementPopOver = angular.element('.popover').find(event.target).length > 0;
                    if (isClickedElementPopOver)
                        return;
                    scope.popoverCtrl.isOpen = false;
                    scope.$apply();
                });
            }
        }

    }
})();