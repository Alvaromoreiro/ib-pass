describe('collapse Directive Test', function () {
    var element, scope, el;

    var template =
        '<div class="testDirectiveCollapse" >' +
            '<div class="ib-tools__lang" collapse out-side-click="true">' +
        '</div>'+
        '</div>'+
        '<div class="" >' +
            '<a  class="ib-link" href="javascript:void(0)">' +
        '</div>';

    beforeEach(function () {
        angular.mock.module('ib-collapse')
    });

    describe('When form is submitted', function () {
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            element = angular.element(template);
            scope.collapseCtrl = {
                isCollapsed : true,
            };
            el = $compile(element)(scope);
            scope.$apply();
        }));
        it('Check the directive when element is clicked', function (done) {
            var ibLink = el.find('.ib-link');
            var tool = el.find('.ib-tools__lang');
            browserTrigger(ibLink,'click');
            browserTrigger(tool,'click');
            browserTrigger(ibLink,'click');
            scope.$digest();
            expect(scope.collapseCtrl.isCollapsed).toBe(false);
            done();
        });
    });

    describe('When form is submitted', function () {
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.collapseCtrl = {
                isCollapsed : true,
            };
            el = $compile(
                '<div class="testDirectiveCollapse" >' +
                    '<div class="ib-tools__lang" collapse out-side-click="true"></div>' +
                '</div>'+
                '<div class="" >' +
                    '<input/>' +
                '</div>'
                )(scope);
            scope.$apply();
        }));
        it('Check the directive when element is focusin', function (done) {
            browserTrigger(el,'focusin');
            expect(scope.collapseCtrl.isCollapsed).toBe(true);
            scope.$digest();
            done();
        });
    });
});
