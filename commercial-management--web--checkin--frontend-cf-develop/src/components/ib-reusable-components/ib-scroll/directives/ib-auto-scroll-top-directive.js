(function () {
    'use strict';

    angular
        .module('ib-scroll-module')
        .directive('ibAutoScrollTop', ibAutoScrollTop);

    ibAutoScrollTop.$inject = ['$window'];
    function ibAutoScrollTop($window) {
        return {
            restrict: 'A',
            link: link
        }
        function link(scope, element) {
            $window.scrollTo(0,element.scrollTop);
        }
    }
})();