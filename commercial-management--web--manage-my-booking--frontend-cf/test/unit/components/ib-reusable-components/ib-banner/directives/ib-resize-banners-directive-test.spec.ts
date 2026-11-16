describe('ibResizeBanners Directive Test', function () {
    var element, $timeout, scope, el, $window, $rootScope, localStorageService;

    var template =
        '<div>' +
            '<div class="ib-tools__lang" ib-resize-banners>' +
            '</div>'+
        '</div>'+
        '<div class="" >' +
            '<a  class="ib-link" href="javascript:void(0)">' +
        '</div>';

    var fakeComponentsUtils = {
        initAddOn: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-banner-module', 'LocalStorageModule', function ($provide) {
            $provide.value('ComponentsUtils', fakeComponentsUtils);
        });
    });

    beforeEach(inject(function (_$rootScope_, $compile,  _$timeout_, _$window_, _localStorageService_) {
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $window = _$window_;
        scope = $rootScope.$new();
        localStorageService = _localStorageService_;
        element = angular.element(template);
        el = $compile(element)(scope);
        scope.$apply();
    }));

    describe('When ibResizeBanners is submitted', function () {
        it('Check the directive with newWidth between 768 and 1024', function (done) {
            $window.innerWidth = 1000;
            var ibLink = el.find('.ib-link');
            browserTrigger(ibLink,'resize');
            expect(angular.element(window).triggerHandler('resize'));
            scope.$digest();
            done();
        });

        it('Check the directive with newWidth less than 768', function (done) {
            $window.innerWidth = 750;
            var ibLink = el.find('.ib-link');
            browserTrigger(ibLink,'resize');
            expect(angular.element(window).triggerHandler('resize'));
            scope.$digest();
            done();
        });

        it('Check the directive with newWidth between 1024 and 1280', function (done) {
            $window.innerWidth = 1200;
            var ibLink = el.find('.ib-link');
            browserTrigger(ibLink,'resize');
            expect(angular.element(window).triggerHandler('resize'));
            scope.$digest();
            done();
        });

        it('Check the directive with newWidth higher than 1280', function (done) {
            $window.innerWidth = 1300;
            var ibLink = el.find('.ib-link');
            browserTrigger(ibLink,'resize');
            expect(angular.element(window).triggerHandler('resize'));
            scope.$digest();
            done();
        });
    });
});
