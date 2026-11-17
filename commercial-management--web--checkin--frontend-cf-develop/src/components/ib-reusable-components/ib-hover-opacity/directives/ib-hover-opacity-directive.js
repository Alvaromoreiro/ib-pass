(function () {
    'use strict';
    angular
        .module('ib-hover-opacity-module')
        .directive('ibHoverOpacity', ibHoverOpacity);

    ibHoverOpacity.$inject = ['$timeout'];   

    function ibHoverOpacity ($timeout){
        return{
            restrict: 'A',
            link: link
        }
        function link (scope, element) {
            $timeout(function(){
                var node = angular.element(element).children();
                var block = [];

                angular.forEach(node, function(value, key){
                    block[key] = angular.element(value);

                    block[key].bind('mouseover', function(){
                        var $thisBlock = angular.element(this);
                        node.css({
                            'opacity': 0.4,
                            'transition': 'opacity .5s'
                        });
                        $thisBlock.css('opacity', 1);
                    });
                    block[key].bind('mouseleave', function(){
                        node.css('opacity', 1);
                    })
                })
            },0.5);
        }
    }
})();