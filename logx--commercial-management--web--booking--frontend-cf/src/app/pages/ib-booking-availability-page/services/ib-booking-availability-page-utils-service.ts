import { isObject, isDefined, element, isArray } from 'angular';
import { BookingAvailabilityService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { PmtRedirectionInfo } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';



@Service('ib-booking-availability-module',
    ['$rootScope', 'BookingAvailabilityConstants', 'BookingAvailabilityService', '$timeout', 'BookingModalService', '$window', 'BookingRedirectionService', 'CommonsSessionStorageService', 'BookingUtilService', 'BookingAppConstants', 'NewMainHeaderFacade', 'BookingComponentUtils', 'DigitalDataService'])
export class IbBookingAvailabilityPageUtilsService {
    constructor (
        private $rootScope: CommonsRootScope,
        private BookingAvailabilityConstants: any,
        private BookingAvailabilityService: BookingAvailabilityService,
        private $timeout: ng.ITimeoutService,
        private BookingModalService,
        private $window: ng.IWindowService,
        private BookingRedirectionService: BookingRedirectionService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingUtilService: any,
        private BookingAppConstants: BookingAppConstants,
        private NewMainHeaderFacade: any,
        private BookingComponentUtils: any,
        private DigitalDataService: DigitalDataService
    ) {
    }

    /**
     * Checks if all slice segments has been selected: Selected segments array can have same length as all segments array, but some elements might be empty
     * @param {object} selectedSlice Array of segments
     */
    areAllSegmentsSelected (segments) {
        let foundedSegments = true, i = 0;
        if (segments) {
            while (foundedSegments && i < segments.length) {
                foundedSegments = isObject(segments[i]);
                i++;
            }
        }
        return foundedSegments;
    }

    /**
    * Given a selected slice, set if it has incompatibilities with previously selected slices
    * @param {object} currentSelectedSlice
    * @returns {object} currentSelectedSlice is incompatible or compatible
    */
    checkSliceCompatibility (currentSelectedSlice, selectedSlices) {
        let i = 0, j = 0, k = 0, l = 0, foundedIncompatible = false, directOrIndirect;
        while (!foundedIncompatible && i < selectedSlices.length) {
            if (selectedSlices[i].originDestinationId !== currentSelectedSlice.originDestinationId) {
                j = 0;
                while (!foundedIncompatible && (j < (selectedSlices[i].selectedSegments ? selectedSlices[i].selectedSegments.length : 1))) {
                    if (selectedSlices[i].selectedSegments) {
                        directOrIndirect = selectedSlices[i].selectedSegments[j];
                    } else {
                        directOrIndirect = selectedSlices[i];
                    }
                    if (directOrIndirect && directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins) {
                        k = 0;
                        while (!foundedIncompatible && k < directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins.length) {
                            if (directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins[k].originDestinationId === currentSelectedSlice.originDestinationId &&
                                directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins[k].segmentId === currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment ? currentSelectedSlice.selectedSegment.selectedSegmentIndex : 0].segmentId &&
                                directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins[k].sliceId === currentSelectedSlice.info.sliceId) {
                                l = 0;
                                if (currentSelectedSlice.selectedSegment) {
                                    while (!foundedIncompatible && l < currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].selectedFareFamily.offers.length) {
                                        if (directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins[k].offerId === currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].offers[l].offerId) {
                                            currentSelectedSlice.info.segments[currentSelectedSlice.selectedSegment.selectedSegmentIndex].cabins[currentSelectedSlice.selectedSegment.cabin].isCabinCompatible = false;
                                            foundedIncompatible = true;
                                        }
                                        l++;
                                    }
                                } else {
                                    while (!foundedIncompatible && l < currentSelectedSlice.info.selectedFareFamily.offers.length) {
                                        if (directOrIndirect.info.cabins[directOrIndirect.cabin].notAvailableCabins[k].offerId === currentSelectedSlice.info.segments[currentSelectedSlice.info.sliceSelectedSegments].offers[l].offerId) {
                                            currentSelectedSlice.info.segments[currentSelectedSlice.info.sliceSelectedSegments].cabins[currentSelectedSlice.info.selectedCabin].isCabinCompatible = false;
                                            foundedIncompatible = true;
                                        }
                                        l++;
                                    }
                                }
                            }
                            k++;
                        }
                    }
                    j++;
                }
            }
            i++;
        }
        return !foundedIncompatible;
    }

    checkSegmentCompatibility (currentSelectedSegment, selectedSliceIndex, selectedSlices) {
        let i = 0, j, k, foundedIncompatible = false;
        while (!foundedIncompatible && i < selectedSlices[selectedSliceIndex].selectedSegments.length) {
            if (isDefined(selectedSlices[selectedSliceIndex].selectedSegments[i])
                && selectedSlices[selectedSliceIndex].selectedSegments[i].info.cabins[selectedSlices[selectedSliceIndex].selectedSegments[i].cabin].notAvailableCabins) {
                j = 0;
                while (!foundedIncompatible
                    && j < selectedSlices[selectedSliceIndex].selectedSegments[i].info.cabins[selectedSlices[selectedSliceIndex].selectedSegments[i].cabin].notAvailableCabins.length) {
                    k = 0;
                    while (!foundedIncompatible && k < currentSelectedSegment.info.selectedFareFamily.offers.length) {
                        if (selectedSlices[selectedSliceIndex].selectedSegments[i].info.cabins[selectedSlices[selectedSliceIndex].selectedSegments[i].cabin].notAvailableCabins[j].offerId === currentSelectedSegment.info.selectedFareFamily.offers[k].offerId) {
                            foundedIncompatible = true;
                        }
                        k++;
                    }
                    j++;
                }
            }
            i++;
        }
        return foundedIncompatible;
    }

    getSelectedFareFamily (oldSelectedFareFamily, selectedCabin, newSliceInfo) {
        let fIndex = 0, fFound = false, foundedFare = {};
        const fareFamilies = newSliceInfo.cabins[selectedCabin].fareFamilies;
        while (!fFound && fIndex < fareFamilies.length) {
            if (fareFamilies[fIndex].commercialCode === oldSelectedFareFamily.commercialCode) {
                fFound = true;
                foundedFare = fareFamilies[fIndex];
            }
            fIndex++;
        }
        return foundedFare;
    }

    /**
     * Checks if there are calendar slides shown that are loading and if so calls the service and updates it
     * @param {Object} currentOrigin the curent origin destination state
     * @param {Object} isNext the current selected slide is less than next selected slide
     */
    checkLoadingCalendarSlides (currentOrigin, isNext, forceCall, isLoading, currentOriginDestinationIndex) {

        const finishSlickLoading = (calendarData) => {
            currentOrigin.calendarSlides = calendarData;
            isLoading = false;
            this.$rootScope.$broadcast('finishLoadingSlides');
        };

        const isLoadingSlide = (originDestination) => {
            let initialIndex = Math.max(0, originDestination.calendarSlides.currentInitialSlide - this.BookingAvailabilityConstants.DAYS_BEFORE);
            const lastIndex = Math.min(originDestination.calendarSlides.slides.length - 1, originDestination.calendarSlides.currentInitialSlide + this.BookingAvailabilityConstants.DAYS_AFTER);
            let found = false;
            while (!found && initialIndex <= lastIndex) {
                found = originDestination.calendarSlides.slides[initialIndex].state === this.BookingAvailabilityConstants.SLICK_STATUS.LOADING;
                initialIndex++;
            }
            return found;
        };
        if ((forceCall || !isLoading) && currentOrigin.calendarSlides && isLoadingSlide(currentOrigin)) {
            isLoading = true;
            this.BookingAvailabilityService.getCalendarRibbon(currentOrigin.calendarSlides, isNext, currentOriginDestinationIndex).then(finishSlickLoading, () => {});
        } else {
            this.$rootScope.$broadcast('finishLoadingSlides');
        }
    }

    scrollToOdStart (currentOriginDestinationIndex, selectedSlices) {
        this.$timeout(() => {
            const originDestination = element('#originDestination-' + currentOriginDestinationIndex);
            const selectedSlice = element('#selectedSlice-' + (selectedSlices.length - 1));
            if (originDestination.offset()) {
                element('html, body').animate({ scrollTop: originDestination.offset().top - 30 });
            } else if (selectedSlice.offset()) {
                element('html, body').animate({ scrollTop: selectedSlice.offset().top - 30 });
            }
        });
    }

    areAllSlicesSelected (model) {
        let areAllSlicesSelected = true, i = 0;
        if (model.currentOriginDestinationIndex) {
            while (areAllSlicesSelected && i < model.availabilityData.originDestinations.length) {
                areAllSlicesSelected = isObject(model.selectedSlices[i]);
                i++;
            }
        } else {
            areAllSlicesSelected = false;
        }
        return areAllSlicesSelected;
    }

    isReadyToCallRedemptionFare (model) {
        let allSelected = this.areAllSlicesSelected(model), i = 0;
        while (allSelected && i < model.selectedSlices.length) {
            allSelected = model.selectedSlices[i].info.segments.length > 1 ? model.selectedSlices[i].selectedSegments.length === model.selectedSlices[i].info.segments.length && !model.selectedSlices[i].selectedSegments.includes(undefined) : true;
            ++i;
        }
        return allSelected;
    }

    onLogin () {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
    }

    onError () {
        this.BookingModalService.finishWaiting();
    }

    redirectToLogin () {
        const url = this.$window.location.origin + this.$window.location.pathname + this.$window.location.search;
        this.BookingRedirectionService.redirectToLoginPage(url);
    }
    isSameFlight (element, reference) {
        let match = true;
        let index = 0;
        try {
            if (isDefined(reference.info) && isArray(element.segments) && isArray(reference.info.segments) && reference.info.segments.length === element.segments.length) {
                while (match && index < element.segments.length) {
                    if (reference.info.segments[index].flight.marketingCarrier.code !== element.segments[index].flight.marketingCarrier.code
                        || reference.info.segments[index].flight.marketingFlightNumber !== element.segments[index].flight.marketingFlightNumber) {
                        match = false;
                    }
                    ++index;
                }
                return match;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     *
     * @param {String} currentOriginIndex
     * @param {Date} newHeaderDate
     */
    updateHeaderDates (currentOriginIndex, newHeaderDate) {
        const originDestination:AvailabilityModels.OriginDestinationSearchModel = this.CommonsSessionStorageService.get('originDestination');
        const formattedDate = new Date(newHeaderDate);
        formattedDate.setHours(0, 0, 0, 0);
        if (currentOriginIndex === this.BookingAvailabilityConstants.CARROUSEL_FLIGHT_SELECTED.OUTBOUND_FLIGHT) {
            originDestination.dates.outboundFlight = newHeaderDate;
            originDestination.dates.formatedOutboundFlight = formattedDate.toISOString();
        }
        if (currentOriginIndex === this.BookingAvailabilityConstants.CARROUSEL_FLIGHT_SELECTED.RETURN_FLIGHT) {
            originDestination.dates.returnFlight = newHeaderDate;
            originDestination.dates.formatedReturnFlight = formattedDate.toISOString();
        }
        this.CommonsSessionStorageService.set('originDestination', originDestination);
        //this.$rootScope.$broadcast('updateDatesHeader');
    }

    generateOldOriginDestinationInfo (currentOriginDestinationIndex, availabilityData) {
        const oldInfo = { selectedFilters: [], filterOptions: [] };
        for (let oIndex = 0; oIndex <= currentOriginDestinationIndex; oIndex++) {
            oldInfo.selectedFilters.push(availabilityData.originDestinations[oIndex].selectedFilters);
            oldInfo.filterOptions.push(availabilityData.originDestinations[oIndex].filterOptions);
        }
        return oldInfo;
    }

    initializeLang = ():string => {
        let lang = this.$rootScope.appLang;
        if (!(lang !== null && lang.length > 0)) {
            lang = this.BookingAppConstants.lang;
        } else {
            lang = lang.toLowerCase();
        }
        return lang;
    };

    initializeMarket = ():string => {
        const isRedemptionFlow = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY) === 'true';
        let market = this.$rootScope.appMarket;
        if (!(market !== null && market.length > 0)) {
            market = this.BookingAppConstants.market;
        } else {
            market = market.toUpperCase();
        }
        isRedemptionFlow ? market = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET_FROM) ?? market: '';
        return market;
    };

    setIsPointsOBFlow = (redirectStatus:boolean):void => {
        const isPointsOBFlow = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY);
        if (isPointsOBFlow) {
            this.$rootScope.isPointsOBFlow = true;
        } else {
            if (((this.CommonsSessionStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION) && (this.CommonsSessionStorageService.get('userLogged') === this.BookingAppConstants.LOGIN_ONB) && redirectStatus)) {
                this.$rootScope.isPointsOBFlow = true;
            } else {
                this.$rootScope.isPointsOBFlow = false;
            }
        }
    };

    setIsRedemptionFlow = (redirectStatus:boolean):void => {
        const isRedemptionFlow = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY);
        if (isRedemptionFlow) {
            this.$rootScope.isRedemptionFlow = true;
        } else {
            if (this.CommonsSessionStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION && redirectStatus) {
                this.$rootScope.isRedemptionFlow = true;
            } else {
                this.$rootScope.isRedemptionFlow = this.$rootScope.isPointsOBFlow;
            }
        }
    };

    initLocalStorage = () => {
        this.CommonsSessionStorageService.set('loadingNextFlow', 1);
        if (this.CommonsSessionStorageService.get('redirectionPaymentCallback') && this.CommonsSessionStorageService.get('flowApp') === 'BBKIOH') {
            this.CommonsSessionStorageService.set('flowApp', 'BBKIOH');
        } else {
            this.CommonsSessionStorageService.set('flowApp', 'BBKI');
        }
        this.CommonsSessionStorageService.set('isShuttleFlow', false);
        this.CommonsSessionStorageService.set('isRedemptionShuttleFlow', false);
        if (this.$rootScope.isRedemptionFlow) {
            this.isRedemptionShuttleFlow();
        }
    };

    isRedemptionShuttleFlow = () => {
        const { arrival, destination, quadrigam } = this.getRouteParams();

        const isShuttleRoute = (arrival === 'MAD' && destination === 'BCN') ||
                         (arrival === 'BCN' && destination === 'MAD');
        const isRedemptionFlow = quadrigam === 'PAHMPA';

        if (isShuttleRoute && isRedemptionFlow) {
            this.CommonsSessionStorageService.set('isRedemptionShuttleFlow', true);
        } 
    };

    getRouteParams = () => {
        return {
            arrival: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY),
            destination: this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY),
            quadrigam: this.BookingUtilService.getURLFirstParameterByName('quadrigam')
        };
    };

    setPaymentStatusValue = (componentType, paymentStatus):boolean => {
        let paymentStatusValue = false;
        if (paymentStatus === 'OK') {
            paymentStatusValue = true;
        } else if (paymentStatus === 'KO') {
            paymentStatusValue = false;
        } else if (componentType) {
            paymentStatusValue = componentType;
        }
        return paymentStatusValue;
    };

    resetShowBasketDiscounts = (showBasket) =>{
        showBasket.headerModel.shoppingBasket.discountsModel.discounts = {};
        showBasket.headerModel.shoppingBasket.discountsModel.total = 0;
        showBasket.headerModel.shoppingBasket.discountsModel.hasDiscounts = false;
        this.NewMainHeaderFacade.updateHeaderModel(showBasket);
    };

    getPaymentRedirectionInfo = () : AvailabilityModels.PaymentRedirectionInfo => {
        const paymentStatus:string = this.BookingUtilService.getURLFirstParameterByName('paymentStatus');
        const componentType:boolean = this.BookingUtilService.getURLFirstParameterByName('componentType');
        const redirectionPaymentCallback = this.CommonsSessionStorageService.get('redirectionPaymentCallback') as AvailabilityModels.RedirectionPaymentCallbackType;
        const redirectStatus: boolean = (paymentStatus === 'OK' || paymentStatus === 'KO' || componentType);
        const paypalToken: string = this.BookingUtilService.getURLFirstParameterByName('token');
        const paypalPayerId: string = this.BookingUtilService.getURLFirstParameterByName('PayerID');
        const paySucces:boolean = this.CommonsSessionStorageService.get('paySucces') || null;
        this.setIsPointsOBFlow(redirectStatus);
        this.setIsRedemptionFlow(redirectStatus);

        return {
            paymentStatus,
            componentType,
            redirectionPaymentCallback,
            redirectStatus,
            paypalToken,
            paypalPayerId,
            paySucces
        };
    };

    checkOldPaymentRedirect = (paymentRedirectionInfo: AvailabilityModels.PaymentRedirectionInfo): boolean => {
        let performedRedirection = false;
        if (paymentRedirectionInfo?.redirectionPaymentCallback?.status && paymentRedirectionInfo.redirectStatus) {
            const confirmationDatalayerInfoCallback = this.CommonsSessionStorageService.get('confirmationDatalayerCallBack');
            const confirmationDigitalDataCallback =  this.CommonsSessionStorageService.get('confirmationDigitalDataCallBack');
            const redirectionPaymentCallback = paymentRedirectionInfo.redirectionPaymentCallback;
            const paymentStatusValue = this.setPaymentStatusValue(paymentRedirectionInfo.componentType, paymentRedirectionInfo.paymentStatus);
            Object.assign(redirectionPaymentCallback, { redirectStatus: paymentRedirectionInfo.redirectStatus, paymentStatus: paymentStatusValue, paypalToken: paymentRedirectionInfo.paypalToken, paypalPayerId: paymentRedirectionInfo.paypalPayerId });
            this.CommonsSessionStorageService.set('redirectionPaymentCallback', redirectionPaymentCallback);
            this.DigitalDataService.addDigitalDataInfo(confirmationDigitalDataCallback);
            this.CommonsSessionStorageService.remove('confirmationDigitalDataCallBack');
            this.CommonsSessionStorageService.remove('confirmationDatalayerCallBack');

            if (paymentRedirectionInfo.paySucces) {
                this.$window.location.href = this.$window.location.origin;
            } else {
                this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                setTimeout(()=> {
                    this.BookingRedirectionService.path( '/ibpurc' );
                });
            }

            performedRedirection = true;
        }
        return performedRedirection;
    };

    checkPaymentRedirect = ()=> {
        const confirmationDigitalDataCallback = this.CommonsSessionStorageService.get( BkiStorageConstants.CONFIRM_DIGITALDATA_CALLBACK );
        const pmtRedirectionContextID = this.CommonsSessionStorageService.get<PmtRedirectionInfo>( BkiStorageConstants.PMT_REDIRECTION_CONTEXT );
        this.DigitalDataService.addDigitalDataInfo( confirmationDigitalDataCallback );
        this.CommonsSessionStorageService.remove( BkiStorageConstants.CONFIRM_DATALAYER_CALLBACK );
        this.CommonsSessionStorageService.remove( BkiStorageConstants.CONFIRM_DIGITALDATA_CALLBACK );
        const result = ( pmtRedirectionContextID?.contextResponse?.contextId?.length > 0 ?? false );
        (pmtRedirectionContextID !== null) && (pmtRedirectionContextID.paymentCompleted = true);
        this.CommonsSessionStorageService.set( BkiStorageConstants.PMT_REDIRECTION_CONTEXT,  pmtRedirectionContextID);
        if(result){ 
            this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            setTimeout(()=> {
                this.BookingRedirectionService.path( '/ibpurc' );
            });
        }
        return result;
    };

    initBookingFlow = () => {
        const flashOffer = this.BookingUtilService.getURLFirstParameterByName('flashOffer');
        const flashOfferId = this.BookingUtilService.getURLFirstParameterByName('flashOfferId');
        return new Promise((resolve, reject) => {
            // Do not init booking params if flashOffer
            if (flashOffer && flashOfferId) {
                resolve(null);
                return;
            }
            this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            return this.BookingAvailabilityService.callInitBooking()
                .then(resolve)
                .catch((error) => {
                    this.BookingModalService.finishWaiting();
                    this.CommonsSessionStorageService.set('availabilityErrror', error);
                    this.BookingRedirectionService.path('/ibbkerror');
                    reject();
                });
        });
    };
    checkLoadLegacy = ():boolean=> {
        const searchType = this.CommonsSessionStorageService.get('searchFlightType');
        const flashOffer = this.BookingUtilService.getURLFirstParameterByName('flashOffer');
        const userLogged = this.CommonsSessionStorageService.get('userLogged');

        return ( flashOffer != null
            || searchType !== this.BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY
            || ( searchType !== this.BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY )
            || !( userLogged !== this.BookingAppConstants.LOGIN_ONB ) );
    };
    equalFareHeights = () => {
        this.$timeout(() => {
            this.BookingComponentUtils.equalHeight(element('.ib-table-flight-cabins'), true);
        });
    };

}
