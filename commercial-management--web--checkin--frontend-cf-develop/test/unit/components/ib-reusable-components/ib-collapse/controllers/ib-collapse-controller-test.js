describe('ibCollapseController', function () {
    var $controller;
    var $rootScope;
    var localStorageService;

    beforeEach(angular.mock.module('ib-collapse'));

    beforeEach(inject(function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        localStorageService = {
            get: jasmine.createSpy('get').and.returnValue(undefined)
        };
    }));

    function createController (bookingInfo) {
        var scope = $rootScope.$new();
        localStorageService.get.and.returnValue(bookingInfo);
        return $controller('ibCollapseController', {
            $scope: scope,
            localStorageService: localStorageService
        });
    }

    it('initializes expanded when a frequent flyer number is stored', function () {
        var controller = createController({
            passengers: [{ frequentFlyer: { number: 'FF123' } }]
        });

        expect(controller.isCollapsed).toBe(true);
        expect(controller.showDetails).toBe(false);
        expect(controller.text).toBe('');
    });

    it('initializes collapsed when no frequent flyer number is stored', function () {
        var controller = createController({ passengers: [{ frequentFlyer: {} }] });

        expect(controller.isCollapsed).toBe(false);
    });

    it('sets opened and closed labels and updates the visible text on toggle', function () {
        var controller = createController();

        controller.initCollapse('Show details', 'Hide details');
        expect(controller.text).toBe('Show details');

        controller.toggle();
        expect(controller.isCollapsed).toBe(true);
        expect(controller.text).toBe('Hide details');

        controller.toggle();
        expect(controller.isCollapsed).toBe(false);
        expect(controller.text).toBe('Show details');
    });

    it('updates closed text without replacing visible text while collapsed', function () {
        var controller = createController();
        controller.initCollapse('Show details', 'Hide details');
        controller.isCollapsed = true;

        controller.externalChangeText('Updated label');

        expect(controller.text).toBe('Show details');
        expect(controller.closedText).toBe('Updated label');
    });

    it('prevents default only when requested or unspecified for collapse and details clicks', function () {
        var controller = createController();
        var event = { preventDefault: jasmine.createSpy('preventDefault') };

        controller.clickCollapse(event);
        controller.clickDetails(event, true);
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        expect(controller.isCollapsed).toBe(true);
        expect(controller.showDetails).toBe(true);

        controller.clickCollapse(event, false);
        controller.clickDetails(event, false);
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
    });

    it('expands on error and returns the supplied error', function () {
        var controller = createController();
        var error = { message: 'Request failed' };

        expect(controller.errorEvent(error)).toBe(error);
        expect(controller.isCollapsed).toBe(true);

        controller.isCollapsed = true;
        expect(controller.errorEvent(error)).toBe(error);
        expect(controller.isCollapsed).toBe(true);
    });

    it('does not change state when no error is supplied', function () {
        var controller = createController();

        expect(controller.errorEvent(null)).toBeUndefined();
        expect(controller.isCollapsed).toBe(false);
    });
});