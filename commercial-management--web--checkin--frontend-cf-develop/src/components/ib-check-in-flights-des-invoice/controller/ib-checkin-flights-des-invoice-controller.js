(function () {
    'use strict';

    angular
        .module('ib-checkin-flights-des-invoice-module')
        .controller('FlightsPassengerDesController', FlightsPassengerDesController);

    FlightsPassengerDesController.$inject = ['$rootScope', '$scope', 'FlightsDesInvoiceModel', 'DeinvoicingService', 'ModalService', 'FlightsPassengersService', 'SearchFlightsPassengersService', '$timeout', 'CkiDatalayerConstants', 'CkiDatalayerUtilsService', 'localStorageService', 'CheckinAppConstants', 'CkiDataLayerService', 'MonetateUtilsService', 'MonetateConstants', 'IbSessionConfigService', 'IbUtilsService'];
    function FlightsPassengerDesController ($rootScope, $scope, FlightsDesInvoiceModel, DeinvoicingService, ModalService, FlightsPassengersService, SearchFlightsPassengersService, $timeout, CkiDatalayerConstants, CkiDatalayerUtilsService, localStorageService, CheckinAppConstants, CkiDataLayerService, MonetateUtilsService, MonetateConstants, IbSessionConfigService, IbUtilsService) {
        const vm = this;
        vm.model = FlightsDesInvoiceModel;
        vm.acceptSegmentsDesInvoicing = acceptSegmentsDesInvoicing;
        vm.openModal = openModal;
        vm.controlCheckAllPassengers = controlCheckAllPassengers;
        vm.goToIbCose = goToIbCose;
        vm.checkboxAllSelected = false;
        vm.checkSelectedSegments = checkSelectedSegments;
        vm.checkSelectedPassengers = checkSelectedPassengers;

        $scope.$on('checkSelectedSegmentsEvent', checkSelectedSegments);
        $scope.$on('checkSelectedPassengersEvent', checkSelectedPassengers);

        activate();

        function activate () {
            const getActualDataLayer = CkiDataLayerService.getDatalayerGeneral();
            const surname = localStorageService.get('checkinSurname');
            const locator = localStorageService.get('PNR');
            let quadrigam, segmentsPassengersInfoAux, aux, passengers, beforeQuad;
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.UN_RECOVERY, 2100);
            ModalService.isWaiting();
            vm.model.initializeModel();
            SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname(surname, locator, true);
            FlightsPassengersService.searchFlightsAndPassengers().then((data) => {
                vm.model.conditions = false;
                vm.manageDeinvoincing = true;
                segmentsPassengersInfoAux = localStorageService.get('bookingInfo');
                vm.model.segmentsPassengersInfo = segmentsPassengersInfoAux;
                vm.model.segmentsPassengersInfo.passengers = angular.copy(data.flightsPassengersInfo.passengers);
                vm.model.segmentsPassengersInfo.segments = angular.copy(data.flightsPassengersInfo.segments);
                checkPassengersChecked(segmentsPassengersInfoAux);
                localStorageService.set('segmentsPassengersInfo', data.flightsPassengersInfo);
                unselectDesInvoicingSegmentsAndPassenger();
                $rootScope.headerModel = data.infoHeader;

                beforeQuad = getActualDataLayer.quadrigam ? getActualDataLayer.quadrigam : CheckinAppConstants.QUADRIGAM.UN_RECOVERY;
                angular.extend(data.flightsPassengersInfo.dataLayer, {
                    quadrigam: beforeQuad === CheckinAppConstants.QUADRIGAM.UN_SEARCH ? CheckinAppConstants.QUADRIGAM.UN_RECOVERY : beforeQuad
                });

                $timeout(() => {
                    const bookingClass = data.flightsPassengersInfo.dataLayer.datalayerBookingType;
                    const isAirShuttle = data.flightsPassengersInfo.dataLayer.isAirShuttle ? CkiDatalayerConstants.DATALAYER_VALUES.YES : CkiDatalayerConstants.DATALAYER_VALUES.NO;
                    quadrigam = data.flightsPassengersInfo.dataLayer.quadrigam;
                    /* INIT DELETE GA4 MIGRATION*/
                    const extendedObject = {};
                    extendedObject[CkiDatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = bookingClass;
                    extendedObject[CkiDatalayerConstants.DATALAYER_INFO.IS_AIR_SHUTTLE] = isAirShuttle;
                    CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, extendedObject, IbSessionConfigService.isUserLogged());
                    CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                    /* FIN DELETE GA4 MIGRATION*/
                    const extendedDigitalDataInfo = {};
                    extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.BOOKING_CLASS] = bookingClass;
                    CkiDataLayerService.setProcessAndStep(quadrigam);
                    CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
                    CkiDatalayerUtilsService.updateDatalayerViewEvent();

                    MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, quadrigam);
                    $rootScope.$broadcast('updateDatalayer');
                    $rootScope.$broadcast('sendUpdateToMonetate');
                });
                ModalService.isNotWaiting();
            }, () => {
                ModalService.isNotWaiting();
            });
        }

        function checkPassengersChecked (segmentsPassengersInfoAux) {
            let i, j, k;
            for (i = 0; i < vm.model.segmentsPassengersInfo.segments.length; i++) {
                if (vm.model.segmentsPassengersInfo.segments[i].segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.AVAILABLE) {
                    vm.model.segmentsPassengersInfo.segments[i].segmentStatusAux = vm.model.segmentsPassengersInfo.segments[i].segmentStatus;
                    vm.model.segmentsPassengersInfo.segments[i].segmentStatus = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED[0];
                }
            }
            for (i = 0; i < segmentsPassengersInfoAux.segments.length; i++) {
                for (j = 0; j < vm.model.segmentsPassengersInfo.passengers.length; j++) {
                    if (segmentsPassengersInfoAux.segments[i].segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED[0]) {
                        vm.model.segmentsPassengersInfo.passengers[j].pasStatus.isChecked = true;
                    }
                }
            }
            for (i = 0; i < vm.model.segmentsPassengersInfo.outwardSegments.length; i++) {
                for (j = 0; j < vm.model.segmentsPassengersInfo.outwardSegments[i].passengers.length; j++) {
                    if (vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[0] || vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.NOT_AVAILABLE[0] || vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[1] || vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[2]) {
                        for (k = 0; k < vm.model.segmentsPassengersInfo.passengers.length; k++) {
                            if (vm.model.segmentsPassengersInfo.passengers[k].id === vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].id && vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[0]) {
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.undoChecked = true;
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.isChecked = false;
                            } else if (vm.model.segmentsPassengersInfo.passengers[k].id === vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].id) {
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.available = false;
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.isChecked = false;
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.reason = vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.message;
                            }
                        }
                    }
                }
            }
            for (i = 0; i < vm.model.segmentsPassengersInfo.returnSegments.length; i++) {
                for (j = 0; j < vm.model.segmentsPassengersInfo.returnSegments[i].passengers.length; j++) {
                    if (vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[0] || vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.NOT_AVAILABLE[0] || vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[1] || vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[2]) {
                        for (k = 0; k < vm.model.segmentsPassengersInfo.passengers.length; k++) {
                            if (vm.model.segmentsPassengersInfo.passengers[k].id === vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].id && vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].status.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE[0] && vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code !== CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED[0]) {
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.undoChecked = true;
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.isChecked = false;
                            } else if (vm.model.segmentsPassengersInfo.passengers[k].id === vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].id && vm.model.segmentsPassengersInfo.outwardSegments[i].passengers[j].status.code !== CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED[0]) {
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.available = false;
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.isChecked = false;
                                vm.model.segmentsPassengersInfo.passengers[k].pasStatus.reason = vm.model.segmentsPassengersInfo.returnSegments[i].passengers[j].status.message;
                            }
                        }
                    }
                }
            }
            if (vm.model.segmentsPassengersInfo.passengers.length === 1) {
                for (i = 0; i < vm.model.segmentsPassengersInfo.segments.length; i++) {
                    if (vm.model.segmentsPassengersInfo.segments[i].segmentStatusAux) {
                        vm.model.segmentsPassengersInfo.segments[i].segmentStatus = 'UNDOCHECKED';
                    } else if (vm.model.segmentsPassengersInfo.segments[i].segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED[0]) {
                        vm.model.segmentsPassengersInfo.passengers[0].pasStatus.undoChecked = false;
                        vm.model.segmentsPassengersInfo.passengers[0].pasStatus.isChecked = true;
                    }
                }
            }
        }

        function unselectDesInvoicingSegmentsAndPassenger () {
            const passengers = vm.model.segmentsPassengersInfo.passengers;
            const segments = vm.model.segmentsPassengersInfo.segments;
            if (passengers && segments !== null) {
                vm.checkPassengersDesInvoicing = true;
                for (let i = 0; i < segments.length; i++) {
                    segments[i].isSelected = false;
                }
                for (let i = 0; i < passengers.length; i++) {
                    passengers[i].isSelected = false;
                    if (passengers[i].pasStatus.isChecked !== true) {
                        vm.checkPassengersDesInvoicing = false;
                    }
                }
            }
        }

        function acceptSegmentsDesInvoicing () {
            let segmentPassengerData, responseData;
            const checkinId = localStorageService.get('flowId');
            ModalService.isWaiting();
            if (checkinId !== null) {
                segmentPassengerData = getPassengerSegmentInfoToDelete(vm.model.segmentsPassengersInfo);
                DeinvoicingService.deinvoicingFlights(segmentPassengerData, checkinId).then((responseData) => {
                    if (responseData !== null) {
                        updateDesInvoicingSuccess(responseData, vm.model.segmentsPassengersInfo);
                        /* INIT DELETE GA4 MIGRATION*/
                        CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(CheckinAppConstants.QUADRIGAM.UN_CONFIRM, null, IbSessionConfigService.isUserLogged());
                        /* FIN DELETE GA4 MIGRATION*/
                        CkiDataLayerService.setProcessAndStep(CheckinAppConstants.QUADRIGAM.UN_CONFIRM);
                        CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(CheckinAppConstants.QUADRIGAM.UN_CONFIRM, null, IbSessionConfigService.isUserLogged());
                        CkiDatalayerUtilsService.updateDatalayerViewEvent();
                        MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, CheckinAppConstants.QUADRIGAM.UN_CONFIRM);
                        $timeout(() => {
                            $rootScope.$broadcast('updateDatalayer');
                            $rootScope.$broadcast('sendUpdateToMonetate');
                        });
                    }
                }, (errorData) => {
                    updateDesInvoicingError(errorData);
                });
            }
        }

        function getPassengerSegmentInfoToDelete (segmentsPassengersInfo) {
            const inputObject = {
                firstSegmentId: 0,
                passengers: []
            };
            let i, firstSegmentId, forControl = true;

            for (i = 0; i < segmentsPassengersInfo.segments.length; i++) {
                if (segmentsPassengersInfo.segments[i].isSelected && forControl) {
                    firstSegmentId = segmentsPassengersInfo.segments[i].id;
                    forControl = false;
                }
            }
            inputObject.firstSegmentId = firstSegmentId;

            for (i = 0; i < segmentsPassengersInfo.passengers.length; i++) {
                if (segmentsPassengersInfo.passengers[i].isSelected && segmentsPassengersInfo.passengers[i].pasStatus.isChecked) {
                    inputObject.passengers.push(segmentsPassengersInfo.passengers[i].id);
                }
            }
            return inputObject;
        }

        function updateDesInvoicingSuccess (responseData, segmentsPassengersInfo) {
            let i, j, firstSegmentDeinvoicing = false;

            vm.desInvoicingValidate = true;
            for (i = 0; i < responseData.data.length; i++) {
                for (j = 0; j < segmentsPassengersInfo.segments.length; j++) {
                    if ((Number(responseData.data[i].id) === segmentsPassengersInfo.segments[j].id || firstSegmentDeinvoicing) && (segmentsPassengersInfo.segments[j].segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED[0])) {
                        segmentsPassengersInfo.segments[j].segmentStatus = 'UNDOCHECKED';
                        firstSegmentDeinvoicing = true;
                    } else {
                        vm.manageDeinvoincing = true;
                    }
                }
            }

            for (i = 0; i < responseData.data[0].passengers.length; i++) {
                for (j = 0; j < segmentsPassengersInfo.passengers.length; j++) {
                    if (Number(responseData.data[0].passengers[i].id) === segmentsPassengersInfo.passengers[j].id) {
                        segmentsPassengersInfo.passengers[j].pasStatus.isChecked = false;
                        segmentsPassengersInfo.passengers[j].pasStatus.undoChecked = true;
                    } else {
                        vm.manageDeinvoincing = true;
                    }
                }
            }
            vm.checkPassengersDesInvoicing = false;
            angular.element('html, body').animate({ scrollTop: 0 }, 'slow');
            ModalService.isNotWaiting();
        }

        function updateDesInvoicingError (errorModalData) {
            const errorData = errorModalData;
            const template = 'ib-modal-deinvoicing-error';

            ModalService.isNotWaiting();
            if (errorData === 409 || errorData === 408) {
                ModalService.showGenericModal(errorData.data.errors[0], false, template).result.then(acceptSegmentsDesInvoicing, angular.noop);
            } else if (errorData === 412 || errorData === 410) {
                ModalService.showGenericModal(errorData.data.errors[0], false, template).result.then(acceptSegmentsDesInvoicing, angular.noop);
            } else {
                ModalService.showGenericModal(errorData.data.errors[0], false, template).result.then(acceptSegmentsDesInvoicing, angular.noop);
            }
        }

        function openModal (template, segments, passengers) {
            let i, isSegmentSelected = false, isPassengerSelected = false;
            for (i = 0; i < segments.length; i++) {
                if (segments[i].isSelected && !isSegmentSelected) {
                    isSegmentSelected = true;
                }
            }
            for (i = 0; i < passengers.length; i++) {
                if (passengers[i].isSelected && !passengers[i].pasStatus.undoChecked && !isPassengerSelected) {
                    isPassengerSelected = true;
                }
            }
            if (isSegmentSelected && isPassengerSelected) {
                ModalService.showGenericModal(segments, false, template).result.then(acceptSegmentsDesInvoicing, angular.noop);
            }
        }

        function checkSelectedSegments (event, eventDom, idSegmentSelected) {
            const segments = vm.model.segmentsPassengersInfo.segments;
            segments.find((segment) => {
                if(segment.id === idSegmentSelected) {
                    segment.isSelected = eventDom.target.checked;
                }
            });
        }

        function checkSelectedPassengers (event, passengerInfo, mainEvent) {
            let checkCounter = 0;
            const passengers = vm.model.segmentsPassengersInfo.passengers;
            passengers.forEach((passenger) => {
                if(passenger.id === passengerInfo.id) {
                    passenger.isSelected = mainEvent.target.checked;
                }
                if(passenger.isSelected) {
                    checkCounter++;
                }
            });
            vm.checkboxAllSelected = (passengers.length === checkCounter);
        }

        function controlCheckAllPassengers (passengers, event) {
            passengers.forEach((passenger) => {
                passenger.isSelected = event.target.checked;
            });
        }

        function goToIbCose () {
            localStorageService.remove('PNR');
            localStorageService.remove('checkinSurname');
            IbUtilsService.goIbCose();
        }
    }
})();
