(function () {


    angular
        .module('ib-booking-services-module')
        .factory('BookingComponentUtils', BookingComponentUtils);

    BookingComponentUtils.$inject = ['$timeout', '$window'];
    function BookingComponentUtils ($timeout, $window) {
        const service = {
            equalHeight: equalHeight,
            equalWidth: equalWidth,
            get_parents: get_parents,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
            detectNavigator: detectNavigator
        };

        return service;

        ////////////////

        function equalHeight (e, reload) {
            const equals = angular.element(e).find('[data-equal]');
            const equalNames = [];

            if (reload === void 0) {
                reload = false;
            }

            angular.forEach(equals, (value) => {
                const thisName = angular.element(value).data('equal');
                if (equalNames.indexOf(thisName) <= -1) {
                    equalNames.push(thisName);
                }
            });

            function autoHeight () {
                let equals, i, auxHeight = [], maxHeight;

                for (i = 0; i <= equalNames.length; i++) {
                    equals = angular.element(e).find('[data-equal="' + equalNames[i] + '"]');
                    equals.css('height', 'auto');
                    auxHeight = [];

                    angular.forEach(equals, (value) => {
                        const $this = angular.element(value);
                        auxHeight.push($this[0].clientHeight);
                    });

                    maxHeight = Math.max.apply(Math, auxHeight);
                    equals.css('height', '0');
                    equals.css('transition', 'height 0.5s');
                    equals.css('height', maxHeight + 'px');

                }
            }

            if (reload) {
                autoHeight();
            } else {
                $timeout(autoHeight);
            }
        }

        // Equalize element widths
        function equalWidth (e, reload) {
            const equals = angular.element(e).find('[data-equal-w]');
            const equalNames = [];

            if (reload === void 0) {
                reload = false;
            }

            angular.forEach(equals, (value) => {
                const thisName = angular.element(value).data('equal-w');
                if (equalNames.indexOf(thisName) <= -1) {
                    equalNames.push(thisName);
                }
            });

            function autoWidth () {
                let equals, i, auxWidth = [], maxWidth;

                for (i = 0 ; i <= equalNames.length ; i++) {
                    equals = angular.element(e).find('[data-equal-w="'+equalNames[i]+'"]');
                    equals.css('width', 'auto');
                    auxWidth = [];

                    angular.forEach(equals, (value) => {
                        const $this = angular.element(value);
                        auxWidth.push($this[0].clientWidth);
                    });

                    maxWidth = Math.max.apply(Math, auxWidth);
                    equals.css('width', '0');
                    equals.css('transition', 'width 0.5s');
                    equals.css('width', maxWidth + 'px');

                }
            }

            if (reload) {
                autoWidth();
            } else {
                $timeout(autoWidth);
            }
        }


        //Collect parent of an element (Native javascript y angular element)
        function get_parents (el, fn) {
            var el = el[0];
            while (el) {
                if (fn(el)) return el;
                el = el.parentNode;
            }
        }

        //Face effect opacity 0 to 1
        function fadeIn (el) {
            var el = el[0];
            let last, tick;
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
        function fadeOut (el) {
            var el = el[0];
            let last, tick;
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
        function detectNavigator () {
            let oldIE = false;
            if (angular.element('html').is('.ie7, .ie8, .ie9')) {
                oldIE = true;
            }
            return oldIE;
        }
    }
})();