(function () {
    'use strict';
    // CODE HERE
    angular
        .module('ib-view-more-old-module')
        .directive('ibViewMoreOld', ibViewMoreOld);

    ibViewMoreOld.$inject = ['$window'];

    function ibViewMoreOld($window) {
        return {
            restrict: 'A',
            link: link
        }
        function link(scope, element) {
            var $elem = angular.element(element),
                fc = $elem[0].querySelectorAll('.fc-collapse__moreInfo-link'),
                $fc = angular.element(fc),
                text = $elem.querySelectorAll('.ibe-collapse_moreInfo-text'),
                $text = angular.element(text),
                parr = $elem.querySelectorAll('.ibe-collapse_moreInfo-text .ibe-collapse_moreInfo-parr'),
                ewindow = angular.element($window);

            ewindow.on('resize', function() {
                var $this, parrHeight, i;
                $this = angular.element($fc);
                parrHeight = 0;
                for (i = 0; i < parr.length; i++) {
                    parrHeight = parrHeight + parr[i].clientHeight;
                }
                if ($text.hasClass('xui-collapse_moreInfo-text-open')) {
                    $text.css({
                        'height': parrHeight + 'px'
                    });
                }
            });


            $fc.on('click', function (e) {
                var $this, parrHeight, i;
                e.preventDefault();
                $this = angular.element(this);
                parrHeight = 0;
                for (i = 0; i < parr.length; i++) {
                    parrHeight = parrHeight + parr[i].clientHeight;
                }
                if ($text.hasClass('xui-collapse_moreInfo-text-close')) {
                    $text.css({
                        'height': parrHeight + 'px',
                        'transition': 'height .5s ease-in',
                        'overflow': 'hidden'
                    });
                    $text.removeClass('xui-collapse_moreInfo-text-close');
                    $text.addClass('xui-collapse_moreInfo-text-open');
                    $this.addClass('xui-collapse__moreInfo-link-open');
                } else {
                    $text.css('height', '3em');
                    $text.removeClass('xui-collapse_moreInfo-text-open');
                    $text.addClass('xui-collapse_moreInfo-text-close');
                    $this.removeClass('xui-collapse__moreInfo-link-open');
                }
            });
        }
    }
})();