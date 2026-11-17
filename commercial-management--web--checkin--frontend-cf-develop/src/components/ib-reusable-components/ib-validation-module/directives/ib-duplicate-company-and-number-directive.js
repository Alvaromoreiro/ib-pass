(function () {
    'use strict';

    angular.module('ib-validation-module')
        .directive('ibDuplicateCompanyAndNumber', ibDuplicateCompanyAndNumber);

    /* istanbul ignore next */
    function ibDuplicateCompanyAndNumber() {
        // Usage:
        // <input
        //     type="text"
        //     name="card_number_passenger_{{index}}"
        //     ng-model="passenger.cardNumber"
        //     ib-duplicate-company-and-number
        //     formData="vm.model.pasform"
        //     passenger-index="{{index}}"
        // />
        //
        // Validate if duplicate company and card number
        //
        var directive = {
            require: 'ngModel',
            scope: {
                formData: '=',
                passengerIndex: '@'
            },
            link: link
        };
        return directive;

        function link(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$validators.duplicateCompanyAndNumber = function (modelValue, viewValue) {
                return isCombinationUnique(scope.formData, scope.passengerIndex, modelValue || viewValue);
            };

            // Watch for changes in the current passenger's carrier
            scope.$watch(
                () => getCompanyValue(scope.formData, scope.passengerIndex),
                () => ngModelCtrl.$validate()
            );

            // Watch cambios en compañía y número de TODOS los pasajeros
            scope.$watch(
                () => collectCombinations(scope.formData),
                () => ngModelCtrl.$validate(),
                true // Deep watch to detect changes in the array
            );
        };

        function isCombinationUnique(formData, passengerIndex, cardValue) {
            const companyValue = getCompanyValue(formData, passengerIndex);

            if (!companyValue || !cardValue) {
                return true;
            }

            const combinations = collectCombinations(formData);

            return countOccurrences(
                combinations,
                buildKey(companyValue, cardValue)
            ) <= 1;
        }

        function collectCombinations(formData) {
            return Object.keys(formData)
                .filter(isCompanyKey)
                .map(key => {
                    const index = extractIndex(key);
                    return buildKey(
                        formData[key]?.$viewValue?.iataCompanyCode,
                        formData[`card_number_passenger_${index}`]?.$viewValue
                    );
                })
                .filter(Boolean);
        }

        function countOccurrences(list, value) {
            return list.filter(item => item === value).length;
        }

        function buildKey(company, card) {
            if (!company || !card) return null;
            return `${company}__${card}`;
        }

        function getCompanyValue(formData, passengerIndex) {
            return passengerIndex && formData && formData[`company_${passengerIndex}`]?.$viewValue?.iataCompanyCode;
        }

        function isCompanyKey(key) {
            return key.startsWith('company_');
        }

        function extractIndex(key) {
            return key.replace('company_', '');
        }
    }
})();
