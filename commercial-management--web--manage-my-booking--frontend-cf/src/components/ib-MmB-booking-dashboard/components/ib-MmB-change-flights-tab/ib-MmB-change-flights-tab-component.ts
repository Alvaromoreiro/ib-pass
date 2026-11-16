import { MmBDeinvoicingUtils } from './../../../services/Utils/ib-MmB-deinvoicing-utils';
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import angular from 'angular';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

@Component(
    'ib-MmB-change-flights-tab-module',
    'ibMmbChangeFlightsTabComponent',
    {
        controllerAs: 'changeFlightsTabCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-change-flights-tab-view.html';
        }],
        bindings: {
            flightsInfo: '<',
            flags: '<',
            blackOutDates: '<',
            flexibilizationRange: '<',
            newSisterCities: '=',
            orderItems: '<'
        }
    },
    ['$scope', '$rootScope', 'MmBModalService', 'localStorageService', '$filter', 'MmBUtilService', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'BookingDashboardConstants' , 'CommonsUtilService', 'VoluntaryChangesLogService', 'MmBDeinvoicingUtils'],
[])
export class ibMmbChangeFlightsTabComponent {

    flightsInfo;
    flags;
    blackOutDates;
    flexibilizationRange;
    newSisterCities;
    orderItems;

    disableChange;
    reshopConditions;
    localFlags = {};
    message = '';
    isRedemption = false;
    linkToRubiQ = '';
    isEmptyBasket = false;
    channelDirect = false;

    model;
    numberFlights;
    quadrigam;
    someChecked;
    slicesId;
    flightsAvailable;
    bookingInfo;
    phonesList;
    isFlex;
    isDigital;
    flightsMenssage;
    flexibilizationInfoDates;
    showFlexibilizationInfoSectionFlag;
    sisterCitiesAvailability: { newSisterCities: any; checkSisterCitiesAvailable: boolean; };
    isActiveDeinvoicing: boolean = false;

    constructor(
        private $scope,
        private $rootScope,
        private MmBModalService,
        private localStorageService,
        private $filter,
        private MmBUtilService,
        private MmBAppConstants,
        private MmBDatalayerUtilsService,
        private BookingDashboardConstants ,
        private CommonsUtilService,
        private VoluntaryChangesLogService,
        private MmBDeinvoicingUtils:MmBDeinvoicingUtils) {
            $scope.$on('restarQuadrigam', this.addQuadrigam);
            this.disableChange = this.$rootScope.$on('childRebookUpdate', this.processRebookFailed);
            $scope.$on('destroy', this.disableChange);
            this.$rootScope.$on('updateBasket', this.getIsEmptyBasket);
        }



    $onInit = () => {
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        //CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_SELECT_NEW_DATES');
        this.showCallCenter();
        this.MmBModalService.showWaitingModal();
        this.model = {};
        this.numberFlights = 0;
        this.quadrigam = null;
        this.someChecked = false;
        this.slicesId = [];
        this.flightsAvailable = { number: 0, slices: [] };
        this.channelDirect = this.isDirectChannel(this.bookingInfo.channel);
        this.model.disruptionPeriodsData = this.localStorageService.get('disruptionPeriodsInfo');
        this.phonesList = this.localStorageService.get('phonesList') || null;
        this.isFlex = this.bookingInfo.flexibilizationCapabilitiesInformation;
        this.isDigital = !this.bookingInfo.flexibilizationCapabilitiesInformation;
        if (this.phonesList && this.phonesList.RESERVAS) {
            this.message = this.$filter('translate')('MMB_VC_INFO_COSTUME_SERVICE_CALL');
            this.message = this.message.replace(/\*/g, this.phonesList.RESERVAS.prefix + ' ' + this.phonesList.RESERVAS.telephone);
        }
        this.sisterCitiesAvailability = this.buildSisterCitiesAvailability(this.newSisterCities);
        this.initializeData();
        this.flags.dateLimit = {};
        this.flags.dateLimit.channel = this.bookingInfo.channel;
        this.flags.dateLimit.verifyDate = this.MmBUtilService.orderItemContained(this.bookingInfo.order.orderItems, this.MmBAppConstants.ORDER_ITEMS_TYPE_TO_AVOID);
        this.quadrigam = this.generateQuadrigam();
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[this.quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[this.quadrigam], this.quadrigam);
        this.addProcessStartToDigitalData();
        this.VoluntaryChangesLogService.getVoluntaryChangesLog();
        this.MmBModalService.finishWaiting();
        this.getIsEmptyBasketController();
        this.showFlexibilizationInfoSection();
        this.isActiveDeinvoicing = this.MmBAppConstants.TOGGLE.isActiveDeinvoicing && this.MmBDeinvoicingUtils.checkWarningCheckOut();
    }

    private initializeData = () => {
        this.reshopConditions = this.localStorageService.get('reshopConditions');

        angular.forEach(this.flightsInfo.flights, (flight, sliceId) => {
            flight.checked = false;
            flight.parseNewDateSelected = null;
            this.slicesId.push(sliceId);
            if (this.isVoluntaryChanges()) {
                this.reshopConditions.voluntaryChanges.slices.forEach(slice => {
                    if(slice.sliceId === sliceId && slice.enabled) {
                        this.flightsAvailable.slices.push(sliceId);
                        this.flightsAvailable.number++;
                    }
                });
            }
            if (this.isInVoluntaryChanges()) {
                this.reshopConditions.involuntaryChanges.slices.forEach(slice => {
                    if(slice.sliceId === sliceId && slice.enabled) {
                        this.flightsAvailable.slices.push(sliceId);
                        this.flightsAvailable.number++;
                    }
                });
            }
            this.numberFlights++;
        });
        if (this.numberFlights === 1) {
            this.flightsInfo.flights[this.slicesId[0]].checked = true;
            this.someChecked = true;
        } else {
            if (this.flightsAvailable.number === 1) {
                this.flightsInfo.flights[this.flightsAvailable.slices[0]].checked = true;
                this.someChecked = true;
            }
        }
        if (this.flags.showFlexibilizationChangeSection || this.flags.showVoluntaryFlexibleFlightChange) {
            if (this.model.disruptionPeriodsData) {
                this.createFlexibilizationDates();
                this.model.blackOutDates = this.localStorageService.get('blackOutPeriodsData');
                this.model.textBlackoutPeriods = this.localStorageService.get('textBlackoutPeriods');
                this.model.textAllowedPeriods = this.localStorageService.get('textAllowedPeriods');
                this.MmBModalService.finishWaiting();
            } else {
                this.model.blackOutDates = true;
                this.MmBModalService.finishWaiting();
            }
        } else {
            this.model.blackOutDates = { blackOutPeriods: [], maxDate: dayjs().add(360, 'day'), allowedPeriods: [] };
        }
        this.getMessage();

    }

    /**
     * This functions return a text to show in the view about fare conditions.
     * @param {Object} condition all information about fare conditions.
     * @returns {String} Return a message with conditions.
     */
    getConditionText = (condition) => {
        return condition && condition.message ? condition.message : '';
    }


    /**
     * This functions open a modal with all information about fare family flight's. This only available to Voluntary change.
     * In flexibilization change this is not available.
     * @param {Object} fareFamilyInfo All information about fareFamily and conditions.
     *  */
    openFareModal = (fareFamilyInfo) => {
        angular.extend(fareFamilyInfo, {
            idModal: 'ib-compare-fares-modal'
        });
        this.MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', {
            selectedFareInfo: fareFamilyInfo
        }).result.then(angular.noop, angular.noop);
    }

    /**
     * This functions save or delete the flight checked to change dates.
     * @param {flight} flightSelected is all data about flight selected.
     * @param {Boolean} this.someChecked Indicated that exist a flight selected to change.
     * @param {Number} indexFlight Indicate the number slices changed.
     * @returns change value this.someChecked variable to show "flexibilization-search" component.
     *  */
    changeCheck = (indexFlight, flightSelected) => {
        let foundCheck = false;
        if (flightSelected && flightSelected.checked) {
            this.someChecked = true;
        } else {
            angular.forEach(this.flightsInfo.flights, (flight) => {
                if (flight.checked) {
                    foundCheck = true;
                }
            });
            this.someChecked = foundCheck;
        }
        flightSelected.parseNewDateSelected = null;
        if (this.someChecked) {
            this.$scope.$broadcast('checkFlightChanged', indexFlight);
        }

        //Modify referenceSliceId depending on which flight the user wants to modify
        if(this.newSisterCities) {
            if(!this.flightsInfo.flights[this.newSisterCities.disruptedSlices[0]].checked && this.flightsInfo.flights[this.newSisterCities.disruptedSlices[1]].checked) {
                this.newSisterCities.referenceSliceId = this.newSisterCities.disruptedSlices[1];
            } else{
                this.newSisterCities.referenceSliceId = this.newSisterCities.disruptedSlices[0];
            }
        }
    }

    /**
     * This function update the datalayer with the quadrigam view. This function is execute when availability-flex service
     * return any error and the user accept close modal.
     * @param {event} restarQuadrigam Is the event that launch the function
     *  */
    private addQuadrigam (event) {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[this.quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[this.quadrigam], this.quadrigam);
    }

    private processRebookFailed = (event) => {
        this.$scope.$emit('changeTabEvent', this.BookingDashboardConstants.TABS.management);
    }

    /**
     * This function generate quadrigam according flow (flexibilization or voluntary change)
     * @returns {String} quadrigam with code.
     *  */
    private generateQuadrigam () {
        let quadrigam = null;
        if (!this.flags.showFlexibilizationChangeSection && !this.flags.showVoluntaryChangeFlightSection && this.flags.showChangeFlightLink) {
            quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_CALL_CENTER_MESSAGE;
            this.CommonsUtilService.setTitlePage('FLIGHT_TEMPORARY_ERROR_TITLE');
            this.MmBDatalayerUtilsService.setProcessAndStep(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
        } else {
            if (this.numberFlights === 1) {
                quadrigam = this.flags.showFlexibilizationChangeSection ? this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_SEARCH_ONE_WAY : this.flags.showVoluntaryChangeFlightSection ? this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SARCH_ONE_WAY : '';
                if (quadrigam === this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_SEARCH_ONE_WAY) this.CommonsUtilService.setTitlePage('FLIGHT_FLEXIBILIZATION_SEARCH_ONE_WAY_TITLE');
                if (quadrigam === this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SARCH_ONE_WAY) this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_FLEXIBILIZATION_SELECT_NEW_FLIGHTS');
            } else if (this.numberFlights === 2) {
                quadrigam = this.flags.showFlexibilizationChangeSection ? this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_SEARCH_WITH_RETURN : this.flags.showVoluntaryChangeFlightSection ? this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SEARCH_WITH_RETURN : '';
                if (quadrigam === this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_SEARCH_WITH_RETURN) this.CommonsUtilService.setTitlePage('FLIGHT_FLEXIBILIZATION_SEARCH_WITH_RETURN_TITLE');
                if (quadrigam === this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SEARCH_WITH_RETURN) this.CommonsUtilService.setTitlePage('FLIGHT_CHANGE_FLIGHTS_SEARCH_WITH_RETURN_TITLE');
            }
        }

        return quadrigam;
    }

    private isDirectChannel (channel) {
        return this.MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT.indexOf(channel) > -1;
    }

    private isRedemptionMessage = (code) => {
        if (code === 'REDEMPTION_RESERVE_AVIOS' || code === 'REDEMPTION_RESERVE_POINTS') {
            this.isRedemption = true;
        }
    }

    /**
     * Validates if the tab controller should be loaded validating the menu flags
     * in case it's disabled it loads the callcenter tab.
     * Temporal validation
     */
    private showCallCenter = () => {
        if(this.flags.hideChangeFlightMenuOption) {
            this.flags.showVoluntaryChangeFlightSection = false;
            this.flags.showFlexibilizationChangeSection = false;
        }
    }

    private getFlight = (sliceId,flights) => {
        const flight = flights.find(e => e.sliceId === sliceId);
        return flight.segments[0].departure.name + '(' + flight.segments[0].departure.code +') - '+flight.segments[0].arrival.name + '(' + flight.segments[0].arrival.code +')';
    }

    private getMessageSlide = (code) => {
        let messageSlide;
        switch (code) {
                case 'EMDS_NOT_ALLOWED':
                case 'PASSENGER_TICKETS_NOT_OK':
                case 'ORDER_STATUS_NOT_OK':
                case 'REISSUED_TICKETS_NOT_OK':
                case 'PENDING_ISSUANCE_EMD':
                case 'MULTICITY_PNR':
                case 'FLIGHT_CHANGE_NOT_ALLOWED':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_1';
                    break;
                case 'GROUP_PNR':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_2';
                    break;
                case 'ORDER_LOCATOR_NOT_OK':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_3';
                    break;
                case 'FORM_OF_PAYMENT_NOT_OK':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_4';
                    break;
                case 'NO_PAYMENT_INFO_AGENCIES':
                case 'NDC_FLIGHT_CHANGE_NOT_ALLOWED':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_5';
                    break;
                case 'SLICE_NEAR_TO_TAKEOFF':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_6';
                    break;
                case 'SEGMENT_STATUS_NOT_OK':
                case 'COUPONS_NOT_OK':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_7';
                    break;
                case 'SLICE_WITH_FLOWN_SEGMENTS':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_8';
                    break;
                case 'UNNACOMPANIED_MINORS_NOT_ALLOWED':
                    messageSlide = 'MMB_DEEPLINK_ERROR_MODAL_TITLE';
                    break;
                case 'ANCILLARIES_NOT_FOUND':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_11';
                    break;
                case 'REDEMPTION_RESERVE_AVIOS':
                case 'REDEMPTION_RESERVE_POINTS':
                    messageSlide = this.reshopConditions.voluntaryChanges.reservationFailedConditions[0].reason;
                    break;
                case 'SLICE_AIRSHUTTLE_CKI_MANAGEMENT':
                    messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_12';
                    break;
                default: messageSlide = 'FLIGHT_CHANGE_ERROR_TITLE_1';
        }
        return messageSlide;
    }

    private getMessageSlideDescription = (code) => {
        let messageSlideDescription;
        const tagsInfo = {
            span: {
                tag: 'span',
                class: 'ib-text--inline-block'
            }
        };
        switch (code) {
                case 'EMDS_NOT_ALLOWED':
                case 'PASSENGER_TICKETS_NOT_OK':
                case 'ORDER_STATUS_NOT_OK':
                case 'REISSUED_TICKETS_NOT_OK':
                case 'PENDING_ISSUANCE_EMD':
                case 'GROUP_PNR':
                case 'MULTICITY_PNR':
                case 'FLIGHT_CHANGE_NOT_ALLOWED':
                case 'COUPONS_NOT_OK':
                case 'SEGMENT_STATUS_NOT_OK':
                    messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_1';
                    break;
                case 'ORDER_LOCATOR_NOT_OK':
                    messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_2';
                    break;
                case 'FORM_OF_PAYMENT_NOT_OK':
                case 'SLICE_WITH_FLOWN_SEGMENTS':
                    messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_3';
                    break;
                case 'NO_PAYMENT_INFO_AGENCIES':
                case 'NDC_FLIGHT_CHANGE_NOT_ALLOWED':
                    messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_4';
                    break;
                case 'SLICE_NEAR_TO_TAKEOFF':
                    messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_5';
                    break;
                // case 'SEGMENT_STATUS_NOT_OK':            //CHANGE ADD
                //     messageSlideDescription = 'FLIGHT_CHANGE_ERROR_TITLE_9'; //CHANGE ADD ON 02/06/2022 and broken test review this code DIB-4444
                //     break;
                case 'UNNACOMPANIED_MINORS_NOT_ALLOWED':
                    messageSlideDescription = this.$filter('literalFormatter')(this.$filter('translate')('FLIGHT_CHANGE_ERROR_SUBTITLE_7', {phone: this.getPhone()}), tagsInfo);
                    break;
                case 'ANCILLARIES_NOT_FOUND':
                    messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_6';
                    break;
                case 'REDEMPTION_RESERVE_AVIOS':
                case 'REDEMPTION_RESERVE_POINTS':
                    messageSlideDescription = this.reshopConditions.voluntaryChanges.reservationFailedConditions[0].reason;
                    break;
                default: messageSlideDescription = 'FLIGHT_CHANGE_ERROR_SUBTITLE_1';
        }
        return messageSlideDescription;
    }

    getPhone = () => {
        return this.phonesList?.RESERVAS ? this.phonesList.RESERVAS.prefix + ' ' + this.phonesList.RESERVAS.telephone : null;
    }

    checkMessageFlight = (sliceIdFlight) => {
        if(this.flightsMenssage) {
            return this.flightsMenssage.some(e => e.sliceId===sliceIdFlight);
        } else{
            return false;
        }
    }

    getMessageFlight = (sliceIdFlight) => {
        return this.flightsMenssage.find(e => e.sliceId===sliceIdFlight).message;
    }

    private getMessage = () => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        this.reshopConditions = this.localStorageService.get('reshopConditions');
        const flights = bookingInfo.order.slices;
        this.flightsMenssage = [];
        if(this.reshopConditions.voluntaryChanges.slices.length>0 && this.reshopConditions.voluntaryChanges.reservationFailedConditions.length===0) {
            this.reshopConditions.voluntaryChanges.slices.forEach(item => {
                if(!item.enabled) {
                    const flightMen = {
                        message: item.failedConditions[0] && item.failedConditions[0].code ? this.getMessageSlide(item.failedConditions[0].code) : 'FLIGHT_CHANGE_ERROR_TITLE_10',
                        description: 'FLIGHT_CHANGE_ERROR_SUBTITLE_1',
                        code: item.failedConditions[0] && item.failedConditions[0].code ? item.failedConditions[0].code : '',
                        sliceId: item.sliceId,
                        flight: this.getFlight(item.sliceId,flights)
                    };
                    this.flightsMenssage.push(flightMen);

                }
            });
        } else if(this.reshopConditions.voluntaryChanges.reservationFailedConditions.length>0) {
            this.isRedemptionMessage(this.reshopConditions.voluntaryChanges.reservationFailedConditions[0].code);

            flights.forEach(item => {
                const flightMen = {
                    message: this.getMessageSlide(this.reshopConditions.voluntaryChanges.reservationFailedConditions[0].code),
                    description: this.getMessageSlideDescription(this.reshopConditions.voluntaryChanges.reservationFailedConditions[0].code),
                    code: this.reshopConditions.voluntaryChanges.reservationFailedConditions[0].code,
                    sliceId: item.sliceId,
                    flight: this.getFlight(item.sliceId,flights)
                };
                if(!this.flightsMenssage.some(e => e.code===flightMen.code)) {
                    this.flightsMenssage.push(flightMen);
                }
            });
            this.flags.showVoluntaryChangeFlightSection = false;
        }else if(this.reshopConditions.callcenterInfo.enabled) {
            flights.forEach(item => {
                const flightMen = {
                    message: 'FLIGHT_CHANGE_ERROR_TITLE_10',
                    description: this.getMessageSlideDescription(''),
                    code: '',
                    sliceId: item.sliceId,
                    flight:''
                };
                this.flightsMenssage.push(flightMen);
            });
        }
    }

    private buildSisterCitiesAvailability = (newSisterCities) => {
        let sisterCitiesAvailability = {
            newSisterCities : newSisterCities ?? [],
            checkSisterCitiesAvailable : false
        };
        let sisterCitiesFlag = this.bookingInfo.orderFlags.find(orderFlag => {
            return orderFlag.type === 'ALLOWED_SISTER_CITIES';
        });
        if(this.bookingInfo.flexibilizationCapabilitiesInformation && sisterCitiesFlag?.enabled){
            sisterCitiesAvailability.checkSisterCitiesAvailable = true;
        }
        return sisterCitiesAvailability;
    }

    private getIsEmptyBasketController = () => {
        let headerModelLocal = this.localStorageService.get('headerModel');
        if ((angular.isDefined(headerModelLocal.headerModel?.shoppingBasket?.total?.original) ? headerModelLocal.headerModel.shoppingBasket.total.original === 0 : headerModelLocal.headerModel.shoppingBasket.total?.totalPrice === 0)){
            this.isEmptyBasket = true;
        } else {
            this.isEmptyBasket = false;
        }
    }

    private getIsEmptyBasket = () => {
        let headerModelLocal = this.localStorageService.get('headerModel');
        if ((angular.isDefined(headerModelLocal.headerModel?.shoppingBasket?.total?.original) ? headerModelLocal.headerModel.shoppingBasket.total.original === 0 : headerModelLocal.headerModel.shoppingBasket.total?.totalPrice === 0)){
            this.localStorageService.set('isEmptyBasket', true);
            this.isEmptyBasket = true;
        } else {
            this.localStorageService.set('isEmptyBasket', false);
            this.isEmptyBasket = false;
        }
    }

    deleteBasket = () => {
        this.MmBModalService.showEmptyBasketModal()
        .result.then(() => {
            this.getIsEmptyBasket();
        }, angular.noop);
    };

    private createFlexibilizationDates = () => {
        let flexibilizationInfoDates: any = {};
        const bookingInfo = this.localStorageService.get('bookingInfo');
        let flexibilizationPeriods = this.localStorageService.get('blackOutPeriodsData');
        let flexibilizationDate = bookingInfo.flexibilizationCapabilitiesInformation?.flightRange;
        flexibilizationInfoDates.flexibilizationDate = {dateFrom: flexibilizationDate?.since, dateTo: flexibilizationDate?.limit, type:'FLEX'};
        flexibilizationInfoDates.allowedPeriods = flexibilizationPeriods?.allowedPeriods;
        flexibilizationInfoDates.blackoutPeriods = flexibilizationPeriods?.blackoutPeriods;
        flexibilizationInfoDates.allowedPeriodsText = this.localStorageService.get('textAllowedPeriods');
        flexibilizationInfoDates.blackoutPeriodsText = this.localStorageService.get('textBlackoutPeriods');
        this.flexibilizationInfoDates = flexibilizationInfoDates;
    };

    showFlexibilizationInfoSection = () => {
        this.showFlexibilizationInfoSectionFlag = (this.flags.showVoluntaryChangeFlightSection && !this.flags.showVoluntaryFlexibleFlightChange) || this.flags.showFlexibilizationChangeSection || (this.flags.showVoluntaryChangeFlightSection && this.flags.showVoluntaryFlexibleFlightChange);
    };

    private addProcessStartToDigitalData = () => {
        const language = this.$rootScope.appLang;
        const market = this.$rootScope.appMarket;
        const quadrigam = this.MmBAppConstants.QUADRIGAM.MANAGE_RESERV;
        const processStartValue = `${language}/${market}/${quadrigam}`;
        const confirmationDigitalDataInfo = {
            [MMBDatalayerConstants.DatalayerBKIConstants.PROCESS_START]: processStartValue
        };

        this.MmBDatalayerUtilsService.addDigitalDataInfo(confirmationDigitalDataInfo);
    };

    isVoluntaryChanges = ():boolean => {
        return (this.reshopConditions && this.reshopConditions.voluntaryChanges && this.reshopConditions.voluntaryChanges.slices && this.reshopConditions.voluntaryChanges.enabled);
    };

    isInVoluntaryChanges = ():boolean => {
        return (this.reshopConditions && this.reshopConditions.involuntaryChanges && this.reshopConditions.involuntaryChanges.slices && this.reshopConditions.involuntaryChanges.enabled);
    };
    
}