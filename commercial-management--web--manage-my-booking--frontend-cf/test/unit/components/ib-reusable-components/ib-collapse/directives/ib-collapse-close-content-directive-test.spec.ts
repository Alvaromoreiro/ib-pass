describe('collapseCloseContent Test', function () {
    var el, scope, $document, $animate, $timeout;

    beforeEach(function () {
        angular.mock.module('ib-collapse')
    });

    describe('When collapseCloseContent is submitted', function () {
        beforeEach(inject(function ($rootScope, $compile, _$document_, _$animate_, _$timeout_) {
            $document = _$document_;
            $animate = _$animate_;
            $animate.enabled(true);
            $timeout = _$timeout_;
            scope = $rootScope.$new();
            el = $compile('<div class="ib-link" collapse-close-content></div>')(scope);
            scope.$apply();
        }));
        it('Check the directive', function (done) {
            scope.$broadcast('closeContent');
            $animate.addClass(el, 'fadeInDown');
            $animate.removeClass(el, 'fadeInDown');
            $animate.addClass(el, 'fadeOutDown');
            scope.$digest();
            expect(el[0]).toHaveClass('fadeOutDown');
            done();
        });
    });
});
