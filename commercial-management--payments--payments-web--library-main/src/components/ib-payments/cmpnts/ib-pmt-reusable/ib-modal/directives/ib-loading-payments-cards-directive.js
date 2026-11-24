(function () {
    'use strict';

    angular
        .module('ib-modal-module')
        .directive('ibLoadingPaymentsCards', ibLoadingPaymentsCards);

    ibLoadingPaymentsCards.$inject = ['$rootScope', '$document', 'PmtConstants'];
    function ibLoadingPaymentsCards($rootScope, $document, PmtConstants) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE'
        };

        return directive;

        function link(scope, element, attrs) {
            var loopAnimation = true;
            var succesState;
            var endAnimation = false;
            var firstTimeLoad = true;
            var endPaymentEventCard;
            $rootScope.animData = {
                wrapper: $document[0].getElementById('container-loading'),
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: PmtConstants.imagesRoute + PmtConstants.loadingCardsPath,
                rendererSettings: {
                    progressiveLoad: true, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
                }
            };
            if ($rootScope.anim) {
                $rootScope.anim.pause();
                $rootScope.anim.destroy();
            }
            $rootScope.anim = bodymovin.loadAnimation($rootScope.animData);
            bodymovin.setSpeed(2);

            $rootScope.anim.addEventListener('data_ready', function () {
                if (firstTimeLoad) {
                    $rootScope.anim.playSegments([0, 14], true);
                    firstTimeLoad = false;
                }
                $rootScope.anim.removeEventListener('data_ready');
            });

            $rootScope.anim.onComplete = function () {
                if (loopAnimation) {
                    $rootScope.anim.playSegments([16, 42], true);
                } else if (!loopAnimation && !endAnimation) {
                    endAnimation = true;
                    bodymovin.destroy();
                    $rootScope.anim.pause();
                    $rootScope.anim.destroy();
                }
            }
            endPaymentEventCard = $rootScope.$on('endPaymentEventCard', function (event, succesStateData) {
                succesState = succesStateData;
                loopAnimation = false;
                $rootScope.anim.playSegments([117, 135], true);
            });
        }
    }

})();