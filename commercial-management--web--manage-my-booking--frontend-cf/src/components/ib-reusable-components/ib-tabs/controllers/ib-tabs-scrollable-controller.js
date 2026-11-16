(function () {
    'use strict';

    angular
        .module('ib-tabs')
        .controller('tabsScrollableController', tabsController);

    tabsController.$inject = ['$window', '$rootScope'];
    function tabsController($window, $rootScope) {
        var vm = this;
        vm.active = 0;

        vm.viewTab = function(index, event) {
            var tab = angular.element(event.currentTarget);
            vm.active = index;
            event.preventDefault();
            
            vm.updateScrollbar('scrollTo', tab);
        };

        vm.configScroll = {
            scrollButtons: {
                scrollAmount: 'auto', // scroll amount when button pressed
                enable: true // enable scrolling buttons by default
            },
            scrollInertia: 400, // adjust however you want
            axis: 'x',
            theme: 'minimal-dark',
            autoHideScrollbar: true,
            callbacks:{
                onScrollStart: onScroll
            },
            advanced:{
                autoExpandHorizontalScroll:true
            }
        };
        function onScroll() {};


    }
})();