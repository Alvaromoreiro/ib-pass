describe('tabResponsive Test', function () {
    var elm, scope;

    beforeEach(function () {
        module('ib-tabs')
    });

    beforeEach(inject(function ($rootScope, $compile) {
        elm = angular.element(
            '<div>' +
            '<div class="nav-pills">' +
            '</div>' +
            '</div>' +
            '<div class="nav-tabs" >' +
            '<a  class="ib-link" href="javascript:void(0)">' +
            '</div>');
        scope = $rootScope;
        $compile(elm)(scope);
        scope.$digest();
    }));

    describe('When tabResponsive is submitted', function () {
        it('Check the directive', function () {
            var titles = elm.find('.nav-pills, .nav-tabs', '.dropdown-toggle');
            titles.eq(0).find('div').click();
            expect(titles.eq(0)).not.toHaveClass('active');
        });
    });
});