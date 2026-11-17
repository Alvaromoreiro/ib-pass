(function () {
    'use strict';
    // CODE HERE
    angular
        .module('ib-view-more-module')
        .directive('ibViewMore', ibViewMore);

    /* istanbul ignore next */
    function ibViewMore() {
        return {
            restrict: 'A',
            link: link
        }
        function link(scope, element) {
            var $elem = angular.element(element),
                $fc = angular.element('.fc-collapse__more-info--link'),
                $text = angular.element('.ib-collapse__more-info--text'),
                parr = $elem.querySelectorAll('.ib-collapse__more-info--text .ib-collapse__more-info--parr');

            $fc.on('click', function (e) {
                var $this, parrHeight, i;
                e.preventDefault();
                $this = angular.element(this);
                parrHeight = 0;
                for (i = 0; i < parr.length; i++) {
                    parrHeight = parrHeight + parr[i].clientHeight;
                }
                if ($text.hasClass('xui-collapse__more-info--text-close')) {
                    $text.css({'height': parrHeight + 'px','transition': 'height .5s ease-in','overflow': 'hidden'});
                    $text.removeClass('xui-collapse__more-info--text-close');
                    $text.addClass('xui-collapse__more-info--text-open');
                    $this.addClass('xui-collapse__more-info--link-open');
                } else {
                    $text.css('height', '3em');
                    $text.removeClass('xui-collapse__more-info--text-open');
                    $text.addClass('xui-collapse__more-info--text-close');
                    $this.removeClass('xui-collapse__more-info--link-open');
                }
            });
        }
    }
})();