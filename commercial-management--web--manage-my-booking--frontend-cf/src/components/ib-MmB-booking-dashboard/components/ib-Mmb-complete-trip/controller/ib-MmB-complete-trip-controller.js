import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-MmB-complete-trip-module')
        .controller('CompleteTripController', CompleteTripController);

    CompleteTripController.$inject = ['$window', 'MmBDatalayerUtilsService', 'MmBAppConstants','CommonsUtilService','CompleteTripConstants', 'localStorageService', '$filter'];
    function CompleteTripController($window, MmBDatalayerUtilsService, MmBAppConstants, CommonsUtilService,CompleteTripConstants, localStorageService, $filter) {


        var vm = this;
        vm.isActivities = false;
        vm.isAvis = false;
        vm.showVehicleRental = false;
        vm.isEsim = false;
        vm.esimModal = {
                type: 'ESIM',
                modal: 'ESIM',
                textModels: {
                    title:  $filter('translate')('ESIM_CARD_TITLE'),
                    subtitle:  $filter('translate')('ESIM_CARD_SUBTITLE'),
                    descriptionTexts: [
                        $filter('translate')('ESIM_CARD_DESCRIPTION')
                    ],
                    imgPath: '/esim/holafly.svg'
                },
                avoidPrice: true,
                modifyButton: false,
                initialTextButton: $filter('translate')('ESIM_CARD_BUTTON'),
                isCompleteTripFlow: true,
                status: null
            };
        vm.openLink = openLink;
        
        vm.$onInit = activate;

        function getAvisModalConfiguration (modifyButton = false) {
            const ancillariesInfoStorage = localStorageService.get('ancillariesInfo');
            const avis = ancillariesInfoStorage?.ancillaries?.find(a => a.type === 'AVIS_BUDGET');
            return {
                type: 'AVIS',
                modal: 'AVIS',
                textModels: {
                    title:  $filter('translate')('AVIS_BANNER_TITLE'),
                    subtitle:  $filter('translate')('AVIS_BANNER_SUBTITLE'),
                    descriptionTexts: [
                        $filter('translate')('MMB_MOVE_FREE_FOR_LESS')
                    ],
                    imgPath: '/avis/avis-completo.svg'
                },
                avoidPrice: true,
                modifyButton: modifyButton,
                initialTextButton: $filter('translate')('AVIS_BANNER_GENERIC_MODAL_BTN'),
                isCompleteTripFlow: true,
                status: avis?.status || null
            };

        }

        function activate() {
            initPageTitleAndDatalayer();
            vm.partnersInfo = transformPartnersInfo();

            const languageActivities = returnLanguageToShowActivities();
            const isAvailableExp = isExpTypeAvailable();
            vm.showVehicleRental = isAvailableVehicleRental();
            vm.isEsim = isAvailableEsim();
            const isCorrectLangulageForActivities = (languageActivities === 'es' || languageActivities === 'en');
            
            if (isAvailableExp && isCorrectLangulageForActivities) {
                vm.isActivities = true;
            }
            vm.avisModalConfiguration = getAvisModalConfiguration();
            /*Remove when ancillaries availability back resolves type='AVIS'*/
            vm.isAvis = isAvisAvailable();            
        }

        function isAvailableVehicleRental () {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            if(!ancillariesInfo) return false;

            const ancillaries = ancillariesInfo.ancillaries;
            return ancillaries.some(ancillary => ancillary.status?.code === 'AVAILABLE' && ancillary.type === 'VEHICLE_RENTAL');
        }

        function isExpTypeAvailable () {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            const isGLB = ancillariesInfo?.ancillaries?.find((element) => element.type === 'GLOBICK');
            const subTypes = isGLB?.subTypes;
            const subTypesLength = subTypes?.length;
            for (let i=0; i<subTypesLength; i++){
                if (subTypes[i].glbType === 'EXP'){
                    if (subTypes[i].status.code === 'AVAILABLE'){
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        }

        function isAvailableEsim() {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            if (!ancillariesInfo?.ancillaries?.length) return false;

            const esim = ancillariesInfo.ancillaries.find(a => a.type === 'ESIM');
            if (!esim) return false;

            vm.esimModal.status = esim.status;

            return esim.status?.code !== 'NOT_AVAILABLE';
        }


        function isAvisAvailable () {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            if(!ancillariesInfo) return false;
            const avisInfo = ancillariesInfo.ancillaries.find(ancillary => (ancillary.type === 'AVIS_BUDGET'));
            if(!avisInfo) return false;
            const isAvisAvailable = avisInfo.status.code === 'AVAILABLE';
            const isAvisReserved = avisInfo.status.code === 'NOT_AVAILABLE' && avisInfo.status.reason === 'AVIS_AVL_ERR_0001';

            if (isAvisReserved) {
                vm.avisModalConfiguration = getAvisModalConfiguration(true);
            }

            return isAvisAvailable || isAvisReserved;
        }

        function transformPartnersInfo () {
            let partners = [],
                partnerIndex, partnerName, partnersInfo;
            // sort partners by ascending order
            function sortByOrder (a, b) {
                return a.order - b.order;
            }
            for (partnerIndex = 0; partnerIndex < CompleteTripConstants.PARTNERS.length; partnerIndex++) {
                partnerName = CompleteTripConstants.PARTNERS[partnerIndex].name.toUpperCase();
                partners.push({
                    order: CompleteTripConstants.PARTNERS[partnerIndex].order,
                    name: CompleteTripConstants.PARTNERS[partnerIndex].name,
                    title: 'MMB_PARTNER_TITLE_' + partnerName,
                    category: 'MMB_PARTNER_CATEGORY_' + partnerName,
                    action: 'MMB_PARTNER_ACTION_' + partnerName,
                    text: 'MMB_PARTNER_TEXT_' + partnerName,
                    link: 'MMB_PARTNER_LINK_' + partnerName
                });
                partnersInfo = partners.sort(sortByOrder);
            }
            return partnersInfo;
        }

        function createInitialHotelTypes () {
            return [
                {
                    type: 'ADULT',
                    total: 0
                },
                {
                    type: 'CHILD',
                    total: 0
                }
            ];
        }

        function incrementTypeTotal (types, passengerType) {
            if (passengerType === 'ADULT') {
                types[0].total++;
            } else if (passengerType === 'CHILD' || passengerType === 'INFANT') {
                types[1].total++;
            }
        }

        function buildHotelTypes (passengersById) {
            var index, types;
            types = createInitialHotelTypes();
            for (index = 0; index < passengersById.length; index++) {
                incrementTypeTotal(types, passengersById[index].passengerType);
            }
            return types;
        }

        function buildHotelDates (departureInfo, returnInfo) {
            var checkinDate, checkoutDate;
            checkinDate = {
                day: departureInfo.day,
                month: departureInfo.monthNumber,
                year: departureInfo.year
            };
            if (returnInfo !== null) {
                checkoutDate = {
                    day: returnInfo.day,
                    month: returnInfo.monthNumber,
                    year: returnInfo.year
                };
            }
            return {
                checkinDate: checkinDate,
                checkoutDate: checkoutDate
            };
        }

        function adjustCheckoutDateIfNeeded (checkinDate, checkoutDate) {
            var checkinIn, checkinOut, increment7days;
            if (checkoutDate === undefined || checkoutDate === null) {
                return checkoutDate;
            }
            checkinIn = dayjs([checkinDate.year, checkinDate.month, checkinDate.day]);
            checkinOut = dayjs([checkoutDate.year, checkoutDate.month, checkoutDate.day]);
            if (checkinOut.diff(checkinIn, 'day') >= 30) {
                increment7days = (dayjs([checkinDate.year, checkinDate.month - 1, checkinDate.day])).add(7, 'day');
                checkoutDate = {
                    day: increment7days.format('DD'),
                    month: increment7days.format('MM'),
                    year: increment7days.format('YYYY')
                };
            }
            return checkoutDate;
        }

        function buildHotelUrl (city, checkinDate, checkoutDate, types) {
            var baseUrl;
            baseUrl = 'https://www.booking.com/searchresults.html?aid=380264&label=pagemanagebooking-link-380264-click;';
            baseUrl += 'checkin_monthday=' + checkinDate.day +
                '&checkin_year_month=' + checkinDate.year + '-' + checkinDate.month;

            if (checkoutDate) {
                baseUrl += '&checkout_monthday=' + checkoutDate.day +
                    '&checkout_year_month=' + checkoutDate.year + '-' + checkoutDate.month;
            }

            baseUrl += '&%20&iata=' + city +
                '&iata_orr=1&no_rooms=1' +
                '&group_adults=' + types[0].total +
                '&group_children=' + types[1].total;

            return baseUrl;
        }

        function openLink (data) { 
            var city, passengersById, types, returnInfo, bookingDates, checkinDate, checkoutDate, bookingUrl;

            MmBDatalayerUtilsService.sendDatalayerEvent(MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_NAME_INTERACTION);

            if (data === 'hotel') {
                returnInfo = vm.model.bookingGeneralInfo.returnInfo;
                city = vm.model.managementModel.flights[0].arrival.city.code;
                bookingDates = buildHotelDates(vm.model.bookingGeneralInfo.departureInfo, returnInfo);
                checkinDate = bookingDates.checkinDate;
                checkoutDate = bookingDates.checkoutDate;
                passengersById = vm.model.passengersModel.passengers;
                types = buildHotelTypes(passengersById);
                checkoutDate = adjustCheckoutDateIfNeeded(checkinDate, checkoutDate);
                bookingUrl = buildHotelUrl(city, checkinDate, checkoutDate, types);
                $window.open(bookingUrl, '_blank');
            } else if (data === 'car') {
                $window.open('https://www.rentacar-iberia.com/?CID=pcaeses-20180625-paginadeinicio-001', '_blank');
            }
        }

        function initPageTitleAndDatalayer() {
            CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_COMPLETE_YOU_BOOK');
            MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS.IBMCYT,
            MMBDatalayerConstants.DIGITAL_DATA_STEP.IBMCYT,
            MmBAppConstants.QUADRIGAM.COMPLETE_TRAVEL
            );
            /* INIT DELETE GA4 MIGRATION*/
            MmBDatalayerUtilsService.sendDatalayerEvent(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }        
        function returnLanguageToShowActivities() {
            const bookingInfo = localStorageService.get('bookingInfo');
            let languageAndMarket = bookingInfo.contextMetadata.language;
            return languageAndMarket;
        };

    }
})();
