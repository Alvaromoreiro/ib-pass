
describe('ibSimulatorCalendarSlidesLoading Test', () => {
    let element, timeout, window, el, scope, componentsUtils;
    let template = '<div ib-simulator-calendar-slides-loading class="ib-fc-calendar-slides-loading"><div class="u-position-relative" style="height:300px"></div></div>';

    let fakeComponentsUtils = {
        get_parents: jasmine.createSpy('get_parents').and.returnValue(angular.element(template))
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-simulator-booking-availability-module', ($provide) => {
            $provide.value('ComponentsUtils', fakeComponentsUtils);
        });
    });

    beforeEach(inject( (_$timeout_, _$window_, $rootScope, $compile) => {
        timeout = _$timeout_;
        window = _$window_;
        scope = $rootScope.$new();
        element = angular.element(template);
        el = $compile(element)(scope);
        document.body.insertAdjacentHTML(
            'afterbegin',
            template);
        scope.$apply();
    }));

    describe('When ibSimulatorCalendarSlidesLoading is submitted', () => {
        it('Check the directive', (done) => {
            // var ibLink = el.find('.ib-link');
            // browserTrigger(ibLink,'resize');
            expect(angular.element(window).triggerHandler('resize'));
            scope.$digest();
            done();
        });
    });
});
