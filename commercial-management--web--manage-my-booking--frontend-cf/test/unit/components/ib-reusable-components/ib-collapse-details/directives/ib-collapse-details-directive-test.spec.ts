describe('ibCollapseDetails Directive Test', function () {

    var element, $document, scope, el;
    var template =
        '<div class="testDirectiveCollapse" >' +
            '<div class="ib-tools__lang" ib-collapse-details out-side-click="true">' +
            '</div>'+
        '</div>'+
        '<div class="" >' +
            '<a  class="ib-link" href="javascript:void(0)">' +
        '</div>';

    beforeEach(function () {
        angular.mock.module('ib-collapse-details-module')
    });

    beforeEach(inject(function ($rootScope, $compile,  _$document_) {
        $document = _$document_;
        scope = $rootScope.$new();
        element = angular.element(template);
        scope.collapseCtrl ={
            isCollapsed : false,
        };
        el = $compile(element)(scope);
        scope.$apply();
    }));

    describe('When form is submitted', function () {
        it('Check the directive', function (done) {
            var ibLink = el.find('.ib-link');
            var tool = el.find('.ib-tools__lang');
            browserTrigger(ibLink,'click');
            browserTrigger(tool,'click');
            browserTrigger(ibLink,'click');
            $document.click();
            scope.$digest();
            done();
        });
    });
});
