(function () {
    'use strict';

    angular
        .module('ib-collapse')
        .controller('ibCollapseController', CollapseController);

    CollapseController.$inject = ['$timeout','$scope', '$window', 'localStorageService'];
    function CollapseController ($timeout, $scope, $window, localStorageService) {
        const vm = this;
        vm.isCollapsed = !!localStorageService.get('bookingInfo')?.passengers[0]?.frequentFlyer?.number;
        vm.showDetails = false;
        vm.text = '';
        vm.closedText = '';
        vm.openedText = '';
        vm.toggle = toggle;
        vm.externalChangeText = externalChangeText;
        vm.initCollapse = initCollapse;
        vm.clickCollapse = clickCollapse;
        vm.clickDetails = clickDetails;
        vm.errorEvent = errorEvent;
        vm.notScroll = notScroll;

        function clickCollapse (e, prevent) {
            vm.isCollapsed = !vm.isCollapsed;
            if (prevent || angular.isUndefined(prevent)) {
                e.preventDefault();
            }
        }

        function clickDetails (e, prevent) {
            vm.showDetails = !vm.showDetails;
            if (prevent || angular.isUndefined(prevent)) {
                e.preventDefault();
            }
        }

        function initCollapse (closedText, openedText) {
            vm.closedText = closedText;
            vm.text = closedText;
            vm.openedText = openedText;
        }

        function externalChangeText (text) {
            vm.text = !vm.isCollapsed ? text : vm.text;
            vm.closedText = text;
        }

        function toggle () {
            vm.isCollapsed = !vm.isCollapsed;
            vm.text = vm.isCollapsed ? vm.openedText : vm.closedText;
        }

        function errorEvent (error) {
            if (error) {
                if (vm.isCollapsed === false) {
                    vm.isCollapsed = !vm.isCollapsed;
                }
                return error;
            }
        }

        function notScroll () {
            $timeout(() => {
                if (!vm.isCollapsed) {
                    angular.element('html, body').scrollTop(0);
                    angular.element(document).find('body').eq(0).addClass('ib-collapse-top__scroll');
                } else {
                    angular.element(document).find('body').eq(0).removeClass('ib-collapse-top__scroll');
                    angular.element('html, body').scrollTop(0);
                    const posWindow = angular.element(document).scrollTop();
                    const position = angular.element('.ib-collapse-top').offset().top;
                    const comHeight = angular.element('.ib-collapse-top').height();
                    const top = position - posWindow + comHeight;
                    angular.element('.ib-collapse-top__content').css('top', top);
                }
            });
        }

        $scope.$on('collapseModal', (event, param) => {
            notScroll();
        });

        angular.element($window).on('resize', () => {
            angular.element('.ib-collapse-top__content').css('top', 'auto');
        });

    }
})();