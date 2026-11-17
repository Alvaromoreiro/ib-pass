(function() {
    'use strict';

    angular
        .module('ib-pinch-zoom-module')
        .directive('ibPinchZoom', ibPinchZoom);

    ibPinchZoom.$inject = ['$rootScope', '$timeout'];
    function ibPinchZoom($rootScope, $timeout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            scope: false
        };
        return directive;

        function link(scope, element, attrs) {
            var elWidth, elHeight;
            var mode = '';
            // distance between two touche points (mode : 'pinch')
            var distance = 0;
            var initialDistance = 0;
            // image scaling
            var scale = 1;
            var relativeScale = 1;
            var initialScale = 1;
            var maxScale;
            var positionX = 0,// position of the upper left corner of the element
                positionY = 0,
                initialPositionX = 0,
                initialPositionY = 0,
                originX = 0,// central origin (mode : 'pinch')
                originY = 0;
            var startX = 0,// start coordinate and amount of movement (mode : 'swipe')
                startY = 0,
                moveX = 0,
                moveY = 0;
            $rootScope.scale = scale;
            maxScale = parseInt(attrs.maxScale, 10);
            if (isNaN(maxScale) || maxScale <= 1) {
                maxScale = 3;
            }

            $timeout(function() {
                elWidth = element[0].clientWidth;
                elHeight = element[0].clientHeight;

                element.css({
                    '-webkit-transform-origin': '0 0',
                    'transform-origin': '0 0'
                });

                element.on('touchstart', touchstartHandler);
                element.on('touchmove', touchmoveHandler);
                element.on('touchend', touchendHandler);
            }, 3000);

            /**
             * @param {object} evt
             */
            function touchstartHandler(evt) {
                var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

                startX = touches[0].clientX;
                startY = touches[0].clientY;
                initialPositionX = positionX;
                initialPositionY = positionY;
                moveX = 0;
                moveY = 0;
            }

            /**
             * @param {object} evt
             */
            function touchmoveHandler(evt) {
                var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;
                if (mode === '') {
                    if (touches.length === 1 && scale > 1) {
                        mode = 'swipe';
                    } else if (touches.length === 2) {
                        mode = 'pinch';
                        initialScale = scale;
                        initialDistance = getDistance(touches);
                        originX = touches[0].clientX -
                            parseInt((touches[0].clientX - touches[1].clientX) / 2, 10) -
                            element[0].offsetLeft - initialPositionX;
                        originY = touches[0].clientY -
                            parseInt((touches[0].clientY - touches[1].clientY) / 2, 10) -
                            element[0].offsetTop - initialPositionY;
                    }
                }

                if (mode === 'swipe') {
                    evt.preventDefault();
                    moveX = touches[0].clientX - startX;
                    moveY = touches[0].clientY - startY;
                    positionX = initialPositionX + moveX;
                    positionY = initialPositionY + moveY;
                    transformElement();
                } else if (mode === 'pinch') {
                    evt.preventDefault();
                    distance = getDistance(touches);
                    relativeScale = distance / initialDistance;
                    scale = relativeScale * initialScale;
                    positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
                    positionY = originY * (1 - relativeScale) + initialPositionY + moveY;
                    transformElement();
                }
            }

            /**
             * @param {object} evt
             */
            function touchendHandler(evt) {
                var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;
                if (mode === '' || touches.length > 0) {
                    return;
                }
                if (scale < 1) {
                    scale = 1;
                    positionX = 0;
                    positionY = 0;
                } else if (scale > maxScale) {
                    scale = maxScale;
                    relativeScale = scale / initialScale;
                    positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
                    positionY = originY * (1 - relativeScale) + initialPositionY + moveY;
                } else {
                    if (positionX > 0) {
                        positionX = 0;
                    }
                    if (positionY > 0) {
                        positionY = 0;
                    }
                }
                transformElement(0.1);
                mode = '';
            }

            /**
             * @param {Array} touches
             * @return {number}
             */
            function getDistance(touches) {
                var d = Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
                    Math.pow(touches[0].clientY - touches[1].clientY, 2));
                return parseInt(d, 10);
            }

            /**
             * @param {number} [duration]
             */
            function transformElement(duration) {
                var transition = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '';
                var matrixArray = [scale, 0, 0, scale, positionX, positionY];
                var matrix = 'matrix(' + matrixArray.join(',') + ')';
                element.css({
                    '-webkit-transition': transition,
                    transition: transition,
                    '-webkit-transform': matrix + ' translate3d(0,0,0)',
                    transform: matrix
                });
                $rootScope.scale = scale;
            }
        }
    }

})();