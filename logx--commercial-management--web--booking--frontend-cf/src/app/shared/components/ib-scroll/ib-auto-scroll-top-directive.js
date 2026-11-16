(function () {


    angular
        .module('ib-scroll-module')
        .directive('ibAutoScrollTop', ibAutoScrollTop);

    ibAutoScrollTop.$inject = ['$document'];
    function ibAutoScrollTop ($document) {
        return {
            restrict: 'A',
            link: link
        };
        function link (scope, element) {
            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        }
    }
})();