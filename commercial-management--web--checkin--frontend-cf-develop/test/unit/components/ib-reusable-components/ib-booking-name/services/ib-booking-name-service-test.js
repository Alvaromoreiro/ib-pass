describe('BookingNameService', function () {
    'use strict';

    var BookingNameService;
    var $uibModal;
    var CheckinRouterConstants;
    var modalInstance;

    beforeEach(angular.mock.module('ib-booking-name', function ($provide) {
        $uibModal = jasmine.createSpyObj('$uibModal', ['open']);

        CheckinRouterConstants = {
            templatesRoute: 'templates/checkin/'
        };

        modalInstance = {
            result: 'modal-result'
        };

        $uibModal.open.and.returnValue(modalInstance);

        $provide.value('$uibModal', $uibModal);
        $provide.value('CheckinRouterConstants', CheckinRouterConstants);
    }));

    beforeEach(inject(function (_BookingNameService_) {
        BookingNameService = _BookingNameService_;
    }));

    describe('checkName', function () {
        it('should open the booking name modal', function () {
            BookingNameService.checkName('Smith', 'FLOW-123');

            expect($uibModal.open).toHaveBeenCalled();
        });

        it('should return the modal instance', function () {
            var result = BookingNameService.checkName('Smith', 'FLOW-123');

            expect(result).toBe(modalInstance);
        });

        it('should configure the modal with the expected options', function () {
            BookingNameService.checkName('Smith', 'FLOW-123');

            expect($uibModal.open).toHaveBeenCalledWith(jasmine.objectContaining({
                controller: 'BookingNameModalController',
                templateUrl: 'templates/checkin/ibcose.modal-name.html',
                controllerAs: 'modalCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'ib-modals ib-modals--md'
            }));
        });

        it('should resolve surname and flowId for the modal controller', function () {
            var modalConfiguration;
            var resolvedObject;

            BookingNameService.checkName('Smith', 'FLOW-123');

            modalConfiguration = $uibModal.open.calls.mostRecent().args[0];
            resolvedObject = modalConfiguration.resolve.object();

            expect(resolvedObject).toEqual({
                surname: 'Smith',
                flowId: 'FLOW-123'
            });
        });

        it('should resolve empty values when surname and flowId are not provided', function () {
            var modalConfiguration;
            var resolvedObject;

            BookingNameService.checkName();

            modalConfiguration = $uibModal.open.calls.mostRecent().args[0];
            resolvedObject = modalConfiguration.resolve.object();

            expect(resolvedObject).toEqual({
                surname: undefined,
                flowId: undefined
            });
        });
    });
});
