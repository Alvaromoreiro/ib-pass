describe('IbShuttleFareDetailController test', () => {

    let $controller, $rootScope, $scope, controller, localStorageService;

    let fakeBookingModalService = {
        showGenericModal: jasmine.createSpy(),
        openFareWindowModal: jasmine.createSpy()
    };

    let fakeBookingAvailabilityTransformer = {
        getDetailedFaresInfo: function () {
            return {};       
        }
    };

    let fakeEvent = {
        preventDefault: function () {
        }
    };

    let index = 1;

    beforeEach(() => {
        angular.mock.module('ib-shuttle-module', 'LocalStorageModule', ($provide) => {

            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('BookingAvailabilityTransformer', fakeBookingAvailabilityTransformer);
        });
        inject((_$controller_, _$rootScope_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('IbShuttleFareDetailController', { $scope: $scope, $rootScope: $rootScope, localStorageService: localStorageService });
        });
    });

    describe('when activate() is called', () => {

        it('Should be called' , () => {
            spyOn(controller, '$onInit').and.callThrough();
            controller.$onInit();
            expect(controller.$onInit).toHaveBeenCalled();
        });
    });

    describe('when the openModalFare function is called', () => {
        it('should call  BookingModalService.showGenericModal with event', () => {
            controller.model = {
                fareFamilyConditions: {}
            };
            controller.openModalFare(fakeEvent, index);
            expect(fakeBookingModalService.openFareWindowModal).toHaveBeenCalledWith(false, 'ib-compare-fares-modal.html', { fareFamilyConditions: fakeBookingAvailabilityTransformer.getDetailedFaresInfo(controller.model.fareFamilyConditions)}, '');
            expect(fakeBookingModalService.openFareWindowModal).toHaveBeenCalled();
        });

        it('should call  BookingModalService.showGenericModal without event', () => {
            controller.model = {
                fareFamilyConditions: {}
            };
            controller.openModalFare(null, index);
            expect(fakeBookingModalService.openFareWindowModal).toHaveBeenCalledWith(false, 'ib-compare-fares-modal.html', { fareFamilyConditions: fakeBookingAvailabilityTransformer.getDetailedFaresInfo(controller.model.fareFamilyConditions)}, '');
            expect(fakeBookingModalService.openFareWindowModal).toHaveBeenCalled();
        });
    });

});
