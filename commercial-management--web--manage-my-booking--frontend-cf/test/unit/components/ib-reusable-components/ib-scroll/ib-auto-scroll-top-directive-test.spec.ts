describe('ibAutoScrollTop Test', function () {
    var el, elm, template, template2, scope, $document;
    template = '<div class="modal-dialog"><div class="ib-link" ib-auto-scroll-top="modal"></div></div>';
    template2 = '<div class="ib-link" ib-auto-scroll-top="test"></div>';

    beforeEach(function () {
        angular.mock.module('ib-scroll-module')
    });

    describe('When ibAutoScrollTop is submitted & ibAutoScrollTop === modal', function () {
        beforeEach(inject(function ($rootScope, $compile, _$document_) {
            $document = _$document_;
            scope = $rootScope.$new();
            elm = angular.element(template);
            el = $compile(elm)(scope);
            scope.$apply();
        }));
        it('Check the directive', function (done) {
            var ibLink = el.find('.ib-link');
            browserTrigger(ibLink,'click');
            expect($document[0].body.scrollTop).toBe(0);
            scope.$digest();
            done();
        });
    });

    describe('When ibAutoScrollTop is submitted & ibAutoScrollTop !== modal', function () {
        beforeEach(inject(function ($rootScope, $compile, _$document_) {
            $document = _$document_;
            scope = $rootScope.$new();
            elm = angular.element(template2);
            el = $compile(elm)(scope);
            scope.$apply();
        }));
        it('Check the directive', function (done) {
            expect($document[0].body.scrollTop).toBe(0);
            scope.$digest();
            done();
        });
    });
});
