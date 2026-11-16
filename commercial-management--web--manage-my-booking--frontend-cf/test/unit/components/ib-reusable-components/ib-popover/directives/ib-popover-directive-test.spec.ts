describe('popOver Directive Test', function () {
    var element, scope, el, $document;

    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy('externalRedirect').and.callFake(angular.noop)
    };

    var template =
        '<div class="testDirectivePopOver" >' +
            '<div class="ib-tools__lang" pop-over out-side-click="true">' +
            '</div>'+
        '</div>'+
        '<div class="" >' +
            '<a  class="ib-link" href="javascript:void(0)">' +
        '</div>';

    beforeEach(function () {
        angular.mock.module('ib-popover-module', function ($provide) {
            $provide.value('RedirectionService', fakeRedirectionService);
        });
    });

    beforeEach(inject(function ($rootScope, $compile, _$document_) {
        scope = $rootScope.$new();
        $document = _$document_;
        element = angular.element(template);
        scope.popoverCtrl ={
            isOpen : true,
        };
        el = $compile(element)(scope);
        scope.$apply();
    }));

    describe('When form is submitted', function () {
        it('Check the directive when element is clicked', function (done) {
            var ibLink = el.find('.ib-link');
            var tool = el.find('.ib-tools__lang');
            browserTrigger(ibLink,'click');
            browserTrigger(tool,'click');
            browserTrigger(ibLink,'click');
            $document.click();
            expect(scope.popoverCtrl.isOpen).toBe(false);
            scope.$digest();
            done();
        });
    });
});
