(function () {
    'use strict';

    angular
        .module('ib-sticky-module')
        .directive('ibSticky', ibSticky);

    ibSticky.$inject = ['$window'];
    function ibSticky($window) {
        return {
            restrict: 'AE',
            link: link
        }

        function link(scope, element) {
            var sticky = angular.element(element),
                stickyAnchor = angular.element(element).find('[data-sticky-anchor]'),
                stickyFixed = angular.element(element).find('[data-sticky-fixed]'),
                stickyFixedMargin = stickyFixed.css('marginTop'),
                stickyClassActive = 'ib-sticky-active',
                stickyClassFixed = 'ib-sticky-fixed',
                windowElem = angular.element($window);

            angular.element($window).bind('resize', function () {
                stickyFixedMargin = stickyFixed.css('marginTop');
            });

            function stickyReload() {
                var stickyAnchorTop = stickyAnchor.offset().top,
                    stickyFixedHeight = stickyFixed.innerHeight(),
                    windowElemTop = windowElem.scrollTop();

                if (windowElemTop > stickyAnchorTop) {
                    sticky.addClass(stickyClassActive);

                    stickyFixed.css({
                        'position': 'fixed',
                        'top': '0px',
                        'zIndex': '1001',
                        'width': '100%'
                    }).addClass(stickyClassFixed);

                    stickyAnchor.height(stickyFixedHeight).css('marginTop', stickyFixedMargin);
                } else {
                    sticky.removeClass(stickyClassActive);
                    stickyFixed.removeAttr('style').removeClass(stickyClassFixed);
                    stickyAnchor.removeAttr('style');
                    stickyFixedMargin = stickyFixed.css('marginTop');
                }
            }

            windowElem.scroll(stickyReload);
            stickyReload();
        }
    }
})();