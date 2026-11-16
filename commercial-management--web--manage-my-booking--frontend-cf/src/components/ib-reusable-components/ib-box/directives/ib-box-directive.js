(function () {
    'use strict';
    angular
        .module('ib-box-module')
        .directive('ibBox', ibBox);

    ibBox.$inject = ['$timeout', '$document', 'ComponentsUtils'];
    /* istanbul ignore next */
    function ibBox($timeout, $document, ComponentsUtils) {
        return {
            restrict: 'A',
            link: link
        };
        function link($scope, $elem) {
            $timeout(function () {
                var boxLeft = angular.element($elem.children()[0]);
                var boxRight = angular.element($elem.children()[1]);
                var inputsTextBoxGroup = angular.element('input[type="text"]');
                var inputsPassBoxGroup = angular.element('input[type="password"]');
                var button = angular.element('.ib-box-form .ib-box-form__button');
                var checkOver = false;
                var checkFocus = false;

                function changeOpacityBoxIn() {
                    boxLeft.css({ 'opacity': .4, 'transition': 'opacity .5s' });
                    boxRight.css({ 'opacity': .4, 'transition': 'opacity .5s' });
                }
                function changeOpacityBoxOut() {
                    boxLeft.css('opacity', 1);
                    boxRight.css('opacity', 1);
                }
                function overBoxIn() {
                    var $thisBox = angular.element(this);
                    if (!checkOver && !checkFocus) {
                        changeOpacityBoxIn();
                        $thisBox.css('opacity', 1);
                    }
                    checkOver = true;
                }
                function overBoxOut() {
                    if (checkOver && !checkFocus) {
                        changeOpacityBoxOut();
                        checkOver = false;
                    }
                }
                function focusInputIn() {
                    angular.element(this).parents('.ib-checkin__container').triggerHandler('mouseover');
                    checkFocus = true;
                }
                function focusInputOut() {
                    checkFocus = false;
                    angular.element(this).parents('.ib-checkin__container').triggerHandler('mouseleave');
                }

                boxLeft.bind('mouseover', overBoxIn);
                boxLeft.bind('mouseleave', overBoxOut);
                boxRight.bind('mouseover', overBoxIn);
                boxRight.bind('mouseleave', overBoxOut);
                button.bind('click', function () {
                    ComponentsUtils.equalHeight($elem);
                });

                angular.forEach(inputsTextBoxGroup, addInputEvents);
                angular.forEach(inputsPassBoxGroup, addInputEvents);

                ComponentsUtils.equalHeight($elem);

                function addInputEvents(value, key) {
                    var currentInput = angular.element(value);
                    currentInput.bind('focus', focusInputIn);
                    currentInput.bind('focusout', focusInputOut);
                    currentInput.bind('blur', function () {
                        ComponentsUtils.equalHeight($elem);
                    });
                }
            });
        }
    }
})();
