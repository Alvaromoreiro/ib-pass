describe("collapseMenu Directive Test", () => {
    let element, scope, el, $document;

    let template =
        '<div class="testDirectivecollapseMenu">' +
        '<div class="ib-tools__lang" collapse-menu out-side-click="true">' +
        "</div>" +
        "</div>" +
        '<div class="">' +
        '<a class="ib-link" href="javascript:void(0)">' +
        "</div>";

    beforeEach(() => {
        angular.mock.module("ib-MmB-booking-dashboard-module");
        inject(function ($rootScope, $compile, _$document_) {
            $document = _$document_;
            scope = $rootScope.$new();
            element = angular.element(template);
            el = $compile(element)(scope);
            scope.$apply();
        });
    });

    describe("When form is submitted", () => {
        it("Check the directive when element is clicked", (done) => {
            let ibLink = el.find(".ib-link");
            let tool = el.find(".ib-tools__lang");
            browserTrigger(ibLink, "click");
            browserTrigger(tool, "click");
            browserTrigger(ibLink, "click");
            $document.click();
            expect(scope.hide).toBe(true);
            scope.$digest();
            done();
        });
    });
});
