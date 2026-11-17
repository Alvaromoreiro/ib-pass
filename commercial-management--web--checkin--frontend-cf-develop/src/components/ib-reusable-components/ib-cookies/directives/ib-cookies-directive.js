(function () {
    'use strict';
    angular
        .module('ib-cookies-module')
        .directive('ibCookies', ibCookies);

    ibCookies.$inject = ['$document'];

    function ibCookies($document){
        return{
            restrict: 'A',
            link: link
        }
        function link(scope, element) {
            var $elem = $document.querySelectorAll('[data-ibe-cookies="close"]');
            var $obj = [];
            angular.forEach($elem, function (value, key){
                $obj[key] = angular.element(value);
                $obj[key].bind('click', function(e){
                    e.preventDefault();
                    angular.element(element).remove();
                })
            })
        }
    }
})();
