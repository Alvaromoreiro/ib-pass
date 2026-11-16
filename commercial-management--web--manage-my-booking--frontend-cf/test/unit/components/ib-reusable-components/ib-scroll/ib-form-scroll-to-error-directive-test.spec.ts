describe('ibFormScrollToError Test', function () {
    var el, scope, $timeout;

    beforeEach(function () {
        angular.mock.module('ib-scroll-module')
    });

    describe('When ibAutoScrollTop is submitted & not have attribute modal', function () {
        beforeEach(inject(function ($rootScope, $compile, _$timeout_) {
            $timeout = _$timeout_;
            scope = $rootScope.$new();
            el = $compile('<form method="post" action="#" class="ib-form" ib-form-scroll-to-error><input class="ng-invalid"/><button class="ib-button" type="submit"></button></form>')(scope);
            scope.$apply();
        }));
        it('Check the directive', function (done) {
            browserTrigger(el,'submit');
            $timeout.flush();
            scope.$digest();
            expect(angular.element('body').animate({ 'scrollTop': el.find('.ng-invalid').offset().top - 20 })).toBeDefined();
            done();
        });
    });
});
