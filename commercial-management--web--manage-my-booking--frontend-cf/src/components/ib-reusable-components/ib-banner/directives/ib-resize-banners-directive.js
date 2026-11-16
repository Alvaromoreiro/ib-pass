(function () {
    'use strict';

    angular
        .module('ib-banner-module')
        .directive('ibResizeBanners', ibResizeBanners);

    ibResizeBanners.$inject = ['$rootScope', '$timeout', '$window', 'ComponentsUtils', 'localStorageService'];
    function ibResizeBanners($rootScope, $timeout, $window, ComponentsUtils, localStorageService) {
        return {
            restrict: 'AE',
            link: link
        };
        function link($scope, $elem, $attrs) {
            var eWindow = angular.element($window);
            var destroyBannerEvent;

            eWindow.on('resize', addOnsEvents);

            destroyBannerEvent = $rootScope.$on('destroyBanners', function () {
                eWindow.off('resize', addOnsEvents);
            });

            $scope.$on('$destroy', destroyBannerEvent);

            function addOnsEvents() {
                var newWidth = $window.innerWidth, newAddOnType;
                var oldAddOnType = localStorageService.get('addOnType');
                if (newWidth >= 768 && newWidth < 1024) {
                    newAddOnType = 0;
                } else if (newWidth < 768) {
                    newAddOnType = 1;
                } else if (newWidth >= 1024 && newWidth < 1280) {
                    newAddOnType = 3;
                } else if (newWidth >= 1280) {
                    newAddOnType = 2;
                }

                if (newAddOnType !== oldAddOnType) {
                    $rootScope.$emit('initializeIsAddOnEvent', true);
                    ComponentsUtils.initAddOn();
                    $rootScope.$emit('calculateAddOnTypeEvent', true);
                }
                localStorageService.set('addOnType', newAddOnType);
            }
        }

    }
})();