describe('ibLoadItemImage Test', function () {
    var el, elm, template, template2, scope;
    template = '<div ib-load-item-image default-image="DEFAULT"></div>';
    template2 = '<div ib-load-item-image="TEST" default-image="DEFAULT"></div>';

    beforeEach(function () {
        angular.mock.module('ib-load-images-module')
    });

    describe('When ibLoadItemImage is submitted and only have default image', function () {
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            elm = angular.element(template);
            el = $compile(elm)(scope);
            scope.$apply();
        }));
        it('Check the directive', function (done) {
            expect(el[0].style.backgroundImage).toBe('url("DEFAULT")');
            scope.$digest();
            done();
        });
    });

    describe('When ibLoadItemImage is submitted and image.onerror() is called', function () {
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            elm = angular.element(template2);
            el = $compile(elm)(scope);
            scope.$apply();
        }));
        it('Check the directive', function (done) {
            expect(el[0].style.backgroundImage).toBe('');
            scope.$digest();
            done();
        });
    });
});
