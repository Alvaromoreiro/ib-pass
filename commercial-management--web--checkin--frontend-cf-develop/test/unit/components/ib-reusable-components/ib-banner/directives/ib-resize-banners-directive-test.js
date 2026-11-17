describe('ibResizeBanners directive', function () {
    var directive;
    var rootScope;
    var fakeWindow;
    var localStorageService;
    var componentUtils;

    beforeEach(angular.mock.module('ib-banner-module', function ($provide) {
        fakeWindow = document.createElement('div');
        fakeWindow.innerWidth = 500;
        localStorageService = {
            get: jasmine.createSpy('get').and.returnValue(undefined),
            set: jasmine.createSpy('set')
        };
        componentUtils = { initAddOn: jasmine.createSpy('initAddOn') };
        $provide.value('$window', fakeWindow);
        $provide.value('ComponentUtils', componentUtils);
        $provide.value('localStorageService', localStorageService);
    }));

    beforeEach(inject(function (ibResizeBannersDirective, $rootScope) {
        directive = ibResizeBannersDirective[0];
        rootScope = $rootScope;
        spyOn(rootScope, '$emit').and.callThrough();
    }));

    it('updates the add-on type for each responsive width range', function () {
        directive.link({}, {}, {});

        [
            { width: 767, type: 1 },
            { width: 800, type: 0 },
            { width: 1100, type: 3 },
            { width: 1280, type: 2 }
        ].forEach(function (size) {
            fakeWindow.innerWidth = size.width;
            angular.element(fakeWindow).triggerHandler('resize');
            expect(localStorageService.set).toHaveBeenCalledWith('addOnType', size.type);
        });

        expect(componentUtils.initAddOn).toHaveBeenCalledTimes(4);
        expect(rootScope.$emit).toHaveBeenCalledWith('initializeIsAddOnEvent', true);
        expect(rootScope.$emit).toHaveBeenCalledWith('calculateAddOnTypeEvent', true);
    });

    it('does not reinitialize an unchanged add-on type and unregisters on destroy', function () {
        localStorageService.get.and.returnValue(1);
        directive.link({}, {}, {});
        fakeWindow.innerWidth = 500;

        angular.element(fakeWindow).triggerHandler('resize');
        var setCallsBeforeDestroy = localStorageService.set.calls.count();
        rootScope.$broadcast('destroyBanners');
        fakeWindow.innerWidth = 800;
        angular.element(fakeWindow).triggerHandler('resize');

        expect(componentUtils.initAddOn).not.toHaveBeenCalled();
        expect(rootScope.$emit).not.toHaveBeenCalled();
        expect(localStorageService.set.calls.count()).toBe(setCallsBeforeDestroy);
    });
});