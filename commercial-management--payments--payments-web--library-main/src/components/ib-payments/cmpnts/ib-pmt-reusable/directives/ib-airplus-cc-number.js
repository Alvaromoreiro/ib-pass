(function () {
    'use strict';

    angular
        .module('ib-reusable-module')
        .directive('ibAirplusCcNumber', ibAirplusCcNumber);

    /* istanbul ignore next */
    ibAirplusCcNumber.$inject = ['$timeout'];
    function ibAirplusCcNumber($timeout) {
        // Usage: <input ng-model="model" ib-airplus-cc-number></input>
        //
        // Creates: parse and format the user input credit card number grouping it 
        //
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            var transformedInput, inputValue, selectionEnd, previous;
            //format text going to user (model to view)
            $modelCtrl.$formatters.unshift(formatCard);

            //format text from the user (view to model)
            $modelCtrl.$parsers.unshift(parseCard);

            $element.on('input', function formatInput() {
                inputValue = $element.val();
                transformedInput = formatCard(parseCard(inputValue));
                if (transformedInput !== inputValue) {
                    previous = $modelCtrl.$viewValue;
                    selectionEnd = $element[0].selectionEnd;
                    if (previous && selectionEnd === previous.length && previous.length < transformedInput.length) {
                        selectionEnd = transformedInput.length;
                    }
                    setCursorPostion($element, selectionEnd);
                    $modelCtrl.$setViewValue(transformedInput);
                    $modelCtrl.$render();
                }
            });

        }

        function formatCard(inputValue) {
            var GROUP_PATTERN = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/;
            return inputValue ? (inputValue.match(GROUP_PATTERN) || []).slice(1).filter(Boolean).join(' ') : '';
        };

        function parseCard(number) {
            return !angular.isString(number) ? '' : number.replace(/[^\d]/g, '');
        }

        function setCursorPostion(element, position) {
            var range;
            $timeout(function () {
                if (element[0].setSelectionRange) {
                    element[0].setSelectionRange(position, position);
                } else if (element[0].createTextRange) {
                    range = element[0].createTextRange();
                    range.move('character', position);
                    range.select();
                }
            });
        }
    }

})();