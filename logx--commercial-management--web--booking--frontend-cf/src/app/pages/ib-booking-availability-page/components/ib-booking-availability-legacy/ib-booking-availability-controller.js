import { cloneDeep } from 'lodash-es';
import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { DatalayerBKIConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { getRedirectionPath, RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
(function () {


    angular
        .module('ib-booking-availability-module')
        .controller('AvailabilityController', AvailabilityController);

    AvailabilityController.$inject = ['$rootScope', '$timeout', 'BookingAvailabilityService', 'BookingAvailabilityModel', '$scope', '$location', 'CurrencyService', 'BookingAvailabilityConstants', '$translate', 'DatalayerUtilsService', 'BookingUtilService', 'BookingAppConstants', 'BookingComponentUtils', '$window', '$filter',  'BookingAvailabilityTransformer', 'MonetateUtilsService', 'MonetateConstants', 'NewMainHeaderFacade', 'BookingLocalDiscountsService', 'IbFlashOfferService', 'IbFlashOfferUtilsService', 'IbSetHeaderService', 'BookingModalService', 'GetDestinationsService', 'DatalayerBKIService', 'IbBookingAvailabilityPageUtilsService', 'CommonsSessionStorageService', 'IbMetaSearchInfoServiceUtils', '$element', 'IbCheckPartnersDiscountsService', 'BookingPageUtilsService', 'IbBookingMetasearchUtilsService', 'BookingUserActivityService','DigitalDataUtilsService'];
    function AvailabilityController($rootScope, $timeout, BookingAvailabilityService, BookingAvailabilityModel, $scope, $location, CurrencyService, BookingAvailabilityConstants, $translate, DatalayerUtilsService, BookingUtilService, BookingAppConstants, BookingComponentUtils, $window, $filter, BookingAvailabilityTransformer, MonetateUtilsService, MonetateConstants, NewMainHeaderFacade, BookingLocalDiscountsService, IbFlashOfferService, IbFlashOfferUtilsService, IbSetHeaderService, BookingModalService, GetDestinationsService, DatalayerBKIService, IbBookingAvailabilityPageUtilsService, CommonsSessionStorageService, IbMetaSearchInfoServiceUtils, $element, IbCheckPartnersDiscountsService, BookingPageUtilsService, IbBookingMetasearchUtilsService, BookingUserActivityService, DigitalDataUtilsService) {
        const vm = this;
        let fareFamilyConditions = [];
        let originCalendarInfo = [];
        let isLoading;
        let allAvailableOffers;

        vm.LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
        vm.model = BookingAvailabilityModel;
        vm.showServiceError = showServiceError;
        vm.selectAvailability = selectAvailability;
        vm.deleteSlices = deleteSlices;
        vm.searchAvailabilityNew = searchAvailabilityNew;
        vm.getNextTrip = getNextTrip;
        vm.showPopoverStopover = showPopoverStopover;
        vm.showBannerFlexibility = showBannerFlexibility;
        vm.showLocalDiscount = showLocalDiscountModule;
        vm.collapseBanner = collapseBanner;
        vm.updateAvailabilityWithDiscount = updateAvailabilityWithDiscount;
        vm.setSelectedSliceInfo = setSelectedSliceInfo;
        vm.localDiscountLoadingTitle = '';
        vm.localdiscountModel = { display: false, origin: '', destination: '', showTooltip: true };
        vm.previouslySelectedNum = 0;
        vm.dataBreakdownPassengers = dataBreakdownPassengers;
        vm.renderMetasearchComponentByFlightType = renderMetasearchComponentByFlightType;
        vm.selectNewFlightFromMetasearch = selectNewFlightFromMetasearch;
        vm.coupon = null;
        vm.commercialData = null;
        vm.showUpselling = false;
        vm.selectedSliceInfo = null;
        $rootScope.ancOffers = false;
        $rootScope.newFare = null;
        vm.showAncOffers = showAncOffers;
        vm.outboundHasFlexAvailable = null;
        vm.ancOffersTotal = '';
        vm.restDaysDate = 0;
        vm.outboundFareSelected = null;
        vm.currentSelectedFareFamily = null;
        vm.showPartnerCollapsable = false;
        vm.tripType = null;
        vm.renderUpsellingComponent = false;


        ($element[0]).addEventListener('selectedSliceEvent', (event) => { event.stopPropagation(), selectSlice(event, event.detail?.selectedSlice, event.detail?.checkSlides) });
        $scope.$on('selectedRedemptionSliceEvent', selectRedemptionSlice);
        $scope.$on('slideSelected', changeAvailability);
        $scope.$on('selectedFareFamily', changeFareselected);
        $scope.$on('selectedRedemptionFareFamily', changeRedemptionFareselected);
        $scope.$on('nextSlideDate', nextSliceDate);
        $scope.$on('openFareModal', openFareWindowModal);
        $scope.$on('animationStarts', startsSelectSliceAnimation);
        $scope.$on('animationEnds', finishSelectSliceAnimation);
        $scope.$on('continueEvent', selectAvailability);
        $scope.$on('recalculatePrice', searchAvailabilityNew);
        $scope.$on('setCoupon', setCoupon);
        $scope.$on('refreshAvailability', refreshFares);
        $scope.$on('newSeach', newSearch);
        $scope.$on('selectedFareFamilyFlexibility', showBannerFlexibility);
        $scope.$on('selectedFareFamilyAncOffers', showAncOffers);
        $scope.$on('dataBreakdownPassengers', dataBreakdownPassengers);
        $scope.$on('discountChange', vm.updateAvailabilityWithDiscount);
        $scope.$on('showUpselling', toggleUpselling);
        $scope.$on('changeOffersTotal', changeOffersTotal);
        $scope.$on('updateEcommerce', updateEcommerce);
        // Subscribe to the $destroy event of the scope
        $scope.$on('$destroy', destroy);
        $rootScope.$on('fareUpsellingSelected', setSelectedSliceInfo);
        $rootScope.$on('calendarGridServiceError', showCalendarServiceError);
        $rootScope.$on('calendarDaySelected', changeAvailability);
        $rootScope.$on('availabilityPageUpdate', activate);

        activate();
        ////////////////
        /**
         * Initialize the availability controller and its model calling the rest service for availability
         * @private
         */
        function activate() {

            const flashOffer = BookingUtilService.getURLFirstParameterByName('flashOffer');
            const flashOfferId = BookingUtilService.getURLFirstParameterByName('flashOfferId');
            vm.model.initializeModel();
            vm.localDiscountLoadingTitle = $filter('translate')('AVAILABILITY_SLICK_PRICES_LOADING');
            isLoading = false;
            vm.model.isRedemptionFlow = (BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY) === 'true');
            vm.model.isLoading = true;
            vm.model.discountsAvailabilityLoading = false;
            vm.isHelloMadridDiscount = false;
            showBannerFlexibility();

            if (CommonsSessionStorageService.get('calditMode') !== null && CommonsSessionStorageService.get('calditMode')) {
                CommonsSessionStorageService.set('availabilityRequestData', CommonsSessionStorageService.get('newAvailabilityRequestData'));
                BookingUtilService.checkExistNewAvailabilitySearch();
            }
            $translate.onReady(() => {
                setPageTitle();
                $timeout(() => {
                    if ((BookingAppConstants.availableMarkets.indexOf($rootScope.appMarket.toLowerCase()) !== -1)
                        && (!flashOffer)
                    ) {
                        if ($rootScope.isRedemptionFlow && angular.isObject(BookingAppConstants.REDEMPTION_AVIOS_REDIRECTED_MARKETS[$rootScope.appMarket])
                            && !$rootScope.isPointsOBFlow) {
                            BookingAvailabilityService.redirectRedemptionMarket($rootScope.appMarket, $rootScope.appLang);
                        }else if ($rootScope.isRedemptionFlow && $rootScope.isPointsOBFlow) {
                            const defaultMarket = BookingAppConstants.UNAVAILABLE_MARKETS_REDIRECTION.DEFAULT.marketRedirect;
                            const unavailableOnbMarkets = BookingAppConstants.UNAVAILABLE_MARKETS_REDIRECTION.ONB_REDIRECTION;
                            const searchParams = new URLSearchParams($window.location.search);
                            const appMarket = $rootScope.appMarket;
                            const language = BookingAppConstants.REDEMPTION_POINTS_REDIRECTED_LANG[appMarket] || 'en';
                            if (unavailableOnbMarkets.includes(appMarket)) {
                                searchParams.set('market', defaultMarket);
                                searchParams.set('fromMarket', defaultMarket);
                                searchParams.set('language', language);
                                $window.location.href = `${$window.location.pathname}?${searchParams.toString()}`;
                            }
                        }
                        CommonsSessionStorageService.set('loadingNextFlow', 1);
                        BookingAvailabilityService.runAvailabilityFlowRequest()
                            .then(getBookingAvailability, showServiceError);
                        CommonsSessionStorageService.remove('redirectionPaymentCallback');
                        vm.isChecked = CommonsSessionStorageService.get('oBDiscountType');
                        vm.oBPreviousOption = vm.isChecked;
                        BookingAvailabilityService.getMarketOBPoints();
                    } else if (flashOffer && flashOfferId) {
                        const values = IbFlashOfferUtilsService.createRequestDirectFare(flashOfferId);
                        const goToLoginPage = CommonsSessionStorageService.get('goToLoginPage');
                        IbFlashOfferService.callInitBooking().then((data) => {
                            const userLogged = CommonsSessionStorageService.get('userLogged');
                            if ((goToLoginPage || goToLoginPage === null) && !userLogged) {
                                IbBookingAvailabilityPageUtilsService.redirectToLogin();
                            }
                            DatalayerBKIService.addflightRatio(data.data.offers[0].flightRatio);
                            const originDestination = IbFlashOfferUtilsService.createNewHeaderData(data.data.offers);
                            const currency = CurrencyService.getCurrencyObject(data.data.contextMetadata.currencies[0]);
                            angular.extend(originDestination, values.passengerCount);
                            IbSetHeaderService.setHeader(originDestination, currency, IbBookingAvailabilityPageUtilsService.onLogin, IbBookingAvailabilityPageUtilsService.onError, activate);
                            const model = IbFlashOfferUtilsService.createModelToHeader(data.data.offers[0].slices, originDestination);
                            DatalayerBKIService.addDestinationInfo(originDestination, model);
                            IbFlashOfferUtilsService.generateNewrequestDataDirectFare(values.request.passengers, model.availabilityData.originDestinations);
                            IbSetHeaderService.setDataOnBasket(data.data.offers[0], model);
                            BookingUtilService.setSegmentOfSelectedTrip(model.selectedSlices);
                            BookingUtilService.setSelectedTripInfoinStorage(IbFlashOfferUtilsService.createModelToSelectedTripInfo(data.data.offers[0].slices, data.data.fareFamilyConditions));
                            vm.model.numericTotalPrice = data.data.offers[0].price.total;
                            vm.model.availabilityData.totalPrice =
                                CurrencyService.formatPrice(currency,
                                    data.data.offers[0].price.total, true);
                            CommonsSessionStorageService.set('fareTotalPrice', vm.model.availabilityData.totalPrice);
                            $location.path('/ibairp');

                        }).catch((error) => {
                            BookingModalService.finishWaiting();
                            CommonsSessionStorageService.set('availabilityErrror', error);
                            $location.path('/ibbkerror');
                        });


                    } else {
                        BookingAvailabilityService.redirectUnavailableMarkets();
                    }
                });
                vm.restDaysDate = (Math.round(Math.abs((new Date(CommonsSessionStorageService.get('bookingUrlParams')?.originDestinations[0]?.date) - new Date(Date.now())) / (1000 * 3600 * 24)))) || 0;
            });
        }
        // Function to handle destruction
        function destroy() {
             // Unsubscribe from the observable oBActualOption$ when the scope is destroyed
            if (vm.obActualOptionSubscription) {
                vm.obActualOptionSubscription.unsubscribe();
            }
        }
        function checkSpecialDiscountsApplied(offer) {
            if (offer?.specialDiscountsApplied) {
                offer.specialDiscountsApplied.forEach((discount) => {
                    if (discount.corporateCodes == BookingAppConstants.HELLO_MADRID.corporateCode) {
                        vm.isHelloMadridDiscount = true;
                    }
                })
            }
        }
        function checkIfHelloMadrid() {
            vm.isHelloMadridDiscount = false;
            vm.model.availabilityData.originDestinations.forEach((originDestination) => {
                originDestination.slices.forEach((slice) => {
                    for (const key in slice.cabins) {
                        slice.cabins[key].fareFamilies?.forEach((fareFamily) => {
                            fareFamily.offers.forEach((offer) => {
                                checkSpecialDiscountsApplied(offer)
                            })
                        })
                    }
                })
            })
            if (vm.isHelloMadridDiscount) {
                $timeout(() => {
                    collapseBanner();
                })
            }
        }
        function collapseBanner() {
            let bannerHelloMadrid = $element.find('#bannerHelloMadrid');

            bannerHelloMadrid.triggerHandler('click');
            $timeout(() => {
                const bannerCssClass = bannerHelloMadrid.attr('class').split(' ');
                const isClosed = bannerCssClass.indexOf('closeCollapse') == 1;
                if (!isClosed) {
                    bannerHelloMadrid.triggerHandler('click');
                }
            }, 5000);
        }
        /**
         * Shows an error to the user.
         * <ul>
         *  <li>If the error has a 404 code with internal code 'SSE_AVM_12001', it will redirect to calendar matrix page (/caldit)</li>
         *  <li>If the error has a 412 code with internal code 'SSE_AVM_BOOKING_MARKET_CHANGE', it will show a modal with the error, and after user interaction,
         *      it will reload the page with the new market</li>
         *  <li>Otherwise it will show an error modal</li>
         * </ul>
         * @param {Object} error the error object with its usually format (errorCode,message,internalErrorCode,needsTranslate,..)
         */
        function showServiceError(error) {
            const multiCitySearch = CommonsSessionStorageService.get('multiCitySearch') || null;
            if (CommonsSessionStorageService.get('searchFlightType') === 'metasearchFlight') {
                selectNewFlightFromMetasearch();
            } else {
                if (error?.errorCode === 404 && error?.internalErrorCode === 'SSE_AVM_12001' && (!multiCitySearch || (multiCitySearch && CommonsSessionStorageService.get('openJaw')))) {
                    $location.path('/caldit');
                } else {
                    BookingModalService.finishWaiting();
                    CommonsSessionStorageService.set('availabilityErrror', error);
                    $location.path(getRedirectionPath(RouterPathsConstants.ibbkerror));
                }
            }
        }
        /**
         *
         * @param {Object} event Event triggered when calendar service failed
         * @param {Object} error Error given by the service that contains information about the type of error.
         */
        function showCalendarServiceError(event, error) {
            BookingModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        }

        function updateAvailabilityWithDiscount (event, discountData) {
            let originDestination, newSelectedSlice, newInfo, selFareFam, selCabin, savedSel;
            vm.model.discountsAvailabilityLoading = true;
            const copySelected = angular.copy(vm.model.selectedSlices);
            vm.previouslySelectedNum = copySelected.length;

            BookingAvailabilityService.updateBookingAvailabilityDiscount(discountData, vm.model).then((response) => {
                if (response) {
                    vm.model.currentOriginDestinationIndex = 0;
                    if (angular.isDefined(NewMainHeaderFacade.deleteTripsBasketFromDispo)) {
                        NewMainHeaderFacade.deleteTripsBasketFromDispo();
                    }

                    getBookingAvailability(response, vm.model.currentOriginDestinationIndex);
                    vm.model.selectedSlices = [];
                    vm.model.currentOriginDestinationIndex = 0;
                    if (angular.isArray(copySelected) && copySelected.length > 0) {
                        for (let index = 0; index < copySelected.length; index++) {
                            savedSel = copySelected[index];
                            if (vm.model.availabilityData.originDestinations && vm.model.availabilityData.originDestinations[index]) {
                                originDestination = vm.model.availabilityData.originDestinations[index];
                                selCabin = savedSel.info.selectedCabin;
                                newInfo = originDestination.slices.filter((el) => IbBookingAvailabilityPageUtilsService.isSameFlight(el, savedSel));
                                newInfo = newInfo[0];
                                if (angular.isObject(newInfo)) {
                                    newInfo.selectedCabin = savedSel.cabin;
                                    newInfo.showedCabin = selCabin;
                                    newSelectedSlice = {
                                        selectedSliceIndex: savedSel.selectedSliceIndex,
                                        selectedSlicesLength: vm.model.currentOriginDestinationIndex,
                                        cabin: selCabin,
                                        originDestinationId: savedSel.originDestinationId,
                                        origin: savedSel.origin,
                                        destination: savedSel.destination,
                                        info: newInfo,
                                        articleOffset: savedSel.articleOffset,
                                        transformOffset: savedSel.transformOffset,
                                        heightHeadingFlight: savedSel.heightHeadingFlight
                                    };
                                    if (angular.isObject(newInfo.cabins[selCabin]) && newInfo.cabins[selCabin].cabinAvailable === true) {
                                        $rootScope.selectedSlice = newSelectedSlice;
                                        $rootScope.animationIndex = angular.copy(vm.model.currentOriginDestinationIndex);
                                        selectSlice(null, newSelectedSlice, false);

                                        selFareFam = angular.isDefined(savedSel.info.selectedFareFamily) ?
                                            newInfo.cabins[selCabin].fareFamilies.filter((el) => savedSel.info.selectedFareFamily.commercialCode === el.commercialCode) : undefined;
                                        if (angular.isDefined(selFareFam) && selFareFam.length > 0) {
                                            vm.model.selectedSlices[index].info.selectedFareFamily = selFareFam[0];
                                            changeFareselected(null, selFareFam[0], index);
                                        }
                                        originDestination.showOd = false;
                                        originDestination.showFaresSelected = true;
                                        vm.model.selectedSlices[index].info.showFares = true;
                                    } else {
                                        vm.model.discountsAvailabilityLoading = false;
                                        break;
                                    }
                                } else {
                                    vm.model.discountsAvailabilityLoading = false;
                                    break;
                                }
                            } else {
                                vm.model.discountsAvailabilityLoading = false;
                                break;
                            }
                        }
                    } else {
                        vm.model.discountsAvailabilityLoading = false;
                    }
                } else {
                    vm.model.discountsAvailabilityLoading = false;
                    showServiceError();
                }
            }).catch((error) => {
                vm.model.discountsAvailabilityLoading = false;
                showServiceError(error);
            });
        }



        /**
         * Select the slice recieved from his child controller and push it to the selectedSlices array. If previusly exist, take the recieved slice and
         * replace the existing slice for the new one
         * @param {Object} event -The current event to $on
         * @param {Object} selectedSlice -The slice selected with its info, origindestinationID, and some extra information
         * @param {Boolean} checkSlides -
         */
        function selectSlice(event, selectedSlice, checkSlides) {
            const mnttLog2GTM = $window.mnttLog2GTM ?? function () { };
            if (CommonsSessionStorageService.get('ancOffers')) {
                $rootScope.ancOffers = CommonsSessionStorageService.get('ancOffers');
                vm.restDaysDate = (Math.round(Math.abs((new Date(CommonsSessionStorageService.get('bookingUrlParams')?.originDestinations[0]?.date) - new Date(Date.now())) / (1000 * 3600 * 24)))) || 0;
                // Remove sessionStorage ancOffers - ATQ-9507
                CommonsSessionStorageService.remove('ancOffers');
            }
            if ($rootScope.newFare === null) {
                if (CommonsSessionStorageService.get('newFare')) {
                    $rootScope.newFare = CommonsSessionStorageService.get('newFare');
                    // Remove sessionStorage newFare - ATQ-9506
                    CommonsSessionStorageService.remove('newFare');
                    CommonsSessionStorageService.set('newFareLEVEL', 'newFare');
                    mnttLog2GTM('ATQ-9506: Show new design for highlight cards on dispo', 'Variante A');
                } else {
                    $rootScope.newFare = false;
                    mnttLog2GTM('ATQ-9506: Show new design for highlight cards on dispo', 'Control');
                }
            }
            let foundedOdSlice = false, foundedSlice = false, i = 0, j = 0, foundedOdSliceIndex = 0;
            if (!vm.model.animationRun) {
                while (!foundedOdSlice && j < vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices.length) {
                    if (vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices[j].sliceId === selectedSlice.info.sliceId) {
                        foundedOdSliceIndex = j;
                        foundedOdSlice = true;
                    }
                    j++;
                }
                vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices[foundedOdSliceIndex].showFares = true;
                while (!foundedSlice && i < vm.model.selectedSlices.length) {
                    if (vm.model.selectedSlices.length > 0 && vm.model.selectedSlices[i].originDestinationId === selectedSlice.originDestinationId) {
                        vm.model.selectedSlices[i] = selectedSlice;
                        vm.model.selectedSlices[i].available = true;
                        vm.model.selectedSlices[i].selectedSliceIndex = foundedOdSliceIndex;
                        vm.model.selectedSlices[i].info.selectedFareFamily = getFirstFareCompatible(vm.model.selectedSlices[i].info.cabins[vm.model.selectedSlices[i].info.selectedCabin].fareFamilies);
                        foundedSlice = true;
                    }
                    i++;
                }
                if (!foundedSlice) {
                    selectedSlice.available = true;
                    selectedSlice.selectedSliceIndex = foundedOdSliceIndex;
                    if (vm.model.availabilityData.multiCity) {
                        selectedSlice.info.selectedFareFamily = null;
                    } else {
                        const lastFareFamilySelected = (event?.type === 'slideSelected') && (vm.model.selectedSlices?.length === 0) ? vm.currentSelectedFareFamily : null;
                        selectedSlice.info.selectedFareFamily = getFirstFareCompatible(selectedSlice.info.cabins[selectedSlice.info.selectedCabin].fareFamilies, lastFareFamilySelected);
                        if ($rootScope.ancOffers && !$rootScope.newFare) {
                            showAncOffers(angular.noop, selectedSlice.info.selectedFareFamily);
                        } else if ($rootScope.ancOffers && $rootScope.newFare) {
                            const lastFareFamilySelected = selectedSlice?.originDestinationId.includes('0') ? vm.currentSelectedFareFamily : null;
                            getFirstFareCompatible(selectedSlice.info.wcabins[selectedSlice.info.selectedCabin].fareFamilies, lastFareFamilySelected);
                            getFirstFareCompatible(selectedSlice.info.wcabins[selectedSlice.info.selectedCabin].fareFamilies, lastFareFamilySelected);
                        }

                    }
                    selectedSlice.originCountry = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].originCity.countryCode;
                    selectedSlice.destinationCountry = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].destinationCity.countryCode;
                    vm.model.selectedSlices.push(selectedSlice);
                }
                vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices.splice(foundedOdSliceIndex, 1);
                const selectedSliceInfo = foundedSlice ? vm.model.selectedSlices[i - 1].info : selectedSlice.info;
                vm.selectedSliceInfo = selectedSliceInfo.selectedFareFamily;
                if (vm.selectedSliceInfo) {
                    vm.selectedSliceInfo.index = selectedSlice.selectedSliceIndex;
                }
                if (selectedSliceInfo.cabins[selectedSliceInfo.selectedCabin].isCabinCompatible) {
                    if (vm.model.currentOriginDestinationIndex === 0 && vm.model.currentOriginDestinationIndex < vm.model.selectedSlices.length - 1) {
                        regenerateOriginCompatibility(1, selectedSliceInfo.selectedFareFamily.offers);
                    } else if (vm.model.currentOriginDestinationIndex === 1 && vm.model.currentOriginDestinationIndex === vm.model.selectedSlices.length - 1 && !$rootScope.newFare) {
                        regenerateOriginCompatibility(0, selectedSliceInfo.selectedFareFamily.offers);
                    } else {
                        BookingUtilService.setSelectedTripInfoinStorage(vm.model.selectedSlices);
                        BookingUtilService.setSegmentOfSelectedTrip(vm.model.selectedSlices);
                    }
                }
                vm.model.currentOriginDestinationIndex = vm.model.selectedSlices.length;
                if (
                    (!vm.model.availabilityData.multiCity && !$rootScope.isRedemptionFlow)
                    || (
                        $rootScope.isRedemptionFlow
                        && (!selectedSlice.selectedSegment || vm.model.currentOriginDestinationIndex === 1)
                    )
                ) {
                    completeNextOriginDestinationInfo(vm.model.selectedSlices[vm.model.currentOriginDestinationIndex - 1].info.selectedFareFamily, false, vm.model.currentOriginDestinationIndex - 1, false, checkSlides);
                }
                const timeLeft = BookingAvailabilityService.getSliceTimeLeft(selectedSlice);
                if (timeLeft?.totalMins <= BookingAvailabilityConstants.LASTMINUTE_FLIGHT_MODAL_MINS) {
                    $timeout(() => {
                        BookingModalService.showBKISliceTimeLeftModal(timeLeft).result.then(() => { }, () => { deleteSlices(selectedSlice.originDestinationId, false, selectedSlice.selectedSliceIndex); });
                    });
                }
                showBannerFlexibility();
                if (!isCompatibleOperatedByFlex()) {
                    vm.showAncOffers.show = false;
                }
                $rootScope.$broadcast('changeUpsellingFare');

                if ($rootScope.newFare) {
                    selectedSlice.info.selectedFareFamily = undefined;
                }
            }
            NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FARE);
        }

        /**
         * Given an array of fareFamilies, finds the first fare that is compatible
         * @param {array} fareFamilies
         * @param {object} [lastFareFamilySelected] - last fare family selected
         * @returns {object} compatibleFare
         */
        function getFirstFareCompatible(fareFamilies, lastFareFamilySelected) {
            let fIndex = 0, fFound = false, compatibleFare = null;
            while (!fFound && fIndex < fareFamilies.length) {
                if (fareFamilies[fIndex].isCompatibleFare) {
                    fFound = lastFareFamilySelected === null || lastFareFamilySelected === undefined;
                    compatibleFare ??= fareFamilies[fIndex];
                    if (fareFamilies[fIndex].commercialCode === lastFareFamilySelected?.commercialCode) {
                        fFound = true;
                        compatibleFare = fareFamilies[fIndex];
                    }
                }
                fIndex++;
            }
            if ($rootScope.ancOffers) {
                vm.outboundHasFlexAvailable = vm.model.selectedSlices.every((slice) => {
                    return ['Básica', 'Óptima'].includes(slice.info.selectedFareFamily.commercialNameES);
                });
                showAncOffers(angular.noop, compatibleFare);
            }
            return compatibleFare;
        }

        function isCompatibleOperatedByFlex() {
            const trips = vm.model.selectedSlices ?? [];
            for (let i = 0; i < trips.length; i++) {
                const tripsCompanies = trips[i].info.allOperatedBy;
                for (let j = 0; j < tripsCompanies.length; j++) {
                    if (!trips[i].info.allOperatedBy[j].toUpperCase().includes('IBERIA') && !trips[i].info.allOperatedBy[j].toUpperCase().includes('LEVEL') &&
                        !trips[i].info.allOperatedBy[j].toUpperCase().includes('AIR NOSTRUM') && !trips[i].info.allOperatedBy[j].toUpperCase().includes('IBERIA EXPRESS')) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * Given a slice selected: finds it in slices array, checks if its OD has been selected before, checks incompatibilities
         * adds slice or segment to selectedSlices and calls completeNextOriginDestinationInfo method if its needed.
         * @param {*} event - Event emitted when a cabin from a new slice/segment is selected
         * @param {*} currentSelectedSlice slice that has been selected with its info
         * @param {*} checkSlides
         */
        function selectRedemptionSlice(event, currentSelectedSlice, checkSlides) {
            let foundedOdSlice = false, foundedSlice = false, foundedSegments = true, incompatibleSegments = false, i = 0, j = 0, n, foundedOdSliceIndex = 0;
            vm.model.currentOriginDestinationIndex = currentSelectedSlice.originDestinationId === 'OD0' ? 0 : 1;

            while (!foundedOdSlice && j < vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices.length) {
                if (vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices[j].sliceId === currentSelectedSlice.info.sliceId) {
                    foundedOdSliceIndex = j;
                    foundedOdSlice = true;
                } else {
                    j++;
                }
            }

            while (!foundedSlice && i < vm.model.selectedSlices.length) {
                if (vm.model.selectedSlices[i].originDestinationId === currentSelectedSlice.originDestinationId && vm.model.selectedSlices[i].selectedSliceIndex === foundedOdSliceIndex) {
                    if (currentSelectedSlice.selectedSegment) {
                        vm.model.selectedSlices[i].selectedSegments[currentSelectedSlice.selectedSegment.selectedSegmentIndex] = angular.copy(currentSelectedSlice.selectedSegment);
                        vm.model.selectedSlices[i].info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].selectedFareFamily = vm.model.selectedSlices[i].info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].cabins[currentSelectedSlice.selectedSegment.cabin].fareFamilies[0];
                        currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].selectedFareFamily = vm.model.selectedSlices[i].info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].cabins[currentSelectedSlice.selectedSegment.cabin].fareFamilies[0];
                        incompatibleSegments = IbBookingAvailabilityPageUtilsService.checkSegmentCompatibility(currentSelectedSlice.selectedSegment, vm.model.currentOriginDestinationIndex, vm.model.selectedSlices);
                    } else {
                        vm.model.selectedSlices[i] = currentSelectedSlice;
                        vm.model.selectedSlices[i].info.selectedFareFamily = vm.model.selectedSlices[i].info.cabins[vm.model.selectedSlices[i].info.selectedCabin].fareFamilies[0];
                    }
                    vm.model.selectedSlices[i].selectedSliceIndex = foundedOdSliceIndex;
                    if (incompatibleSegments) {
                        $timeout(() => {
                            BookingModalService.showGenericModal(true, 'ib-modal-incompatible-fares-segments.html', { idModal: 'ib-modal-incompatible-fares' }).result.then(changeSegments(currentSelectedSlice), angular.noop);
                        });
                    }
                    foundedSlice = true;
                } else {
                    i++;
                }
            }

            if (!vm.model.animationRun) {
                if (currentSelectedSlice.selectedSegment) {
                    vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices[foundedOdSliceIndex].segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].showFares = true;
                    vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].showOd = false;
                } else {
                    vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].slices[foundedOdSliceIndex].showFares = true;
                }
                if (!foundedSlice) {
                    currentSelectedSlice.selectedSliceIndex = foundedOdSliceIndex;
                    currentSelectedSlice.originCountry = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].originCity.countryCode;
                    currentSelectedSlice.destinationCountry = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].destinationCity.countryCode;

                    if (currentSelectedSlice.selectedSegment) {
                        currentSelectedSlice.selectedSegments = currentSelectedSlice.selectedSegments ? currentSelectedSlice.selectedSegments : [];
                        currentSelectedSlice.selectedSegments[currentSelectedSlice.selectedSegment.selectedSegmentIndex] = currentSelectedSlice.selectedSegment;
                        currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].selectedFareFamily = currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].cabins[currentSelectedSlice.selectedSegment.cabin].fareFamilies[0];
                    } else {
                        currentSelectedSlice.available = true;
                        currentSelectedSlice.info.selectedFareFamily = currentSelectedSlice.info.cabins[currentSelectedSlice.info.selectedCabin].fareFamilies[0];
                    }
                    if (vm.model.selectedSlices[vm.model.currentOriginDestinationIndex]) {
                        for (n = 0; n <= vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].selectedSegments.length; ++n) {
                            if (vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].selectedSegments[n])
                                vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].selectedSegments[n].info.showFares = false;
                        }
                    }
                    vm.model.selectedSlices[vm.model.currentOriginDestinationIndex] = currentSelectedSlice;
                }
                if (vm.model.selectedSlices.length > 1) {
                    if (currentSelectedSlice.selectedSegment) {
                        currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].cabins[currentSelectedSlice.selectedSegment.cabin].isCabinCompatible = IbBookingAvailabilityPageUtilsService.checkSliceCompatibility(currentSelectedSlice, vm.model.selectedSlices);
                    } else {
                        currentSelectedSlice.info.segments[currentSelectedSlice.info.sliceSelectedSegments].cabins[currentSelectedSlice.info.selectedCabin].isCabinCompatible = IbBookingAvailabilityPageUtilsService.checkSliceCompatibility(currentSelectedSlice, vm.model.selectedSlices);
                    }
                }
                if ((!currentSelectedSlice.selectedSegment && !vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].info.segments[currentSelectedSlice.info.sliceSelectedSegments].cabins[currentSelectedSlice.cabin].isCabinCompatible) || (currentSelectedSlice.selectedSegment && !vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].cabins[currentSelectedSlice.selectedSegment.cabin].isCabinCompatible)) {
                    $timeout(() => {
                        BookingModalService.showGenericModal(true, 'ib-modal-incompatible-fares.html', { idModal: 'ib-modal-incompatible-fares' }).result.then(changeOutbound, changeInbound);
                    });
                } else if (!incompatibleSegments) {
                    foundedSegments = IbBookingAvailabilityPageUtilsService.areAllSegmentsSelected(vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].selectedSegments);
                    if (foundedSegments && foundedSlice && currentSelectedSlice.selectedSegment && vm.model.selectedSlices[i].selectedSegments.length === vm.model.selectedSlices[i].info.segments.length) {
                        $timeout(() => {
                            BookingComponentUtils.equalHeight(angular.element('.ib-table-flight-cabins'), true);
                        });
                    }
                    $rootScope.selectedSlice = currentSelectedSlice;
                    $rootScope.animationIndex = angular.copy(vm.model.currentOriginDestinationIndex);
                    vm.model.selectedSlices[i].available = true;
                    if (!currentSelectedSlice.selectedSegment || (foundedSegments && (vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].selectedSegments.length === vm.model.selectedSlices[vm.model.currentOriginDestinationIndex].info.segments.length))) {
                        vm.model.currentOriginDestinationIndex = vm.model.selectedSlices.length;
                        completeNextOriginDestinationInfo(vm.model.selectedSlices[vm.model.currentOriginDestinationIndex - 1].info.segments, false, vm.model.currentOriginDestinationIndex - 1, false, checkSlides);
                    }
                }
            }
            BookingUtilService.setSelectedTripInfoinStorage(vm.model.selectedSlices);
            BookingUtilService.setSegmentOfSelectedTrip(vm.model.selectedSlices);
        }

        /**
         * deletes the selected slice and the following until last position in the array
         * @param {String} originDestinationId -The originDestinationsId from current selected slice
         * @param {Boolean} selectedSliceMode -If true it stars removing from the next slice of current sliceIndex, false removes from current selectedSlice Index
         * @param {Integer} sliceIndex -the index of selected slice, the shame as its origin destination
         */
        function deleteSlices(originDestinationId, selectedSliceMode, sliceIndex) {
            let found = false, i = 0;
            const showBasket = CommonsSessionStorageService.get('headerModel');
            vm.model.showTotalPrice = false;
            vm.model.availabilityData.totalPrice = 0;
            vm.model.availabilityData.withoutAviosMoney = false;
            vm.model.availabilityData.fareRate = null;
            vm.showUpselling = false;
            vm.selectedSliceInfo = null;
            vm.outboundFareSelected = originDestinationId === 'OD2' ? vm.outboundFareSelected : false;
            IbBookingAvailabilityPageUtilsService.resetShowBasketDiscounts(showBasket);
            NewMainHeaderFacade.deleteTripsBasketFromDispo();
            DatalayerUtilsService.updateDiscountData();
            if (vm.model.currentOriginDestinationIndex < vm.model.selectedSlices.length - 1) {
                updateOriginDestinationInfo(0);
                updateSelectedSlices(0);
            } else {
                updateOriginDestinationInfo(sliceIndex);
                while (!found && i < vm.model.selectedSlices.length) {
                    found = vm.model.selectedSlices[i].originDestinationId === originDestinationId;
                    i++;
                }
                if (found) {
                    updateSelectedSlices(selectedSliceMode ? i : (i - 1));
                }
            }
            if (vm.model.currentOriginDestinationIndex === 0 && vm.model.availabilityData.originDestinations.length > 1) {
                const oldSelectedFilters = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].selectedFilters;
                const oldFilterOptions = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].filterOptions;
                vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex] = $rootScope.isRedemptionFlow ?
                    BookingAvailabilityService.createRedemptionOriginDestinationInfo(vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex],
                        vm.model.availabilityData.fareFamilyConditions, originCalendarInfo[vm.model.currentOriginDestinationIndex], vm.model.availabilityData.incompatibleCabinClasses) :
                    BookingAvailabilityService.createOriginDestinationInfoTransformed(vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex],
                        vm.model.currentOriginDestinationIndex, vm.model.availabilityData.currencies, allAvailableOffers, fareFamilyConditions, originCalendarInfo[vm.model.currentOriginDestinationIndex], vm.model.currentOriginDestinationIndex);
                vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].selectedFilters = oldSelectedFilters;
                vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].filterOptions = oldFilterOptions;
            } else {
                if (!$rootScope.isRedemptionFlow) {
                    if (vm?.model?.selectedSlices[sliceIndex - 1]?.info?.selectedFareFamily?.offers) {
                        regenerateOriginCompatibility(sliceIndex, vm?.model.selectedSlices[sliceIndex - 1].info.selectedFareFamily.offers);
                    } else {
                        regenerateOriginCompatibility(sliceIndex, allAvailableOffers);
                    }
                }
            }
            if (found) {
                const index = selectedSliceMode ? i : i - 1;
                for (i = index; i < vm.model.selectedSlices.length; i++) {
                    vm.model.selectedSlices[i].info.showFares = false;
                    vm.model.availabilityData.originDestinations[i].slices.splice(vm.model.selectedSlices[i].selectedSliceIndex, 0, vm.model.selectedSlices[i].info);
                    $timeout(() => {
                        angular.element('html, body').animate({ scrollTop: angular.element('#originDestination-' + vm.model.currentOriginDestinationIndex).offset().top - 30 });
                    });
                }
                NewMainHeaderFacade.updateBasketFlexibilization('');
            }
            if (vm.tripType === '2') {
                sliceIndex === 1 ? NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_INBOUND) : NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OUTBOUND);
            } else {
                NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OW);
            }
            $timeout(() => {
                BookingComponentUtils.equalHeight(angular.element('.ib-table-flight-cabins'), true);
            });
            $timeout(() => {
                if (!vm.model.animationRun) {
                    angular.element('html, body').animate({ scrollTop: angular.element('#originDestination-' + vm.model.currentOriginDestinationIndex)?.offset()?.top - 30 });
                }
            });
        }
        function updateSelectedSlices(selectedIndexFrom) {
            let sIndex;
            for (sIndex = selectedIndexFrom; sIndex < vm.model.selectedSlices.length; sIndex++) {
                vm.model.selectedSlices[sIndex].info.showFares = false;
                if (vm.model.availabilityData.multiCity) {
                    vm.model.selectedSlices[sIndex].info.selectNextTrip = false;
                }
                updateOriginSlices(sIndex);
            }
            vm.model.selectedSlices.splice(selectedIndexFrom, vm.model.selectedSlices.length);
            vm.model.currentOriginDestinationIndex = vm.model.selectedSlices.length;
        }

        function updateOriginDestinationInfo(odIndexFrom) {
            let oIndex, i = 0, j = 0;
            for (oIndex = odIndexFrom; oIndex < vm.model.availabilityData.originDestinations.length; oIndex++) {
                vm.model.availabilityData.originDestinations[oIndex].showOd = (oIndex === odIndexFrom);
                vm.model.availabilityData.originDestinations[oIndex].showFaresSelected = false;
                if (oIndex < vm.model.selectedSlices.length && angular.isDefined(vm.model.selectedSlices[oIndex].selectedSegment)) {
                    for (i = 0; i < vm.model.availabilityData.originDestinations[oIndex].slices.length; i++) {
                        for (j = 0; j < vm.model.availabilityData.originDestinations[oIndex].slices[i].segments.length; j++) {
                            vm.model.availabilityData.originDestinations[oIndex].slices[i].segments[j].showFares = false;
                        }
                    }
                }

            }
        }



        /**
         * complete the next origin destination info. If there are not originDestinations to show, place the total price of the last offer in the view
         * @param {Object} selectedFareFamily the current selected fare family
         * @param {Boolean} selectedSliceMode If true it forces to calculate next origin destation info
         * @param {Integer} selectedSliceIndex current selected slice index from selectedSlice array, shame as its origin destination index
         * @param {Boolean} scrollToOd true if you need to make an animate scroll to the next origin destination, false e.o.c
         * @param {Boolean} notCheckLoading true if it should check loading slides into origin destination calendar data
         */
        function completeNextOriginDestinationInfo(selectedFareFamily, selectedSliceMode, selectedSliceIndex, scrollToOd, checkLoadingSlides) {
            const showBasket = CommonsSessionStorageService.get('headerModel');
            let slicesHasDiscount = false;
            if ((vm.model.currentOriginDestinationIndex < vm.model.availabilityData.originDestinations.length) ||
                (angular.isDefined(selectedSliceIndex) && (selectedSliceIndex !== vm.model.selectedSlices.length - 1) && selectedSliceMode)) {
                const oldSelectedFilters = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].selectedFilters;
                const oldFilterOptions = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].filterOptions;

                vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex] =
                    $rootScope.isRedemptionFlow ? BookingAvailabilityService.createRedemptionOriginDestinationInfo(vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex], vm.model.availabilityData.fareFamilyConditions, originCalendarInfo[vm.model.currentOriginDestinationIndex], vm.model.availabilityData.incompatibleCabinClasses, selectedSliceIndex)
                        : BookingAvailabilityService.createOriginDestinationInfo(vm.model, allAvailableOffers, fareFamilyConditions, originCalendarInfo[vm.model.currentOriginDestinationIndex], selectedFareFamily.offers, vm.model.currentOriginDestinationIndex);
                if (oldSelectedFilters) vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].selectedFilters = oldSelectedFilters;
                if (oldFilterOptions) vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].filterOptions = oldFilterOptions;
                if (checkLoadingSlides) {
                    IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides(vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex], null, true, isLoading, vm.model.currentOriginDestinationIndex);
                }
            } else {
                const newSelectedSlices = angular.copy(vm.model.selectedSlices);
                if (newSelectedSlices) {
                    for (const slice of newSelectedSlices) {
                        if (slice && slice.info && slice.info.selectedFareFamily && slice.info.selectedFareFamily.fareDiscountPriceToCalculate) {
                            if (slice.info.selectedFareFamily.fareDiscountPriceToCalculate !== slice.info.selectedFareFamily.farePriceToCalculate) {
                                slicesHasDiscount = true;
                            }
                        }
                    }
                }
                if ($rootScope.isRedemptionFlow) {
                    vm.model.showLoadingFares = true;
                    selectFareRedemptionAvailability();
                } else {
                    if (($rootScope.newFare && scrollToOd) || !$rootScope.newFare) {
                        newSelectedSlices[selectedSliceIndex].info.selectedFareFamily = selectedFareFamily;
                        const offerSelected = BookingAvailabilityService.getSelectedOffer(newSelectedSlices);
                        if (offerSelected) {
                            vm.model.numericTotalPrice = offerSelected.price.total;
                            vm.model.availabilityData.totalPrice = CurrencyService.formatPrice(vm.model.availabilityData.currencies[selectedFareFamily.fareCurrency],
                                offerSelected.price.total, true);
                            CommonsSessionStorageService.set('fareTotalPrice', vm.model.availabilityData.totalPrice);
                            /*basket functionality in dispo*/
                            if (
                                offerSelected.discountsApplied &&
                                offerSelected.discountsApplied.discounts &&
                                offerSelected.discountsApplied.discounts.length > 0 &&
                                offerSelected.discountsApplied.originalPrice &&
                                (
                                    slicesHasDiscount ||
                                    offerSelected?.priceSpecialDiscount?.totalDiscount > 0
                                )
                            ) {
                                IbBookingAvailabilityPageUtilsService.resetShowBasketDiscounts(showBasket);
                                angular.forEach(offerSelected.discountsApplied.discounts, (discount) => {
                                    NewMainHeaderFacade.updateBasketDiscountsNew(discount, offerSelected.discountsApplied.originalPrice, offerSelected.discountsApplied.totalDiscount, offerSelected.price.total);
                                });
                            } else {
                                NewMainHeaderFacade.updateBasketDiscountsNew(false, false, false);
                            }
                            NewMainHeaderFacade.updateTripsBasketFromDispo(offerSelected, vm.model);
                            DatalayerUtilsService.updateDiscountData(offerSelected?.specialDiscountsApplied ?? []);
                        }
                    }
                }
            }
            if (scrollToOd) {
                IbBookingAvailabilityPageUtilsService.scrollToOdStart(vm.model.currentOriginDestinationIndex, vm.model.selectedSlices);
            }
        }

        /**
         * Calls service to get fare information and saves in session storage the request
         */
        function selectFareRedemptionAvailability() {
            CommonsSessionStorageService.set('requestRedemptionFareInfo', BookingAvailabilityTransformer.createGetFareRequest(vm.model));
            BookingAvailabilityService.selectRedemptionAvailability().then((data) => {
                const membershipData = CommonsSessionStorageService.get('membershipData') || null;
                vm.model.availabilityData.fareRate = data.fareRate;
                vm.model.availabilityData.withoutAviosMoney = data.withoutAviosMoney;
                vm.model.availabilityData.totalPrice = data.totalPrice;
                vm.model.availabilityData.coupons = data.coupons;
                vm.model.showLoadingFares = false;
                if (membershipData && angular.isNumber(membershipData.memberBalance) && $rootScope.isPointsOBFlow) {
                    vm.model.availabilityData.withoutAviosMoney = false;
                    vm.model.availabilityData.totalPointsNeeded = !(membershipData.memberBalance >= data.totalPrice.totalPoints);
                } else {
                    vm.model.availabilityData.totalPointsNeeded = false;
                }
                dataBreakdownPassengers(null, data.totalPrice.redemptionOptionId);
                scrollToAviosMoney();
            }, (error) => {
                BookingModalService.showGenericError(error).result.then(() => {
                    deleteSlices('OD0', false, 0);
                }, () => {
                    deleteSlices('OD0', false, 0);
                });
                vm.model.showLoadingFares = false;
                scrollToAviosMoney();
            });

            function scrollToAviosMoney() {
                $timeout(() => {
                    const aviosMoney = angular.element('#aviosMoney');
                    const noAviosMoney = angular.element('#noAviosMoney');
                    if (noAviosMoney.length > 0) {
                        angular.element('html, body').animate({
                            scrollTop: noAviosMoney.offset().top - 30
                        });
                    } else if (aviosMoney.offset()) {
                        angular.element('html, body').animate({
                            scrollTop: aviosMoney.offset().top - 30
                        });
                    }
                });
            }
        }

        /**
         * Updates the selected slice with the new selected fare family and check incompatibilities.
         * @param {Object} event the event thrown
         * @param {Object} data the selected fare family, event data
         * @param {Integer} selectedSliceIndex the index of selected fare family slice in selectedSlice array, same as its origin destination index
         */
        function changeFareselected(event, data, selectedSliceIndex) {
            let fIndex = 0, changeFarePosibility = false, firstCompatibleFareFamily = null;
            const typeFligth = CommonsSessionStorageService.get('searchFlightType');
            vm.showUpselling = false;
            if (BookingAppConstants.AVAILABLE_REFACTOR && !vm.model.availabilityData.metaSearchInfo) {
                if (selectedSliceIndex === 0 && typeFligth !== BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP) {
                    for (let i = selectedSliceIndex + 1; i < vm.model.availabilityData.originDestinations.length; i++) {
                        deleteSlices(
                            vm.model.availabilityData.originDestinations[i].originDestinationId,
                            false,
                            i)
                            ;
                    }
                }
            }
            const selectedTripInfo = angular.copy(vm.model.selectedSlices);
            selectedTripInfo[selectedSliceIndex] ? selectedTripInfo[selectedSliceIndex].info.selectedFareFamily = data : angular.noop;
            vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily = data;
            $rootScope.$broadcast('changeUpsellingFare', vm.model.selectedSlices);
            $rootScope.$broadcast('updatePrice', CurrencyService.formatPrice(vm.model.availabilityData.currencies[data.fareCurrency], data.farePrice, true));
            if (vm.model.availabilityData.metaSearchInfo) {
                updateSelectedSliceInfo(selectedSliceIndex, data);
            } else {
                while (!changeFarePosibility && fIndex < vm.model.selectedSlices[selectedSliceIndex].info.cabins[vm.model.selectedSlices[selectedSliceIndex].info.showedCabin].fareFamilies.length) {
                    if (vm.model.selectedSlices[selectedSliceIndex].info.cabins[vm.model.selectedSlices[selectedSliceIndex].info.showedCabin].fareFamilies[fIndex].isCompatibleFare) {
                        firstCompatibleFareFamily = vm.model.selectedSlices[selectedSliceIndex].info.cabins[vm.model.selectedSlices[selectedSliceIndex].info.showedCabin].fareFamilies[fIndex];
                        changeFarePosibility = true;

                    }
                    fIndex++;
                }
                vm.model.selectedSlices[selectedSliceIndex].info.selectedCabin = vm.model.selectedSlices[selectedSliceIndex].info.showedCabin;
                if (data.isCompatibleFare || vm.model.availabilityData.multiCity) {
                    if (selectedSliceIndex === 0 && selectedSliceIndex < vm.model.selectedSlices.length - 1) {
                        regenerateOriginCompatibility(1, data.offers);
                    } else if (selectedSliceIndex === 1 && selectedSliceIndex === vm.model.selectedSlices.length - 1) {
                        regenerateOriginCompatibility(0, data.offers);
                    }
                    if (vm.model.availabilityData.multiCity) {
                        vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily = data;
                        vm.model.selectedSlices[selectedSliceIndex].info.selectNextTrip = true;
                        getNextTrip(false);
                    } else {
                        completeNextOriginDestinationInfo(data, false, selectedSliceIndex, true, true);
                    }
                } else {
                    BookingModalService.showGenericModal(true, 'ib-modal-incompatible-fares.html', { idModal: 'ib-modal-incompatible-fares', changeFare: changeFarePosibility }).result.then((changeFarePosibilityData) => {
                        if (!changeFarePosibilityData) {
                            changeOutbound();
                        } else {
                            vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily = firstCompatibleFareFamily;
                        }
                    }, changeInbound);
                }
                if (vm.model.availabilityData.multiCity) {
                    BookingUtilService.setSelectedTripInfoinStorage(vm.model.selectedSlices);
                }
                $timeout(() => {
                    BookingComponentUtils.equalHeight(angular.element('.ib-table-flight-cabins'), true);
                });
            }
            if ($rootScope.ancOffers && !$rootScope.newFare) {
                showAncOffers(angular.noop, vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily);
            } else if ($rootScope.ancOffers && $rootScope.newFare) {
                showAncOffers(angular.noop, vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily);
            }
            if ($rootScope.newFare) {
                const selectedTripInfoStoraged = CommonsSessionStorageService.get('selectedTripInfo');
                for (let i = 0; i < selectedTripInfoStoraged.length; i++) {
                    if (selectedTripInfoStoraged[i].info.sliceId === vm.model.selectedSlices[selectedSliceIndex].info.sliceId) {
                        selectedTripInfoStoraged[i].info.selectedFareFamily = vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily;
                    }
                }
                if (selectedSliceIndex === 0) {
                    vm.outboundFareSelected = vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily;
                }
                CommonsSessionStorageService.set('selectedTripInfo', selectedTripInfoStoraged);
            }
            checkONBLoginAndCalculatePointsDiscounts();
            DatalayerBKIService.getDigitalDataEcommerce([vm.model.selectedSlices[selectedSliceIndex]], DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
            if (vm.tripType === '2') {
                vm.model?.selectedSlices?.length === 1 && NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_INBOUND);
                vm.model?.selectedSlices?.length === 0 && NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OUTBOUND);
            }
        }

        /**
         * Updates the selected slice/segment with the new selected fare family, check incompatibilities and make an animate scroll to the next origin destination if no segments or all segments have been selected
         * @param {*} event triggered when changing selected fare
         * @param {*} fareFamilyInfo Data of the fare family selected
         * @param {*} selectedSliceIndex slice index inside selected segments
         * @param {*} selectedSegmentIndex segment index
         */
        function changeRedemptionFareselected(event, fareFamilyInfo, selectedSliceIndex, selectedSegmentIndex) {
            let foundedSegments = false, previousSelectedSlice = null, infoSegments = null;
            vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex].cabins[fareFamilyInfo.cabinType].isCabinCompatible = IbBookingAvailabilityPageUtilsService.checkSliceCompatibility(vm.model.selectedSlices[selectedSliceIndex], vm.model.selectedSlices);
            if (!vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex].cabins[fareFamilyInfo.cabinType].isCabinCompatible && vm.model.selectedSlices[selectedSliceIndex].available) {
                $timeout(() => {
                    BookingModalService.showGenericModal(true, 'ib-modal-incompatible-fares.html', { idModal: 'ib-modal-incompatible-fares' }).result.then(changeOutbound, changeInbound);
                });
            } else {
                if (vm.model.selectedSlices[selectedSliceIndex].selectedSegments) {
                    vm.model.selectedSlices[selectedSliceIndex].selectedSegments[selectedSegmentIndex].info.selectedCabin = vm.model.selectedSlices[selectedSliceIndex].selectedSegments[selectedSegmentIndex].info.showedCabin;
                    previousSelectedSlice = angular.copy(vm.model.selectedSlices[selectedSliceIndex].selectedSegments[selectedSegmentIndex]);
                    infoSegments = angular.copy(vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex]);
                    vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex].selectedCabin = vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex].showedCabin;
                    vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex].selectedFareFamily = fareFamilyInfo;
                    vm.model.selectedSlices[selectedSliceIndex].selectedSegments[selectedSegmentIndex] = { info: vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex], cabin: fareFamilyInfo.cabinType, selectedSegmentIndex: selectedSegmentIndex };
                } else {
                    vm.model.selectedSlices[selectedSliceIndex].info.selectedCabin = vm.model.selectedSlices[selectedSliceIndex].info.showedCabin;
                    vm.model.selectedSlices[selectedSliceIndex].info.selectedFareFamily = fareFamilyInfo;
                }
                if ((angular.isDefined(vm.model.selectedSlices[selectedSliceIndex].selectedSegments)) && IbBookingAvailabilityPageUtilsService.checkSegmentCompatibility(vm.model.selectedSlices[selectedSliceIndex].selectedSegments[selectedSegmentIndex], selectedSliceIndex, vm.model.selectedSlices) && vm.model.selectedSlices[selectedSliceIndex].available) {
                    if (vm.model.selectedSlices[selectedSliceIndex].available) {
                        infoSegments.showedCabin = infoSegments.selectedCabin;
                        vm.model.selectedSlices[selectedSliceIndex].selectedSegments[selectedSegmentIndex] = previousSelectedSlice;
                        vm.model.selectedSlices[selectedSliceIndex].info.segments[selectedSegmentIndex] = angular.copy(infoSegments);
                    }
                    $timeout(() => {
                        BookingModalService.showGenericModal(true, 'ib-modal-incompatible-fares-segments.html', { idModal: 'ib-modal-incompatible-fares' }).result.then(changeSegments(vm.model.selectedSlices[selectedSliceIndex]), angular.noop);
                    });
                } else {
                    foundedSegments = IbBookingAvailabilityPageUtilsService.areAllSegmentsSelected(vm.model.selectedSlices[selectedSliceIndex].selectedSegments);
                    if (IbBookingAvailabilityPageUtilsService.isReadyToCallRedemptionFare(vm.model)) {
                        vm.model.showLoadingFares = true;
                        selectFareRedemptionAvailability();
                    }
                    if (!vm.model.selectedSlices[selectedSliceIndex].selectedSegments || (vm.model.selectedSlices[selectedSliceIndex].selectedSegments.length === vm.model.selectedSlices[selectedSliceIndex].info.segments.length && IbBookingAvailabilityPageUtilsService.areAllSegmentsSelected(vm.model.selectedSlices[selectedSliceIndex].selectedSegments))) {
                        IbBookingAvailabilityPageUtilsService.scrollToOdStart(vm.model.currentOriginDestinationIndex, vm.model.selectedSlices);
                    }
                }
            }
        }

        /**
         * Regenerates the origin destination to recalculate the compatible fares
         * @param {Integer} originIndex  The origin destination to be recalculated
         * @param {Array<Object>} compatibleOffers The array with the compatible offers for this origin destinatino
         */
        function regenerateOriginCompatibility(originIndex, compatibleOffers) {
            const oldSelectedSliceInfo = vm.model.selectedSlices[originIndex] ? vm.model.selectedSlices[originIndex].info : null;
            const oldSelectedSliceIndex = vm.model.selectedSlices[originIndex] ? vm.model.selectedSlices[originIndex].selectedSliceIndex : null;
            const oldShowOd = vm.model.availabilityData.originDestinations[originIndex].showOd;
            const oldShowFares = vm.model.availabilityData.originDestinations[originIndex].showFaresSelected;
            const oldFilterOptions = vm.model.availabilityData.originDestinations[originIndex].filterOptions;
            let updatedSliceInfo = null;
            const oldSelectedFilters = vm.model.availabilityData.originDestinations[originIndex].selectedFilters;
            const selectedTripFare = angular.copy(vm.model.selectedSlices);
            if (vm.model.selectedSlices[originIndex]) {
                updateOriginSlices(originIndex);
            }
            vm.model.availabilityData.originDestinations[originIndex] = $rootScope.isRedemptionFlow ?
                BookingAvailabilityService.createRedemptionOriginDestinationInfo(vm.model.availabilityData.originDestinations[originIndex],
                    vm.model.availabilityData.fareFamilyConditions, originCalendarInfo[originIndex], vm.model.availabilityData.incompatibleCabinClasses)
                : BookingAvailabilityService.createOriginDestinationInfoTransformed(vm.model.availabilityData.originDestinations[originIndex],
                    originIndex, vm.model.availabilityData.currencies, allAvailableOffers, fareFamilyConditions, originCalendarInfo[originIndex], compatibleOffers, originIndex);
            vm.model.availabilityData.originDestinations[originIndex].filterOptions = oldFilterOptions;
            vm.model.availabilityData.originDestinations[originIndex].showOd = oldShowOd;
            vm.model.availabilityData.originDestinations[originIndex].showFaresSelected = oldShowFares;
            if (oldSelectedFilters) vm.model.availabilityData.originDestinations[originIndex].selectedFilters = oldSelectedFilters;
            if (oldSelectedSliceInfo) {
                updatedSliceInfo = vm.model.availabilityData.originDestinations[originIndex].slices[oldSelectedSliceIndex];
                updatedSliceInfo.showFares = oldShowFares;
                updatedSliceInfo.selectedFareFamily = $rootScope.isRedemptionFlow ? vm.model.availabilityData.fareFamilyConditions : IbBookingAvailabilityPageUtilsService.getSelectedFareFamily(selectedTripFare && selectedTripFare[updatedSliceInfo.sliceIndex] ? selectedTripFare[updatedSliceInfo.sliceIndex].info.selectedFareFamily : oldSelectedSliceInfo.selectedFareFamily, oldSelectedSliceInfo.selectedCabin, updatedSliceInfo);
                updatedSliceInfo.selectedCabin = oldSelectedSliceInfo.selectedCabin;
                updatedSliceInfo.showedCabin = oldSelectedSliceInfo.showedCabin;
            }
            updateSelectedSliceInfo(originIndex, updatedSliceInfo);
        }


        /**
         * Continue booking flow after availability, calling to the get fare rest service if needed or redirecting to passenger page/ALP depending in the case
         */
        function selectAvailability() {
            CommonsSessionStorageService.set('loadingNextFlow', 2);
            $rootScope.backGroundImage = BookingUtilService.getBackGroundURL();
            $rootScope.isAvailability = false;
            const mnttLog2GTM = $window?.mnttLog2GTM ?? (() => { });
            BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            DatalayerUtilsService.removeDatalayerObjects([DatalayerConstants.DATALAYER_INFO.ORDER_KEY, DatalayerConstants.DATALAYER_INFO.EVENT]);
            if (vm.model.availabilityData.metaSearchInfo || vm.model.availabilityData.multiCity || vm.model.availabilityData.redemption) {
                BookingUtilService.setSelectedTripInfoinStorage(vm.model.selectedSlices);
                BookingUtilService.setSegmentOfSelectedTrip(vm.model.selectedSlices);
                DatalayerBKIService.updateDatalayerObject(vm.model.selectedSlices);
                if (vm.model.availabilityData.redemption) {
                    CommonsSessionStorageService.set('selectedFareRedemptionData', vm.model.availabilityData.totalPrice);
                } else if (vm.model.availabilityData.metaSearchInfo) {
                    const fareData = CommonsSessionStorageService.get('fareData');
                    const newSelectedSlices = cloneDeep(vm.model.selectedSlices);
                    const offerSelected = BookingAvailabilityService.getSelectedOffer(newSelectedSlices);
                    fareData.offers.splice(0, fareData.offers.length);
                    fareData.offers.push(offerSelected);

                    CommonsSessionStorageService.set('fareData', fareData);
                    CommonsSessionStorageService.set('orderItemsId', [offerSelected.offerItems[0].offerItemId]);
                }
                $location.path('/ibairp');
            } else {
                CommonsSessionStorageService.set('requestFareInfo', BookingAvailabilityTransformer.createGetFareRequest(vm.model));
                BookingAvailabilityService.selectAvailability().then((fareRequest) => {
                    BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                    DatalayerBKIService.updateDatalayerObject(vm.model.selectedSlices);
                    if (BookingAppConstants.DYNAMIC_PRICING_WARN_FARE_ENABLE && fareRequest?.warnings && Array.isArray(fareRequest.warnings)) {
                        const warnPriceChange = fareRequest.warnings.find((warning) => warning.code === 'SSE_AVM_20010' || warning.code === 'SSE_AWS_9113');
                        if (warnPriceChange) {
                            warnPriceChange.title = 'MODAL_HEADING_ATTENTION_TEXT';
                            warnPriceChange.message = warnPriceChange.description;
                            BookingModalService.showGenericModal(true, 'generic-info-modal.html', warnPriceChange).result.then(() => { }, () => { });
                        }
                    }
                    $location.path('/ibpbah');
                }, (error) => {
                    BookingModalService.finishWaiting();
                    BookingModalService.showGenericError(error).result.then(() => { }, () => { });
                });
            }

            function isFareCompatibleFlex() {
                const selectedFares = vm.model.selectedSlices ?? [];
                for (let i = 0; i < selectedFares.length; i++) {
                    if (selectedFares[i]?.info?.selectedFareFamily?.commercialNameES !== 'Básica' && selectedFares[i]?.info?.selectedFareFamily?.commercialNameES !== 'Óptima') {
                        return false;
                    }
                }
                return true;
            }

            if (isCompatibleOperatedByFlex() && isFareCompatibleFlex() && vm.model.availabilityData.originDestinations.length === vm.model.selectedSlices.length &&
                (vm.model.availabilityData.flightRatio === 'Medio Radio' || vm.model.availabilityData.flightRatio === 'Corto Radio')
                && vm.restDaysDate > 25) {
                mnttLog2GTM('ATQ-7625: Adelantar compra de flexibilidad a la dispo', 'Is target');
            }

            if ($rootScope.ancOffers) {
                if (CommonsSessionStorageService.get('selectedFlex')) {
                    mnttLog2GTM('ATQ-7625: Adelantar compra de flexibilidad a la dispo', 'Compra flex');
                }
            }

        }

        /**
         * gets the next slick calendar prices from the service, updating its model
         * @param {Object} event the event thrown
         * @param {Object} isNext the current selected slide is less than next selected slide
         */
        function nextSliceDate(event, isNext) {
            const currentOrigin = vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex];
            currentOrigin.calendarSlides.currentInitialSlide += isNext ? 1 : -1;
            IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides(currentOrigin, isNext, null, isLoading, vm.model.currentOriginDestinationIndex);//Duda parámetros entrada
        }

        /**
         * Receives the slide information and the origin destination index to call availability service and reload the information with the new date
         * @param {Object} event The event thrown to change availability date.
         * @param {Object} slideInfo information about the slide selected.
         * @param {Boolean} isReturn Type of flight selected.
         */
        function changeAvailability(event, slideInfo, isNext) {

            BookingModalService.closeAllCurrentModals();
            vm.model = BookingAvailabilityService.updateLimitsCalendarData(vm.model, slideInfo, isNext);
            const oldOriginInfo = IbBookingAvailabilityPageUtilsService.generateOldOriginDestinationInfo(vm.model.currentOriginDestinationIndex, vm.model.availabilityData);
            const oldOriginDestinationIndex = vm.model.currentOriginDestinationIndex;
            vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].loadingAvailability = true;
            if ($rootScope.isRedemptionFlow) vm.loadingOption = true;
            IbBookingAvailabilityPageUtilsService.updateHeaderDates(vm.model.currentOriginDestinationIndex, slideInfo.serviceDate);
            BookingAvailabilityService.updateBookingAvailability(slideInfo, vm.model).then((data) => {
                let sIndex = 0, finished = false;
                const currentSelectedSlices = vm.model.selectedSlices;
                vm.currentSelectedFareFamily = currentSelectedSlices[0] ? { ...currentSelectedSlices[0].info?.selectedFareFamily } : null;
                vm.model.initializeModel();
                getBookingAvailability(data, vm.model.currentOriginDestinationIndex);
                while (!finished && sIndex < currentSelectedSlices.length) {
                    const selectedSlice = BookingAvailabilityService.getSelectedSlice(currentSelectedSlices[sIndex].info.departureDateTime, currentSelectedSlices[sIndex].info.arrivalDateTime, vm.model);
                    if (selectedSlice) {
                        if ($rootScope.isRedemptionFlow) {
                            if (currentSelectedSlices[sIndex].selectedSegments) {
                                angular.extend(selectedSlice.slice, { selectedSegment: currentSelectedSlices[sIndex].selectedSegment, selectedSegments: currentSelectedSlices[sIndex].selectedSegments });
                                angular.extend(currentSelectedSlices[sIndex], {
                                    originDestinationId: vm.model.availabilityData.originDestinations[sIndex].originDestinationId
                                });
                            } else {
                                angular.extend(selectedSlice.slice, { selectedCabin: currentSelectedSlices[sIndex].info.selectedCabin, showedCabin: currentSelectedSlices[sIndex].info.showedCabin });
                                angular.extend(currentSelectedSlices[sIndex], {
                                    info: selectedSlice.slice,
                                    originDestinationId: vm.model.availabilityData.originDestinations[sIndex].originDestinationId
                                });
                            }
                            selectRedemptionSlice(event, currentSelectedSlices[sIndex], false);
                        } else {
                            angular.extend(selectedSlice.slice, { selectedCabin: currentSelectedSlices[sIndex].info.selectedCabin, showedCabin: currentSelectedSlices[sIndex].info.showedCabin });
                            angular.extend(currentSelectedSlices[sIndex], {
                                info: selectedSlice.slice,
                                originDestinationId: vm.model.availabilityData.originDestinations[sIndex].originDestinationId
                            });
                            selectSlice(event, currentSelectedSlices[sIndex], false);
                        }

                        IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides(vm.model.availabilityData.originDestinations[sIndex], isNext, true, isLoading, vm.model.currentOriginDestinationIndex);

                        vm.model.availabilityData.originDestinations[sIndex].showFaresSelected = true;
                        vm.model.availabilityData.originDestinations[sIndex].showOd = false;
                        sIndex++;
                    } else {
                        finished = true;
                    }
                }
                vm.model.availabilityData.originDestinations[sIndex].selectedFilters = oldOriginInfo.selectedFilters[sIndex];
                vm.model.availabilityData.originDestinations[sIndex].filterOptions = oldOriginInfo.filterOptions[sIndex];
                if (!$rootScope.isRedemptionFlow) {
                    vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options = angular.copy(vm.model.availabilityData.originDestinations[sIndex].initialFilterOptions.price.options);
                    if (vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.minValue
                        < vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options.floor
                    ) {
                        vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.minValue =
                            vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options.floor;
                    } else {
                        if (
                            !(
                                vm.model.availabilityData.originDestinations[sIndex].selectedFilters
                                && vm.model.availabilityData.originDestinations[sIndex].selectedFilters.price
                                && vm.model.availabilityData.originDestinations[sIndex].selectedFilters.price.value[0]
                            )
                        ) {
                            vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.minValue =
                                vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options.floor;
                        }
                    }
                    if (
                        vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.maxValue
                        > vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options.ceil
                    ) {
                        vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.maxValue =
                            vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options.ceil;
                    } else {
                        if (
                            !(
                                vm.model.availabilityData.originDestinations[sIndex].selectedFilters
                                && vm.model.availabilityData.originDestinations[sIndex].selectedFilters.price
                                && vm.model.availabilityData.originDestinations[sIndex].selectedFilters.price.value[1]
                            )
                        ) {
                            vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.maxValue =
                                vm.model.availabilityData.originDestinations[sIndex].filterOptions.price.options.ceil;
                        }
                    }
                }
                vm.model.availabilityData.originDestinations[sIndex].showOd = true;
                if (sIndex === oldOriginDestinationIndex && slideInfo.slidePosition) {
                    vm.model.availabilityData.originDestinations[sIndex].calendarSlides.selectedSlide = slideInfo.slidePosition;
                    vm.model.availabilityData.originDestinations[sIndex].calendarSlides.currentInitialSlide = slideInfo.slidePosition;
                    IbBookingAvailabilityPageUtilsService.checkLoadingCalendarSlides(vm.model.availabilityData.originDestinations[sIndex], isNext, true, isLoading, vm.model.currentOriginDestinationIndex);
                }
                for (sIndex = vm.model.currentOriginDestinationIndex + 1; sIndex < oldOriginInfo.selectedFilters.length; sIndex++) {
                    vm.model.availabilityData.originDestinations[sIndex].selectedFilters = oldOriginInfo.selectedFilters[sIndex];
                    vm.model.availabilityData.originDestinations[sIndex].filterOptions = oldOriginInfo.filterOptions[sIndex];
                }
                $timeout(() => {
                    BookingComponentUtils.equalHeight(angular.element('.ib-table-flight-cabins'), true);
                });
            }, showServiceError);
        }


        function afterLogin() {
            BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            CommonsSessionStorageService.remove('headerModel');
            activate();
        }
        /**
         * Stops the plane animation and associates the transformed availability data to the page model
         * @param {Object} data the transformed availability data
         */
        function getBookingAvailability(data, currentOriginDestinationIndex) {
            vm.tripType = BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE[1]) || null;
            BookingUserActivityService.initKeepAliveTimer();
            $rootScope.showHeaders = true;
            GetDestinationsService.getDestinationAreasCitiesList().then();
            const offers = data?.allAvailableOffers ?? [];
            BookingModalService.finishWaiting();
            vm.renderUpsellingComponent = renderMetasearchComponentByFlightType();
            CommonsSessionStorageService.set('loadingNextFlow', 1);    //RESET nextFlow to 1 (AVAILABILITY)
            const selectedPartner = IbCheckPartnersDiscountsService.getSelectedPartner()
            if (!$rootScope.isRedemptionFlow && CommonsSessionStorageService.get('searchFlightType') === 'availabilityFlight' && selectedPartner?.partnerIdentifier === 'SAN') {
                vm.showPartnerCollapsable = true;
            }
            DatalayerBKIService.updateDigitalDataDynamicPricing(offers);
            if (data.transformedAvailabilityData && data.transformedAvailabilityData.originDestinations[currentOriginDestinationIndex || 0].isAvailable) {
                vm.model.isOpenJaw = CommonsSessionStorageService.get('openJaw');
                vm.model.availabilityData = data.transformedAvailabilityData;
                vm.model.availabilityData.isMetaOpenJaw = (vm.model.availabilityData.metaSearchInfo && vm.model.isOpenJaw) ?? false;

                NewMainHeaderFacade.initHeader({
                    originDestination: vm.model.availabilityData.multiCity || vm.model.availabilityData.isMetaOpenJaw ? CommonsSessionStorageService.get('originDestinationMulticity') : CommonsSessionStorageService.get('originDestination'),
                    redemption: vm.model.availabilityData.redemption,
                    flightType: vm.model.availabilityData.isMetaOpenJaw ? BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP : CommonsSessionStorageService.get('searchFlightType'),
                    currency: vm.model.availabilityData.currencies[vm.model.availabilityData.originDestinations[0].currency] || 'REDEMPTION',
                    showModalBackHome: true,
                    showBasket: vm.model.availabilityData.metaSearchInfo || vm.model.availabilityData.multiCity || $rootScope.isRedemptionFlow || $rootScope.isPointsOBFlow ? false : true
                },
                    { hasSteps: true, steps: $rootScope.isPointsOBFlow ? 'REDEMPTION_OB_STEPS' : 'DEFAULT_STEPS', position: CommonsSessionStorageService.get('actualStepFlow') },
                    {
                        onLogin: IbBookingAvailabilityPageUtilsService.onLogin,
                        onError: IbBookingAvailabilityPageUtilsService.onError,
                        afterLogin: afterLogin,
                        userLogged: CommonsSessionStorageService.get('userLogged'),
                        loggedData: CommonsSessionStorageService.get('customerData') || CommonsSessionStorageService.get('membershipData') || undefined
                    });
                vm.tripType === '2' ? NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OUTBOUND) : NewMainHeaderFacade.updateStepDescription(BookingAppConstants.HEADER_MOBILE_STEP_DESCRIPTIONS.SELECT_FLIGHT_OW);

                if (vm.model.availabilityData.multiCity) {
                    allAvailableOffers = [];
                    fareFamilyConditions[vm.model.currentOriginDestinationIndex] = data.fareFamilyConditions;
                    allAvailableOffers[vm.model.currentOriginDestinationIndex] = data.allAvailableOffers;
                } else {
                    fareFamilyConditions = data.fareFamilyConditions;
                    allAvailableOffers = data.allAvailableOffers;
                }
                originCalendarInfo = data.originCalendarInfo;
                vm.model.animationRun = false;
                vm.model.showTotalPrice = false;
                vm.showLocalDiscount();
                if (vm.model.availabilityData.metaSearchInfo) {
                    CommonsSessionStorageService.set('addPassengers', null);
                    vm.model.showTotalPrice = true;
                    vm.model.disableDelete = true;
                    vm.model.currentOriginDestinationIndex = 2;
                    vm.model.selectedSlices = vm.model.availabilityData.selectedSlices;
                    vm.model.availabilityData.loading = false;
                    vm.model.availabilityData.searchNewAvailability = false;
                    vm.model.specialDiscountsPossibilities = vm.model.specialDiscountsPossibilities ? vm.model.specialDiscountsPossibilities : data.specialDiscounts;
                    $scope.$broadcast('updateInitialInfo');

                }
                $timeout(() => {
                    if (angular.isObject($window.datalayer_general)) {
                        CommonsSessionStorageService.set('confirmationDatalayerInfo', $window.datalayer_general);
                    }
                    let quadrigramInfoDatalayer = BookingAppConstants.QUADRIGAMS.AVAILABILITY;
                    if (CommonsSessionStorageService.get('multiCitySearch')) {
                        if (CommonsSessionStorageService.get('isHMAD')) {
                            quadrigramInfoDatalayer = BookingAppConstants.QUADRIGAMS.HMAD_AVAILABILITY;
                        } else {
                            quadrigramInfoDatalayer = BookingAppConstants.QUADRIGAMS.MULTI_AVAILABILITY;
                        }
                    } else if ($rootScope.isRedemptionFlow) {
                        if ($rootScope.isPointsOBFlow) {
                            quadrigramInfoDatalayer = BookingAppConstants.QUADRIGAMS.ONB_REDEMPTION_AVAILABILITY;
                        } else {
                            quadrigramInfoDatalayer = BookingAppConstants.QUADRIGAMS.REDEMPTION_AVAILABILITY;
                        }
                    }

                    DatalayerUtilsService.removeDigitalDataObjects([DatalayerBKIConstants.LARGE_FAMILY, DatalayerBKIConstants.RESIDENT_CODE]);
                    DigitalDataUtilsService.updateDigitalDataWithQuadrigam(quadrigramInfoDatalayer, data.digitalDataObject);
                    DatalayerUtilsService.updateDatalayerViewEvent();
                    let monetateQuadrigam = BookingAppConstants.QUADRIGAMS.AVAILABILITY;
                    if (CommonsSessionStorageService.get('multiCitySearch')) {
                        if (CommonsSessionStorageService.get('isHMAD')) {
                            monetateQuadrigam = BookingAppConstants.QUADRIGAMS.HMAD_AVAILABILITY;
                        } else {
                            monetateQuadrigam = BookingAppConstants.QUADRIGAMS.MULTI_AVAILABILITY;
                        }
                    } else if ($rootScope.isRedemptionFlow) {
                        if ($rootScope.isPointsOBFlow) {
                            monetateQuadrigam = BookingAppConstants.QUADRIGAMS.ONB_REDEMPTION_AVAILABILITY;
                        } else {
                            monetateQuadrigam = BookingAppConstants.QUADRIGAMS.REDEMPTION_AVAILABILITY;
                        }
                    }
                    MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, monetateQuadrigam);
                    if ((!$rootScope.isPointsOBFlow || $rootScope.isRedemptionFlow) && (CommonsSessionStorageService.get('flowApp') === 'BBKI' || CommonsSessionStorageService.get('flowApp') === 'BBKIOH') && (CommonsSessionStorageService.get('searchFlightType') === 'availabilityFlight' || CommonsSessionStorageService.get('searchFlightType') === 'redemptionFlight'
                        || CommonsSessionStorageService.get('searchFlightType') === 'metasearchFlight')) {
                        MonetateUtilsService.addFlightSearchMonetate(CommonsSessionStorageService.get('bookingUrlParams'), CommonsSessionStorageService.get('originDestination'), vm.model.availabilityData);
                    }
                    vm.model.isLoading = false;
                    vm.loadingOption = false;
                    $timeout(() => {
                        $rootScope.$broadcast('sendUpdateToMonetate');
                    });
                    checkIfHelloMadrid();
                });
                if (data.transformedAvailabilityData.warnings && data.transformedAvailabilityData.warnings[0]) {
                    angular.forEach(data.transformedAvailabilityData.warnings, (warning) => {
                        if (warning.code === 'SSE_AVM_20010' || warning.code === 'SSE_AWS_9113') {
                            warning.title = 'MODAL_HEADING_ATTENTION_TEXT';
                            warning.message = warning.description;
                            BookingModalService.showGenericModal(true, 'generic-info-modal.html', warning).result.then(() => { }, () => { });
                        }
                    });
                }
            } else {
                $location.path('/ibbkerror');
            }
        }

        /**
         * Open a modal window for show all conditions of rate selected
         * @param {Object} event Event
         * @param {Object} conditions All conditions of rate selected
         */
        function openFareWindowModal(event, selectedFareInfo) {
            angular.extend(selectedFareInfo, { idModal: 'ib-compare-fares-modal' });
            const fareFamilyConditionsWithIcons = BookingAvailabilityTransformer.getDetailedFaresInfo(vm.model.availabilityData.fareFamilyConditions);
            angular.forEach(fareFamilyConditionsWithIcons.conditions, (condition) => {
                condition.info.icon = BookingAvailabilityConstants.FARE_FAMILY_ICON_PROPERTY_CODE[condition.info.code];
            });
            BookingModalService.showFaresModal(false, 'ib-compare-fares-modal.html', { fareFamilyConditions: fareFamilyConditionsWithIcons, selectedFareInfo: selectedFareInfo }, 'ib-modals--lg').result.then(angular.noop, angular.noop);
        }

        /**
         * Undo segments selection up to first segment (and hide its fares)
         */
        function changeSegments(currentSelectedSlice) {
            const currentSelectedSliceIndex = currentSelectedSlice.originDestinationId === 'OD0' ? 0 : 1;
            for (let i = 1; i < vm.model.selectedSlices[currentSelectedSliceIndex].info.segments.length; i++) {
                vm.model.selectedSlices[currentSelectedSliceIndex].info.segments[i].showFares = false;
            }
            vm.model.selectedSlices[currentSelectedSliceIndex].selectedSegments.splice(1, vm.model.selectedSlices[currentSelectedSliceIndex].selectedSegments.length);

        }

        /**
         * Change the outbound selection removing the selected slice
         * NewMainHeaderFacade.deleteTripsBasketFromDispo
         * (Delete Trips and Update Basket in Availability)
         */
        function changeOutbound() {
            updateIncompatibleFares(1, 0);
            NewMainHeaderFacade.deleteTripsBasketFromDispo();
        }

        /**
         * Change the inbound selection removing the selected slice and regerating the origin model
         * NewMainHeaderFacade.deleteTripsBasketFromDispo
         * (Delete Trips and Update Basket in Availability)
         */
        function changeInbound() {
            updateIncompatibleFares(0, 1);
            NewMainHeaderFacade.deleteTripsBasketFromDispo();
        }

        /**
         * Updates the selected slice in the given index with the given information
         * @param {Integer} index the selected slice index to be updated
         * @param {Object} selectedSliceInfo the new information of the selected slice
         */
        function updateSelectedSliceInfo(index, selectedFareInfo) {
            const updateSlicetoBestPrices = (sliceIndex) => {
                const cabins = Object.values(vm.model.selectedSlices[sliceIndex].info.cabins).flat();
                // actualizar cabin priceToShown
                cabins.map(cabin => cabin.fareFamilies).flat().forEach(
                    (fare) => {
                        const selectedOffer = fare.offers[0];
                        const slicePrice = selectedOffer.slices[sliceIndex].price.total;
                        fare.farePrice = selectedOffer.price.total;
                        fare.farePriceShown = CurrencyService.formatPrice(vm.model.availabilityData.currencies[selectedFareInfo.fareCurrency], slicePrice, false, true);
                        fare.farePriceToCalculate = slicePrice;
                        return fare;

                    }
                );
            };




            if (index >= 0 && index < vm.model.selectedSlices.length) {
                if (vm.model.availabilityData.metaSearchInfo) {
                    vm.model.selectedSlices[index].info.selectedFareFamily = selectedFareInfo;
                    /*if (vm.model.selectedSlices[index].info.slicePrice < selectedFareInfo.farePrice) {
                        vm.model.selectedSlices[index].info.maxSlicePrice = selectedFareInfo.farePrice;
                    }*/
                    vm.model.selectedSlices[index].info.slicePrice = selectedFareInfo.farePrice;

                    vm.model.availabilityData.totalPrice = CurrencyService.formatPrice(vm.model.availabilityData.currencies[selectedFareInfo.fareCurrency], selectedFareInfo.farePrice, true);
                    if (index === 0 && vm.model.selectedSlices.length > 1) {
                        updateSlicetoBestPrices(0);
                        vm.model.selectedSlices[1].info.cabins = IbMetaSearchInfoServiceUtils.getCompatibleCabinsWithFare(selectedFareInfo, vm.model.availabilityData.originDestinations[1].slices[0].cabins, 1);
                        vm.model.selectedSlices[1].info.selectedFareFamily = vm.model.selectedSlices[1].info.cabins[Object.keys(vm.model.selectedSlices[1].info.cabins)[0]].fareFamilies[0];
                        vm.model.selectedSlices[1].info.showedCabin = Object.keys(vm.model.selectedSlices[1].info.cabins)[0];
                    } else if (vm.model.selectedSlices.length > 1) {
                        const selectedOffer = BookingAvailabilityService.getSelectedOffer(vm.model.selectedSlices);
                        vm.model.selectedSlices[0].info.slicePrice = selectedOffer.slices[0].price.total;
                        vm.model.availabilityData.totalPrice = CurrencyService.formatPrice(vm.model.availabilityData.currencies[selectedFareInfo.fareCurrency], selectedOffer.price.total, true);
                        const slicePrice = selectedOffer.slices[0].price.total;
                        const cabinsAux = vm.model.selectedSlices[0].info.cabins;
                        const cabins = Object.values(cabinsAux);
                        const fare = [...cabins.map((cabin) => cabin.fareFamilies)].flat().find((fare) => fare.offers.some((offer) => selectedOffer.offerId === offer.offerId));
                        fare.farePrice = selectedOffer.price.total;
                        fare.farePriceShown = CurrencyService.formatPrice(vm.model.availabilityData.currencies[selectedFareInfo.fareCurrency], slicePrice, false, true);
                        fare.farePriceToCalculate = slicePrice;
                    }
                    BookingUtilService.setSelectedTripInfoinStorage(vm.model.selectedSlices);
                    BookingUtilService.setSegmentOfSelectedTrip(vm.model.selectedSlices);
                    $rootScope.$broadcast('changeUpsellingFare');
                } else {
                    BookingUtilService.setSelectedTripInfoinStorage(vm.model.selectedSlices);
                    BookingUtilService.setSegmentOfSelectedTrip(vm.model.selectedSlices);
                    vm.model.selectedSlices.length > 1 ? $rootScope.$broadcast('changeUpsellingFare', vm.model.selectedSlices) : angular.noop;
                }

            }
            // aquí guardamos localStorage
            //$rootScope.$broadcast('changeUpsellingFare');
        }

        /**
         * Updates the origins destination information
         * @param {Integer} allCompatibleOr  must have all its slices, cabins and fares compatibles
         * @param {Integer} offerCompatibleOriginIndex the origin destination that should calcularte its compatible offers
         */
        function updateIncompatibleFares(allCompatibleOriginIndex, offerCompatibleOriginIndex) {
            const allCompatibleOriginSliceSelected = vm.model.selectedSlices[allCompatibleOriginIndex].info;
            const allCompatibleOriginSliceSelectedIndex = vm.model.selectedSlices[allCompatibleOriginIndex].selectedSliceIndex;
            const oldAllCompatibleFilterOptions = vm.model.availabilityData.originDestinations[allCompatibleOriginIndex].filterOptions;
            const oldOfferCompatibleFilterOptions = vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex].filterOptions;
            vm.model.showTotalPrice = false;
            vm.model.selectedSlices[offerCompatibleOriginIndex].available = false;
            updateOriginSlices(offerCompatibleOriginIndex);
            updateOriginSlices(allCompatibleOriginIndex);
            vm.model.availabilityData.originDestinations[allCompatibleOriginIndex] = $rootScope.isRedemptionFlow ?
                BookingAvailabilityService.createRedemptionOriginDestinationInfo(
                    vm.model.availabilityData.originDestinations[allCompatibleOriginIndex],
                    vm.model.availabilityData.fareFamilyConditions,
                    originCalendarInfo[allCompatibleOriginIndex],
                    vm.model.availabilityData.incompatibleCabinClasses) :
                BookingAvailabilityService.createOriginDestinationInfoTransformed(vm.model.availabilityData.originDestinations[allCompatibleOriginIndex],
                    allCompatibleOriginIndex, vm.model.availabilityData.currencies, allAvailableOffers, fareFamilyConditions,
                    originCalendarInfo[allCompatibleOriginIndex], allCompatibleOriginIndex);
            vm.model.availabilityData.originDestinations[allCompatibleOriginIndex].filterOptions = oldAllCompatibleFilterOptions;
            vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex] = $rootScope.isRedemptionFlow ?
                BookingAvailabilityService.createRedemptionOriginDestinationInfo(
                    vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex],
                    vm.model.availabilityData.fareFamilyConditions,
                    originCalendarInfo[offerCompatibleOriginIndex],
                    vm.model.availabilityData.incompatibleCabinClasses) :
                BookingAvailabilityService.createOriginDestinationInfoTransformed(vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex],
                    offerCompatibleOriginIndex, vm.model.availabilityData.currencies, allAvailableOffers, fareFamilyConditions,
                    originCalendarInfo[offerCompatibleOriginIndex], allCompatibleOriginSliceSelected.selectedFareFamily.offers, allCompatibleOriginIndex);
            vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex].filterOptions = oldOfferCompatibleFilterOptions;
            vm.model.availabilityData.originDestinations[allCompatibleOriginIndex].showOd = false;
            vm.model.availabilityData.originDestinations[allCompatibleOriginIndex].showFaresSelected = true;
            const updatedSliceInfo = vm.model.availabilityData.originDestinations[allCompatibleOriginIndex].slices[allCompatibleOriginSliceSelectedIndex];
            updatedSliceInfo.showFares = true;
            if (!$rootScope.isRedemptionFlow) {
                updatedSliceInfo.selectedFareFamily = IbBookingAvailabilityPageUtilsService.getSelectedFareFamily(allCompatibleOriginSliceSelected.selectedFareFamily, allCompatibleOriginSliceSelected.selectedCabin,
                    updatedSliceInfo);
                updatedSliceInfo.selectedCabin = allCompatibleOriginSliceSelected.selectedCabin;
                updateSelectedSliceInfo(allCompatibleOriginIndex, updatedSliceInfo);
            } else if (allCompatibleOriginIndex) {
                updateOriginDestinationInfo(offerCompatibleOriginIndex);
                updateSelectedSlices(offerCompatibleOriginIndex);
            } else {
                vm.model.selectedSlices.splice(offerCompatibleOriginIndex, offerCompatibleOriginIndex);
            }

            $timeout(() => {
                angular.element('html, body').animate({ scrollTop: angular.element('#originDestination-' + offerCompatibleOriginIndex).offset().top - 30 });
            });
            vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex].showOd = true;
            vm.model.availabilityData.originDestinations[offerCompatibleOriginIndex].showFaresSelected = false;
            vm.model.currentOriginDestinationIndex = offerCompatibleOriginIndex;
            $timeout(() => {
                BookingComponentUtils.equalHeight(angular.element('.ib-table-flight-cabins'), true);
            });
        }

        function updateOriginSlices(selectedSliceIndex) {
            let foundedSlice = false, j = 0;
            while (!foundedSlice && j < vm.model.availabilityData.originDestinations[selectedSliceIndex].slices.length) {
                if (vm.model.selectedSlices[selectedSliceIndex] && vm.model.availabilityData.originDestinations[selectedSliceIndex].slices[j].sliceId === vm.model.selectedSlices[selectedSliceIndex].info.sliceId) {
                    foundedSlice = true;
                }
                j++;
            }
            if ((!vm.model.availabilityData.originDestinations[selectedSliceIndex].slices[vm.model.selectedSlices[selectedSliceIndex].selectedSliceIndex] ||
                (vm.model.availabilityData.originDestinations[selectedSliceIndex].slices[vm.model.selectedSlices[selectedSliceIndex].selectedSliceIndex].sliceId !==
                    vm.model.selectedSlices[selectedSliceIndex].info.sliceId)) && !foundedSlice) {
                vm.model.availabilityData.originDestinations[selectedSliceIndex].slices.splice(vm.model.selectedSlices[selectedSliceIndex].selectedSliceIndex, 0, vm.model.selectedSlices[selectedSliceIndex].info);
            }

        }

        /**
         * Calculates the discount or the points depending on the market and the user's election.
         */
        function checkONBLoginAndCalculatePointsDiscounts() {
            if (CommonsSessionStorageService.get('userLogged') === BookingAppConstants.LOGIN_ONB) {
                CommonsSessionStorageService.remove('noDiscountOBPrice');
                CommonsSessionStorageService.remove('oBPoints');
                CommonsSessionStorageService.remove('showNoDiscountOBPrice');
                CommonsSessionStorageService.remove('priceDifference');

                if (vm.model.availabilityData.originDestinations.length <= vm.model.currentOriginDestinationIndex && CommonsSessionStorageService.get(BkiStorageConstants.SELECTED_OFFER)) {
                    if (!vm.isChecked) {
                        CommonsSessionStorageService.set('pointsChecked', false);
                        if (!CommonsSessionStorageService.get('getMarketOBPoints')) {
                            CommonsSessionStorageService.set('pointsChecked', true);
                            CommonsSessionStorageService.set('discountsAndPoints', true);
                            getOBPoints();
                            getOriginPrice();
                        } else {
                            vm.model.showOBPoints = 'NONE';
                            getOriginPrice();
                        }
                    } else {
                        CommonsSessionStorageService.set('pointsChecked', true);
                        vm.model.showNoDiscountOBPrice = false;
                        if (!$rootScope.isPointsOBFlow) {
                            getOBPoints();
                        }
                    }
                }
            }
        }

        /**
         * Calculates the points the user is gonna get in order to show 'em in the total price.
         */
        function getOBPoints() {
            vm.model.oBPoints = {};
            vm.model.showOBPoints = 'NONE';

            if (CommonsSessionStorageService.get('userLogged') === BookingAppConstants.LOGIN_ONB) {
                vm.model.showOBPoints = 'LOADING';
                BookingAvailabilityService.getOBPoints(vm.model.selectedSlices).then((oBPointsData) => {
                    vm.model.oBPoints = oBPointsData;
                    if ('redemptionPoints' in vm.model.oBPoints && vm.model.oBPoints.redemptionPoints >= 0) {
                        vm.model.showOBPoints = 'SHOW';
                        CommonsSessionStorageService.set('oBPoints', vm.model.oBPoints);
                    }
                });
            }
        }

        function getOriginPrice() {
            let i, originPrice = 0, hasDiscount = false;
            const bookingSelectedOffer = CommonsSessionStorageService.get(BkiStorageConstants.SELECTED_OFFER);
            vm.model.noDiscountOBPrice;
            vm.model.showNoDiscountOBPrice = false;
            CommonsSessionStorageService.set('showNoDiscountOBPrice', vm.model.showNoDiscountOBPrice);

            for (i = 0; i < bookingSelectedOffer.originDestinations.length; i++) {
                if (bookingSelectedOffer.originDestinations[i].totalPriceDiscountData) {
                    originPrice += bookingSelectedOffer.originDestinations[i].totalPriceDiscountData.totalOriginal;
                    hasDiscount = true;
                } else {
                    originPrice += bookingSelectedOffer.originDestinations[i].totalPrice.total;
                }
            }

            vm.model.noDiscountOBPrice = CurrencyService.formatPrice(vm.model.availabilityData.currencies[vm.model.availabilityData.originDestinations[0].currency], parseFloat(originPrice.toFixed(2)), true);
            CommonsSessionStorageService.set('noDiscountOBPrice', vm.model.noDiscountOBPrice);
            CommonsSessionStorageService.set('originalOBPrice', originPrice);

            vm.model.priceDifference = originPrice - vm.model.numericTotalPrice;
            vm.model.formatedPriceDifference = CurrencyService.formatPrice(vm.model.availabilityData.currencies[vm.model.availabilityData.originDestinations[0].currency], parseFloat(vm.model.priceDifference.toFixed(2)), true);
            CommonsSessionStorageService.set('formatedPriceDifference', vm.model.formatedPriceDifference);
            CommonsSessionStorageService.set('priceDifference', vm.model.priceDifference);

            if (hasDiscount) {
                vm.model.showNoDiscountOBPrice = true;
                CommonsSessionStorageService.set('showNoDiscountOBPrice', vm.model.showNoDiscountOBPrice);
            }
        }

        /**
         * Given an Origin Destination index: shows total price, shows incompatibilities modal or show next OD depending on each case.
         * @param {Object} event the event received when the animation ends
         * @param {Integer} originIndex the origin destination index
         */
        function finishSelectSliceAnimation(event, originIndex) {
            vm.model.animationRun = false;
            vm.model.availabilityData.originDestinations[originIndex].showOd = false;
            if (vm.model.availabilityData.originDestinations.length <= vm.model.currentOriginDestinationIndex || $rootScope.isRedemptionFlow) {
                vm.model.showTotalPrice = true;
                checkONBLoginAndCalculatePointsDiscounts();
            } else {
                $timeout(() => {
                    vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].showOd = !(vm.model.availabilityData.multiCity || $rootScope.isRedemptionFlow);
                });
            }
            if (!vm.model.availabilityData.multiCity && !vm.model.selectedSlices[originIndex].selectedSegments && !$rootScope.newFare) {
                if (
                    !vm.model.selectedSlices[originIndex].info.selectedFareFamily.isCompatibleFare &&
                    !vm.model.selectedSlices[originIndex].info.cabins[vm.model.selectedSlices[originIndex].info.selectedCabin].isCabinCompatible
                ) {
                    $timeout(() => {
                        BookingModalService.showGenericModal(true, 'ib-modal-incompatible-fares.html', { idModal: 'ib-modal-incompatible-fares' }).result.then(changeOutbound, changeInbound);
                    });
                }
            }
            if (vm.model.discountsAvailabilityLoading === true && vm.previouslySelectedNum <= vm.model.currentOriginDestinationIndex) {
                $timeout(() => { vm.model.discountsAvailabilityLoading = false; });
            }

        }

        /**
         * Event received when the animation starts
         * @param {Object} event the event received
         * @param {Integer} originIndex the origin destination index
         */
        function startsSelectSliceAnimation(event, originIndex) {
            vm.model.animationRun = true;
            vm.model.availabilityData.originDestinations[originIndex].showFaresSelected = true;
        }

        /**
         * @function setCoupon
         *
         * Save data coupon selected
         *
         * @param {object} event
         * @param {object} coupon
         */
        function setCoupon(event, coupon) {
            let elementSelected = 1;
            if (coupon) {
                vm.commercialData = CommonsSessionStorageService.get('commercialData');
                for (let i = 0; i < coupon.offerList.length; i++) {
                    vm.model.availabilityData.fareRate[i].avios.fare = coupon.offerList[i].discountedPrice.totalPoints.fare;
                    vm.model.availabilityData.fareRate[i].cash.fare = coupon.offerList[i].discountedPrice.totalCash.fare;
                    vm.model.availabilityData.fareRate[i].formatPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), vm.model.availabilityData.fareRate[i].cash.fare + vm.model.availabilityData.totalPrice.tax, true);
                    vm.model.availabilityData.fareRate[i].formatAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, vm.model.availabilityData.fareRate[i].avios.fare);
                    vm.model.availabilityData.fareRate[i].redemptionOptionId = coupon.offerList[i].optionId;
                    // Price without discount
                    vm.model.availabilityData.fareRate[i].aviosWithoutDiscount.fare = coupon.offerList[i].basePrice.totalPoints.fare;
                    vm.model.availabilityData.fareRate[i].cashWithoutDiscount.fare = coupon.offerList[i].basePrice.totalCash.fare;
                    vm.model.availabilityData.fareRate[i].formatOldPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), vm.model.availabilityData.fareRate[i].cashWithoutDiscount.fare + vm.model.availabilityData.totalPrice.tax, true);
                    vm.model.availabilityData.fareRate[i].formatOldAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, vm.model.availabilityData.fareRate[i].aviosWithoutDiscount.fare);
                    if (document.getElementById('avios&money-' + i).checked) {
                        vm.model.availabilityData.fareRate[i].selected = true;
                        document.getElementById('avios&money-' + i).checked = true;
                        elementSelected = i + 1;
                    }
                }
                vm.model.availabilityData.totalPrice.couponApplied = true;
                vm.coupon = coupon;
            } else {
                vm.coupon = null;
            }

            dataBreakdownPassengers(null, elementSelected);
        }

        function refreshFares() {
            vm.model.showLoadingFares = true;
            selectFareRedemptionAvailability();
        }



        /**
         * genrate a new availability fligh of metasearch
         * @param {Object} event the event received
         * @param {object} requestData availability data
         */
        function searchAvailabilityNew(event) {
            const requestData = angular.copy(CommonsSessionStorageService.get('availabilityRequestData')), discounts = CommonsSessionStorageService.get('specialDiscounts') || null, passengers = CommonsSessionStorageService.get('addPassengers') || null, originInfo = CommonsSessionStorageService.get('originDestination') || null;
            CommonsSessionStorageService.remove('headerModel');
            if ((passengers || discounts) && vm.model.availabilityData.searchNewAvailability) {
                requestData.passengers = passengers ? passengers : requestData.passengers;
                requestData.specialDiscounts = discounts;
                CommonsSessionStorageService.set('availabilityRequestData', requestData);
                vm.model.availabilityData.loading = true;
                if (passengers) {
                    const newPassengers = DatalayerUtilsService.getPassengersMetasearch(passengers);
                    originInfo.passengers = newPassengers.numberPassengers;
                    originInfo.numberPassengrsWithoutInfant = newPassengers.numberPassengrsWithoutInfant;
                    originInfo.numChilds = newPassengers.numChilds;
                    originInfo.numInfant = newPassengers.numInfant;
                    originInfo.numAdults = newPassengers.numAdults;
                    originInfo.numYoung = newPassengers.numYoung;
                    originInfo.numSeniors = newPassengers.numSeniors;
                    originInfo.numTeenager = newPassengers.numTeenager;
                    CommonsSessionStorageService.set('originDestination', originInfo);
                }
                $scope.$broadcast('updateInfoPassengers');
                BookingAvailabilityService.getBookingAvailability().then((data) => {

                    vm.model.selectedSlices = [];
                    vm.model.availabilityData.metaSearchInfo = false;
                    vm.model.currentOriginDestinationIndex = 0;
                    getBookingAvailability(data);
                }, (error) => {
                    showServiceError(error);
                });
            } else {
                if (CommonsSessionStorageService.get('openJaw') && CommonsSessionStorageService.get('searchFlightType') === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH) {
                    CommonsSessionStorageService.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP);
                    CommonsSessionStorageService.set('multiCitySearch', true);
                } else {
                    CommonsSessionStorageService.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
                }
                if ($rootScope.isRedemptionFlow) {
                    CommonsSessionStorageService.set('searchFlightType', 'availabilityFlight');
                    $rootScope.isRedemptionFlow = false;
                    $rootScope.isPointsOBFlow = false;
                } else {
                    const newrequestData = BookingUtilService.getNewAvailabilityRequest(requestData);
                    CommonsSessionStorageService.set('originDestination', BookingUtilService.getOriginDestination(newrequestData.slices, newrequestData.passengers));
                    CommonsSessionStorageService.set('newAvailabilitySearch', newrequestData);
                    CommonsSessionStorageService.set('availabilityRequestData', newrequestData);
                }
                BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                BookingAvailabilityService.getBookingAvailability().then((data) => {
                    vm.model.selectedSlices = [];
                    vm.model.availabilityData.metaSearchInfo = false;
                    vm.model.currentOriginDestinationIndex = 0;
                    getBookingAvailability(data);
                }, (error) => {
                    showServiceError(error);
                });
            }

        }

        /**
        * get info for next slice in multi city flow
        * * @param {Boolean} checkSlides -
        */
        function getNextTrip(checkSlides) {
            const resultSlices = {};//////
            if (vm.model.currentOriginDestinationIndex === vm.model.availabilityData.originDestinations.length) {
                vm.model.availabilityData.loading = true;
                CommonsSessionStorageService.set('requestFareInfo', BookingAvailabilityTransformer.createGetFareRequest(vm.model));
                BookingAvailabilityService.selectAvailability(vm.model).then((data) => {
                    vm.model.availabilityData.totalPrice =
                        CurrencyService.formatPrice(vm.model.availabilityData.currencies[data.contextMetadata.currencies[0].code],
                            data.offers[0].price.total, true);
                    vm.model.availabilityData.loading = false;
                    DatalayerBKIService.getLengthStayMultipleTrip(data.offers[0].slices);
                }, (error) => {
                    CommonsSessionStorageService.set('availabilityErrror', error);
                    $location.path('/ibbkerror');
                });

            } else {
                BookingAvailabilityService.getNextInfoSlice(vm.model.availabilityData.responseIdArray[vm.model.currentOriginDestinationIndex - 1], vm.model.selectedSlices[vm.model.currentOriginDestinationIndex - 1].info.selectedFareFamily.offers[0].offerId).then((data) => {
                    allAvailableOffers = allAvailableOffers ? allAvailableOffers : [];
                    fareFamilyConditions = fareFamilyConditions ? fareFamilyConditions : [];
                    allAvailableOffers[vm.model.currentOriginDestinationIndex] = data.offers;
                    fareFamilyConditions[vm.model.currentOriginDestinationIndex] = data.fareFamilyConditions;
                    vm.model.availabilityData.responseIdArray[vm.model.currentOriginDestinationIndex] = data.responseId;
                    vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex] = data.originDestinations[vm.model.currentOriginDestinationIndex];
                    vm.model.availabilityData.originDestinations[vm.model.currentOriginDestinationIndex].showOd = true;
                    completeNextOriginDestinationInfo(vm.model.selectedSlices[vm.model.currentOriginDestinationIndex - 1].info.selectedFareFamily, false, vm.model.currentOriginDestinationIndex - 1, false, checkSlides);
                }, (error) => {
                    CommonsSessionStorageService.set('availabilityErrror', error);
                    $location.path('/ibbkerror');
                });
            }
        }

        function searchAvailabilityOption() {
            const requestData = CommonsSessionStorageService.get('newAvailabilityRequestData') ? angular.copy(CommonsSessionStorageService.get('newAvailabilityRequestData')) : angular.copy(CommonsSessionStorageService.get('availabilityRequestData'));
            vm.loadingOption = true;
            const newrequestData = BookingUtilService.getNewAvailabilityRequest(requestData);
            CommonsSessionStorageService.set('availabilityRequestData', newrequestData);
            BookingAvailabilityService.getBookingAvailability().then((data) => {
                getBookingAvailability(data);
            }, (error) => {
                showServiceError(error);
            });
        }
        function newSearch(event, state) {
            vm.model.availabilityData.searchNewAvailability = state;
            vm.model.availabilityData.changePassengers = state;
        }


        function showPopoverStopover(stopOverCities, stopsNumber) {
            let i, cities = '';
            if (stopOverCities && angular.isNumber(stopsNumber)) {
                for (i = 0; i < stopOverCities.length; i++) {
                    if (stopsNumber > 1) {
                        if (i === stopsNumber - 1) {
                            cities += stopOverCities[i].description.toUpperCase();
                        } else {
                            cities += stopOverCities[i].description.toUpperCase() + ', ';
                        }
                    } else {
                        cities += stopOverCities[i].description.toUpperCase();
                    }
                }
                return cities;
            }
        }
        function updateEcommerce() {
            DatalayerBKIService.getDigitalDataEcommerce(vm.model.selectedSlices, 'add_to_cart');
        }
        /**
         * Show/Hide Banner Ancillaries Offers
         */
        function showAncOffers(event, data) {
            const selectedTripInfoLength = vm.model.selectedSlices.length ?? 0;
            const selectedTripInfo = vm.model.selectedSlices ?? '';
            if ((data.commercialNameES === 'Óptima' || data.commercialNameES === 'Básica') && vm.outboundHasFlexAvailable) {
                vm.showAncOffers.show = true;
                if (selectedTripInfo !== '') {
                    if (!isCompatibleOperatedByFlex()) {
                        vm.showAncOffers.show = false;
                    }
                }
            } else if (selectedTripInfoLength >= 1 && (data.commercialNameES === 'Óptima' || data.commercialNameES === 'Básica') && vm.outboundHasFlexAvailable) {
                if (selectedTripInfo[0].info.selectedFareFamily.commercialNameES === 'Óptima' || selectedTripInfo[0].info.selectedFareFamily.commercialNameES === 'Básica') {
                    vm.showAncOffers.show = true;
                    if (!isCompatibleOperatedByFlex()) {
                        vm.showAncOffers.show = false;
                    }
                }
                if (selectedTripInfo[0].info.selectedFareFamily.commercialNameES !== 'Óptima' && selectedTripInfo[0].info.selectedFareFamily.commercialNameES !== 'Básica') {
                    vm.showAncOffers.show = false;
                }
            } else {
                vm.showAncOffers.show = false;
            }
            $rootScope.$broadcast('isFareSelectedAncOffers', false);
        }
        /**
         * Show/Hide Banner Upselling Flexibilitys
         * @param {Object} event the event thrown
         * @param {Object} data the selected fare family, event data
         * @param {Integer} selectedSliceIndex the index of selected fare family slice in selectedSlice array, same as its origin destination index
         */
        function showBannerFlexibility() {
            let codeDeparture = '', codeReturn = '', changeToShowSecond = false, changeToNotShow = false;
            vm.model.showBannerFlexibility = {
                showFirst: false,
                showSecond: false,
                showThird: false,
                showGlobal: false,
                show: false
            };

            angular.forEach(vm.model.selectedSlices, (slice, index) => {
                if (slice.info.selectedFareFamily && slice.info.selectedFareFamily.commercialNameES) {
                    if (index === 0) {
                        codeDeparture = slice.info.selectedFareFamily.commercialNameES;
                    } else if (index === 1) {
                        codeReturn = slice.info.selectedFareFamily.commercialNameES;
                    }
                }
            });

            if (vm.model.selectedSlices) {
                switch (vm.model.selectedSlices.length) {
                    case 1:
                        if (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) {
                            vm.model.showBannerFlexibility.show = true;
                            vm.model.showBannerFlexibility.showFirst = true;
                        } else if (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) {
                            vm.model.showBannerFlexibility.show = true;
                            vm.model.showBannerFlexibility.showSecond = true;
                        } else if (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) {
                            vm.model.showBannerFlexibility.show = true;
                            vm.model.showBannerFlexibility.showThird = true;
                        }
                        break;
                    case 2:
                        //showFirst
                        if (
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL)) ||
                            (((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL)) || (((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL)))) ||
                            ((((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL)) ||
                            ((((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP)) ||
                            ((((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP)))
                        ) {
                            vm.model.showBannerFlexibility.show = true;
                            vm.model.showBannerFlexibility.showFirst = true;
                            //showSecond
                        } else if (
                            (((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT)) ||
                            (((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX)) ||
                            (((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || ((codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURBASLEVEL) && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF) || (codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF && codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF))) {
                            vm.model.showBannerFlexibility.show = true;
                            vm.model.showBannerFlexibility.showSecond = true;
                            //showThird
                        } else if (
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMY && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.OPTIMAL && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESOP && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO && codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO))
                        ) {
                            vm.model.showBannerFlexibility.show = true;
                            vm.model.showBannerFlexibility.showThird = true;
                        } else if (
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMFLEX || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMFLEX) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMFLEX || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMFLEX)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.CONFORT || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.TURPREMOPTFLEX || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.ECONOMYPREMPROMO)) ||
                            ((codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO) || (codeDeparture === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESCONF || codeReturn === BookingAppConstants.FLEXIBILITY_COMMERCIAL_CODE.BUSINESSPROMO))
                        ) {
                            vm.model.showBannerFlexibility.show = false;
                        }
                        break;
                }
            }
            let firstFlight = null;
            let CurrentDate = null;
            let daysUntilDeparture = null;
            let firstFlightDate = null;
            let correctCarrier = true;
            angular.forEach(vm.model.selectedSlices, (slice, index) => {

                if (firstFlight === null) {
                    firstFlight = slice;
                } else {
                    if (firstFlight.info.departureDateParsed.formatedDate > slice.info.departureDateParsed.formatedDate) {
                        firstFlight = slice;
                    }
                }

                angular.forEach(slice.info.segments, (segment, index) => {
                    if (segment.flight.operationalCarrier.code !== 'IB' && segment.flight.operationalCarrier.code !== 'YW' && segment.flight.operationalCarrier.code !== 'I2' && segment.flight.operationalCarrier.code !== 'I0' && segment.flight.operationalCarrier.code !== '0I' && segment.flight.operationalCarrier.code !== 'LV') {
                        correctCarrier = false;
                    }
                });
            });
            for (let i = 0; i < vm.model.selectedSlices.length; i++) {
                const length = vm.model.selectedSlices[i].info.selectedFareFamily !== null && vm.model.selectedSlices[i].info.selectedFareFamily !== false ? vm.model.selectedSlices[i].info.selectedFareFamily.conditions.length : 0;
                for (let j = 0; j < length; j++) {
                    if (vm.model.selectedSlices[i].info.selectedFareFamily.conditions[j].code === BookingAvailabilityConstants.FARE_FAMILY_ICON_PROPERTY_CODE.CODECAMBIO) {
                        if ((vm.model.selectedSlices[i].info.selectedFareFamily.conditions[j].extendedInfo.code === BookingAvailabilityConstants.FARE_FAMILY_ICON_PROPERTY_CODE.CODENOCAMBIO)) {
                            if (vm.model.showBannerFlexibility.showFirst) {
                                changeToShowSecond = true;
                            } else if (vm.model.showBannerFlexibility.showThird) {
                                changeToNotShow = true;
                            }
                        }
                    }
                }
            }
            if (changeToShowSecond && !changeToNotShow) {
                vm.model.showBannerFlexibility.showFirst = false;
                vm.model.showBannerFlexibility.showSecond = true;
            } else if ((changeToShowSecond && changeToNotShow) || (!changeToShowSecond && changeToNotShow)) {
                vm.model.showBannerFlexibility.show = false;
            }
            if (firstFlight) {
                CurrentDate = new Date();
                firstFlightDate = new Date(firstFlight.info.departureDateParsed.formatedDate);
                const resta = firstFlightDate.getTime() - CurrentDate.getTime();
                daysUntilDeparture = Math.round(resta / (1000 * 60 * 60 * 24));
            }

            if (daysUntilDeparture < 25 || !correctCarrier) {
                vm.model.showBannerFlexibility.show = false;
            }


        }

        /**
         * Save data breakdown passengers on localStorage
         * @param {Number} redemptionOptionId
         */
        function dataBreakdownPassengers(event, selectedOptionId) {
            const fareData = CommonsSessionStorageService.get('fareData');
            const breakdownPassengers = {};
            let selectedOptions = [], selectedRedeption = [], cuponSelected = {};
            const index = (selectedOptionId === 0) ? selectedOptionId : selectedOptionId - 1;

            // save data selected option by redemptionOptions or promotion
            if (fareData) {
                if (fareData.offers[0].redemptionOptions) {
                    selectedOptions = fareData.offers[0].redemptionOptions;
                } else if (fareData.offers[0].promotion && fareData.offers[0].promotion.discountedRedemptionOptions) {
                    selectedOptions = fareData.offers[0].promotion.discountedRedemptionOptions;
                }

                // if exist coupon, save selection options prices
                if (vm.coupon) {
                    selectedOptions = vm.coupon.offerList;
                    cuponSelected = selectedOptions[index % selectedOptions.length];

                    vm.model.availabilityData.totalPrice.price.totalCash = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(vm.commercialData.currency), cuponSelected.discountedPrice.totalCash.fare + fareData.offers[0].price.tax, true);
                    vm.model.availabilityData.totalPrice.price.totalAvios = CurrencyService.formatAvios(vm.commercialData.currency.groupingSeparator, cuponSelected.discountedPrice.totalPoints.fare);
                }

                selectedRedeption = selectedOptions[index % selectedOptions.length];
                breakdownPassengers.selectedRedeption = selectedRedeption;
                CommonsSessionStorageService.set('breakdownPassengers', breakdownPassengers);
            }
        }
        function showLocalDiscountModule() {
            const urlParams = CommonsSessionStorageService.get('bookingUrlParams');
            const chosenResident = urlParams.resident || '';
            const chosenFamily = urlParams.largeFamilyType || '';
            if (BookingAppConstants.market === 'ES' && angular.isObject(vm.model.availabilityData)
                && vm.model.availabilityData.metaSearchInfo === false && vm.model.availabilityData.multiCity === false && vm.model.availabilityData.redemption === false
                && angular.isArray(vm.model.availabilityData.originDestinations)
                && vm.model.availabilityData.originDestinations.length > 0 && vm.model.availabilityData.originDestinations.length <= 2
                && angular.isObject(vm.model.availabilityData.originDestinations[0].originCity) && angular.isObject(vm.model.availabilityData.originDestinations[0].destinationCity)
                && vm.model.availabilityData.originDestinations[0].originCity.countryCode === 'ES' && vm.model.availabilityData.originDestinations[0].destinationCity.countryCode === 'ES') {
                vm.localdiscountModel.origin = vm.model.availabilityData.originDestinations[0].originCity.code || '';
                vm.localdiscountModel.destination = vm.model.availabilityData.originDestinations[0].destinationCity.code || '';
                vm.localdiscountModel.display = BookingLocalDiscountsService.isResidentAvailable(vm.localdiscountModel.origin, vm.localdiscountModel.destination);
                vm.localdiscountModel.selectedResident = chosenResident;
                vm.localdiscountModel.selectedFamily = chosenFamily;
            }
        }

        function toggleUpselling(event, data) {
            vm.showUpselling = data;
        }

        function changeOffersTotal(event, titleText) {
            vm.ancOffersTotal = titleText;
        }

        function setSelectedSliceInfo(event, data, model) {
            for (let i = 0; i < model.length; i++) {
                model[i].info.selectedFareFamily = data[i];
                vm.model.selectedSlices[model[i].indexArray] = model[i];
                completeNextOriginDestinationInfo(data[i], false, model[i].indexArray, false, true);
            }
            $rootScope.$emit('changeUpsellingFare', vm.model.selectedSlices);
        }

        function setPageTitle() {
            const isMulticity = CommonsSessionStorageService.get('searchFlightType') === 'multiCityFlight';
            const isHMAD = CommonsSessionStorageService.get('isHMAD');
            let title = '';
            if (isMulticity && !isHMAD) title = 'BKI_MULTI_TITLE_PAGE_AVAILABILITY';
            else if (isHMAD) title = 'BKI_HMAD_TITLE_PAGE_AVAILABILITY';
            title && BookingPageUtilsService.setPageTitle(title);
        }

        function renderMetasearchComponentByFlightType () {
            const searchFlightType = CommonsSessionStorageService.get('searchFlightType');
            const exclusionList = ['metasearchFlight'];
            return !exclusionList.includes(searchFlightType);
        }

        function selectNewFlightFromMetasearch () {
            IbBookingMetasearchUtilsService.redirectFlightSelection($scope);
        }

    }
})();
