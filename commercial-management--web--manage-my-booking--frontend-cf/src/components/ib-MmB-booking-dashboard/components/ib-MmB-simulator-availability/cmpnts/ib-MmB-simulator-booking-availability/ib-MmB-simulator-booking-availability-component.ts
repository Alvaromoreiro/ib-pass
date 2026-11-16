import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import angular from "angular";
import { SimulatorAvailabilityTransformer } from "../../transformers/ib-MmB-simulator-availability-transformer";
import { MmBModalService } from "@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service";
import { SimulatorBookingAvailabilityTransformerFilter } from "./transformer/ib-Mmb-simulator-booking-availability-transformer-filter";
import { MmBUtilsSharedService } from "@src/components/services/Utils/ib-MmB-utils-shared-service";

@Component(
    'ib-MmB-simulator-booking-availability-module',
    'ibMmbSimulatorBookingAvailability',
    {
        controllerAs: 'simulatorBookingAvailabilityCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-simulator-booking-availability-view.html';
        }],
        bindings: {
            model: '=',
            dates: '<'
        }
    },
    ['$scope', '$rootScope', 'SimulatorBookingAvailabilityTransformer', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'SimulatorBookingAvailabilityTransformerFilter', '$filter', 'SimulatorAvailabilityTransformer', 'SimulatorBookingAvailabilityConstants', 'localStorageService', 'MmBUtilsSharedService', 'MmBModalService', 'SimulatorFareOrquestator', 'SimulatorAvailabilityOrchestrator', 'AvailabilityClass', 'FareClass', 'CommonsUtilService'],
[])
export class ibMmbSimulatorBookingAvailability {

    constructor(
        private $scope,
        private $rootScope,
        private SimulatorBookingAvailabilityTransformer,
        private MmBAppConstants: MmBAppConstants,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private SimulatorBookingAvailabilityTransformerFilter: SimulatorBookingAvailabilityTransformerFilter,
        private $filter,
        private SimulatorAvailabilityTransformer: SimulatorAvailabilityTransformer,
        private SimulatorBookingAvailabilityConstants,
        private localStorageService,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private MmBModalService: MmBModalService,
        private SimulatorFareOrquestator,
        private SimulatorAvailabilityOrchestrator,
        private AvailabilityClass,
        private FareClass,
        private CommonsUtilService: CommonsUtilService) {
            this.$scope.$on('resetFilterDataModal', this.resetFilter);
            this.$scope.$on('deployFare', this.deployFareContainer);
            this.$scope.$on('typeFilterAvailability', this.typeFilter);
            this.$scope.$on('updateFareSelected', this.updateFareSelected);
            this.$scope.$on('slideSelected', this.changeSelectedSlide);
            this.$scope.$on('updateAvailability', this.updateAvailability);
            this.$scope.$on('filterDataModal', this.captureFilterData);
            this.$scope.$on('$destroy', this.resetDataTransformer);
        }

    stateFlight = false;
    stateFlightEndAnimation = false;
    buttonCloseStateFlight = false;
    showDetails = false;
    returnFlight = false;
    showOption = '';
    showDetail = false;
    showLoading = true;
    outboundFlightSelected = false;
    returnFlightSelected = false;
    modeFlightReturn = false;
    selectedItem = -1;
    selectedSlide: any = {};
    copyFlightOutward = {};
    copyFlightReturn = {};
    titleController;
    best = {
        outbound: false,
        return: false
    };
    flights: any = {};
    showCalendar = false;
    modelFligths = {};
    modelfilterOutBound = {};
    modelfilterReturn = {};
    modelTotalPrice = null;
    outboundFlightSelectedInfo = null;
    titleOutwardOrigin;
    titleOutwardDestiny;
    fareSelectedIndex = 0;
    fareSelectedIndexOutbound = 0;
    typeFlight = ['outbound', 'return'];
    typeFlightIndex = [0, 1];
    offersAvailableOutbound = false;
    offersAvailableReturn = false;
    haveFlights = false;
    baseDate;
    filterAux = [];
    entryFiltersFirstTimeOutBound = true;
    entryFiltersFirstTimeReturn = true;
    unifiedOfferType = this.localStorageService.get('unifiedOfferType');
    bookingInfo;
    channelDirect;
    notIberiaSegmentWarn;
    model;
    modeFlight;
    applyFilter;
    slices;
    serviceMsg;
    warningVoucher;
    flexPack;
    indexRibbonReturn;
    titleReturnOrigin;
    titleReturnDestiny;
    newSisterCities;
    sisterCitiesOptionChecked;
    sisterInfo;
    oldOfferOutboundSelected;
    cabinSelectedIndexOutbound;
    offertOutboundSelected;
    totalPriceDone;
    returnFlightSelectedInfo;
    cabinSelectedIndexReturn;
    sliceSelectedOutbound;
    sliceSelectedIndexOutbound;
    dateOutbound;
    sliceSelectedReturn;
    sliceSelectedIndexReturn;
    dateReturn;
    priceOfferSelected;
    fareSelectedIndexReturn
    priceOfferSelectedFormated;
    quadrigam;
    selectedIndex;
    dates;
    toSummaryView;
    noResultsOutbound: boolean = false;
    noResultsReturn: boolean = false;
    penalty: {outbound: false, return: false};

    resetDataTransformer = () => {
        /* INIT DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.removeDatalayerObjects(this.SimulatorBookingAvailabilityTransformer.getElementsOfDataLayer());
        this.MmBDatalayerUtilsService.removeDatalayerObjects(['modal']);
        this.MmBDatalayerUtilsService.sendDatalayerEvent(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        /* FINISH DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.removeDigitalDataObjects(this.SimulatorBookingAvailabilityTransformer.getElementsOfDataLayer());
        this.MmBDatalayerUtilsService.removeDigitalDataObjects(['modal']);
        this.MmBDatalayerUtilsService.updateDatalayerViewEvent();
        this.SimulatorBookingAvailabilityTransformer.resetData('all');
    }

    /**
     * Initialize the availability controller and its model calling the rest service for availability.
     *
     */
    $onInit = () => {
        let i;
        const breakdownInfo = this.localStorageService.get('breakdownInfo');
        const isUnified = this.localStorageService.get('isUnifiedFlow');
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        this.channelDirect = this.isDirectChannel(this.bookingInfo.channel);
        this.notIberiaSegmentWarn = this.localStorageService.get('unifiedNotIberiaOP');
        this.flights = this.model.modelRibbon;
        this.selectedSlide = this.model.selectedSlice;
        this.showCalendar = true;
        this.showLoading = false;
        this.modeFlight = this.model.modeFlight;
        this.baseDate = new Date();
        this.slices = {
            flightsOutward: [],
            flightsReturns: []
        };


        this.model.relatedContent?.forEach(relatedContent=>{
            if(relatedContent.key==='NEGATIVE_PRICE_NOT_SHOW'){
                this.serviceMsg=relatedContent.value;
            }
        });

        this.warningVoucher = {
            titleText: this.$filter('translate')('MMB_VC_VOUCHER_BOX_AVAILABILITY'),
            icon: 'icon-informacion_2'
        };

        if (breakdownInfo?.issuedItems && breakdownInfo.issuedItems.length > 0) {
            for (i = 0; i < breakdownInfo.issuedItems.length; i++) {
                if (breakdownInfo.issuedItems[i].subtype === 'FLEXIBILITY_PACK') {
                    this.flexPack = true;
                }
            }
        }
        if (!this.model.modelempty) {
            if (this.modeFlight === 'outbound' || this.modeFlight === 'twice') {
                this.slices.flightsOutward = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[0]);
                this.offersAvailableOutbound = this.slices.flightsOutward.some((element) => {
                    return element.visibility === true;
                });
                this.haveFlights = this.offersAvailableOutbound;
                this.indexRibbonReturn = 1;
                this.modelfilterOutBound = this.getModelfilterOutBound();
            } else if (isUnified) {
                if(this.localStorageService.get('unifiedOptionalData')) {
                    this.indexRibbonReturn = this.localStorageService.get('unifiedOptionalData').enabled?1:0;
                }else {
                    this.indexRibbonReturn = 0;
                }
                if (this.modeFlight === 'return' && this.model.originDestinations.length > 1) {
                    this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[1]);
                }else{
                    this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[0]);
                }
                this.offersAvailableReturn = this.slices.flightsReturns.some((element) => {
                    return element.visibility === true;
                });
                this.haveFlights = this.offersAvailableReturn;
                this.modeFlightReturn = true;
                this.modelfilterReturn = this.getModelfilterReturn();

            } else {
                this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[1]);
                this.offersAvailableReturn = this.slices.flightsReturns.some((element) => {
                    return element.visibility === true;
                });
                this.haveFlights = this.offersAvailableReturn;
                this.modeFlightReturn = true;
                this.indexRibbonReturn = 0;
                this.modelfilterReturn = this.getModelfilterReturn();
            }
            this.modelTotalPrice = this.getModelTotalPrice(this.model);
        } else {
            if (this.modeFlight === 'outbound' || this.modeFlight === 'twice') {
                this.indexRibbonReturn = 1;
            } else {
                this.modeFlightReturn = true;
                this.indexRibbonReturn = 0;
            }
        }
        this.titleOutwardOrigin = this.model.originDestinations[0].originCity.description;
        this.titleOutwardDestiny = this.model.originDestinations[0].destinationCity.description;
        if (this.model.originDestinations.length > 1) {
            this.titleReturnOrigin = this.model.originDestinations[1].originCity.description;
            this.titleReturnDestiny = this.model.originDestinations[1].destinationCity.description;
        }
        if (isUnified) {
            if (this.model.originDestinations.length === 1) {
                this.titleReturnOrigin = this.model.originDestinations[0].originCity.description;
                this.titleReturnDestiny = this.model.originDestinations[0].destinationCity.description;
            }
            this.newSisterCities = this.localStorageService.get('newSisterCitiesModelData');
            this.sisterCitiesOptionChecked = this.localStorageService.get('showSisterCitiesPossibility');
            this.sisterInfo = [];
            if(this.sisterCitiesOptionChecked && this.newSisterCities)
            this.setSisterCitiesLiteral();
        }
        this.initializeDatalayer();
        this.titleController = this.$filter('translate')('MMB_VC_VOUCHER_BOX_AVAILABILITY');
    }

    isShowLikToRubiQ = () => {
        return this.localStorageService.get('showLinkToRubiQ');
    }

    isDirectChannel = (channel) => {
        return this.MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT.indexOf(channel) > -1;
    }

    /**
     * This function generate and return quadrigam value according user selection.
     * @param {Object} model is all model data availability controller.
     * @returns {String} quadrigam value.
     *  */
    generateQuadrigam = (haveFligths, model) => {
        var quadrigam = null;

        if (!haveFligths) {
            //error en busqueda STCERR
            quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_ERROR_RIBBON;
            this.CommonsUtilService.setTitlePage('FLIGHT_CHANGE_ERROR_TITLE_CALENDAR');
        } else {
            if (model.originDestinations.length > 1) {
                // if (model.selectedSlice.length > 1) {
                quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_AVAILABILITY_ROUNDTRIP;
                // } else {
                //     quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_AVAILABILITY_ONEWAY;
                // }
            } else {
                quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_AVAILABILITY_ONEWAY;
            }

        }
        return quadrigam;
    }

    initializeDatalayer = (newquadrigam?) => {
        let datalayerObject = null, quadrigam = newquadrigam || this.generateQuadrigam(this.haveFlights, this.model);;
        datalayerObject = this.SimulatorBookingAvailabilityTransformer.generateDataLayerAvailability();
            /* INIT DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.addDataLayerInfo(datalayerObject);
        /* FINISH DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.addDigitalDataInfo(datalayerObject);
        this.MmBDatalayerUtilsService.setProcessAndStep(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],
            MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam],
            quadrigam
        );
        this.MmBDatalayerUtilsService.updateDatalayerViewEvent()
    }

    /**
     * It resets to the initial state variables of the controller related to the selection of slice, cabin and fare.
     * @param {String} typeFlight mode flight outbound or return.
     */
    removeStateFlight = (typeFlight) => {
        this.buttonCloseStateFlight = true;
        this.stateFlight = false;
        this.stateFlightEndAnimation = false;
        this.showDetails = false;

        switch (this.modeFlight) {
                case 'twice':
                    if (this.oldOfferOutboundSelected) {
                        this.outboundFlightSelectedInfo.cabins[this.cabinSelectedIndexOutbound].fareFamilies[this.fareSelectedIndexOutbound].priceShown = this.oldOfferOutboundSelected;
                        this.outboundFlightSelectedInfo.cabins[this.cabinSelectedIndexOutbound].price = this.oldOfferOutboundSelected;
                        this.oldOfferOutboundSelected = null;
                    }
                    if (typeFlight === 'outbound') {
                        this.outboundFlightSelectedInfo = null;
                        this.outboundFlightSelected = false;
                        this.offertOutboundSelected = null;
                        this.slices.flightsReturns = null;
                        this.totalPriceDone = false;
                        this.cabinSelectedIndexOutbound = null;
                        this.SimulatorBookingAvailabilityTransformer.resetData('return');
                    } else {
                        this.returnFlightSelectedInfo = null;
                        this.returnFlightSelected = false;
                        this.totalPriceDone = false;
                        this.cabinSelectedIndexReturn = null;
                    }
                    break;
                case 'outbound':
                    this.outboundFlightSelectedInfo = null;
                    this.outboundFlightSelected = false;
                    this.totalPriceDone = false;
                    this.cabinSelectedIndexOutbound = null;

                    break;
                case 'return':
                    this.returnFlightSelectedInfo = null;
                    this.returnFlightSelected = false;
                    this.totalPriceDone = false;
                    this.cabinSelectedIndexReturn = null;
                    break;
        }
    };

    /**
     * Restore data slice from copy in function of typeflyght receive.
     * @param {Object} event event captured of another component.
     * @param {String} typeFlight type of flight.
     */
    resetFilter = (event, typeFlight) => {
        if (typeFlight === 'outbound') {
            this.slices.flightsOutward = this.copyFlightOutward;
            this.noResultsOutbound = false;
        } else {
            this.slices.flightsReturns = this.copyFlightReturn;
            this.noResultsReturn = false;
        }
    }

    /**
     * Apply the filter to the slides of the round trip flights or restore the original slides before applying the filter.
     * @param {Object} e event captured of another component.
     * @param {Object} data information of filter to apply to slices.
     */
    captureFilterData = (e, data) => {
        this.applyFilter = data.filter;
        if (data.typeFlight === 'outbound') {
            if (this.entryFiltersFirstTimeOutBound) {
                this.copyFlightOutward = angular.copy(this.slices.flightsOutward);
                this.entryFiltersFirstTimeOutBound = false;
            } else {
                this.resetFilter({}, data.typeFlight);
                this.copyFlightOutward = angular.copy(this.slices.flightsOutward);
            }
            this.slices.flightsOutward = this.SimulatorBookingAvailabilityTransformerFilter.applyFilter(data, this.slices.flightsOutward);
            this.noResultsOutbound = !this.slices.flightsOutward.some(flight => flight.visibility === true);

        } else {
            if (this.entryFiltersFirstTimeReturn) {
                this.copyFlightReturn = angular.copy(this.slices.flightsReturns);
                this.entryFiltersFirstTimeReturn = false;
            } else {
                this.resetFilter({}, data.typeFlight);
                this.copyFlightReturn = angular.copy(this.slices.flightsReturns);
            }
            this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformerFilter.applyFilter(data, this.slices.flightsReturns);
            this.noResultsReturn = !this.slices.flightsReturns.some(flight => flight.visibility === true);
        }
    }

    /**
     * Configure controller variables related to slice, cabin and fare selection of outbound flight.
     * @param {number} sliceIndex Index of slice selected.
     * @param {number} cabinIndex Index of cabin selected.
     */
    ChangeFlightSelectedOutbound = (sliceIndex, cabinIndex) => {
        this.cabinSelectedIndexOutbound = cabinIndex;
        if (!this.outboundFlightSelected) {
            this.outboundFlightSelectedInfo = angular.copy(this.slices.flightsOutward[sliceIndex]);
            this.sliceSelectedOutbound = sliceIndex + '-selected';
            this.sliceSelectedIndexOutbound = sliceIndex;
            this.best.outbound = this.slices.flightsOutward[sliceIndex].cabins[cabinIndex].best;
            this.outboundFlightSelected = true;
            this.dateOutbound = this.$filter('DateFormatFilter')(this.selectedSlide[0].date.serviceDate);
            this.outboundFlightSelectedInfo.cabins[cabinIndex].penalty = this.model.penalty.outbound;
        }
    }

    /**
     * Configure controller variables related to slice, cabin and fare selection of return flight.
     * @param {number} sliceIndex Index of slice selected.
     * @param {number} cabinIndex Index of cabin selected.
     */
    ChangeFlightSelectedReturn = (sliceIndex, cabinIndex) => {
        this.cabinSelectedIndexReturn = cabinIndex;
        if (!this.returnFlightSelected) {
            this.returnFlightSelectedInfo = angular.copy(this.slices.flightsReturns[sliceIndex]);
            this.best.return = this.slices.flightsReturns[sliceIndex].cabins[cabinIndex].best;
            this.sliceSelectedReturn = sliceIndex + '-selected';
            this.sliceSelectedIndexReturn = sliceIndex;
            this.returnFlightSelected = true;
            this.dateReturn = this.$filter('DateFormatFilter')(this.selectedSlide.length > 1 ? this.selectedSlide[1].date.serviceDate : this.selectedSlide[0].date.serviceDate);
            this.returnFlightSelectedInfo.cabins[cabinIndex].penalty = this.model.penalty.return;
        }
    }

    /**
     * Configure controller variables related to slice, cabin and fare selection of outbound or return flight.
     * @param {number} sliceIndex Index of slice selected.
     * @param {number} cabinIndex Index of cabin selected.
     * @param {String} sliceIndex mode flight outbound or return.
     */
    open = (sliceIndex, cabinIndex, typeFlight) => {
        switch (this.modeFlight) {
                case 'twice':
                    if (typeFlight === 'outbound') {
                        this.totalPriceDone = false;
                        this.ChangeFlightSelectedOutbound(sliceIndex, cabinIndex);
                        // this.MmBDataLayerService.getDigitalDataEcommerce(this.outboundFlightSelectedInfo, this.cabinSelectedIndexOutbound, MMBDatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
                    } else {
                        this.ChangeFlightSelectedReturn(sliceIndex, cabinIndex);
                        // this.MmBDataLayerService.getDigitalDataEcommerce(this.returnFlightSelectedInfo, this.cabinSelectedIndexReturn, MMBDatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
                    }
                    break;
                case 'outbound':
                    this.ChangeFlightSelectedOutbound(sliceIndex, cabinIndex);
                    this.priceOfferSelected = this.slices.flightsOutward[this.sliceSelectedIndexOutbound].cabins[this.cabinSelectedIndexOutbound].fareFamilies[0].offers[0].price.total;
                    this.modelTotalPrice.totalPrice = this.priceOfferSelected;
                    this.totalPriceDone = true;
                    // this.MmBDataLayerService.getDigitalDataEcommerce(this.outboundFlightSelectedInfo, this.cabinSelectedIndexOutbound, MMBDatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
                    break;
                case 'return':
                    this.ChangeFlightSelectedReturn(sliceIndex, cabinIndex);
                    this.priceOfferSelected = this.slices.flightsReturns[this.sliceSelectedIndexReturn].cabins[this.cabinSelectedIndexReturn].fareFamilies[0].offers[0].price.total;
                    this.modelTotalPrice.totalPrice = this.priceOfferSelected;
                    this.totalPriceDone = true;
                    // this.MmBDataLayerService.getDigitalDataEcommerce(this.returnFlightSelectedInfo, this.cabinSelectedIndexReturn, MMBDatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
                    break;
        }

    };

    /**
     * Configure controller variables related to slice, cabin and fare selection when the fare selection changes.
     * @param {Object} event received event of another component.
     * @param {Object} info Information of type flight, cabin, fare and slice selected.
     */
    updateFareSelected = (event, info) => {
        event.preventDefault();
        var quadrigam = this.generateQuadrigam(this.haveFlights, this.model);
        const process = this.MmBUtilsSharedService.getProcessByStatus(quadrigam, this.bookingInfo?.order?.status);
        if (quadrigam === this.MmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL) {
            quadrigam = this.MmBAppConstants.QUADRIGAM.SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL;
        } else if (quadrigam === this.MmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL) {
            quadrigam = this.MmBAppConstants.QUADRIGAM.SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL;
        } else if (quadrigam === this.MmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL) {
            quadrigam = this.MmBAppConstants.QUADRIGAM.SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL;
        }
        switch (this.modeFlight) {
                case 'twice':
                    if (info.typeFlight === 'outbound') {
                        this.fareSelectedIndexOutbound = info.selectedFare;
                        this.offertOutboundSelected = this.outboundFlightSelectedInfo.cabins[this.cabinSelectedIndexOutbound].fareFamilies[this.fareSelectedIndexOutbound].offers[0];
                        this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.SimulatorAvailabilityTransformer.getDataAvailabilityTransformedReturns(this.offertOutboundSelected), this.typeFlightIndex[1]);
                        this.initializeDatalayer();
                        this.offersAvailableReturn = this.slices.flightsReturns.some((element) => {
                            return element.visibility === true;
                        });

                        this.entryFiltersFirstTimeReturn = true;
                        this.modelfilterReturn = this.getModelfilterReturn();
                        this.returnFlightSelected = false;
                        this.cabinSelectedIndexReturn = null;
                        this.totalPriceDone = false;
                        if (this.applyFilter) {
                            this.captureFilterData(null, {
                                filter: this.applyFilter,
                                model: this.model,
                                typeFlight: 'return',
                                isReturn: true
                            });
                        }
                        // this.MmBDataLayerService.createSelectItemEvent(this.outboundFlightSelectedInfo, this.cabinSelectedIndexOutbound, this.fareSelectedIndexOutbound);

                    } else {
                        this.fareSelectedIndexReturn = info.selectedFare;
                        this.priceOfferSelected = this.slices.flightsReturns[this.sliceSelectedIndexReturn].cabins[this.cabinSelectedIndexReturn].fareFamilies[this.fareSelectedIndexReturn].offers[0].price.total;
                        this.priceOfferSelectedFormated = this.slices.flightsReturns[this.sliceSelectedIndexReturn].cabins[this.cabinSelectedIndexReturn].fareFamilies[this.fareSelectedIndexReturn].priceShown;
                        this.oldOfferOutboundSelected = this.outboundFlightSelectedInfo.cabins[this.cabinSelectedIndexOutbound].fareFamilies[this.fareSelectedIndexOutbound].priceShown;
                        this.outboundFlightSelectedInfo.cabins[this.cabinSelectedIndexOutbound].fareFamilies[this.fareSelectedIndexOutbound].priceShown = this.priceOfferSelectedFormated;
                        this.outboundFlightSelectedInfo.cabins[this.cabinSelectedIndexOutbound].price = this.priceOfferSelectedFormated;
                        this.modelTotalPrice.totalPrice = this.priceOfferSelected;
                        this.$scope.$broadcast('changeOnTotalPrice', true);
                        this.totalPriceDone = true;
                        this.MmBUtilsSharedService.updateQuadrigam(quadrigam, process);
                        // this.MmBDataLayerService.createSelectItemEvent(this.returnFlightSelectedInfo, this.cabinSelectedIndexReturn, this.fareSelectedIndexReturn);
                    }
                    break;
                case 'outbound':
                    this.fareSelectedIndexOutbound = info.selectedFare;
                    this.priceOfferSelected = this.slices.flightsOutward[this.sliceSelectedIndexOutbound].cabins[this.cabinSelectedIndexOutbound].fareFamilies[this.fareSelectedIndexOutbound].offers[0].price.total;
                    this.modelTotalPrice.totalPrice = this.priceOfferSelected;
                    this.$scope.$broadcast('changeOnTotalPrice', true);
                    this.totalPriceDone = true;
                    this.MmBUtilsSharedService.updateQuadrigam(quadrigam, process);
                    // this.MmBDataLayerService.createSelectItemEvent(this.outboundFlightSelectedInfo, this.cabinSelectedIndexOutbound, this.fareSelectedIndexOutbound);
                    break;
                case 'return':
                    this.fareSelectedIndexReturn = info.selectedFare;
                    this.priceOfferSelected = this.slices.flightsReturns[this.sliceSelectedIndexReturn].cabins[this.cabinSelectedIndexReturn].fareFamilies[this.fareSelectedIndexReturn].offers[0].price.total;
                    this.modelTotalPrice.totalPrice = this.priceOfferSelected;
                    this.$scope.$broadcast('changeOnTotalPrice', true);
                    this.totalPriceDone = true;
                    this.MmBUtilsSharedService.updateQuadrigam(quadrigam, process);
                    // this.MmBDataLayerService.createSelectItemEvent(this.returnFlightSelectedInfo, this.cabinSelectedIndexReturn, this.fareSelectedIndexReturn);
                    break;
        }
        this.updateOriginDestinyTitles();
    }

    updateOriginDestinyTitles = () => {
        if(this.outboundFlightSelected) {
            this.titleOutwardOrigin = this.outboundFlightSelectedInfo.segments[0].departurePlaceName;
            this.titleOutwardDestiny = this.outboundFlightSelectedInfo.segments.length > 1 ? this.outboundFlightSelectedInfo.segments[this.outboundFlightSelectedInfo.segments.length -1].arrivalPlaceName : this.outboundFlightSelectedInfo.segments[0].arrivalPlaceName;
        }
        if (this.returnFlightSelectedInfo) {
            this.titleReturnOrigin = this.returnFlightSelectedInfo.segments[0].departurePlaceName;
            this.titleReturnDestiny = this.returnFlightSelectedInfo.segments.length > 1 ? this.returnFlightSelectedInfo.segments[1].arrivalPlaceName : this.returnFlightSelectedInfo.segments[0].arrivalPlaceName;
        }
    }

    /**
     * Make the request to the transformer to obtain a transformed slice.
     * @param {Object} slice information of slice.
     * @returns {Object} slice transformed.
     */
    getInfo = (slice) => {
        const info = this.SimulatorBookingAvailabilityTransformer.getInfo(slice);
        return info;
    }

    /**
     * Make the request to the transformer to obtain a transformed collection of segments.
     * @param {Object} segments information of segments.
     * @returns {Object} segments transformed.
     */
    getSegments = (segments) => {
        const segment = this.SimulatorBookingAvailabilityTransformer.getSegments(segments);
        return segment;
    }

    deployFareContainer = (evt, data) => {
        this.selectedItem = data.offerIndex;
    }

    /**
     * Apply a kind of sort to the round trip slices based on the information received.
     * @param {Object} event received event of another component.
     * @param {Object} info information of type filter and destiny slice.
     */
    typeFilter = (event, info) => {
        if (info.typeFlight === 'outbound') {
            this.slices.flightsOutward = this.SimulatorBookingAvailabilityTransformer.getOrderSlices(info, this.slices.flightsOutward);
        } else {
            this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.getOrderSlices(info, this.slices.flightsReturns);
        }
    }

    private isUnifiedWarningType = (index, dataAvailability, undoMovement):boolean => {
        return (index === 'OD2' && this.localStorageService.get('unifiedOfferType') && dataAvailability.flowType !== this.localStorageService.get('unifiedOfferType') && !undoMovement);
    };

    private handleChannelDirect = (phoneCallCenter, error) => {
        if(this.channelDirect) {
            phoneCallCenter = this.getPhoneCallCenter();
            error.message = this.$filter('translate')('MMB_FLEX_REBOOK_ERROR_MESSAGE');
            error.message +=  ' ' + phoneCallCenter;
        }else {
            error.message = this.$filter('translate')('TRAVEL_AGENCY_MESSAGE');
        }
    };

    private handleChangeSelectedSlide = ({index, flightsObject, eventInfo, isUnified, newDataAvailability, strategy, undoMovement, phoneCallCenter, prevSlide, updatedModel}) => {
        switch (index) {
            case 'OD1':
                this.model.currentOriginDestinationIndex = 0;
                break;
            case 'OD2':
                this.model.currentOriginDestinationIndex = 1;
                break;
            default:
                break;
        };

        for (let i = 0; i < this.flights.length; i++) {
            this.model.originDestinations[i] = angular.extend(this.model.originDestinations[i], this.flights[i]);
        }
        this.dates = this.SimulatorAvailabilityTransformer.changeFlightsData(index, eventInfo, this.flights.flights, this.model.originDestinations, this.modeFlight);
        flightsObject = {
            flights: this.dates
        };
        if (isUnified) {
            this.newSisterCities = this.localStorageService.get('newSisterCitiesModelData');
            this.sisterCitiesOptionChecked = this.localStorageService.get('showSisterCitiesPossibility');
            newDataAvailability = this.SimulatorAvailabilityOrchestrator.getAvailabilityRequest(strategy, flightsObject.flights, this.localStorageService.get('flowId'), this.newSisterCities && this.sisterCitiesOptionChecked, this.newSisterCities, null);
        }else {
            newDataAvailability = this.SimulatorAvailabilityOrchestrator.getAvailabilityRequest(strategy, flightsObject, this.localStorageService.get('flowId'), false, null, this.modeFlight);
        }
        //newDataAvailability = VoluntaryChangesTransformer.searchFlights(flightsObject, this.modeFlight);
        this.showLoading = true;

        let paramsHandleAvailability = {index, newDataAvailability, strategy, undoMovement, phoneCallCenter, prevSlide};
        this.handleAvailability(paramsHandleAvailability);

        if (this.modeFlight === 'twice') {
            updatedModel = this.updateLimitsCalendarData(this.model, eventInfo);
            for (let k = 0; k < updatedModel.originDestinations.length; k++) {
                this.flights[k] = {
                    calendarData: updatedModel.originDestinations[k].calendarData,
                    checked: updatedModel.originDestinations[k].checked,
                    index: updatedModel.originDestinations[k].index,
                    initialSlideIndex: updatedModel.originDestinations[k].currentInitialSlide
                };
            }
        }
        this.model.originDestinations[this.model.currentOriginDestinationIndex].loadingAvailability = true;
    };

    private handleAvailability = ({index, newDataAvailability, strategy, undoMovement, phoneCallCenter, prevSlide}) => {
        this.SimulatorAvailabilityOrchestrator.availability(strategy,newDataAvailability,true).then((dataAvailability) => {
            if (this.isUnifiedWarningType(index, dataAvailability, undoMovement)) {
                this.MmBModalService.showGenericModal(false, 'ib-modal-unified-warning-type.html', { data : this.localStorageService.get('unifiedOfferType') }, null).result.then(() => {
                    this.removeStateFlight('outbound');
                }, () => this.showLoading = false);
            }else{
                this.unifiedOfferType = dataAvailability.flowType;
                this.localStorageService.set('unifiedOfferType',dataAvailability.flowType);
                this.$scope.$emit('changeDataAvailability', {
                    data: dataAvailability,
                    modeFlight: this.modeFlight,
                    penalty: this.model.penalty
                });
                this.showLoading = false;
                this.initializeDatalayer();
            }
        }, (error) => {
            if (index === 'OD1') {
                this.offersAvailableOutbound = false;
            } else {
                this.offersAvailableReturn = false;
            }
            
            if(error.internalErrorCode === 'SSE_AVM_18012') {
                error.title = this.$filter('translate')('SORRY_ERROR');
                this.handleChannelDirect(phoneCallCenter, error);
            }else if(error.internalErrorCode === 'SSE_AVM_18011') {
                error.title = this.$filter('translate')('MODAL_ERROR_TITLE');
                phoneCallCenter = this.getPhoneCallCenter();
                error.message = this.$filter('translate')('ERROR_MMB_001', { phoneCallCenter: phoneCallCenter });
            } else {
                error.message = this.$filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH');
            }
            if (error.internalErrorCode !== "SSE_AVM_12001") {
                this.MmBModalService.showGenericError(error, null, null).result.then( () => {
                    this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[this.quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[this.quadrigam], this.quadrigam);
                    // Return to previous availability search in case of availability error.
                    this.$scope.$broadcast('setSlide', {'slide': prevSlide, 'index': index});
                }, angular.noop);
            }
            this.showLoading = false;
            this.initializeDatalayer();
        });
    };


    /**
     * Configure variables related to the ribbon calendar and the selected flights when they are changed.
     * @param {Object} event received event of another component.
     * @param {Object} eventInfo information of new dates of flights.
     * @param {string} index Type of flight selected.
     */
    changeSelectedSlide = (event, eventInfo, index, prevSlide) => {
        let updatedModel, newDataAvailability, flightsObject, undoMovement = false, phoneCallCenter;
        const isUnified = this.localStorageService.get('isUnifiedFlow');
        const strategy = isUnified ?new this.AvailabilityClass.UnifiedStrategy().getAvailability():new this.AvailabilityClass.VoluntaryStrategy().getAvailability();
        this.changeSelectedIndex(index);
        if (this.model) {
            let paramsHandleChangeSelectedSlide = {index, flightsObject, eventInfo, isUnified, newDataAvailability, strategy, undoMovement, phoneCallCenter, prevSlide, updatedModel};
            this.handleChangeSelectedSlide(paramsHandleChangeSelectedSlide);
        }
        this.$scope.$broadcast('changeCurrentSelectedIndex', this.selectedIndex);

        for (let j = 0; j < this.selectedSlide.length; j++) {
            if (this.selectedSlide[j].index === index) {
                this.selectedSlide[j].date = eventInfo;
            }
        }
    };

    /**
     * Transforms the CallCenter number
     * @return {String} CallCenter number
     */
    getPhoneCallCenter = () => {
        const phonesList =  this.localStorageService.get('phonesList');
        let phoneNumber;

        if (phonesList && phonesList.RESERVAS) {
            phoneNumber = phonesList.RESERVAS.prefix + ' ' + phonesList.RESERVAS.telephone;
        }
        return phoneNumber;
    }
    /**
     * Update the current controller model with the received one and configure variables related to this change.
     * @param {Object} event received event of another component.
     * @param {Object} model information used to update the model.
     */
    updateAvailability = (event, model) => {
        const unifiedOfferType = this.localStorageService.get('unifiedOfferType');
        this.model = model;
        if (this.modeFlight !== 'return') {
            this.slices.flightsOutward = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[0]);
            this.offersAvailableOutbound = this.slices.flightsOutward.some((element) => {
                return element.visibility === true;
            });
            this.$scope.$broadcast('cleanFilter', true);
            this.entryFiltersFirstTimeOutBound = true;
            this.modelfilterOutBound = this.getModelfilterOutBound();
            if (this.offertOutboundSelected) {
                this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.SimulatorAvailabilityTransformer.getDataAvailabilityTransformedReturns(this.offertOutboundSelected), this.typeFlightIndex[1]);
                this.offersAvailableReturn = this.slices.flightsReturns.some((element) => {
                    return element.visibility === true;
                });
                this.$scope.$broadcast('cleanFilter', true);
                this.entryFiltersFirstTimeReturn = true;
                this.modelfilterReturn = this.getModelfilterReturn();
            }
        } else {
            if (this.localStorageService.get('isUnifiedFlow')) {
                if (unifiedOfferType === 'VOLUNTARY_CHANGE') {
                    this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[1]);
                } else if (unifiedOfferType === 'INVOLUNTARY_CHANGE') {
                    this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[0]);
                }
            } else {
                this.slices.flightsReturns = this.SimulatorBookingAvailabilityTransformer.init(this.model, this.typeFlightIndex[1]);
            }
            this.offersAvailableReturn = this.slices.flightsReturns.some((element) => {
                return element.visibility === true;
            });
            this.$scope.$broadcast('cleanFilter', true);
            this.entryFiltersFirstTimeReturn = true;
            this.modelfilterReturn = this.getModelfilterReturn();
        }
        if (!this.modelTotalPrice) {
            this.modelTotalPrice = this.getModelTotalPrice(this.model);
        }
        this.initializeDatalayer();
    }

    /**
     * Check if the current calendar info data of origin destinations needs to be updated because of limits modification
     * @param {Object} model the current availability model state
     * @param {Object} eventInfo the event information when change availability is requested
     * @return the model updated with the new calendar info
     */
    updateLimitsCalendarData = (model, eventInfo) => {
        const nextOrigin = model.originDestinations[model.currentOriginDestinationIndex + 1];
        const prevOrigin = model.originDestinations[model.currentOriginDestinationIndex - 1];
        if (nextOrigin && nextOrigin.calendarData && eventInfo) {
            this.changeBottomLimit(nextOrigin.calendarData, eventInfo.serviceDate);
            model.originDestinations[model.currentOriginDestinationIndex + 1] = nextOrigin;
        }
        if (prevOrigin && prevOrigin.calendarData) {
            this.changeUpperLimit(prevOrigin.calendarData, eventInfo.serviceDate);
            model.originDestinations[model.currentOriginDestinationIndex - 1] = prevOrigin;
        }
        return model;
    }

    private changeBottomLimit = (calendarData, newLimitDate) => {
        let index, slidePosition, minDate = new Date(newLimitDate),
            currentDate, offsetPosition = 0;
        const removedSlides = calendarData.slides.splice(0, calendarData.selectedSlide);
        for (index = 0; index < this.SimulatorBookingAvailabilityConstants.daysAfter; index++) {
            removedSlides.shift();
        }
        currentDate = new Date(calendarData.slides[0].serviceDate);
        currentDate.setTime(currentDate.getTime() - this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
        index = removedSlides.length - 1;
        while (currentDate.getTime() >= minDate.getTime() && index >= 0) {
            calendarData.slides.unshift(removedSlides[index]);
            currentDate.setTime(currentDate.getTime() - this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            index--;
        }
        slidePosition = calendarData.slides[0].slidePosition;
        while (currentDate.getTime() >= minDate.getTime()) {
            slidePosition--;
            calendarData.slides.unshift(this.generateSlidesInfo(currentDate, this.SimulatorBookingAvailabilityConstants.SLICK_STATUS.LOADING, slidePosition));
            currentDate.setTime(currentDate.getTime() - this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
        }
        for (index = 0; index < this.SimulatorBookingAvailabilityConstants.daysAfter; index++) {
            slidePosition--;
            calendarData.slides.unshift(this.generateSlidesInfo(currentDate, this.SimulatorBookingAvailabilityConstants.SLICK_STATUS.DISABLED, slidePosition));
            currentDate.setTime(currentDate.getTime() - this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
        }
        offsetPosition = calendarData.slides[0].slidePosition;
        for (index = 0; index < calendarData.slides.length; index++) {
            calendarData.slides[index].slidePosition -= offsetPosition;
        }
        calendarData.selectedSlide -= offsetPosition;
        calendarData.currentInitialSlide = calendarData.selectedSlide;
        calendarData.currentSlides = calendarData.slides.slice(calendarData.selectedSlide - 3, calendarData.selectedSlide + 4);
        calendarData.slides[0].firstItem = true;
    }

    private changeUpperLimit = (calendarData, newLimitDate) => {
        let index, slidesLength = calendarData.slides.length,
            maxDate = new Date(newLimitDate),
            currentDate;
        const removedSlides = calendarData.slides.splice(calendarData.selectedSlide + 1, slidesLength);
        for (index = 0; index < this.SimulatorBookingAvailabilityConstants.daysAfter; index++) {
            removedSlides.pop();
        }
        if (removedSlides.length > 0) {
            removedSlides[removedSlides.length - 1].state = this.SimulatorBookingAvailabilityConstants.SLICK_STATUS.LOADING;
        }

        slidesLength = calendarData.slides.length;
        currentDate = new Date(calendarData.slides[slidesLength - 1].serviceDate);
        currentDate.setTime(currentDate.getTime() + this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
        index = 0;
        while (currentDate.getTime() <= maxDate.getTime() && index < removedSlides.length) {
            calendarData.slides.push(removedSlides[index]);
            currentDate.setTime(currentDate.getTime() + this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            index++;
            slidesLength++;
        }
        while (currentDate.getTime() <= maxDate.getTime()) {
            calendarData.slides.push(this.generateSlidesInfo(currentDate, this.SimulatorBookingAvailabilityConstants.SLICK_STATUS.LOADING, slidesLength));
            currentDate.setTime(currentDate.getTime() + this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            slidesLength++;
        }
        for (index = 0; index < this.SimulatorBookingAvailabilityConstants.daysAfter; index++) {
            calendarData.slides.push(this.generateSlidesInfo(currentDate, this.SimulatorBookingAvailabilityConstants.SLICK_STATUS.DISABLED, slidesLength));
            currentDate.setTime(currentDate.getTime() + this.SimulatorBookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            slidesLength++;
        }
        calendarData.currentInitialSlide = calendarData.selectedSlide;
        calendarData.currentSlides = calendarData.slides.slice(calendarData.selectedSlide - 3, calendarData.selectedSlide + 4);
        calendarData.slides[slidesLength - 1].lastItem = true;
    }

    /**
     * Creates an slide object for the slick carousel
     * @param {Date} dateObject the slide date object
     * @param {String} status the status for the new slide
     * @return {Object} the slide object with the necessary information for slick carousel
     */
    generateSlidesInfo = (dateObject, status, slidePosition) => {
        const dateString = this.$filter('date')(dateObject, 'yyyy-MM-dd');
        return {
            serviceDate: dateString,
            slidePosition: slidePosition,
            date: this.$filter('DateFormatFilter')(dateString),
            state: status
        };
    }

    /**
     * Modify the selectedIndex variable of the controller based on the information received.
     * @param {String} index Type of flight.
     */
    changeSelectedIndex = (index) => {
        switch (index) {
                case 'OD1':
                    this.selectedIndex = 'OD2';
                    break;
                case 'OD2':
                    this.selectedIndex = 'OD1';
                    break;
                default:
                    break;
        }
    }

    /**
     * Make the request to the transformer to obtain a transformed model of filter.
     * @returns {Object} model of filter transformed.
     */
    getModelfilterReturn = () => {
        return this.SimulatorBookingAvailabilityTransformer.getModelfilter(this.slices.flightsReturns);
    }

    /**
     * Make the request to the transformer to obtain a transformed model of filter.
     * @returns {Object} model of filter transformed.
     */
    getModelfilterOutBound = () => {
        return this.SimulatorBookingAvailabilityTransformer.getModelfilter(this.slices.flightsOutward);
    }

    /**
     * Make the request to the transformer to obtain a transformed model of total price.
     * @returns {Object} model of total price transformed.
     */
    getModelTotalPrice = (model) => {
        return this.SimulatorBookingAvailabilityTransformer.getTotalPrice(model);
    }

    /**
     * Collect the selected information and make the request to the FareReshop service, saving the response in the local storage.
     */
    acceptAvailability = () => {
        let offer, offerId, offerItemsIds = [], originDestinations = [], request, strategy;
        switch (this.modeFlight) {
                case 'twice':
                    offer = this.slices.flightsReturns[this.sliceSelectedIndexReturn].cabins[this.cabinSelectedIndexReturn].fareFamilies[this.fareSelectedIndexReturn].offers[0];
                    // this.MmBDataLayerService.createAddToCartItemEvent(this.outboundFlightSelectedInfo, this.cabinSelectedIndexOutbound, this.fareSelectedIndexOutbound);
                    // this.MmBDataLayerService.createAddToCartItemEvent(this.returnFlightSelectedInfo, this.cabinSelectedIndexReturn, this.fareSelectedIndexReturn);
                    break;
                case 'outbound':
                    offer = this.slices.flightsOutward[this.sliceSelectedIndexOutbound].cabins[this.cabinSelectedIndexOutbound].fareFamilies[this.fareSelectedIndexOutbound].offers[0];
                    // this.MmBDataLayerService.createAddToCartItemEvent(this.outboundFlightSelectedInfo, this.cabinSelectedIndexOutbound, this.fareSelectedIndexOutbound);
                    break;
                case 'return':
                    offer = this.slices.flightsReturns[this.sliceSelectedIndexReturn].cabins[this.cabinSelectedIndexReturn].fareFamilies[this.fareSelectedIndexReturn].offers[0];
                    // this.MmBDataLayerService.createAddToCartItemEvent(this.returnFlightSelectedInfo, this.cabinSelectedIndexReturn, this.fareSelectedIndexReturn);
                    break;
        }
        offerId = offer.offerId;
        offer.offerItems.forEach((elem) => {
            offerItemsIds.push(elem.offerItemId);
        });
        offer.originDestinations.forEach((elem) => {
            originDestinations.push({
                originDestinationId: elem.originDestinationId,
                selectedSliceId: elem.applicableSlices[0].sliceId
            });
        });
        request = {
            responseId: this.model.responseId || this.localStorageService.get('vcAvailability').responseId,
            offerId: offerId,
            offerItemIds: offerItemsIds,
            originDestinations: originDestinations
        };
        if (this.localStorageService.get('isUnifiedFlow')) {
            strategy = new this.FareClass.FareUnifiedStrategy();
        } else {
            strategy = new this.FareClass.FareDefaultStrategy();
        }
        this.SimulatorFareOrquestator.callFare(strategy.getFare())(request).then(this.fareSuccess).catch(this.fareError);
    }

    fareSuccess = (data) => {
        this.MmBModalService.finishWaiting();
        if(this.localStorageService.get('isUnifiedFlow')) {
            this.localStorageService.set('flowApp', 'MMBUNIF');
        } else {
            this.localStorageService.set('flowApp', 'MMBVC');
        }
        this.localStorageService.set('fareData', data);
        this.localStorageService.set('orderItemsId', [data.offers[0].offerId]);
        this.localStorageService.set('fareFamilyConditionsInfo', data.fareFamilyConditions);
        this.localStorageService.set('cashAviosPossibilities', data.offers[0].cashAviosPossibilities);
        this.localStorageService.set('bestFare', this.best);
        this.localStorageService.set('modeFlight', this.modeFlight);
        this.toSummaryView = this.$rootScope.$broadcast('toSummaryView', true);
    }

    fareError = (error) => {
        var quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_ERROR_FARE;
        // this.CommonsUtilService.setTitlePage('FLIGHT_FARE_ERROR_TITLE');
        this.initializeDatalayer(quadrigam);
        this.MmBModalService.finishWaiting();
        this.MmBModalService.showGenericError(error, null, null).result.then(() => {}, angular.noop);
    }

    openSisterCity = (index) => {
        const sisterModalObject: any = {};
        sisterModalObject.newSisterCities = this.newSisterCities;

        this.newSisterCities.disruptedSlices.filter((sliceId) => {
            return this.newSisterCities[sliceId].index === index;
        }).map((slice)=>{
            sisterModalObject.sisTripSliceId = slice;
            return slice;
        });
        sisterModalObject.newSisterCities.referenceSliceId = sisterModalObject.sisTripSliceId;
        this.MmBModalService.showGenericModal(false, 'ib-modal-sister-cities.html', sisterModalObject, null).result.then(() => {
            this.MmBUtilsSharedService.updateSisterCitiesModel(sisterModalObject.newSisterCities);
            this.newSisterCities = sisterModalObject.newSisterCities;
            this.localStorageService.set('newSisterCitiesModelData', sisterModalObject.newSisterCities);
            this.setSisterCitiesLiteral();
            if(this.localStorageService.get('isUnifiedFlow')) {
                let slideIndex = null;
                if(index === 0) {
                    slideIndex = 'OD1';
                } else if (index === 1) {
                    slideIndex = 'OD2';
                }
                this.$scope.$emit('slideSelected', this.model.selectedSlice[index].date, slideIndex, this.model.selectedSlice[index].date);
            } else {
                this.$scope.$emit('newDateSalected');
            }
        }, ()=>  {
        });
    }

    setSisterCitiesLiteral = () => {
        this.newSisterCities.disruptedSlices.map((sliceId) => {
            this.sisterInfo.push({});
            return sliceId;
        }).map((sliceId)=> {
            this.sisterInfo[this.newSisterCities[sliceId].index].origin = this.newSisterCities[sliceId].origin.originOrderCities.description +
                (this.newSisterCities[sliceId].originSisterCitiesNum ? ' ' + this.newSisterCities[sliceId].originSisterCitiesNum: '');
            this.sisterInfo[this.newSisterCities[sliceId].index].destination = this.newSisterCities[sliceId].destination.destinationOrderCities.description +
                (this.newSisterCities[sliceId].destinationSisterCitiesNum ? ' ' + this.newSisterCities[sliceId].destinationSisterCitiesNum: '');
            return sliceId;
        });
    }
}
