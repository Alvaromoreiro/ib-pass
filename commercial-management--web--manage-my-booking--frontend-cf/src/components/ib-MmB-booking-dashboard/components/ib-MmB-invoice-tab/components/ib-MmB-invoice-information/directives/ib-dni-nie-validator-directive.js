(function () {
    'use strict';

    angular.module('ib-MmB-invoice-information-module')
        .directive('ibDniNieValidator', ibDniNieValidator);

    /* istanbul ignore next */
    function ibDniNieValidator() {
        // Usage: <input ng-model="model" ib-dni-nie-validator></input>
        //
        // Creates: adds an spanish dni/nie validator with check digital control to the input
        //
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$parsers.push(validateDniNieNumber);
            $modelCtrl.$formatters.push(validateDniNieNumber);

            function validateDniNieNumber(number) {
                $modelCtrl.$setValidity('dniNie', dniNieCheck(number));
                return number;
            };
        };

        function dniNieCheck(dniNie) {
            if (dniNie === "") return;
            let isValid = false;
            const dniRegularExp = /^([0-9]{8})[A-Za-z]$/m;
            const nieRegularExp = /^[XYZxyz][0-9]{7}[A-Z]$/i;
            const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

            if (dniNie && dniRegularExp.test(dniNie)) {
                checkDigitControlDni(dniNie);
            } else if (dniNie && nieRegularExp.test(dniNie)) {
                checkDigitControlNie(dniNie);
            } else {
                isValid = false;
            }

            function checkDigitControlDni(DNInumber) {
                const onlyNumbers = DNInumber.replace(/[^0-9]+/g, "");
                const dniLetter = DNInumber.replace(/[0-9]+/g, "").toUpperCase();
                const rest = onlyNumbers % 23;
                if (letters.charAt(rest) === dniLetter) isValid = true;
            }

            function checkDigitControlNie(NIEnumber) {
                let replaceNIEnumber = NIEnumber.replace(NIEnumber[0], checkNieFirstLetter(NIEnumber[0]));
                const onlyNumbers = replaceNIEnumber.replace(/[^0-9]+/g, "");
                const nieLetter = replaceNIEnumber.replace(/[0-9]+/g, "").toUpperCase();
                const rest = onlyNumbers % 23;
                if (letters.charAt(rest) === nieLetter) isValid = true;
            }

            function checkNieFirstLetter(NieLetter) {
                let numberValue = null;
                switch (NieLetter) {
                    case 'X':
                    case 'x':
                        numberValue = 0;
                        break;
                    case 'Y':
                    case 'y':
                        numberValue = 1;
                        break;
                    case 'Z':
                    case 'z':
                        numberValue = 2;
                        break;
                    default:
                        break;
                }
                return numberValue;
            }

            return isValid;
        };
    }
})();
