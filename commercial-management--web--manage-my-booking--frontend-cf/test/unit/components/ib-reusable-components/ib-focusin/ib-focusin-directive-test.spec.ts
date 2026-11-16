describe('focusin Test', function () {
    var element, el, scope;

    beforeEach(function () {
        angular.mock.module('ib-focusin')
    });

    beforeEach(inject(function ($rootScope, $compile) {
        var template = '<div focusin></div>';
        scope = $rootScope;
        element = angular.element(template);
        el = $compile(element)(scope);
        scope.$apply();
    }));

    describe('When focusin is submitted', function () {
        it('Check the directive when event is mousedown', function (done) {
            var mousedownEvent: any = new Event('mousedown');
            el[0].dispatchEvent(mousedownEvent);
            expect(el[0]).not.toHaveClass('focus');
            scope.$digest();
            done();
        });

        it('Check the directive when event is keyup', function (done) {
            var keyupEvent: any = new Event('keyup');
            el[0].dispatchEvent(keyupEvent);
            expect(el[0]).toHaveClass('focus');
            scope.$digest();
            done();
        });

        it('Check the directive when event is focusout', function (done) {
            var focusoutEvent: any = new Event('focusout');
            el[0].dispatchEvent(focusoutEvent);
            expect(el[0]).not.toHaveClass('focus');
            scope.$digest();
            done();
        });
    });
});
