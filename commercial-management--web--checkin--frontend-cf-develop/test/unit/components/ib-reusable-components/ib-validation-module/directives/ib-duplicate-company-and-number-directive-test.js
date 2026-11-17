describe('ibDuplicateCompanyAndNumber Directive', () => {
    let $compile, $rootScope, $scope, element, ngModelCtrl;

    beforeEach(angular.mock.module('ib-validation-module'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

    function createDirective(html, scopeData) {
        angular.extend($scope, scopeData);
        element = $compile(html)($scope);
        $scope.$digest();
        ngModelCtrl = element.controller('ngModel');
        return element;
    }

    function setupTest(formData) {
        $scope.vm = { formData };
        const html = `
            <input 
                type="text" 
                name="card_number_passenger_0"
                ng-model="passenger.cardNumber"
                ib-duplicate-company-and-number
                form-data="vm.formData"
                passenger-index="0"
            />
        `;
        createDirective(html, $scope);
    }

    function testDuplicateValidation(formData, expectedResult, description) {
        it(description, () => {
            setupTest(formData);
            const result = ngModelCtrl.$validators.duplicateCompanyAndNumber('1234567890', '1234567890');
            expect(result).toBe(expectedResult);
        });
    }

    describe('Validator: duplicateCompanyAndNumber', () => {
        it('should return true when company or card value is empty', () => {
            setupTest({
                'company_0': { $viewValue: null },
                'card_number_passenger_0': { $viewValue: null }
            });

            const result = ngModelCtrl.$validators.duplicateCompanyAndNumber('', '');
            expect(result).toBe(true);
        });

        testDuplicateValidation(
            {
                'company_0': { $viewValue: { iataCompanyCode: 'IB' } },
                'card_number_passenger_0': { $viewValue: '1234567890' },
                'company_1': { $viewValue: { iataCompanyCode: 'BA' } },
                'card_number_passenger_1': { $viewValue: '0987654321' }
            },
            true,
            'should return true when combination is unique'
        );

        testDuplicateValidation(
            {
                'company_0': { $viewValue: { iataCompanyCode: 'IB' } },
                'card_number_passenger_0': { $viewValue: '1234567890' },
                'company_1': { $viewValue: { iataCompanyCode: 'IB' } },
                'card_number_passenger_1': { $viewValue: '1234567890' }
            },
            false,
            'should return false when combination is duplicated'
        );
    });

    describe('Watch: Company changes', () => {
        it('should revalidate when company value changes', () => {
            setupTest({
                'company_0': { $viewValue: { iataCompanyCode: 'IB' } },
                'card_number_passenger_0': { $viewValue: '1234567890' }
            });

            spyOn(ngModelCtrl, '$validate');
            $scope.vm.formData['company_0'].$viewValue = { iataCompanyCode: 'BA' };
            $scope.$digest();

            expect(ngModelCtrl.$validate).toHaveBeenCalled();
        });
    });

    describe('Watch: All passengers combinations', () => {
        it('should revalidate when any passenger data changes', () => {
            setupTest({
                'company_0': { $viewValue: { iataCompanyCode: 'IB' } },
                'card_number_passenger_0': { $viewValue: '1234567890' },
                'company_1': { $viewValue: { iataCompanyCode: 'BA' } },
                'card_number_passenger_1': { $viewValue: '0987654321' }
            });

            spyOn(ngModelCtrl, '$validate');
            $scope.vm.formData['card_number_passenger_1'].$viewValue = '1234567890';
            $scope.$digest();

            expect(ngModelCtrl.$validate).toHaveBeenCalled();
        });
    });
});
