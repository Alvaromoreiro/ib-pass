(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('PmtComponentUtils', PmtComponentUtils);

    PmtComponentUtils.$inject = ['$timeout', '$window'];
    function PmtComponentUtils($timeout, $window) {
        var service = {
            equalHeight: equalHeight,
            get_parents: get_parents,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
            detectNavigator: detectNavigator
        };

        return service;

        ////////////////

        function equalHeight(e, reload) {
            var equals = angular.element(e).find('[data-equal]');
            var equalNames = [];

            if (reload === void 0) {
                reload = false;
            }

            angular.forEach(equals, function (value) {
                var thisName = angular.element(value).data('equal');
                if (equalNames.indexOf(thisName) <= -1) {
                    equalNames.push(thisName);
                }
            });

            function autoHeight() {
                var equals, i, auxHeight = [], maxHeight;

                for (i = 0; i <= equalNames.length; i++) {
                    equals = angular.element(e).find('[data-equal="' + equalNames[i] + '"]');
                    equals.css('height', 'auto');
                    auxHeight = [];

                    angular.forEach(equals, function (value) {
                        var $this = angular.element(value);
                        auxHeight.push($this[0].clientHeight);
                    });

                    maxHeight = Math.max.apply(Math, auxHeight);
                    equals.css('height', '0');
                    equals.css('transition', 'height 0.5s');
                    equals.css('height', maxHeight + 'px');

                }
            };

            if (reload) {
                autoHeight();
            } else {
                $timeout(autoHeight);
            }
        };

        //Collect parent of an element (Native javascript y angular element)
        function get_parents(el, fn) {
            var el = el[0];
            while (el) {
                if (fn(el)) return el;
                el = el.parentNode;
            }
        }

        //Face effect opacity 0 to 1
        function fadeIn(el) {
            var el = el[0];
            var last, tick;
            el.style.opacity = 0;
            last = new Date().getTime();
            tick = function () {
                el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
                last = new Date().getTime();
                if (+el.style.opacity < 1) {
                    ($window.requestAnimationFrame && requestAnimationFrame(tick)) || $timeout(tick, 16);
                }
            };
            tick();
        }
        //Face effect opacity 1 to 0
        function fadeOut(el) {
            var el = el[0];
            var last, tick;
            el.style.opacity = 1;

            last = new Date().getTime();
            tick = function () {
                el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
                last = new Date().getTime();
                if (+el.style.opacity > 0) {
                    ($window.requestAnimationFrame && requestAnimationFrame(tick)) || $timeout(tick, 16);
                }
            };
            tick();
        }

        //Detect navigator
        function detectNavigator() {
            var oldIE = false;
            if (angular.element('html').is('.ie7, .ie8, .ie9')) {
                oldIE = true;
            }
            return oldIE;
        }
    }
})();