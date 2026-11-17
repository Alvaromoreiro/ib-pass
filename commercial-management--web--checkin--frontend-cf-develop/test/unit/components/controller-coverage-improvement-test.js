describe('low-coverage controller behaviors', function () {
    var $controller, $rootScope, $scope;

    beforeEach(function () {
        angular.mock.module(
            'ib-tabs',
            'ib-passenger-deinvoicing-info-module',
            'ib-ticket-deinvoicing-module',
            'ib-what-to-do-module',
            'ib-your-flight-info-pa-module'
        );
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            spyOn($scope, '$emit');
        });
    });

    it('updates scrollable tabs through direct selection and broadcast events', function () {
        var controller = $controller('tabsScrollableController', { $scope: $scope });
        controller.updateScrollbar = jasmine.createSpy('updateScrollbar');

        expect(controller.active).toBe(0);
        expect(controller.configScroll.axis).toBe('x');
        controller.viewTab(2, '#tab-2');
        expect(controller.active).toBe(2);
        expect(controller.updateScrollbar).toHaveBeenCalledWith('scrollTo', '#tab-2');

        $scope.$broadcast('changeTabEvent', 3, '#tab-3');
        expect(controller.active).toBe(3);
        expect(controller.updateScrollbar).toHaveBeenCalledWith('scrollTo', '#tab-3');
    });

    it('emits the deinvoicing passenger-selection event and opens its warning modal', function () {
        var modalService = { showGenericModal: jasmine.createSpy('showGenericModal') };
        var datalayerConstants = { DATALAYER_MODAL_ID: { NO_PREVIOUS_SEGMENT_WARNING: 'no-previous-segment' } };
        var controller = $controller('PassengerDeinvoicingInfoController', {
            $scope: $scope,
            ModalService: modalService,
            CkiDatalayerConstants: datalayerConstants
        });

        controller.$onInit();
        controller.checkSelectedPassengers({ id: 'pax-1' }, 'select');
        expect($scope.$emit).toHaveBeenCalledWith('checkSelectedPassengersEvent', { id: 'pax-1' }, 'select');

        controller.openGenericModal({ reason: 'No previous flight segment' });
        expect(modalService.showGenericModal).toHaveBeenCalledWith({
            message: 'No previous flight segment',
            needsTranslate: false,
            idModal: 'no-previous-segment'
        });
    });

    it('forwards selected ticket segments to the parent scope', function () {
        var controller = $controller('TicketDeinvoicingController', { $scope: $scope });

        controller.$onInit();
        controller.checkSelectedSegments({ id: 'segment-1' }, 'segment-1');

        expect($scope.$emit).toHaveBeenCalledWith('checkSelectedSegmentsEvent', { id: 'segment-1' }, 'segment-1');
    });

    it('emits the selected shuttle option and its status', function () {
        var controller = $controller('WhatToDoController', { $scope: $scope });

        controller.$onInit();
        controller.selectedOption('seat', true);

        expect($scope.$emit).toHaveBeenCalledWith('selectedShuttleOption', 'seat', true);
    });

    it('emits the fare family requested by the passenger', function () {
        var controller = $controller('YourFlightInfoPAController', { $scope: $scope });

        controller.$onInit();
        controller.openFareConditionsModal({ name: 'economy' });

        expect($scope.$emit).toHaveBeenCalledWith('openFareConditionsModal', { name: 'economy' });
    });
});
