import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-check-in-upgrade-module')
        .controller('UpgradeController', UpgradeController);

    UpgradeController.$inject = ['$rootScope', '$scope', 'UpgradeService', 'UpgradeModel', 'CkiDatalayerUtilsService', '$timeout', 'CheckinAppConstants', 'CurrencyService', 'MonetateUtilsService', 'MonetateConstants', 'ModalService', 'localStorageService', '$window', 'CkiDataLayerService', 'NewMainHeaderFacade', '$filter', 'CkiDatalayerConstants', 'IbSessionConfigService', 'IbAncillariesPaymentUtilsService', 'IbUtilsService', 'CheckinFlowService', 'IbPassengerBookingUtilsService'];

    function UpgradeController ($rootScope, $scope, UpgradeService, UpgradeModel, CkiDatalayerUtilsService, $timeout, CheckinAppConstants, CurrencyService, MonetateUtilsService, MonetateConstants, ModalService, localStorageService, $window, CkiDataLayerService, NewMainHeaderFacade, $filter, CkiDatalayerConstants, IbSessionConfigService, IbAncillariesPaymentUtilsService, IbUtilsService, CheckinFlowService, IbPassengerBookingUtilsService) {

        const vm = this;
        const selectedOfferToSend = { data: { upgradingAccepted: false, offer: null } };
        let offers, isUpgradeFree, newInterfaz = true;

        vm.model = UpgradeModel;
        vm.model.initializeModel();
        vm.calculatePrice = calculatePrice;
        vm.updateUpgradeView = updateUpgradeView;
        vm.getOfferImage = getOfferImage;
        vm.getOfferTitle = getOfferTitle;
        vm.getOfferClass = getOfferClass;
        vm.openConditions = openConditions;
        vm.openSeat3d = openSeat3d;
        vm.currency = {};

        $scope.$on('openOfferCondition', openOfferCondition);
        $scope.$on('openSeat3dModal', openSeat3dModal);

        if (!CheckinFlowService.checkConfirmationPNR()) {
            activate();
        }

        ////////////////

        function activate () {
            initRenacen3dScript();
            const upgSlices = localStorageService.get('upgSlices');
            const totalPriceFormatted = localStorageService.get('totalPriceFormatted');
            const posOfferPriceFormatted = localStorageService.get('posOfferPriceFormatted');
            const showPriceCombinated = localStorageService.get('showPriceCombinated');
            localStorageService.set('showBasket', true);
            $rootScope.showMainHeader = false;
            $rootScope.showHeaders = true;
            localStorageService.set('nextStepAllowed', true);
            CheckinFlowService.warnUserOnBackPressed();
            $timeout(() => {
                // PUSH DATALAYER OBJECT
                const quadrigam = CheckinAppConstants.QUADRIGAM.UPGRADE;

                /* INIT DELETE GA4 MIGRATION*/
                const extendedDatalayerInfo = {};
                CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, extendedDatalayerInfo, IbSessionConfigService.isUserLogged());
                CkiDatalayerUtilsService.updateAircraft(IbPassengerBookingUtilsService.setAircraftDatalayer());
                CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FIN DELETE GA4 MIGRATION*/
                const extendedDigitalDataInfo = {};
                CkiDataLayerService.setProcessAndStep(quadrigam);
                CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
                CkiDatalayerUtilsService.updateDatalayerViewEvent();

                MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, CheckinAppConstants.QUADRIGAM.UPGRADE);
                $rootScope.$broadcast('updateDatalayer');
                $rootScope.$broadcast('sendUpdateToMonetate');
            });
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.UPGRADE, 1400);
            UpgradeService.generateUpgradeModel().then((transformedData) => {
                vm.model.segments_toShow = transformedData.segments_toShow;
                vm.model.currency = transformedData.currency;
                vm.currency = vm.model.currency;
                if (upgSlices) {
                    vm.model.slices = upgSlices;
                } else {
                    vm.model.slices = transformedData.slices;
                }
                vm.model.selectedOffer = transformedData.selectedOffer;
                vm.model.posOfferPrice = transformedData.posOfferPrice;
                vm.model.totalPriceCombined = transformedData.totalPriceCombined;
                vm.model.posOfferbox = transformedData.posOfferbox;
                if (posOfferPriceFormatted) {
                    vm.model.posOfferPriceFormatted = posOfferPriceFormatted;
                } else {
                    vm.model.posOfferPriceFormatted = transformedData.posOfferPriceFormatted;
                }
                if (totalPriceFormatted) {
                    vm.model.totalPriceFormatted = totalPriceFormatted;
                } else {
                    vm.model.totalPriceFormatted = CurrencyService.formatPrice(vm.model.currency, vm.model.totalPrice, true);
                }
                vm.model.haveCombinedOffers = transformedData.haveCombinedOffers;
                if (showPriceCombinated) {
                    vm.model.showPriceCombinated = true;
                } else {
                    vm.model.showPriceCombinated = false;
                }
                vm.model.combinedOffersSegments = transformedData.combinedOffersSegments;
                offers = transformedData.offers;
                isUpgradeFree = true;
                let UpgTypeDigitalData = ``;

                vm.model?.slices[0]?.segments.forEach( (segment) => {
                    UpgTypeDigitalData += `${segment.actualClass?.type}=>`;
                    segment.offers.forEach((offer) => {
                        UpgTypeDigitalData += `${offer.offerSegmentClasses[0]?.cabinClass?.type} `;
                    });
                });
                CkiDatalayerUtilsService.addDigitalDataInfo({upgType: UpgTypeDigitalData.trim()});


            });
            $rootScope.timeSession.startTime = dayjs();
            $timeout(() => {
                NewMainHeaderFacade.initHeaderModel({
                    originDestination: localStorageService.get('headerInfo'),
                    flightType: 'multiCityFlight',
                    currency: vm.currency,
                    showBasket: true
                });
            });
        }

        /**
         * Open modal for show conditions of rate
         * @param {String} currentCabin
         * @param {Object} segment
         * @param {String} indexOffer
         */
        function openConditions (currentCabin, segment, indexOffer, indexSegment) {
            let i, condition = 0, summaryTripForUpg = '', descriptionCurrentCabin = '';
            if (segment && segment.departure && segment.arrival) {
                summaryTripForUpg = segment.departure.airport.code + '-' + segment.arrival.airport.code;
                if (summaryTripForUpg === 'MAD-TLV' || summaryTripForUpg === 'TLV-MAD') {
                    for (i = 0; i < segment.offers.length; i++) {
                        if (segment.offers[i].cabinLayout === 'BUSINESS_PLUS' || segment.offers[i].cabinLayout === 'BUSINESS_CLUB') {
                            segment.offers[i].exception = true;
                        }
                    }
                }
            }
            if (currentCabin === 'Turista') {
                descriptionCurrentCabin = $filter('translate')('CKIANCUPP_ECONOMY');
            } else {
                descriptionCurrentCabin = $filter('translate')('CKIANCUPP_PREMIUM_ECONOMY');
            }
            for (i = 0; i < segment.offers.length; i++) {
                if (segment.offers[i].cabinLayout === 'PREMIUMTOURIST' || segment.offers[i].cabinLayout === 'PREMIUM_ECONOMY') {
                    segment.offers[i].descriptionTranslate = $filter('translate')('CKIANCUPP_PREMIUM_ECONOMY');
                } else {
                    segment.offers[i].descriptionTranslate = $filter('translate')('CKIANCUPP_BUSINESS_CLASS');
                }
            }
            ModalService.openCkiUpgradingKnowMore({ segmentInfo: segment, offerSelected: indexOffer, currentCabin: currentCabin, indexSegment: indexSegment, descriptionCurrentCabin: descriptionCurrentCabin}).result.then(() => {
            });
        }

        /**
         * Open offer condition
         * @param {Object} evt
         * @param {Intenger} Info for
         */
        function openOfferCondition (evt, data) {
            openConditions(data.currentCabin, data.segmentInfo, data.offerSelected);
        }

        /**
         * @function
         * @name calculatePrice
         * @desc Calculates the final price for all upgrading choosed
         */
        function calculatePrice (segment, offer, event) {
            const offersSegmentClassSelected = [];
            let counterOfferSelected, offersSelected = [], isOfferSelected, i, j, k;
            vm.model.totalPrice = 0;
            vm.model.showPriceCombinated = false;
            for(i = 0; i < vm.model.slices.length;  i++) {
                for (j = 0; j < vm.model.slices[i].segments.length; j++) {
                    if (vm.model.slices[i].segments[j].id === segment.id && vm.model.slices[i].segments[j].offers.length > 1) {
                        if (offer.isSelected) {
                            for(k = 0; k < vm.model.slices[i].segments[j].offers.length; k++) {
                                if (offer.id !== vm.model.slices[i].segments[j].offers[k].id) {
                                    vm.model.slices[i].segments[j].offers[k].isSelected = false;
                                }
                            }
                        }
                    }
                }
            }
            angular.forEach(vm.model.slices, (slice) => {
                counterOfferSelected = 0;
                angular.forEach(slice.segments, (segment) => {
                    isOfferSelected = false;
                    angular.forEach(segment.offers, (offer) => {
                        if (offer.isSelected) {
                            isOfferSelected = true;
                            vm.model.totalPrice += offer.totalAmount;
                            vm.model.selectedOffer = offer;
                            offersSelected.push(offer);
                            offersSegmentClassSelected.push(offer.offerSegmentClasses[0]);
                            counterOfferSelected++;
                        }
                    });
                    segment.offerSelected = isOfferSelected;
                    if (counterOfferSelected > 1) {
                        vm.model.showPriceCombinated = true;
                    }
                });
            });
            if (vm.model.showPriceCombinated && vm.model.haveCombinedOffers) {
                vm.model.selectedOffer = getCombinedOffer(offersSegmentClassSelected);
                vm.model.showOffersPopUp = false;
                vm.model.posOfferPrice = vm.model.selectedOffer.totalAmount;
                vm.model.posOfferPriceFormatted = CurrencyService.formatPrice(vm.model.currency, vm.model.posOfferPrice, true);
                offersSelected = [];
            } else {
                vm.model.selectedOffer = offers[vm.model.posOfferbox];
                vm.model.showOffersPopUp = true;
            }

            if (vm.model.totalPrice > 0) {
                vm.model.totalPriceFormatted = CurrencyService.formatPrice(vm.model.currency, vm.model.totalPrice, true);
                vm.model.showTotal = true;
                isUpgradeFree = false;
            } else {
                vm.model.totalPriceFormatted = CurrencyService.formatPrice(vm.model.currency, vm.model.totalPrice, true);
                vm.model.showTotal = false;
                isUpgradeFree = true;
            }

            function getCombinedOffer (offersSelected) {
                let combinedOffer = null, combinedOfferId = null, isFound, i, counterSegments = 0;
                angular.forEach(vm.model.combinedOffersSegments, (offerCombined) => {
                    angular.forEach(offerCombined.segments, (segment) => {
                        i = 0, isFound = false;
                        while (i < offersSelected.length && !isFound && counterSegments < offerCombined.segments.length) {
                            if (offersSelected[i].segment === segment.segmentId && offersSelected[i].cabinClass.code === segment.cabinClassCode) {
                                isFound = true;
                                counterSegments++;
                                combinedOfferId = offerCombined.id;
                            }
                            i++;
                        }
                    });
                });

                if (counterSegments >= vm.model.combinedOffersSegments[0].segments.length) {
                    for (i = 0; i < offers.length; i++) {
                        if (offers[i].id === combinedOfferId) {
                            combinedOffer = offers[i];
                        }
                    }

                }

                return combinedOffer;
            }
            localStorageService.set('upgSlices', vm.model.slices);
            if (vm.model.showPriceCombinated) {
                localStorageService.set('totalPriceFormatted', vm.model.totalPriceFormatted);
                localStorageService.set('posOfferPriceFormatted', vm.model.posOfferPriceFormatted);
                localStorageService.set('showPriceCombinated', vm.model.showPriceCombinated);
            } else {
                localStorageService.set('totalPriceFormatted', vm.model.totalPriceFormatted);
                localStorageService.set('showPriceCombinated', vm.model.showPriceCombinated);
            }
            updateDataToService(offersSelected.length > 0 ? offersSelected[0] : vm.model.selectedOffer);
        }

        /**
         * @function
         * @name updateDataToService
         * @desc updates the object that contains the data to the next step in checkin process
         */
        function updateDataToService (combinedOffer) {
            let found = false, i = 0, length = 0;
            if (combinedOffer !== null && combinedOffer !== undefined) {
                vm.model.isOfferSelected = true;
                selectedOfferToSend.data.upgradingAccepted = true;
                selectedOfferToSend.data.offer = combinedOffer.id;
                selectedOfferToSend.serviceInfo = combinedOffer.offerSegmentClasses;
            } else {
                if (vm.model.selectedOffer) {
                    length = vm.model.selectedOffer.length;
                    while (!found && i < length) {
                        if (vm.model.selectedOffer[i].id !== null) {
                            //found the selected offer update the data to send
                            selectedOfferToSend.data.upgradingAccepted = true;
                            selectedOfferToSend.data.offer = vm.model.selectedOffer[i].id;
                            selectedOfferToSend.serviceInfo = vm.model.selectedOffer[i].offerSegmentClasses;
                            found = true;
                            vm.model.isOfferSelected = true;
                        }
                        i++;
                    }
                }

                if (!found) {
                    selectedOfferToSend.data.upgradingAccepted = false;
                    selectedOfferToSend.data.offer = null;
                    selectedOfferToSend.serviceInfo = null;
                    vm.model.isOfferSelected = false;
                }
            }
            if (combinedOffer) {
                combinedOffer.hasUpgrading = true;
                combinedOffer.total = combinedOffer.totalAmount;
            } else {
                $rootScope.$broadcast('updateHeaderUpgrading', {});
            }
            const updateUpgInfo = upgInfoToBasket(combinedOffer);
            $rootScope.$broadcast('updateHeaderUpgrading', IbAncillariesPaymentUtilsService.getHeaderUpgradingInfo(updateUpgInfo));
        }

        /**
         * @function
         * @name updateUpgradeView
         * @desc updates the object to the Rest service and go on to next step
         */
        function updateUpgradeView (accepted) {
            const auxSelectedOffer = { serviceInfo: null, data: { upgradingAccepted: false, offer: null } };
            //    CkiDatalayerUtilsService.updateDatalayerForUpgrade(vm.model.isOfferSelected, isUpgradeFree, vm.model.selectedOffer, accepted, currency.currencySymbol);
            //If not accepted, send upgrade accepted false object to the server Call the service to update the data and the info to next step
            UpgradeService.updateUpgradeInformation(!accepted ? auxSelectedOffer.data : selectedOfferToSend.data, !accepted ? auxSelectedOffer.serviceInfo : selectedOfferToSend.serviceInfo, vm.model.selectedOffer);
        }

        /**
         * Return literal text for offerClass type
         * @param {String} offerClass Type cabin offer
         */
        function getOfferClass (offerClass) {
            let modifier = '';
            switch (offerClass) {
                    case 'PREMIUM_ECONOMY':
                    case 'PREMIUMTOURIST':
                        modifier = '--tourist-premium';
                        break;
                    case 'BUSINESS_PLUS':
                        modifier = '--business-plus';
                        break;
                    case 'BUSINESS_CLUB':
                    case 'BUSINESS_CLASS':
                    case 'BUSINESS_AIR_NOSTRUM':
                    case 'BUSINESS_IBERIA_EXPRESS':
                    case 'BUSINESS':
                        modifier = '--business';
                        break;
            }

            return modifier;
        }

        /**
         * Return PATH image of cabin class
         * @param {String} offerClass Cabin class
         */
        function getOfferImage (offer) {
            let image = '';
            switch (offer.cabinLayout) {
                    case 'PREMIUMTOURIST':
                    case 'PREMIUM_ECONOMY':
                        offer.haul = 'LH';
                        image = CheckinAppConstants.imagesRoute + '/upgrade/turista_premium-sin_mascara.png'; break;
                    case 'BUSINESS_PLUS':
                        offer.haul = 'LH';
                        image = CheckinAppConstants.imagesRoute + '/upgrade/business_plus-sin_mascara.png'; break;
                    case 'BUSINESS_CLUB':
                        offer.haul = 'LH';
                        image = CheckinAppConstants.imagesRoute + '/upgrade/business_plus-sin_mascara.png'; break;
                    case 'BUSINESS_CLASS':
                    case 'BUSINESS_AIR_NOSTRUM':
                    case 'BUSINESS_IBERIA_EXPRESS':
                    case 'BUSINESS':
                        offer.haul = 'MH';
                        image = CheckinAppConstants.imagesRoute + '/upgrade/business_class-sin-mascara.png'; break;
            }
            if (!localStorageService.get('newUpgradeInterfaz')) {
                switch (offer.cabinLayout) {
                        case 'PREMIUMTOURIST':
                        case 'PREMIUM_ECONOMY':
                            offer.haul = 'LH';
                            image = CheckinAppConstants.imagesRoute + '/upgrade/new_turista_premium-sin_mascara.png'; break;
                        case 'BUSINESS_PLUS':
                            offer.haul = 'LH';
                            image = CheckinAppConstants.imagesRoute + '/upgrade/new_business_plus-sin_mascara.png'; break;
                        case 'BUSINESS_CLUB':
                            offer.haul = 'LH';
                            image = CheckinAppConstants.imagesRoute + '/upgrade/new_business_plus-sin_mascara.png'; break;
                        case 'BUSINESS_CLASS':
                        case 'BUSINESS_AIR_NOSTRUM':
                        case 'BUSINESS_IBERIA_EXPRESS':
                        case 'BUSINESS':
                            offer.haul = 'MH';
                            image = CheckinAppConstants.imagesRoute + '/upgrade/new_business_class-sin-mascara.png'; break;
                }
            }
            return image;
        }

        /**
         * Return literal text for offerClass type
         * @param {String} offerClass Type cabin offer
         */
        function getOfferTitle (offerClass) {
            let title = '';
            switch (offerClass) {
                    case 'PREMIUM_ECONOMY':
                    case 'PREMIUMTOURIST':
                        title = $filter('translate')('CKIANCUPP_PREMIUM_ECONOMY');
                        break;
                    case 'BUSINESS_PLUS':
                    case 'BUSINESS_CLUB':
                    case 'BUSINESS_CLASS':
                    case 'BUSINESS_AIR_NOSTRUM':
                    case 'BUSINESS_IBERIA_EXPRESS':
                    case 'BUSINESS':
                        title = $filter('translate')('CKIANCUPP_BUSINESS_CLASS');
                        break;
            }

            return title;
        }

        function getRenacenData (offer) {
            let i, infoData = {layout: '', operator: '', scene: ''}, bookingInfo = localStorageService.get('bookingInfo');
            switch (offer.cabinLayout) {
                    case 'PREMIUM_ECONOMY':
                    case 'PREMIUMTOURIST':
                        infoData.scene = 'W';
                        break;
                    case 'BUSINESS_PLUS':
                    case 'BUSINESS_CLUB':
                    case 'BUSINESS_CLASS':
                    case 'BUSINESS_AIR_NOSTRUM':
                    case 'BUSINESS_IBERIA_EXPRESS':
                    case 'BUSINESS':
                        infoData.scene = 'J';
                        break;
            }
            for (i = 0; i < bookingInfo.outwardSegments.length; i++) {
                if (bookingInfo.outwardSegments[i].id === offer.offerSegmentClasses[0].segment) {
                    infoData.layout = bookingInfo.outwardSegments[i].aircraft.model;
                    infoData.operator = bookingInfo.outwardSegments[i].operatingFlightNumber.company.code;
                }
            }
            for (i = 0; i < bookingInfo.returnSegments.length; i++) {
                if (bookingInfo.returnSegments[i].id === offer.offerSegmentClasses[0].segment) {
                    infoData.layout = bookingInfo.returnSegments[i].aircraft.model;
                    infoData.operator = bookingInfo.returnSegments[i].operatingFlightNumber.company.code;
                }
            }
            return infoData;
        }

        function getModalRenacenData (offer) {
            let i, infoData = {layout: '', operator: '', scene: ''}, bookingInfo = localStorageService.get('bookingInfo');
            switch (offer.currentCabin) {
                    case 'PREMIUM_ECONOMY':
                    case 'PREMIUMTOURIST':
                        infoData.scene = 'W';
                        break;
                    case 'BUSINESS_PLUS':
                    case 'BUSINESS_CLUB':
                    case 'BUSINESS_CLASS':
                    case 'BUSINESS_AIR_NOSTRUM':
                    case 'BUSINESS_IBERIA_EXPRESS':
                    case 'BUSINESS':
                        infoData.scene = 'J';
                        break;
            }
            for (i = 0; i < bookingInfo.outwardSegments.length; i++) {
                if (bookingInfo.outwardSegments[i].id === offer.segmentInfo.id) {
                    infoData.layout = bookingInfo.outwardSegments[i].aircraft.model;
                    infoData.operator = bookingInfo.outwardSegments[i].operatingFlightNumber.company.code;
                }
            }
            for (i = 0; i < bookingInfo.returnSegments.length; i++) {
                if (bookingInfo.returnSegments[i].id === offer.segmentInfo.id) {
                    infoData.layout = bookingInfo.returnSegments[i].aircraft.model;
                    infoData.operator = bookingInfo.returnSegments[i].operatingFlightNumber.company.code;
                }
            }
            return infoData;
        }

        function upgInfoToBasket (selectedOffer) {
            if (!selectedOffer) {
                return [];
            }

            const offerSegmentsClass = (selectedOffer.offerSegmentClasses || []).map(
                createOfferSegmentClass
            );

            return [{
                type: 'UPGRADING',
                total: selectedOffer.total,
                currency: vm.currency,
                upgrading: {
                    id: selectedOffer.id,
                    amountPerPassenger: selectedOffer.amountPerPassenger,
                    offerSegmentsClass: offerSegmentsClass
                }
            }];
        }

        function createOfferSegmentClass (offerSegmentClass) {
            return {
                ...offerSegmentClass,
                segmentId: offerSegmentClass.segment !== null
                    ? String(offerSegmentClass.segment)
                    : null
            };
        }

        function initRenacen3dScript () {
            if (!$window.SeatMapVr) {
                UpgradeService.initRenacen3dScript();
            }
        }

        function openSeat3d (offer) {
            const infoRenacen = getRenacenData (offer);
            $window.SeatMapVr.config({
                resource_cdn: 'https://iberia.3dseatmapvr.com',
                destinationSelector: '.seatmap3Dview'
            });
            $window.SeatMapVr.init();
            $window.SeatMapVr.selectScene({
                layout: infoRenacen.layout,
                operator: infoRenacen.operator,
                scene: infoRenacen.scene,
                screenMode: SeatMapVr.SCREEN_MODE.MODAL
            });
        }

        function openSeat3dModal (evt, offer) {
            const infoRenacen = getModalRenacenData (offer);
            $window.SeatMapVr.config({
                resource_cdn: 'https://iberia.3dseatmapvr.com',
                destinationSelector: '.seatmap3Dview'
            });
            $window.SeatMapVr.init();
            $window.SeatMapVr.selectScene({
                layout: infoRenacen.layout,
                operator: infoRenacen.operator,
                scene: infoRenacen.scene,
                screenMode: SeatMapVr.SCREEN_MODE.MODAL
            });
        }
    }
})();
