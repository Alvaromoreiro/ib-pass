(function () {


    angular
        .module('ib-booking-modal-module')
        .directive('ibFormatDocument', ibFormatDocument);

    /* istanbul ignore next */
    function ibFormatDocument () {
        // Usage: <input ng-model="model" ib-format-document></input>
        //
        // Creates: parse and format the user input document id for brasil country
        const directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link ($scope, $element, $attrs, $modelCtrl) {
            let transformedInput, inputValue;
            //format text going to user (model to view)
            $modelCtrl.$formatters.unshift(formatDocument);

            //format text from the user (view to model)
            $modelCtrl.$parsers.unshift(parseCard);

            $element.on('input', () => {
                inputValue = $element.val();
                transformedInput = formatDocument(parseCard(inputValue));
                if (transformedInput !== inputValue) {
                    $modelCtrl.$setViewValue(transformedInput);
                    $modelCtrl.$render();
                }
            });
        }

        function formatDocument (inputValue) {
            const GROUP_PATTERN = /(\d{1,3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/;
            const matchValue = inputValue ? (inputValue.match(GROUP_PATTERN) || []).slice(1) : [];
            return parseNumber(matchValue);
        }

        function parseNumber (number) {
            let i, valor = '';

            for (i = 0; i < number.length; i++) {
                if (number[i]) {
                    if (i === number.length - 1) {
                        valor = valor.concat('-' + number[i]);
                    } else {
                        valor.length > 0 ? valor = valor.concat('.' + number[i]) : valor = number[i];
                    }
                }
            }
            return valor ? valor : number;
        }

        function parseCard (number) {
            return !angular.isString(number) ? '' : number.replace(/[^\d]/g, '');
        }
    }

})();