(function () {
    'use strict';
    angular
        .module('ib-limit-years-datepicker-module')
        .directive('ibLimitYearsDatepicker', ibLimitYearsDatepicker);

    ibLimitYearsDatepicker.$inject = ['$document', '$timeout'];
    /* istanbul ignore next */
    function ibLimitYearsDatepicker($document, $timeout) {
        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $element, $attrs) {
            var moveDirection;
            $timeout(function () {
                angular.element($element).find('.uib-left').bind('click', function (e) {
                    moveDirection = 'left';
                });
            });
            $timeout(function () {
                angular.element($element).find('.uib-right').bind('click', function (e) {
                    moveDirection = 'right';
                });
            });


            $scope.$on('datepicker.monthChanged', function (event, calendarRows) {
                $timeout(function () {
                    var i = 0, j, someDayEnabled = false;
                    while (!someDayEnabled && i < calendarRows.length) {
                        for (j = 0; j < calendarRows[i].length; j++) {
                            if (!calendarRows[i][j].disabled) {
                                someDayEnabled = true;
                            }
                        }
                        i++;
                    }
                    if (!someDayEnabled) {
                        if (moveDirection === 'right') {
                            angular.element($element).find('.uib-right').css({
                                'visibility': 'hidden'
                            });
                        } else {
                            angular.element($element).find('.uib-left').css({
                                'visibility': 'hidden'
                            });
                        }
                    } else {
                        if (moveDirection === 'left') {
                            angular.element($element).find('.uib-right').removeAttr('style');
                        } else {
                            angular.element($element).find('.uib-left').removeAttr('style');
                        }
                    }
                });
            });
        }


    }
})();
