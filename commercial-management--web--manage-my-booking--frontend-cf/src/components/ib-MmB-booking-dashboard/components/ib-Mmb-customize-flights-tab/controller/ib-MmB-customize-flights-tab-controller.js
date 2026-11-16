import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';

(function () {
    'use strict';

    angular
        .module('ib-MmB-customize-flights-tab-module')
        .controller('CustomizeFlightTabController', CustomizeFlightTabController);

    CustomizeFlightTabController.$inject = ['$scope', '$rootScope', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'MmBUtilService', 'MmBModalService', 'localStorageService', 'RedirectionService', '$filter', '$window', '$timeout', 'CommonsUtilService', '$ocLazyLoad', 'AncillariesConstants', 'CommonsModalService', 'ModalServiceAncillaries'];
    function CustomizeFlightTabController($scope, $rootScope, MmBAppConstants, MmBDatalayerUtilsService, MmBUtilService, MmBModalService, localStorageService, RedirectionService, $filter, $window, $timeout, CommonsUtilService, $ocLazyLoad, AncillariesConstants, CommonsModalService, ModalServiceAncillaries) {
        const vm = this;
        vm.redirectModal = redirectModal;
        vm.redirectToCheckin = redirectToCheckin;
        vm.$onInit = activate;
        vm.thirdPartyCompanies = {};
        vm.ancillariesData = null;
        vm.cancelModalEvent = $rootScope.$on('cancelModalEvent', setDefaultQuadrigam);
        vm.enableThirdPartyCompanies = false;
        vm.userLoggeded = logged();
        vm.getBoxCardClassId = getBoxCardClassId;
        vm.passengers = localStorageService.get('passengers');
        vm.bookingInfo = localStorageService.get('bookingInfo');
        vm.commercialData = localStorageService.get('commercialData');
        vm.bobAvailable = bobAvailable;
        vm.userPassenger = [];
        vm.bobInfo = localStorageService.get('bobInfo');
        vm.flowApp = localStorageService.get('flowApp');
        vm.displayBidsBox = true;
        vm.globickTransfers = null;
        vm.globickExperiences = null;
        vm.getShoppingModel = getShoppingModel;
        vm.bobBooked = false;
        vm.bookingInfoMarket = vm.bookingInfo.contextMetadata?.country;
        vm.commercialDataMarket = vm.commercialData.market?.code;
        vm.provisionalWebComponent = location.hostname === MmBAppConstants.INT_HOSTNAME;
        vm.isOnbUserLogged = false;
        $scope.$on('acceptSeats', verifySeats);
        $scope.$on('deleteSeats', verifySeats);
        $scope.$on('upgBoxModuleWhenClosedModal', checkUpgBoxModule);
        $scope.$on('openBobModal', openBobModal);

        ///////////////

        function activate() {
            let isSeatModelInit, isSeatInit = false, ancillariesInfoLocal = localStorageService.get('ancillariesInfo');
            CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_CUSTOMIZE_YOU_FLIGHT');
            checkUpgBoxModule();

            setAncillariesBob();
            const isFlowBob = localStorageService.get('flowBob');

            vm.isOnbUserLogged= vm.userLoggeded === MmBAppConstants.LOGIN_ONB;

            if (isFlowBob) {
                localStorageService.set('flowBob', true);
                const ancillariesAvailable = getAncillariesAvailable();
                if (!ancillariesAvailable?.includes('INTEGRATED_BOB') || (!bobAvailable())) {
                    MmBModalService.showGenericModal(false, 'ib-modal-bob-error-redirection.html', { showCloseButton: true }, 'ib-modals ib-modals--md').result.then(() => {
                    });
                }
            }
            vm.headerModelLocal = localStorageService.get('headerModel');
            if (ancillariesInfoLocal && ancillariesInfoLocal.ancillaries) {
                vm.ancillariesData = ancillariesInfoLocal.ancillaries;
            }
            if (vm.model.ancillariesAvailable.includes('UPGRADING_AVIOS') && (vm.model.ancillariesAvailable.includes('UPGRADING_BID'))) {
                let index = vm.model.ancillariesAvailable.indexOf('UPGRADING_AVIOS');
                vm.model.ancillariesAvailable[index] = 'UPGRADING_AVIOS_BID';
                index = vm.model.ancillariesAvailable.indexOf('UPGRADING_BID');
                vm.model.ancillariesAvailable.splice(index, 1);
            }

            vm.upgradeModel = {
                bidsUpgradingInfo: vm.model.bidsUpgradingInfo,
                aviosUpgradingInfo: vm.model.aviosUpgradingInfo
            };

            vm.model.ancillariesAvailable = orderAncillaries(vm.model.ancillariesAvailable);

            const returnLanguageToShowTransfers = () => {
                const bookingInfo = localStorageService.get('bookingInfo');
                let languageAndMarket = bookingInfo.contextMetadata.language;
                return languageAndMarket;
            };

            const languageTransfers = returnLanguageToShowTransfers();
            const isAvailableTrans = isTransTypeAvailable();

            const isIncludeTransfersInAncillariesAvailable = vm.model.ancillariesAvailable.includes('TRANSFERS');
            const isAcceptedLanguage = languageTransfers === 'es' || languageTransfers === 'en';
            const canIncludeTransfers = !isIncludeTransfersInAncillariesAvailable && isAvailableTrans && isAcceptedLanguage;

            if (canIncludeTransfers) {
                this.model.ancillariesAvailable.push('TRANSFERS');
            }


            if (!vm.model.ancillariesAvailable.includes('GASTRONOMIC_PROPOSAL')) {
                vm.model.ancillariesAvailable.push('GASTRONOMIC_PROPOSAL');
            }

            ensureAllianzFusionIsLast();

            getThirdPartyCompanies();
            getThirdPartyCompaniesFlights();

            if (vm.headerModelLocal && vm.headerModelLocal.shoppingBasket) {
                isSeatModelInit = vm.headerModelLocal.shoppingBasket.seats.hasSeats;
                isSeatInit = isSeatModelInit ? isSeatModelInit : false;
            }
            vm.model.isSeats = isSeatInit;
            if (localStorageService.get('deepLinkParams') && localStorageService.get('bookingInfo')) {
                vm.deepLinkData = localStorageService.get('bookingInfo').deepLinkInformation;
                localStorageService.set('deepLinkData', vm.deepLinkData);
                updateDalayerInfo(MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS_DEEPLINK);
                CommonsUtilService.setTitlePage('MMB_TITLE_DEEPLINK_SEAT_SELECTION');
            } else {
                CommonsUtilService.setTitlePage('MMB_TITLE_CUSTOMIZE_FLIGHTS');
                updateDalayerInfo(MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
            }

            loadPaymentModule();
            if (vm.model.ancillariesAvailable.includes(MmBAppConstants.ANCILLARIES_TYPES.PREORDER)) {
                MmBDatalayerUtilsService.updateDatalayerEvents(
                    AncillariesConstants.DATALAYER_INFO.MODULE_PREORDER,
                    AncillariesConstants.DATALAYER_INFO.PREORDER_CODE,
                    AncillariesConstants.DATALAYER_INFO.PREORDER_ACCESS);
            }
            emitResizeEvent();

            vm.model.shoppingModel = this.getShoppingModel();
        }

        function isTransTypeAvailable () {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            const isGLB = ancillariesInfo?.ancillaries?.find((element) => element.type === 'GLOBICK');
            const subTypes = isGLB?.subTypes;
            const subTypesLength = subTypes?.length;
            for (let i = 0; i < subTypesLength; i++) {
                if (subTypes[i].glbType === 'TRANS') {
                    if (subTypes[i].status.code === 'AVAILABLE') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        }

        function emitResizeEvent() {
            $timeout(() => {
                $window.dispatchEvent(new Event('resize'));
            });
            if (vm.bobInfo?.additionalBagsPrice === "") {
                vm.bobInfo.additionalBagsPrice = vm.bobInfo.slices[0]?.products[0]?.additionalBagsPrice?.toString();
            }
        }

        function getAncillariesAvailable() {
            const ancillariesInfo = localStorageService.get('ancillariesInfo').ancillaries.filter(item => {
                return item.status.code === 'AVAILABLE';
            });
            const ancillarieType = ancillariesInfo.map(function (item) {
                return item['type'];
            });
            return ancillarieType;
        }

        function getUpgradingWaitingListSegmentsPurchased() {
            return localStorageService.get('breakdownInfo')?.freeItems?.find(item => item.type === 'UPGRADING_WAITING_LIST')?.segments?.map(item => item.id);
        }
        function getUpgradingWaitingListSegmentsAvailable() {
            const segmentsPurchased = getUpgradingWaitingListSegmentsPurchased();

            return localStorageService.get('ancillariesInfo')?.ancillaries?.find(item => item.type === 'UPGRADING_WAITING_LIST')?.waitingList?.
                segments?.filter(segment => segment.status.code === 'AVAILABLE' && !segmentsPurchased.includes(segment.id));
        }
        function isUpgradingWaitingListAvailable() {
            return getUpgradingWaitingListSegmentsAvailable()?.length > 0;
        }

        function logged() {
            return localStorageService.get('userLogged');
        };

        /**
         * This functions update datalayerInfo. The quadrigam change according to flow.
         * @param {String} quadrigam value to update datalayer_general.
         * @returns {Void}
         *  */
        function updateDalayerInfo(quadrigam) {
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
        }

        /**
         * Show redirection modal for redirect user to third party web
         * @param {Object} event Object event
         * @param {Integer} index Third party company selection
         * @param {String} company Name of company
         */
        function redirectModal(event, index, company) {
            event.preventDefault();
            MmBModalService.showGenericModal(false, 'ib-modal-redirect-modal.html', { jbaLink: vm.thirdPartyCompanies.flights[index].companyUrl, company: vm.thirdPartyCompanies.flights[index].companyName }, 'ib-modals ib-modals--md').result.then(angular.noop, angular.noop);
            /* INIT DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateDatalayerWithQuadrigam(MmBAppConstants.QUADRIGAM.MODAL_SELECT_SEAT_JBA, null, MmBUtilService.isUserLogged());
            /* FINISH DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateDigitalDataWithQuadrigam(MmBAppConstants.QUADRIGAM.MODAL_SELECT_SEAT_JBA, null, MmBUtilService.isUserLogged());
            MmBDatalayerUtilsService.setProcessAndStep(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.SEATMPJBR, MMBDatalayerConstants.DIGITAL_DATA_STEP.SEATMPJBR, MmBAppConstants.QUADRIGAM.MODAL_SELECT_SEAT_JBA);
        }



        /**
         * Redirect to check-in modal
         */
        function redirectToCheckin() {
            MmBModalService.showGenericModal(true, 'ib-modal-redirect-check-in.html', null, 'ib-modals ib-modals--md').result.then(() => {
                RedirectionService.externalRedirect($filter('LinksFilter')('CHECKIN_ONLINE_APP') + '?surname=' + localStorageService.get('checkinSurname') + '&pnr=' + localStorageService.get('PNR'));
            }, angular.noop);
        }

        function getThirdPartyCompanies() {
            let index, indexOrder, indexSegment, bookingInfoAux = localStorageService.get('bookingInfo');
            if (vm.ancillariesData) {
                for (index = 0; index < vm.ancillariesData.length; index++) {
                    if (vm.ancillariesData[index].type === 'THIRD_PARTY_COMPANIES' && vm.ancillariesData[index].status.code === 'AVAILABLE') {
                        vm.enableThirdPartyCompanies = true;
                        vm.thirdPartyCompanies = vm.ancillariesData[index];

                        vm.thirdPartyCompanies.segments = [];

                        for (indexOrder = 0; indexOrder < bookingInfoAux.order.slices.length; indexOrder++) {
                            for (indexSegment = 0; indexSegment < bookingInfoAux.order.slices[indexOrder].segments.length; indexSegment++) {
                                vm.thirdPartyCompanies.companies.forEach((company) => {
                                    company.deeplinks.forEach((deeplink) => {
                                        if (deeplink.segmentId === bookingInfoAux.order.slices[indexOrder].segments[indexSegment].id) {
                                            vm.thirdPartyCompanies.segments.push(bookingInfoAux.order.slices[indexOrder].segments[indexSegment]);
                                        }
                                    });
                                });
                            }
                        }
                    }
                }
                if (vm.thirdPartyCompanies && vm.thirdPartyCompanies.segments && vm.thirdPartyCompanies.segments.length > 0) {
                    vm.enableThirdPartyCompanies = true;
                } else {
                    vm.enableThirdPartyCompanies = false;
                }
            }
        }

        function getThirdPartyCompaniesFlights() {
            let index, providerIndex, thirdPartyFlights = [];
            vm.thirdPartyCompanies.flights = [];
            if (vm.ancillariesData) {
                for (index = 0; index < vm.ancillariesData.length; index++) {
                    if (vm.ancillariesData[index].type === 'THIRD_PARTY_COMPANIES' && vm.ancillariesData[index].status.code === 'AVAILABLE') {
                        vm.thirdPartyCompanies.segments.forEach((element) => {
                            for (providerIndex = 0; providerIndex < vm.thirdPartyCompanies.companies.length; providerIndex++) {
                                if (vm.thirdPartyCompanies.companies[providerIndex].provider === element.flight.operationalCarrier.code) {
                                    thirdPartyFlights = {
                                        flightID: element.id,
                                        departureCity: element.departureCity.description,
                                        arrivalCity: element.arrivalCity.description,
                                        companyCode: element.flight.operationalCarrier.code,
                                        companyName: element.flight.operationalCarrier.name,
                                        companyUrl: vm.thirdPartyCompanies.companies[providerIndex].deeplinks[0].externalUrl
                                    };
                                    vm.thirdPartyCompanies.flights.push(thirdPartyFlights);
                                }
                            }
                        });
                    }
                }
            }
        }


        function setDefaultQuadrigam() {
            /* INIT DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateDatalayerWithQuadrigam(MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS, null, MmBUtilService.isUserLogged());
            /* FINISH DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.updateDigitalDataWithQuadrigam(MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS, null, MmBUtilService.isUserLogged());
        }

        function verifySeats(event, data) {
            let isSeatModel;
            if (vm.headerModelLocal && vm.headerModelLocal.shoppingBasket) {
                isSeatModel = vm.headerModelLocal.shoppingBasket.seats.hasSeats;
            }

            if (isSeatModel) {
                vm.model.isSeats = true;
            } else {
                vm.model.isSeats = false;
            }
        }

        function getBoxCardClassId(index) {
            return 'bigs-' + Math.floor(index / 2);
        }

        function ensureAllianzFusionIsLast() {
            const allianzIndex = vm.model.ancillariesAvailable.indexOf('ALLIANZ_FUSION');
            if (allianzIndex !== -1 && vm.model.ancillariesAvailable.length % 2 !== 0) {
                vm.model.ancillariesAvailable.splice(allianzIndex, 1);
                vm.model.ancillariesAvailable.push('ALLIANZ_FUSION');
            }
        }

        function orderAncillaries(data) {
            let ancillariesOrder = localStorageService.get('orderAncillariesModules');
            let result = [];
            if (ancillariesOrder) {
                for (let i = 0; i < ancillariesOrder.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (ancillariesOrder[i] == data[j]) {
                            result.push(ancillariesOrder[i]);
                        }
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    let ancillarieInList = false;
                    for (let j = 0; j < ancillariesOrder.length; j++) {
                        if (ancillariesOrder[j] == data[i]) {
                            ancillarieInList = true;
                        }
                    }
                    if (!ancillarieInList) {
                        result.push(data[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < data.length; i++) {
                    result.push(data[i]);
                }
            }
            return result;
        }

        /**
        * Check if flight is eligible for BOB Widget
         *
         * Rules:
         *      - Not eligible for shuttle flights
         *      - Only for users who are browsing in ENG, ESP or CAT
         *      - Early checkin allowed, (nothing to do, just information)
        * */
        function bobAvailable() {
            if (vm.bookingInfo.order.slices[0].type === 'SHUTTLE') {
                return false;
            }
            return true;
        }

        function loadPaymentModule() {
            import('@src/lazy-loading/ib-web-payments').then(() => {
                $ocLazyLoad.load(angular.module('ib-web-payments-templates'));
                $ocLazyLoad.load(angular.module('ib-pmt-app'));
                $ocLazyLoad.load(angular.module('ib-pmt-order-confirmation-module'));
                $ocLazyLoad.load(angular.module('ib-pmt-communication-lost-module'));
                $ocLazyLoad.load(angular.module('ib-pmt-mmb-confirmation-module'));
                $ocLazyLoad.load(angular.module('ib-pmt-injectable-module'));
            });
        }

        function checkUpgBoxModule() {
            const breakdownInfo = localStorageService.get('breakdownInfo');

            if (breakdownInfo && breakdownInfo.freeItems.length > 0 && breakdownInfo.freeItems[0].type === 'UPGRADING_WAITING_LIST') {
                vm.displayBidsBox = false;

                //Remove UPGRADING_WAITING_LIST from ancillariesAvailable
                if (vm.model.ancillariesAvailable.includes('UPGRADING_WAITING_LIST') && !isUpgradingWaitingListAvailable()) {
                    const index_UWL = vm.model.ancillariesAvailable.indexOf('UPGRADING_WAITING_LIST');
                    vm.model.ancillariesAvailable.splice(index_UWL, 1);
                }
            }
            emitResizeEvent();
        }

        function getShoppingModel() {
            return {
                eventName: 'shoppingCardSelected',
                cardImg: {
                    src: '/ancillaries_nuevas/shopping.svg',
                    text: 'Text img'
                },
                externalUrl: this.model.preorderAncillarieInfo.info
            };
        }

        /**
         * Open insurance modal for select the insurance
         */
        function openBobModal() {
            getBobSelectedSegments();

            ModalServiceAncillaries.openBobModal({}, 'ib-bob-modal-view.html').result.then(() => {
            },
                () => {
                    //when modal is closed ando bob is booked change card
                    if (localStorageService.get('bobOrder')) {
                        vm.bobBooked = true;
                    }
                }
            );
        };
        function setAncillariesBob() {
            const breakdownInfo = localStorageService.get('breakdownInfo');
            const freeItems = breakdownInfo?.freeItems;
            let bobOrder = null;
            angular.forEach(freeItems, (item) => {
                if (item.type === MmBAppConstants.ANCILLARIES_TYPES.INTEGRATED_BOB) {
                    bobOrder = {
                        id: item.orderId,
                        status: item.status,
                        bookingCode: item.bookingCode,
                        summary: [{
                            number: null,
                            type: null,
                            status: item.status,
                            amount: item.total,
                            products: [{ type: 'mmb', quantity: item.bags, price: item.total, tax: 0 }],
                            date: null,
                            slot: null,
                            address: null,
                            email: vm.passengers[0].contactInfo.email
                        }]
                    };
                }
            });
            if (bobOrder) {
                localStorageService.set('bobOrder', bobOrder);
            }
        }

        function getBobSelectedSegments() {
            const bobInfo = localStorageService.get('bobInfo');
            const slices = vm.bookingInfo.order.slices;
            const passengers = vm.bookingInfo.passengers;
            const passengersStatus = passengers.map(passenger => ({
                name: passenger.personalInfo.name,
                surname: passenger.personalInfo.surname
            }));

            const selectedSegmentList = bobInfo.slices.map(bobSlice => {
                const sliceWithBoB = slices.find(slice => slice.sliceId === bobSlice.sliceId);
                const bobFlightInfo = getBobFlightInfo(sliceWithBoB);
                return {
                    generalType: sliceWithBoB.type,
                    passengerStatus: passengersStatus,
                    id: sliceWithBoB.sliceId,
                    departure: bobFlightInfo?.departure,
                    arrival: bobFlightInfo?.arrival,
                    cabinClass: bobFlightInfo?.cabin,
                    segmentId: sliceWithBoB.segments[0].id,
                    airlineName: sliceWithBoB.segments[0].flight.marketingCarrier.name,
                    airlineLogo: MmBUtilService.getCompanyLogo(sliceWithBoB.segments[0].flight.marketingCarrier.code)
                };
            });

            localStorageService.set('segmentsSelected', selectedSegmentList);
        }


        function getBobFlightInfo(sliceWithBoB) {
            const departureFormattedDate = $filter('DateFormatFilter')(sliceWithBoB.segments[0].departureDateTime);
            const arrivalFormattedDate = $filter('DateFormatFilter')(sliceWithBoB.segments[0].arrivalDateTime);
            const departureDate = {
                weekDay: departureFormattedDate.weekDay,
                monthDay: departureFormattedDate.monthDay,
                monthNumber: departureFormattedDate.monthNumber,
                month: departureFormattedDate.month,
                year: departureFormattedDate.year,
                dateTime: departureFormattedDate.dateTime
            };
            const arrivalDate = {
                weekDay: arrivalFormattedDate.weekDay,
                monthDay: arrivalFormattedDate.monthDay,
                monthNumber: arrivalFormattedDate.monthNumber,
                month: arrivalFormattedDate.month,
                year: arrivalFormattedDate.year,
                dateTime: arrivalFormattedDate.dateTime
            };

            const departure = {
                cityDescription: sliceWithBoB.segments[0].departure.city.description,
                cityCode: sliceWithBoB.segments[0].departure.city.code,
                airportDescription: sliceWithBoB.segments[0].departure.name,
                airportCode: sliceWithBoB.segments[0].departure.code,
                terminal: sliceWithBoB.segments[0].departure.terminal,
                originalDate: sliceWithBoB.segments[0].departureDateTime,
                date: departureDate
            };
            const arrival = {
                cityDescription: sliceWithBoB.segments[0].arrival.city.description,
                cityCode: sliceWithBoB.segments[0].arrival.city.code,
                airportDescription: sliceWithBoB.segments[0].arrival.name,
                airportCode: sliceWithBoB.segments[0].arrival.code,
                terminal: sliceWithBoB.segments[0].arrival.terminal,
                originalDate: sliceWithBoB.segments[0].arrivalDateTime,
                date: arrivalDate
            };
            const cabin = {
                code: sliceWithBoB.segments[0].cabin.code,
                type: sliceWithBoB.segments[0].cabin.bookingClass,
                description: sliceWithBoB.segments[0].cabin.description,
                fareFamily: sliceWithBoB.segments[0].cabin.fareFamily,
                mainClass: sliceWithBoB.segments[0].cabin.rbd,

            };
            const bobFlightInfo = {
                arrival: arrival,
                departure: departure,
                cabin: cabin
            };
            return bobFlightInfo;
        }
    }
})();
