(function () {
    'use strict';

    angular
        .module('ib-scroll-module')
        .directive('ibAutoScrollTop', ibAutoScrollTop);

    ibAutoScrollTop.$inject = ['$document'];
    function ibAutoScrollTop($document) {
        return {
            restrict: 'A',
            link: link
        };
        function link($scope, $element, attrs) {
            if(attrs.ibAutoScrollTop === 'modal'){
                $element.on('click', scrollTopModal);
            }else{
                $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
            }
            function scrollTopModal($element){
                angular.element($element.target).parents('.modal-dialog').animate({'scrollTop':0}, 500, 'linear');
            }    
        }
    }
})();