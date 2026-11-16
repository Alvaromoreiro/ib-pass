describe('ibComment Test', function () {
    var el, elm, template, scope, $interpolate;
    template = '<!-- directive: ib-comment "something something {{ "iberia" }}" -->';

    beforeEach(function () {
        angular.mock.module('ib-comment-module')
    });

    beforeEach(inject(function ($rootScope, $compile, _$interpolate_) {
        $interpolate = _$interpolate_;
        scope = $rootScope.$new();
        elm = angular.element(template);
        el = $compile(elm)(scope);
        scope.$apply();
    }));

    describe('When ibComment is submitted', function () {
        it('Check the directive', function (done) {
            scope.$broadcast('updateDatalayer');
            expect(el[0]).toBeDefined();
            scope.$digest();
            done();
        });
    });
});
