import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { Skeleton } from "commercial-management--digital--web-components-design--library";

(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-seat-info-module')
        .controller('MmbManageSeatInfoController', MmbManageSeatInfoController);

    MmbManageSeatInfoController.$inject = ['$rootScope', 'MmBModalService', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'MmBAncillariesUtilsService', 'localStorageService', 'CommonsUtilService'];

    function MmbManageSeatInfoController($rootScope, MmBModalService, MmBDatalayerUtilsService, MmBAppConstants, MmBAncillariesUtilsService, localStorageService, CommonsUtilService) {
        var vm = this;
        vm.openModalConditions = openModalConditions;
        vm.isFirstElement = isFirstElement;
        vm.resetElement = resetElement;
        vm.countSelected = 0;
        vm.isActiveLink = isActiveLink;
        vm.$onInit = activate;
        vm.emitGoToPaymentPage = emitGoToPaymentPage;
        vm.openDisruptedSeatsModal = openDisruptedSeatsModal;
        vm.skeletonComponent = Skeleton;
        vm.skeletonProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__baggage'
        };
        vm.skeletonIconProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__skeleton-icon'
        };
        vm.skeletonMainTextProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__seats-main-text'
        };
        vm.skeletonStatusTextProps = {
            className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__seats-status-text'
        };
        vm.getAllSegments = getAllSegments;
        vm.allSegments = [];

        $rootScope.$on('deleteSeats', deleteUpdateSeatsPending);
        $rootScope.$on('deleteAllPendingAncillaries', deleteAllPendingSeats);
        $rootScope.$on('deleteAllBasket', deleteAllPendingSeats);
        $rootScope.$on('acceptSeats', updateSeatsAccept);
        $rootScope.$on('updateBasket', updateSeatsGeneral);
        let updateSeatFlights = localStorageService.get('updateSeatFlights') ? localStorageService.get('updateSeatFlights') : [];

        function activate() {
            vm.allSegments = getAllSegments();
            vm.disruptedSeatsInfoModel = initDisruptedSeatsWarning();
            if (!updateSeatFlights.length) {
                setActiveLink();
                initializeSeat();
                updateSeatsAssigned();
                updateSeatsPendingFirstCharge();
                updatePassengersWithoutSeats();

            } else if (!$rootScope.fireUpdateSeatsAccept) {
                updateSeatsGeneral();
            } else {
                $rootScope.fireUpdateSeatsAccept = false;
            }

        }

        function initDisruptedSeatsWarning() {
                return {
                    title: 'SEATS_DISRUPTION_DASHBOARD_WARNING_TITLE',
                    text: 'SEATS_DISRUPTION_DASHBOARD_WARNING_TEXT',
                    buttonLinkText: 'SEATS_DISRUPTION_DASHBOARD_WARNING_LINK',
                    infoIcon: true,
                    cssClasses: {
                        wrapperClass: 'ib-box-info__wrapper alert-wrapper alert-wrapper__dark-gray u-p',
                        iconClass: 'u-font-xmedium u-pr-xxsmall icon__white icon-informacion',
                        titleClass: 'ib-box-info__title u-color-white u-font-xsm',
                        bodyTextClass: 'ib-box-info__container u-ml-xmedium',
                        textClass: 'ib-box-info__text u-font-xsm u-mt-xxsmall ib-box-info__alert-text',
                        buttonLinkTextClass: 'u-color-white u-font-xsm'
                    }
                };
        }
        function openDisruptedSeatsModal() {
            $rootScope.$broadcast('openDisruptedSeatsModal');
        }

        function updateSeatsAccept() {
            $rootScope.fireUpdateSeatsAccept = true;
            setActiveLink();
            updateSeatsAssigned();
            updateSeatsPending();
            updatePassengersWithoutSeats();
        }

        function updateSeatsGeneral(){
            setActiveLink();
            initializeSeat();
            updateSeatsAssigned();
            updateSeatsPending();
            updatePassengersWithoutSeats();

        }

        function getAllSegments() {
            let importLight = localStorageService.get('bookingInfoLight') ? localStorageService.get('bookingInfoLight') : [];
            let importLightSlices = importLight?.order?.slices ? importLight?.order?.slices : [];
            let allSegments = [];
            importLightSlices.forEach(slice => {
                if (slice?.segments) {
                    slice.segments.forEach(segment => {
                        allSegments.push(segment);
                    });
                }
            });
            
            return allSegments;
        }

        function isActiveLink(segmentId) {
            var activeLink = false, i;
            var segmentsSeatAvailable = localStorageService.get('seatsAvailableSegments') !== null ? localStorageService.get('seatsAvailableSegments') : '';
            for (i = 0; i < segmentsSeatAvailable.length; i++) {
                if (segmentsSeatAvailable[i] === segmentId && !vm.ancillariesInfo?.isPnrGroup) {
                    activeLink = true;
                }
            }
            return activeLink;

        }
        function setActiveLink() {
            if (!vm.model || !Array.isArray(vm.model.flights)) return;
            vm.model.flights.map(flight => {
                flight.activeLink = isActiveLink(flight.segmentId);
            });
        }

        function openModalConditions(event, segmentSeats) {
            if ((!segmentSeats.seats || !segmentSeats.seats.length) && (!segmentSeats.updatedSeats || !segmentSeats.updatedSeats.length)) {
                $rootScope.$broadcast('ancillariesSeatsNavigation', segmentSeats);
            } else {
                var activeLink = isActiveLink(segmentSeats.segmentId);
                MmBModalService.showGenericModal(false, 'ib-show-seats-modal.html', {
                    'selectedSegmentInfo': segmentSeats,
                    'activeLink': activeLink
                }, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
                CommonsUtilService.setTitlePage('MMB_TITLE_SEATS_INFO');
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MODSEA, MMBDatalayerConstants.DIGITAL_DATA_STEP.MODSEA, MmBAppConstants.QUADRIGAM.MODAL_INFO_SEATS);
            }

        }

        function isFirstElement() {
            vm.countSelected++;
            return vm.countSelected > 1 ? true : false;
        }

        function resetElement() {
            vm.countSelected = 0;
        }

        function addInfantPassengerSeat(seat) {
            const passengers = localStorageService.get('passengers') ? localStorageService.get('passengers') : [];
            seat.infant = undefined;
            //Add infant passenger to adult
            passengers.map(passenger => {
                if (passenger.passengerType === 'INFANT' && seat.id === passenger.relatedPassengerId) {
                    if (passenger.externalPersonalInfo) {
                        seat.infant = passenger.externalPersonalInfo.name + ' ' + passenger.externalPersonalInfo.firstSurname;
                    } else {
                        seat.infant = passenger.personalInfo.name + ' ' + passenger.personalInfo.surname;
                    }
                } else if (seat.id === passenger.passengerId) {
                    seat.userName = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.name;
                    seat.userSurname = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.firstSurname : passenger.personalInfo.surname;
                }
            });

            return seat;
        }

        function initializeSeat() {
            if (!vm.model) vm.model = {};
            if (!Array.isArray(vm.model.flights)) vm.model.flights = [];
            var m, t, a, x;
            var headerModel;
            var arrSelectedAux;
            const breakdownInfo = localStorageService.get('breakdownInfo') ? localStorageService.get('breakdownInfo') : [];
            headerModel = localStorageService.get('headerModel');
            arrSelectedAux = [];
            for (t = 0; t < vm.model.flights.length; t++) {
                vm.model.flights[t].seats = [];
                if (headerModel && headerModel.headerModel.shoppingBasket && headerModel.headerModel.shoppingBasket.seats && headerModel.headerModel.shoppingBasket.seats.hasSeats) {
                    for (a = 0; a < headerModel.headerModel.shoppingBasket.seats.segments.length; a++) {
                        if (vm.model.flights[t].segmentId === headerModel.headerModel.shoppingBasket.seats.segments[a].segmentId) {
                            headerModel.headerModel.shoppingBasket.seats.segments[a].price = headerModel.headerModel.shoppingBasket.seats.segments[a].total;
                            headerModel.headerModel.shoppingBasket.seats.segments[a].selected = false;
                            vm.model.flights[t].seats.push(headerModel.headerModel.shoppingBasket.seats.segments[a]);
                        }
                    }
                }
            }

            for (t = 0; t < vm.model.flights.length; t++) {
                arrSelectedAux = [];
                arrSelectedAux = vm.model.flights[t].seats;
                vm.model.flights[t].seats = [];
                vm.model.flights[t].segmentStatus = '';
                breakdownInfo.issuedItems?.map(issuedItem => {
                    if (issuedItem.type === 'SEAT') {
                        issuedItem.segments.map(segment => {
                            if  (vm.model.flights[t].segmentId === segment.id) {
                                segment.passengers.map(passenger => {
                                    let code = (passenger?.seat?.row ? passenger.seat.row : '') + (passenger?.seat?.column ? passenger.seat.column : '');
                                    let features = seatIssuedTypeDescription(segment.id, code) ? seatIssuedTypeDescription(segment.id, code) : '';
                                    let newElement = {
                                        code: code,
                                        id: passenger.id,
                                        price: passenger.amount,
                                        userName: '',
                                        userSurname: '',
                                        isShow: true,
                                        selected: passenger.selected,
                                        seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description
                                    };

                                    if(passenger.selected) {
                                        vm.model.flights[t].seats.push(newElement);
                                        vm.model.flights[t].seats.map(seat => {
                                            seat = addInfantPassengerSeat(seat);
                                        });
                                    }
                                });
                            };
                        });
                    };
                });


                breakdownInfo.freeItems?.map(freeItem => {
                    freeItem.segments?.map(segment => {
                        if  (vm.model.flights[t].segmentId === segment.id) {
                            segment.passengers.map(passenger => {
                                let code = passenger.seat.row + passenger.seat.column;
                                let features = seatFreeTypeDescription(segment.id, code) ? seatFreeTypeDescription(segment.id, code) : '';

                                let newElement = {
                                    code: code,
                                    id: passenger.id,
                                    price: passenger.amount,
                                    userName: '',
                                    userSurname: '',
                                    isShow: true,
                                    selected: passenger.selected,
                                    seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description
                                };

                                if(passenger.selected) {
                                    vm.model.flights[t].seats.push(newElement);
                                    vm.model.flights[t].seats.map(seat => {
                                        seat = addInfantPassengerSeat(seat);
                                    });
                                }
                            });

                        }
                    });

                });
                for (m = 0; m < arrSelectedAux.length; m++) {
                    if (arrSelectedAux[m].selected && arrSelectedAux[m].code !== 0) {
                        arrSelectedAux[m].isShow = arrSelectedAux[m].price > 0 ? false : true;
                        if (arrSelectedAux[m].isShow) {
                            let features = seatFreeTypeDescription(vm.model.flights[t].segmentId, arrSelectedAux[m].code) ? seatFreeTypeDescription(vm.model.flights[t].segmentId, arrSelectedAux[m].code) : (seatIssuedTypeDescription(vm.model.flights[t].segmentId, arrSelectedAux[m].code) ? seatIssuedTypeDescription(vm.model.flights[t].segmentId, arrSelectedAux[m].code) : '');
                            arrSelectedAux[m].seatTypeDescription = MmBAncillariesUtilsService.getTypeAndDescription(features).description;
                            //Add infant passenger to adult
                            arrSelectedAux[m] = addInfantPassengerSeat(arrSelectedAux[m]);
                            vm.model.flights[t].seats.push(arrSelectedAux[m]);
                        }
                    }
                    if (arrSelectedAux[m].price > 0) {
                        vm.model.flights[t].segmentStatus = 'pending';

                    }
                }

            }

        }
        /**
        * Emits an 'goToPaymentPage' event to redirect to payment page
        */
        function emitGoToPaymentPage() {
            $rootScope.$broadcast('goToPayment');
        }


        /**
         * Update seats first charge
         */
        function updateSeatsPendingFirstCharge() {
            const breakdownInfo = localStorageService.get('breakdownInfo') ? localStorageService.get('breakdownInfo') : [];
            const passengers = localStorageService.get('passengers') ? localStorageService.get('passengers') : [];
            vm.model.flights.map(flight => {
                let segmentIdFlight = flight.segmentId;
                breakdownInfo?.pendingPaymentItems?.map(pendingPayment => {
                    if (pendingPayment.type === 'SEAT') {
                        pendingPayment.segments.map(pendingSegment => {
                            if (pendingSegment.id === segmentIdFlight) {
                                flight.updatedSeats = [];
                                pendingSegment.passengers.map(pendingSegmentPassenger => {
                                    passengers.map(passenger => {
                                        if (passenger.passengerType !== 'INFANT' && pendingSegmentPassenger.id === passenger.passengerId) {
                                            let seatCode = pendingSegmentPassenger.seat.row + pendingSegmentPassenger.seat.column;
                                            let features = seatPendingTypeDescription(pendingSegment.id, seatCode) ? seatPendingTypeDescription(pendingSegment.id, seatCode) : (seatIssuedTypeDescription(pendingSegment.id, seatCode) ? seatIssuedTypeDescription(pendingSegment.id, seatCode) : '');
                                            let seat = {
                                                id: pendingSegmentPassenger.id,
                                                userName: passenger.personalInfo?.name ? passenger.personalInfo?.name : '',
                                                userSurname: passenger.personalInfo?.surname ? passenger.personalInfo?.surname : '',
                                                code: pendingSegmentPassenger.seat.row + pendingSegmentPassenger.seat.column,
                                                seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description
                                            };
                                            if (!flight.updatedSeats.includes(seat)) {
                                                flight.updatedSeats.push(seat);
                                            }
                                        }
                                    });
                                    //Add infant passenger to adult
                                    flight.updatedSeats.map(updatedSeat => {
                                        updatedSeat = addInfantPassengerSeat(updatedSeat);
                                    });
                                });

                            }

                        });
                    }
                });

            });
        }


        /**
        * Show updated seats
        */
        function updateSeatsPending() {
            const updateSeatFlights = localStorageService.get('updateSeatFlights') ? localStorageService.get('updateSeatFlights') : [];

            let segmentIdUpdate, segmentIdFlight;
            updateSeatFlights.map(updatedFlight => {
                segmentIdUpdate = updatedFlight.segmentId;
                vm.model.flights.map(flight => {
                    segmentIdFlight = flight.segmentId;
                    if (segmentIdUpdate === segmentIdFlight) {
                        flight.updatedSeats = [];
                        if (updatedFlight.status === 'pending' && flight.segmentId === updatedFlight.segmentId ) {
                            updatedFlight.seats.map(updatedSeat => {

                                //if seats array is empty go in
                                if (!flight.seats.length && !flight.updatedSeats.includes(updatedSeat) && updatedSeat.price > 0) {

                                    let features = seatPendingTypeDescription(segmentIdUpdate, updatedSeat.code) ? seatPendingTypeDescription(segmentIdUpdate, updatedSeat.code) : (seatIssuedTypeDescription(segmentIdUpdate, updatedSeat.code) ? seatIssuedTypeDescription(segmentIdUpdate, updatedSeat.code) : '');
                                    flight.updatedSeats.push({
                                        id: updatedSeat.id,
                                        userName: updatedSeat.userName,
                                        userSurname: updatedSeat.userSurname,
                                        code: updatedSeat.code,
                                        seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description
                                    });
                                } else {
                                    //if seats array not contain this new seat, add new seat (if neccessary when only change 1 seat of 4 for example)
                                    if (flight.seats.filter(e => e.code === updatedSeat.code).length === 0 && !flight.updatedSeats.includes(updatedSeat) && updatedSeat.price > 0) {
                                        let features = seatPendingTypeDescription(segmentIdUpdate, updatedSeat.code) ? seatPendingTypeDescription(segmentIdUpdate, updatedSeat.code) : (seatIssuedTypeDescription(segmentIdUpdate, updatedSeat.code) ? seatIssuedTypeDescription(segmentIdUpdate, updatedSeat.code) : '');
                                        flight.seats.filter((e, index) => {
                                            if (e.code === updatedSeat.codeInitial) {
                                                flight.seats.splice(index, 1);   //Remove seat assigned visually
                                            }
                                        });
                                        flight.updatedSeats.push({
                                            id: updatedSeat.id,
                                            userName: updatedSeat.userName,
                                            userSurname: updatedSeat.userSurname,
                                            code: updatedSeat.code,
                                            seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description

                                        });
                                    }
                                }
                            });
                        }
                        //Add infant passenger to adult
                        flight.updatedSeats.map(updatedSeat => {
                            updatedSeat = addInfantPassengerSeat(updatedSeat);
                        });
                    }
                });
            });

        }

        /**
        * Show update seats assigned
        */
        function updateSeatsAssigned() {
            const updateSeatFlights = localStorageService.get('updateSeatFlights') ? localStorageService.get('updateSeatFlights') : [];

            let segmentIdUpdate, segmentIdFlight;
            if (updateSeatFlights.length > 0) {
                updateSeatFlights.map(updateFlight => {
                    segmentIdUpdate = updateFlight.segmentId;
                    vm.model.flights.map(flight => {
                        segmentIdFlight = flight.segmentId;
                        if (segmentIdUpdate === segmentIdFlight) {
                            updateFlight.seats.map(seatUpdate => {
                                if (seatUpdate.code !== seatUpdate.codeInitial) {
                                    flight.seats.filter((e, index) => {
                                        if (e.code === seatUpdate.codeInitial) {
                                            flight.seats.splice(index, 1);   //Remove seat assigned visually
                                            if (seatUpdate.price === 0) {
                                                let features = seatFreeTypeDescription(segmentIdUpdate, seatUpdate.code) ? seatFreeTypeDescription(segmentIdUpdate, seatUpdate.code) : (seatIssuedTypeDescription(segmentIdUpdate, seatUpdate.code) ? seatIssuedTypeDescription(segmentIdUpdate, seatUpdate.code) : '');
                                                let newElement = {
                                                    code: seatUpdate.code,
                                                    id: seatUpdate.id,
                                                    userName: seatUpdate.userName,
                                                    userSurname: seatUpdate.userSurname,
                                                    isShow: true,
                                                    selected: true,
                                                    seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description
                                                };

                                                flight.seats.push(newElement);
                                            }
                                        }
                                    });
                                    if (flight.seats.filter(e => e.code === seatUpdate.code).length === 0 && seatUpdate.price === 0) {
                                        let features = seatFreeTypeDescription(segmentIdUpdate, seatUpdate.code) ? seatFreeTypeDescription(segmentIdUpdate, seatUpdate.code) : (seatIssuedTypeDescription(segmentIdUpdate, seatUpdate.code) ? seatIssuedTypeDescription(segmentIdUpdate, seatUpdate.code) : '');
                                        let newElement = {
                                            code: seatUpdate.code,
                                            id: seatUpdate.id,
                                            userName: seatUpdate.userName,
                                            userSurname: seatUpdate.userSurname,
                                            isShow: true,
                                            selected: true,
                                            seatTypeDescription: MmBAncillariesUtilsService.getTypeAndDescription(features).description
                                        };

                                        flight.seats.push(newElement);
                                    }
                                    //Add infant passenger to adult
                                    flight.seats.map(updatedSeat => {
                                        updatedSeat = addInfantPassengerSeat(updatedSeat);
                                    });

                                }
                            });

                        }

                    });

                });
            } else if (vm.model?.flights?.length > 0) {
                for (let x = 0; x < vm.model.flights.length; x++) {
                    let flight = vm.model.flights[x];
                    segmentIdUpdate = flight.segmentId;
                    for (let y = 0; y < flight.seats.length; y++) {
                        let seat = flight.seats[y];
                        if (!seat.seatTypeDescription) {
                            let features = seatFreeTypeDescription(segmentIdUpdate, seat.code) ? seatFreeTypeDescription(segmentIdUpdate, seat.code) : (seatIssuedTypeDescription(segmentIdUpdate, seat.code) ? seatIssuedTypeDescription(segmentIdUpdate, seat.code) : '');
                            seat.seatTypeDescription = MmBAncillariesUtilsService.getTypeAndDescription(features).description;
                        }

                    }
                    //Add infant passenger to adult
                    flight.seats.map(seat => {
                        seat = addInfantPassengerSeat(seat);
                    });

                }
            }
        }

        function updatePassengersWithoutSeats() {
            const passengers = localStorageService.get('passengers') ? localStorageService.get('passengers') : [];
            vm.model.flights.map(flight => {
                flight.passengersWithoutSeats = [];
                if (!flight.updatedSeats) {
                    flight.updatedSeats = [];
                }
                //add passengers without seats
                passengers.map(passenger => {
                    if (!flight.passengersWithoutSeats.includes(passenger) && flight.seats.filter(seat => seat.id === passenger.passengerId).length === 0 && flight.updatedSeats.filter(updatedSeat => updatedSeat.id === passenger.passengerId).length === 0) {
                        if (passenger.passengerType !== 'INFANT') {
                            flight.passengersWithoutSeats.push(passenger);
                        }

                    }
                });
                //Add infant passenger to adult
                passengers.map(passenger => {
                    flight.passengersWithoutSeats.map(passengerWithoutSeat => {
                        if (passenger.passengerType === 'INFANT' && passengerWithoutSeat.passengerId === passenger.relatedPassengerId) {
                            let name = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.name;
                            let surname = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.firstSurname : passenger.personalInfo.surname;
                            passengerWithoutSeat.infant = name + ' ' + surname;

                        }
                    });
                });

            });
        }

        /**
        * Return seatTypeDescription for seatsSelectedInfoData
        */
        function seatTypeDescriptionGlobal(segmentIdFlight, codeSeat, seatsSelectedInfoData) {
            for (let seatSelected in seatsSelectedInfoData) {
                let segment = seatsSelectedInfoData[seatSelected];
                if (segmentIdFlight === segment.id) {
                    for (let y = 0; y < segment.passengersInfo.length; y++) {
                        let passenger = segment.passengersInfo[y];
                        let codeProv = passenger.currentSeat.row + passenger.currentSeat.column;
                        if (codeSeat === codeProv) {
                            return passenger.currentSeat.seatType;
                        }
                    }

                }
            }
        }

        /**
        * Return seatTypeDescription for free seats
        */
        function seatFreeTypeDescription(segmentIdFlight, codeSeat) {
            const breakdownInfo = localStorageService.get('breakdownInfo') ? localStorageService.get('breakdownInfo') : [];
            const seatsSelectedInfoData = localStorageService.get('seatsSelectedInfoData') ? localStorageService.get('seatsSelectedInfoData') : null;

            if (seatsSelectedInfoData) {
                return seatTypeDescriptionGlobal(segmentIdFlight, codeSeat, seatsSelectedInfoData);
            }

            for (let x = 0; x < breakdownInfo?.freeItems?.length; x++) {
                let freeItem = breakdownInfo.freeItems[x];
                if (freeItem.type === 'SEAT') {
                    for (let y = 0; y < freeItem.segments.length; y++) {
                        let freeItemSegment = freeItem.segments[y];
                        if (segmentIdFlight === freeItemSegment.id) {
                            for (let z = 0; z < freeItemSegment.passengers.length; z++) {
                                let codeProv = freeItemSegment.passengers[z].seat.row + freeItemSegment.passengers[z].seat.column;
                                if (codeSeat === codeProv) {
                                    return freeItemSegment.passengers[z].seat.features;
                                }
                            };
                        }
                    };
                }
            };


        }

        /**
        * Return seatTypeDescription for pending seats
        */
        function seatPendingTypeDescription(segmentIdFlight, codeSeat) {
            const breakdownInfo = localStorageService.get('breakdownInfo') ? localStorageService.get('breakdownInfo') : [];
            const seatsSelectedInfoData = localStorageService.get('seatsSelectedInfoData') ? localStorageService.get('seatsSelectedInfoData') : null;

            if (seatsSelectedInfoData) {
                return seatTypeDescriptionGlobal(segmentIdFlight, codeSeat, seatsSelectedInfoData);
            }

            for (let x = 0; x < breakdownInfo?.pendingPaymentItems?.length; x++) {
                let pendingPayment = breakdownInfo.pendingPaymentItems[x];
                if (pendingPayment.type === 'SEAT') {
                    for (let y = 0; y < pendingPayment.segments.length; y++) {
                        let pendingSegment = pendingPayment.segments[y];
                        if (segmentIdFlight === pendingSegment.id) {
                            for (let z = 0; z < pendingSegment.passengers.length; z++) {
                                let codeProv = pendingSegment.passengers[z].seat.row + pendingSegment.passengers[z].seat.column;
                                if (codeSeat === codeProv) {
                                    return pendingSegment.passengers[z].seat.features;
                                }
                            };
                        }
                    };
                }
            };
        }

        /**
        * Return seatTypeDescription for issued seats
        */
        function seatIssuedTypeDescription(segmentIdFlight, codeSeat) {
            const breakdownInfo = localStorageService.get('breakdownInfo') ? localStorageService.get('breakdownInfo') : [];
            for (let x = 0; x < breakdownInfo?.issuedItems?.length; x++) {
                let issuedItems = breakdownInfo.issuedItems[x];
                if (issuedItems.type === 'SEAT') {
                    for (let y = 0; y < issuedItems.segments.length; y++) {
                        let issuedSegment = issuedItems.segments[y];
                        if (segmentIdFlight === issuedSegment.id) {
                            for (let z = 0; z < issuedSegment.passengers.length; z++) {
                                let codeProv = issuedSegment.passengers[z].seat.row + issuedSegment.passengers[z].seat.column;
                                if (codeSeat === codeProv) {
                                    return issuedSegment.passengers[z].seat.features;
                                }
                            };
                        }
                    };
                }
            };
        }

        function deleteAllPendingSeats(e, x) {
            const updateSeatFlights = localStorageService.get('updateSeatFlights') ? localStorageService.get('updateSeatFlights') : [];
            vm.model.flights.map(flight =>{
                flight.updatedSeats.map(updatedSeat=>{
                    updateSeatFlights?.map(updatedSeatFlight => {
                        if (updatedSeatFlight.segmentId === flight.segmentId) {
                            updatedSeatFlight.seats?.filter((e, index) => {
                                if (e.code === updatedSeat.code) {
                                    updatedSeatFlight.seats.splice(index, 1);
                                    localStorageService.set('updateSeatFlights', updateSeatFlights);
                                }
                            });
                        }
                    });
                });
                flight.updatedSeats = [];
            });
        }

        function deleteUpdateSeatsPending(e, seatsDeleted) {
            const seatsLocalStorage = localStorageService.get('seatsSelectedInfoData') ? localStorageService.get('seatsSelectedInfoData') : null;
            const updateSeatFlights = localStorageService.get('updateSeatFlights') ? localStorageService.get('updateSeatFlights') : [];
            let segmentIdSeatDeleted = seatsDeleted?.seats[0]?.segments[0];
            let code;
            if (seatsLocalStorage && segmentIdSeatDeleted?.id && seatsLocalStorage[segmentIdSeatDeleted.id]) {
                angular.forEach(seatsLocalStorage[segmentIdSeatDeleted.id].passengersInfo, (passengerLocal,index) => {
                    angular.forEach(segmentIdSeatDeleted.passengers, (passenger) => {
                        if (passengerLocal.id === passenger.id) {
                            code = passengerLocal.currentSeat.row + passengerLocal.currentSeat.column;
                            vm.model.flights.map(flight => {
                                flight.updatedSeats?.map((e, indexFilter) => {
                                    if (e.code === code) {
                                        flight.updatedSeats.splice(indexFilter, 1);   //Remove seat assigned visually
                                    }
                                });
                            });
                            //UPDATE localStorage updateSeatFlights
                            updateSeatFlights?.map(updatedSeat => {
                                if (updatedSeat.segmentId === segmentIdSeatDeleted.id) {
                                    updatedSeat.seats?.filter((e, index) => {
                                        if (e.code === code) {
                                            updatedSeat.seats.splice(index, 1);

                                            localStorageService.set('updateSeatFlights', updateSeatFlights);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }
    }
})();
