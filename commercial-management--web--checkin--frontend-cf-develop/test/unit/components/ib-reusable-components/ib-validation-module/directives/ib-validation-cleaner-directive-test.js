describe('Validation cleaner Directive test', function () {

    var scope;
    var element;

    beforeEach(angular.mock.module('ib-validation-module'));


    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope;
        scope.myModel = '';

        element = angular.element('<form name="testForm"><input name="testInput" ng-model="myModel" type="text" data-ib-validator-cleaner="[0-9]" /></form>');

        $compile(element)(scope);
        scope.$digest();
    }));


    describe('when we set text on input', function () {
        it('numbers should be removed', function () {
            scope.testForm.testInput.$setViewValue('Some text 1900');
            scope.$digest();
            expect(scope.myModel).toBe('Some text ');
        });
    });
});