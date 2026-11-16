(function () {
    'use strict';

    angular
        .module('dependencies-shared-components-module')
        .directive('calculateHeightScroll', calculateHeightScroll);

    calculateHeightScroll.$inject = ['$window', '$rootScope'];
    function calculateHeightScroll($window, $rootScope) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elem, attrs) {
            var windowWidth = $window.innerWidth;
            var summaryBreakdown;

            var calculateHeightScrollEvent = $rootScope.$on('calculateHeightScrollEvent', calculateHeightScroll);

            function calculateHeightScroll() {
                var windowHeight = $window.innerHeight;
                var totalFixed = angular.element('.ib-fixed--bottom');
                var headerHeight = angular.element('.ib-header--basket-group').innerHeight();
                var shoppingHeight = angular.element('.ib-header-common__box .ib-layout__form-center').innerHeight();
                var footerShoping = angular.element('.ib-message-fixed-down').length > 0 ? angular.element('.ib-message-fixed-down').innerHeight() : 0;
                var calculateHeigthShoping = windowHeight - headerHeight - footerShoping;


                if (windowWidth < 768) {
                    summaryBreakdown = angular.element('.ib-summary-breakdown__footer-long');
                    angular.element(elem).css('height', '100%');
                    angular.element(summaryBreakdown[0]).css('position', 'fixed');
                    angular.element(summaryBreakdown[0]).css('bottom', '0');
                    angular.element(summaryBreakdown[0]).css('width', '100%');
                    angular.element('.ib-header-common__box').css('height', '100%');
                } else {
                    if (totalFixed.length > 0) {
                        if (headerHeight + shoppingHeight > windowHeight - totalFixed.innerHeight()) {
                            enableOverFlow(calculateHeigthShoping);
                        } else {
                            disableOverflow();
                        }
                    } else {
                        if (headerHeight + shoppingHeight > windowHeight - footerShoping) {
                            enableOverFlow(calculateHeigthShoping);
                        } else {
                            disableOverflow();
                        }
                    }
                }
            }

            angular.element('[data-calculate-scroll-height-click]').on('click', function () {
                calculateHeightScroll();
            });

            angular.element('.ib-summary-breakdown__item-text .ib-link').on('click', function () {
                calculateHeightScroll();
            });

            angular.element($window).on('resize', function () {
                windowWidth = $window.innerWidth;
                if (windowWidth < 768) {
                    summaryBreakdown = angular.element('.ib-summary-breakdown__footer-long');
                    angular.element(elem).css('height', '100%');
                    angular.element(summaryBreakdown[0]).css('position', 'fixed');
                    angular.element(summaryBreakdown[0]).css('bottom', '0');
                    angular.element(summaryBreakdown[0]).css('width', '100%');
                    angular.element('.ib-header-common__box').css('height', '100%');
                    disableOverflow();
                }
            });

            function enableOverFlow(shoppingHeight) {
                var styleShopping = { overflow: 'auto', height: shoppingHeight };
                angular.element(elem).css(styleShopping);
            }

            function disableOverflow() {
                var styleShopping = { overflow: 'auto', height: 'auto' };
                if (windowWidth > 768) {
                    angular.element(elem).css(styleShopping);
                }
            }
        }
    }
})();