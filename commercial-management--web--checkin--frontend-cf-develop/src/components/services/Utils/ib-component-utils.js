(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .factory('ComponentUtils', ComponentUtils);

    ComponentUtils.$inject = ['$rootScope', '$window', '$timeout', 'AddOnService'];
    function ComponentUtils($rootScope, $window, $timeout, AddOnService) {
        var service = {
            equalHeight: equalHeight,
            resizeHeightListElements: resizeHeightListElements,
            get_parents: get_parents,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
            initAddOn: initAddOn
        };

        return service;

        ////////////////

        // Equalize element heights
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
                var i, equals, auxHeight, maxHeight;
                for (i = 0; i <= equalNames.length; i++) {
                    equals = angular.element(e).find('[data-equal="'+equalNames[i]+'"]');
                    equals.css('height', 'auto');
                    if (equals.height() > 0) {
                        auxHeight = [];
                        maxHeight;
                        angular.forEach(equals, function (value) {
                            var $this = angular.element(value);
                            auxHeight.push($this[0].scrollHeight);
                        });
                        maxHeight = Math.max.apply(Math, auxHeight);
                        equals.css('height', maxHeight + 'px');
                    }
                }
            };
            if (reload) {
                autoHeight();
            } else {
                $timeout(function () {
                    autoHeight();
                });
            }
        };

        function resizeHeightListElements(element) {
            var auxHeight = [];
            var maxHeight;
            var $elements = angular.element(element);
            $elements.css('height', 'auto');
            angular.forEach($elements, function (value) {
                var $this = angular.element(value);
                auxHeight.push($this[0].clientHeight);
            });
            maxHeight = Math.max.apply(Math, auxHeight);
            $elements.css('height', maxHeight + 'px');
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

        /**
          * @function 
          * @name initAddOn
          * @desc init Add Ons 
          */
        function initAddOn() {
            var width = $window.innerWidth;
            if (width >= 768 && width < 1024) {
                AddOnService.displayAddOn($rootScope.BANNER_IDS.TYPE_0);
            } else if (width < 768) {
                AddOnService.displayAddOn($rootScope.BANNER_IDS.TYPE_1);
            } else if (width >= 1024 && width < 1280) {
                AddOnService.displayAddOn($rootScope.BANNER_IDS.TYPE_3);
            } else if (width >= 1280) {
                AddOnService.displayAddOn($rootScope.BANNER_IDS.TYPE_2);
            }
        };
    }
})();