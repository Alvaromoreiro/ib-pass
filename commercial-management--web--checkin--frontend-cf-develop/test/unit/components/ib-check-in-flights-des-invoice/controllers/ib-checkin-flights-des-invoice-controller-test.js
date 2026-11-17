describe('FlightsPassengerDesController', function () {
    var $controller;
    var $rootScope;
    var controller;
    var localStorageService;
    var modalService;
    var ibUtilsService;
    var passengersService;
    var deinvoicingService;
    var $q;
    var constants;

    beforeEach(angular.mock.module('ib-checkin-flights-des-invoice-module', function ($provide) {
        constants = {
            TITLE_PAGE: { UN_RECOVERY: 'UN_RECOVERY' },
            QUADRIGAM: { UN_RECOVERY: 'UN_RECOVERY' }
        };
        localStorageService = {
            get: jasmine.createSpy('get'),
            remove: jasmine.createSpy('remove')
        };
        modalService = {
            isWaiting: jasmine.createSpy('isWaiting'),
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            showGenericModal: jasmine.createSpy('showGenericModal').and.returnValue({ result: { then: jasmine.createSpy('then') } })
        };
        ibUtilsService = {
            setTitlePage: jasmine.createSpy('setTitlePage'),
            goIbCose: jasmine.createSpy('goIbCose')
        };
        passengersService = {
            searchFlightsAndPassengers: jasmine.createSpy('searchFlightsAndPassengers')
        };
        deinvoicingService = {
            deinvoicingFlights: jasmine.createSpy('deinvoicingFlights')
        };

        $provide.value('CheckinAppConstants', constants);
        $provide.value('localStorageService', localStorageService);
        $provide.value('ModalService', modalService);
        $provide.value('FlightsPassengersService', passengersService);
        $provide.value('FlightsDesInvoiceModel', {
            initializeModel: jasmine.createSpy('initializeModel')
        });
        $provide.value('SearchFlightsPassengersService', {
            searchFlighsPassengersByLocatorAndSurname: jasmine.createSpy('searchFlighsPassengersByLocatorAndSurname')
        });
        $provide.value('CkiDatalayerConstants', {});
        $provide.value('CkiDatalayerUtilsService', {});
        $provide.value('CkiDataLayerService', { getDatalayerGeneral: jasmine.createSpy('getDatalayerGeneral').and.returnValue({}) });
        $provide.value('MonetateUtilsService', {});
        $provide.value('MonetateConstants', {});
        $provide.value('IbSessionConfigService', {});
        $provide.value('IbUtilsService', ibUtilsService);
        $provide.value('DeinvoicingService', deinvoicingService);
    }));

    beforeEach(angular.mock.inject(function (_$controller_, _$rootScope_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        passengersService.searchFlightsAndPassengers.and.returnValue(_$q_.defer().promise);
        controller = $controller('FlightsPassengerDesController', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new(),
            $timeout: jasmine.createSpy('$timeout')
        });
        controller.model.segmentsPassengersInfo = { segments: [], passengers: [] };
    }));

    it('updates the selected state of the matching segment', function () {
        controller.model.segmentsPassengersInfo.segments = [{ id: 10, isSelected: false }];

        controller.checkSelectedSegments(null, { target: { checked: true } }, 10);

        expect(controller.model.segmentsPassengersInfo.segments[0].isSelected).toBe(true);
    });

    it('updates passenger selection and the select-all state', function () {
        controller.model.segmentsPassengersInfo.passengers = [
            { id: 10, isSelected: false },
            { id: 20, isSelected: false }
        ];

        controller.checkSelectedPassengers(null, { id: 10 }, { target: { checked: true } });

        expect(controller.model.segmentsPassengersInfo.passengers[0].isSelected).toBe(true);
        expect(controller.checkboxAllSelected).toBe(false);

        controller.checkSelectedPassengers(null, { id: 20 }, { target: { checked: true } });

        expect(controller.checkboxAllSelected).toBe(true);
    });

    it('applies the select-all state to every passenger', function () {
        var passengers = [{ isSelected: false }, { isSelected: false }];

        controller.controlCheckAllPassengers(passengers, { target: { checked: true } });

        expect(passengers.every(function (passenger) { return passenger.isSelected; })).toBe(true);
    });

    it('clears booking identifiers before navigating to booking search', function () {
        controller.goToIbCose();

        expect(localStorageService.remove).toHaveBeenCalledWith('PNR');
        expect(localStorageService.remove).toHaveBeenCalledWith('checkinSurname');
        expect(ibUtilsService.goIbCose).toHaveBeenCalled();
    });

    it('opens the confirmation modal only when a segment and passenger are selected', function () {
        var segments = [{ id: 10, isSelected: true }];
        var passengers = [{ id: 20, isSelected: true, pasStatus: { undoChecked: false } }];

        controller.openModal('confirm-template', segments, passengers);

        expect(modalService.showGenericModal).toHaveBeenCalledWith(segments, false, 'confirm-template');

        modalService.showGenericModal.calls.reset();
        controller.openModal('confirm-template', [{ id: 10, isSelected: false }], passengers);

        expect(modalService.showGenericModal).not.toHaveBeenCalled();
    });

    it('sends selected segments and passengers and shows the error modal when deinvoicing fails', function () {
        var deferred = $q.defer();
        var error = { data: { errors: [{ message: 'Unable to deinvoice' }] } };
        localStorageService.get.and.callFake(function (key) {
            return key === 'flowId' ? 'flow-id' : null;
        });
        deinvoicingService.deinvoicingFlights.and.returnValue(deferred.promise);
        controller.model.segmentsPassengersInfo = {
            segments: [{ id: 10, isSelected: true }],
            passengers: [{ id: 20, isSelected: true, pasStatus: { isChecked: true } }]
        };

        controller.acceptSegmentsDesInvoicing();
        deferred.reject(error);
        $rootScope.$digest();

        expect(deinvoicingService.deinvoicingFlights).toHaveBeenCalledWith(
            { firstSegmentId: 10, passengers: [20] },
            'flow-id'
        );
        expect(modalService.isNotWaiting).toHaveBeenCalled();
        expect(modalService.showGenericModal).toHaveBeenCalledWith(
            error.data.errors[0],
            false,
            'ib-modal-deinvoicing-error'
        );
    });

    it('does not open the confirmation modal for passengers that have already been unchecked', function () {
        controller.openModal(
            'confirm-template',
            [{ id: 10, isSelected: true }],
            [{ id: 20, isSelected: true, pasStatus: { undoChecked: true } }]
        );

        expect(modalService.showGenericModal).not.toHaveBeenCalled();
    });
});