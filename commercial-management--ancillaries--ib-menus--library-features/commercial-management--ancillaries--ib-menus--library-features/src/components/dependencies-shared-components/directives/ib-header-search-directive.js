(function () {
    'use strict';

    angular
        .module('dependencies-shared-components-module')
        .directive('ibHeaderSearch', ibHeaderSearch);

    function ibHeaderSearch() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            angular.element(element).on('click', function (){
                var bodyElem = angular.element('body');
                var searchElem = angular.element('.ib-advanced-search');
                if(!bodyElem.hasClass('modal-open') && searchElem.is(':hidden')){
                    bodyElem.addClass('modal-open');
                    searchElem.removeAttr('hidden');
                }else{
                    bodyElem.removeClass('modal-open');
                    searchElem.attr('hidden',true);
                }
            });
        }
    }
    
})();