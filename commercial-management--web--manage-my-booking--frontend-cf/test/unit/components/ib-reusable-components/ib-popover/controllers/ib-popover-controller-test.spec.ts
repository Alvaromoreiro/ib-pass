describe('IbPopoverController test', function () {
    var $scope, controller, $controller, $rootScope;
    var path = 'https://www.test.com/';
    var blank = true;

    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy('externalRedirect').and.callFake(angular.noop)
    };

    beforeEach(function () {
        angular.mock.module('ib-popover-module', function ($provide) {
            $provide.value('RedirectionService', fakeRedirectionService);
        });
        inject(function(_$controller_, _$rootScope_, _$filter_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('IbPopoverController', { $scope: $scope });
        });
    });

    describe('init component', function () {
        it('its create correctly', function () {
            expect(controller).toBeDefined();
        });
    });

    describe('when close() function is called', function () {
        it('should set isOpen to false', function () {
            controller.isOpen = true;
            controller.close();
            expect(controller.isOpen).toEqual(false);
        });
    });

    describe('when goToPage() function is called', function () {
        it('should use redirect service with the path', function () {
            controller.goToPage(path, blank);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
        });
    });

    describe('when showData() function is called', function () {
        it('should set outboundFlight, returnFlight, passengers with params', function () {
            controller.showData('outboundFlight', 'returnFlight', 'passengers');
            expect(controller.outboundFlight).toEqual('outboundFlight');
            expect(controller.returnFlight).toEqual('returnFlight');
            expect(controller.passengers).toEqual('passengers');
        });
    });

    describe('when showModalToAvailability() function is called', function () {
        it('should emit (showModalAvailability, position param)', function () {
            spyOn($scope, '$emit');
            controller.showModalToAvailability('position');
            expect($scope.$emit).toHaveBeenCalledWith('showModalAvailability', 'position');
        });
    });

    describe('when callEvent() function is called', function () {
        it('should emit (changeTabEvent, tab)', function () {
            spyOn($scope, '$emit');
            controller.callEvent('test');
            expect($scope.$emit).toHaveBeenCalledWith('changeTabEvent', 'test');
        });
    });
});
