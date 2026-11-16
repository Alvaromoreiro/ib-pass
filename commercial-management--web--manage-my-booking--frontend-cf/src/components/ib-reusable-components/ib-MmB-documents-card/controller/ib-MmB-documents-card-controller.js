(function () {
    'use strict';

    angular
        .module('ib-MmB-documents-card-module')
        .controller('MmBDocumentsController', MmBDocumentsController);

    MmBDocumentsController.$inject = ['BookingDashboardConstants', 'localStorageService', '$filter', 'MmBAppConstants'];
    function MmBDocumentsController (BookingDashboardConstants, localStorageService, $filter, MmBAppConstants) {
        const vm = this;
        vm.infoBooking = null;
        vm.showInfoDocuments = false;
        vm.numberOfpassenger = 1;

        vm.warningTop = {
            type: 'simple-gray-50',
            icon: 'icon-informacion_2',
            modifier: 'ib-message-box--boxed-shadow',
            text: [
                { type: 'bold', text: 'MMB_DOCUMENTS_SIMPLE_WARNING' }
            ]
        };

        vm.$onInit = function () {
            vm.infoBooking = localStorageService.get('bookingInfo');
            vm.numberOfpassenger = vm.infoBooking.passengers.length;
            vm.flightReminder = {
                colSize: BookingDashboardConstants.BOX_COL_SIZES.MEDIUM,
                boxSize: BookingDashboardConstants.BOX_LINK_SIZES.FULL,
                icon: BookingDashboardConstants.BOX_LINK_ICONS.MESSAGES,
                linkId: BookingDashboardConstants.BOX_LINKS_TYPES.FLIGHT_REMINDER,
                text: {
                    title: 'MODULES_LINK_MAIL_FLIGHT_TEXT_2',
                    subtitle: 'MODULES_LINK_RESEND_TEXT_2',
                    accessibilityText: 'MODULES_LINK_MAIL_FLIGHT_ACCESIBLE_TEXT_2'
                }
            };
            vm.checkInLinkData = {
                colSize: BookingDashboardConstants.BOX_COL_SIZES.MEDIUM,
                boxSize: BookingDashboardConstants.BOX_LINK_SIZES.FULL,
                icon: BookingDashboardConstants.BOX_LINK_ICONS.CHECK_IN,
                linkId: BookingDashboardConstants.BOX_LINKS_TYPES.CHECK_IN,
                text: {
                    title: 'MODULES_LINK_GO_TO_CHECK_IN_TEXT',
                    subtitle: '',
                    accessibilityText: 'MODULES_LINK_GO_TO_CHECK_IN_ACCESIBLE_TEXT',
                    value: ''
                }
            };
            getDataDocuments();
        };

        /**
         * Requires documentation because is aircheck
         */
        function getDataDocuments () {
            const infoDigitalBoarding = localStorageService.get('digitalBoardingInfo');
            let validIdSegments = null;
            vm.model.flightsWithDocuments = {};

            if (infoDigitalBoarding?.digitalBoardings?.segments.length > 0) {
                validIdSegments = infoDigitalBoarding.digitalBoardings.segments.map(segment => segment.id);
                for (const sliceId in vm.model.flights) {
                    if (Object.hasOwnProperty.call(vm.model.flights, sliceId)) {
                        const flight = vm.model.flights[sliceId];
                        const existSegmentValid = flight.segments.some(segment => {
                            let result = false;
                            for (const id of validIdSegments) {
                                if (id === segment.segmentId && !result) {
                                    result = !result;
                                }
                            }

                            return result;
                        });

                        if(existSegmentValid) {
                            vm.model.flightsWithDocuments[sliceId] = flight;
                        }
                    }
                }

                for (const sliceId in vm.model.flightsWithDocuments) {
                    if (Object.hasOwnProperty.call(vm.model.flightsWithDocuments, sliceId)) {
                        const flight = vm.model.flightsWithDocuments[sliceId];
                        flight.segments.forEach(segment => {
                            const passBaggages = segment.sliceBaggage.passBaggages;
                            infoDigitalBoarding.digitalBoardings.segments.forEach(segmentDB => {
                                const dataDocSegStatus = MmBAppConstants.DOCUMENTS_SEGMENT_STATUS.WARNINGS.find(obj => obj.CODE === segmentDB.status.code);
                                let arrPassInfant = [];

                                if (segment.segmentId === segmentDB.id && dataDocSegStatus?.CODE) {
                                    vm.showInfoDocuments = true;
                                    segment.status = dataDocSegStatus.CODE;
                                    segment.showWarning = (segment.status !== MmBAppConstants.DOCUMENTS_SEGMENT_STATUS.CODES.ONLINE_DOCUMENTATION_ALLOWED);

                                    if (segment.showWarning) {
                                        segment.warning = dataDocSegStatus.WARNING;
                                        segment.warning.urlLink = segmentDB.url;
                                    }

                                    if (segmentDB.passengers?.length > 0) {
                                        segment.passengers = segmentDB.passengers;
                                        arrPassInfant = passBaggages.filter(pass => pass.passengerType === 'INFANT');

                                        segment.passengers.forEach(passenger => {
                                            const infoPass = passBaggages.find(pass => (pass.passengerId === passenger.id && angular.isObject(pass.personalInfo)));
                                            passenger.name = infoPass.personalInfo.name + ' ' + infoPass.personalInfo.surname;
                                            passenger.document = getStatusDocument(passenger.airCheckStatus);
                                            passenger.infant = getDataInfantIfExist(arrPassInfant, passenger);
                                        });
                                    }
                                }
                            });
                        });
                    }
                }
            }

            function getStatusDocument (airCheckStatus) {
                const docStatusObj = MmBAppConstants.DOCUMENT_STATUS.find(objStatus => objStatus.CODES.some(code => code === airCheckStatus.code));
                const dataDoc = {
                    title: airCheckStatus.title ? airCheckStatus.title : '',
                    description: airCheckStatus.description ? airCheckStatus.description : '',
                    icon: docStatusObj?.ICON,
                    showLink: docStatusObj?.LINK
                };

                return dataDoc;
            }

            function getDataInfantIfExist (arrPassInfant, passenger) {
                let dataInfant = null, name = '', surname = '';
                arrPassInfant.forEach(infant => {
                    if (infant.relatedPassengerId === passenger.id) {
                        name = (infant.personalInfo?.name?.length > 0) ? infant.personalInfo.name : '';
                        surname = (infant.personalInfo?.surname?.length > 0) ? infant.personalInfo.surname : '';

                        dataInfant = {
                            id: infant.passengerId,
                            name: `${name} ${surname}`
                        };
                    }
                });

                return dataInfant;
            }
        }
    }
})();
