describe('tabResize Test', function () {
    var element, timeout, window, el, scope;
    var template =
        '<div>' +
            '<div class="ib-tools__lang" tab-resize>' +
            '</div>'+
        '</div>'+
        '<div class="" >' +
            '<a  class="ib-link" href="javascript:void(0)">' +
        '</div>';

    beforeEach(function () {
        angular.mock.module('ib-tabs')
    });

    beforeEach(inject(function (_$window_, $timeout, $compile, $rootScope) {
        timeout = $timeout;
        window = _$window_;
        scope = $rootScope.$new();
        element = angular.element(template);
        el = $compile(element)(scope);
        scope.$apply();
    }));

    describe('When tabResize is submitted', function () {
        it('Check the directive', function (done) {
            var ibLink = el.find('.ib-link');
            browserTrigger(ibLink,'resize');
            expect(angular.element(window).triggerHandler('resize'));
            scope.$digest();
            done();
        });
    });
});
