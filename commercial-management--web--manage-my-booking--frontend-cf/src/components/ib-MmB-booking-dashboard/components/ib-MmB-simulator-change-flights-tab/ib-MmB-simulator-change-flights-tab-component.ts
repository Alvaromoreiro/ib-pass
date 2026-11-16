import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import angular from 'angular';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SimulatorAvailabilityTransformer } from '../ib-MmB-simulator-availability/transformers/ib-MmB-simulator-availability-transformer';
dayjs.extend(duration);

@Component(
    'ib-MmB-simulator-change-flights-tab-module',
    'ibMmbSimulatorChangeFlightsTabComponent',
    {
        controllerAs: 'simulatorChangeFlightsTabCtrl',
        templateUrl: [
            'MmBAppConstants',
            MmBAppConstants => {
                return MmBAppConstants.templatesRoute + 'ib-MmB-simulator-change-flights-tab-view.html';
            },
        ],
        bindings: {
            flightsInfo: '<',
            flags: '<',
            blackOutDates: '<',
            flexibilizationRange: '<',
            orderItems: '<',
        },
    },
    [
        '$scope',
        '$rootScope',
        'MmBModalService',
        'localStorageService',
        '$filter',
        'MmBUtilService',
        'MmBAppConstants',
        'MmBDatalayerUtilsService',
        'BookingDashboardConstants',
        'IbFlexFlexibilizationTransformer',
        'SimulatorAvailabilityTransformer',
        'SimulatorVoluntaryChangesService',
        '$window',
        'VoluntaryChangesLogService'
    ],
    []
)
export class ibMmbSimulatorChangeFlightsTabComponent {
    flightsInfo;
    flags;
    blackOutDates;
    flexibilizationRange;
    orderItems;

    disableChange;
    reshopConditions;
    localFlags = {};
    message = '';
    isRedemption = false;
    linkToRubiQ = '';
    isEmptyBasket = false;

    model;
    numberFlights;
    quadrigam;
    slicesId;
    flightsAvailable;
    bookingInfo;
    phonesList;
    isFlex;
    isDigital;
    flightsMenssage;

    searchAvailable;
    steps = [];
    totalSteps = 2;

    routeDatepicker;
    dateOptions;
    timeRangeOptions = [
        { name: this.$filter('translate')('MMB_SVC_FLIGHT_SCHEDULE_INDIFERENT')},
        { name: '08:00 - 15:00' },
        { name: '16:00 - 24:00' },
        { name: '01:00 - 07:00' },
    ];
    timeRangeSelected = this.timeRangeOptions;
    penalty: {};

    filterRangeParsed = {
        outbound: {
            departure: {}
        },
        return: {
            departure: {}
        }
    };
    linkManagementFees: string = '';

    constructor(
        private $scope,
        private $rootScope,
        private MmBModalService,
        private localStorageService,
        private $filter,
        private MmBUtilService,
        private MmBAppConstants,
        private MmBDatalayerUtilsService,
        private BookingDashboardConstants,
        private IbFlexFlexibilizationTransformer,
        private SimulatorAvailabilityTransformer: SimulatorAvailabilityTransformer,
        private SimulatorVoluntaryChangesService,
        private $window,
        private VoluntaryChangesLogService
    ) {
        this.disableChange = this.$rootScope.$on('childRebookUpdate', this.processRebookFailed);
        $scope.$on('destroy', this.disableChange);
        this.$rootScope.$on('updateBasket', this.getIsEmptyBasket);
    }

    $onInit = () => {
        this.linkManagementFees = '*' + this.generateFeesUrl();
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        this.reshopConditions = this.localStorageService.get('reshopConditions');
        this.routeDatepicker = this.MmBAppConstants.templatesRoute + 'ib-mmb-datepicker.html';
        this.MmBModalService.showWaitingModal();
        this.model = {};
        this.numberFlights = 0;
        this.quadrigam = null;
        this.slicesId = [];
        this.flightsAvailable = { number: 0, slices: [] };
        this.model.disruptionPeriodsData = this.localStorageService.get('disruptionPeriodsInfo');
        this.phonesList = this.localStorageService.get('phonesList') || null;
        this.isFlex = this.bookingInfo.flexibilizationCapabilitiesInformation;
        this.isDigital = !this.bookingInfo.flexibilizationCapabilitiesInformation;
        if (this.phonesList && this.phonesList.RESERVAS) {
            this.message = this.$filter('translate')('MMB_VC_INFO_COSTUME_SERVICE_CALL');
            this.message = this.message.replace(
                /\*/g,
                this.phonesList.RESERVAS.prefix + ' ' + this.phonesList.RESERVAS.telephone
            );
        }

        this.initializeData();
        this.dateOptions = {
            showWeeks: false,
            maxMode: 'day',
            minDate: dayjs(),
            maxDate: dayjs().add(365, 'day'),
        };

        this.initializeDates();
        this.flags.dateLimit = {};
        this.flags.dateLimit.channel = this.bookingInfo.channel;
        this.flags.dateLimit.verifyDate = this.MmBUtilService.orderItemContained(
            this.bookingInfo.order.orderItems,
            this.MmBAppConstants.ORDER_ITEMS_TYPE_TO_AVOID
        );
        this.quadrigam = this.generateQuadrigam();
        this.MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS[this.quadrigam],
            MMBDatalayerConstants.DIGITAL_DATA_STEP[this.quadrigam],
            this.quadrigam
        );
        this.VoluntaryChangesLogService.getVoluntaryChangesLog();
        this.MmBModalService.finishWaiting();
        this.getIsEmptyBasketController();
        this.MmBModalService.showGenericModal(true, 'ib-MmB-modal-simulator.html', this.BookingDashboardConstants.SAVE_ACCEPT_LITERALS, null);
        this.penalty = this.getPenaltyForSlice();
    }

    private getPenaltyForSlice = () => {
        let penalties = {
            outbound: false,
            return: false
        };

        for (let i = 0; i < this.slicesId.length; i++) {
            const sliceId = this.slicesId[i];
            const flight = this.flightsInfo.flights[sliceId];
            let hasPenalty = false;

            if (flight && flight.segments) {
                const segment = flight.segments[0];
                if (segment.fareFamilyConditions) {
                    segment.fareFamilyConditions.forEach(condition => {
                        if (condition.code === 'CAMBIO' && condition.units > 0) {
                            hasPenalty = true;
                        }
                    });
                }
            }

            if (i === 0) {
                penalties.outbound = hasPenalty;
            } else if (i === 1) {
                penalties.return = hasPenalty;
            }
        }

        return penalties;
    };

    initializeDates() {
        this.slicesId = [];
        this.numberFlights = 0;

        if (!this.flightsInfo || !this.flightsInfo.flights) {
            return;
        }


        for (const sliceId in this.flightsInfo.flights) {
            if (Object.prototype.hasOwnProperty.call(this.flightsInfo.flights, sliceId)) {
                if (this.numberFlights > 0) {
                    if (
                        new Date(this.flightsInfo.flights[sliceId].departureDateParsed.originalDate) <
                        new Date(this.flightsInfo.flights[this.slicesId[0]].departureDateParsed.originalDate)
                    ) {
                        this.slicesId[1] = this.slicesId[0];
                        this.slicesId[0] = sliceId;
                    } else {
                        this.slicesId[1] = sliceId;
                    }
                } else {
                    this.slicesId[0] = sliceId;
                }
                this.numberFlights++;
            }
        }

        for (let i = 0; i < this.numberFlights; i++) {
            const flight = this.flightsInfo.flights[this.slicesId[i]];
            if (!flight) continue;

            flight.newDateSelected = null;
            flight.dateOptions = angular.copy(this.dateOptions);
            flight.timeRangeSelected = this.timeRangeOptions[0];


            if (i === 1) {
                flight.dateOptions.initDate = new Date(flight.departureDateParsed.originalDate);

                if (
                    new Date(flight.dateOptions.minDate) <
                    new Date(this.flightsInfo.flights[this.slicesId[i - 1]].departureDateParsed.originalDate)
                ) {
                    flight.dateOptions.minDate = new Date(
                        this.flightsInfo.flights[this.slicesId[i - 1]].departureDateParsed.originalDate
                    );
                }

                this.flightsInfo.flights[this.slicesId[i - 1]].dateOptions.maxDate = new Date(
                    flight.departureDateParsed.originalDate
                );
            }
        }
        this.searchAvailable = true;
    }

    changeDate(index: number) {
        if (!this.slicesId[index]) {
            return;
        }

        const sliceId = this.slicesId[index];
        const flight = this.flightsInfo.flights[sliceId];

        if (!flight) {
            return;
        }

        const todayDate = new Date();

        if (this.numberFlights > 1) {
            if (index === 0) {
                const initDate = new Date(flight.newDateSelected);

                this.flightsInfo.flights[this.slicesId[index + 1]].dateOptions.minDate = initDate;
                this.flightsInfo.flights[this.slicesId[index + 1]].dateOptions.initDate =
                    initDate > todayDate ? initDate : todayDate;

                const returnFlight = this.flightsInfo.flights[this.slicesId[index + 1]];
                if (returnFlight.newDateSelected) {
                    const returnDate = new Date(returnFlight.newDateSelected);
                    if (
                        initDate.getMonth() !== returnDate.getMonth() ||
                        initDate.getDate() > returnDate.getDate()
                    ) {
                        returnFlight.newDateSelected = null;
                    }
                }
            } else if (index === 1) {
                this.flightsInfo.flights[this.slicesId[0]].dateOptions.maxDate = new Date(
                    flight.newDateSelected
                );
            }
        }
        flight.parseNewDateSelected = this.transformerDateSelected(flight.newDateSelected);

        if (flight.newDateSelected) {
            flight.checked = true;
        }
    }

    transformerDateSelected(date) {
        if (!date) return null;
        return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            weekDay: date.getDay(),
        };
    }

    anyDateSelected() {
        for (const sliceId of this.slicesId) {
            const flight = this.flightsInfo.flights[sliceId];
            if (flight.newDateSelected) {
                return true;
            }
        }
        return false;
    }

    private initializeData = () => {
        angular.forEach(this.flightsInfo.flights, (flight, sliceId) => {
            flight.checked = false;
            flight.parseNewDateSelected = null;
            this.slicesId.push(sliceId);
            if (
                this.reshopConditions &&
                this.reshopConditions.simulatedChanges &&
                this.reshopConditions.simulatedChanges.enabled &&
                this.reshopConditions.simulatedChanges.slices
            ) {
                this.reshopConditions.simulatedChanges.slices.forEach(slice => {
                    if (slice.sliceId === sliceId && slice.enabled) {
                        this.flightsAvailable.slices.push(sliceId);
                        this.flightsAvailable.number++;
                    }
                });
            }
            this.numberFlights++;
        });

        this.model.blackOutDates = {
            blackOutPeriods: [],
            maxDate: dayjs().add(360, 'day'),
            allowedPeriods: [],
        };

    };

    getConditionText = (condition: { message: string }) => {
        if (!condition?.message) {
            return '';
        }

        const separator = condition.message.includes('.') ? '.' : ',';

        const [firstPart = '', secondPart = ''] = condition.message
            .split(separator)
            .map(part => part.trim())
            .filter(Boolean);
        const messageParts = {
            main: firstPart ? firstPart : '',
            additional: secondPart || ''
        };
        return messageParts;
    };

    /**
     * This functions open a modal with all information about fare family flight's. This only available to Voluntary change.
     * In flexibilization change this is not available.
     * @param {Object} fareFamilyInfo All information about fareFamily and conditions.
     *  */
    openFareModal = fareFamilyInfo => {
        angular.extend(fareFamilyInfo, {
            idModal: 'ib-compare-fares-modal',
        });
        this.MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', {
            selectedFareInfo: fareFamilyInfo,
        }).result.then(angular.noop, angular.noop);
    };

    /**
     * This function update the datalayer with the quadrigam view. This function is execute when availability-flex service
     * return any error and the user accept close modal.
     * @param {event} restarQuadrigam Is the event that launch the function
     *  */
    private addQuadrigam() {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS[this.quadrigam],
            MMBDatalayerConstants.DIGITAL_DATA_STEP[this.quadrigam],
            this.quadrigam
        );
    }

    private processRebookFailed = event => {
        this.$scope.$emit('changeTabEvent', this.BookingDashboardConstants.TABS.management);
    };

    /**
     * This function generate quadrigam according flow (flexibilization or voluntary change)
     * @returns {String} quadrigam with code.
     *  */
    private generateQuadrigam() {
        let quadrigam = null;
        if (this.numberFlights === 1) {
            quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_SEARCH_ONEWAY;
            this.MmBDatalayerUtilsService.setProcessAndStep(
                MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],
                MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam],
                quadrigam
            );

        } else if (this.numberFlights === 2) {
            quadrigam = this.MmBAppConstants.QUADRIGAM.SIMULATOR_SEARCH_ROUNDTRIP;
            this.MmBDatalayerUtilsService.setProcessAndStep(
                MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],
                MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam],
                quadrigam
            );
        }

        return quadrigam;
    }



    getPhone = () => {
        return this.phonesList?.RESERVAS
            ? this.phonesList.RESERVAS.prefix + ' ' + this.phonesList.RESERVAS.telephone
            : null;
    };

    private getIsEmptyBasketController = () => {
        let headerModelLocal = this.localStorageService.get('headerModel');
        if (
            angular.isDefined(headerModelLocal.headerModel?.shoppingBasket?.total?.original)
                ? headerModelLocal.headerModel.shoppingBasket.total.original === 0
                : headerModelLocal.headerModel.shoppingBasket.total?.totalPrice === 0
        ) {
            this.isEmptyBasket = true;
        } else {
            this.isEmptyBasket = false;
        }
    };

    private getIsEmptyBasket = () => {
        let headerModelLocal = this.localStorageService.get('headerModel');
        if (
            angular.isDefined(headerModelLocal.headerModel?.shoppingBasket?.total?.original)
                ? headerModelLocal.headerModel.shoppingBasket.total.original === 0
                : headerModelLocal.headerModel.shoppingBasket.total?.totalPrice === 0
        ) {
            this.localStorageService.set('isEmptyBasket', true);
            this.isEmptyBasket = true;
        } else {
            this.localStorageService.set('isEmptyBasket', false);
            this.isEmptyBasket = false;
        }
    };

    deleteBasket = () => {
        this.MmBModalService.showEmptyBasketModal().result.then(() => {
            this.getIsEmptyBasket();
        }, angular.noop);
    };
    searchChangesFlights = () => {
        let availabilityRequest = null,
            dataByVC = {
                allSegments: this.flightsInfo.allSegments,
                flights: this.flightsInfo.flights,
            },
            modeFlight = null,
            dataModelRibbon = null,
            dataselectedSlide = [],
            index;
        let selectedDate, sliceId, originalDate, diffDate, modalBody, phoneList, phoneNumber;
        phoneList = this.localStorageService.get('phonesList');
        phoneNumber = phoneList
            ? phoneList[this.MmBAppConstants.WCS.PHONE_TYPES.SALES]?.prefix +
            phoneList[this.MmBAppConstants.WCS.PHONE_TYPES.SALES]?.telephone
            : null;

        if (this.flags.dateLimit.verifyDate) {
            for (sliceId in this.flightsInfo.flights) {
                if (this.flightsInfo.flights.hasOwnProperty(sliceId)) {
                    if (
                        this.flightsInfo.flights[sliceId].disrupted ||
                        this.flightsInfo.flights[sliceId].optionalEnabled
                    ) {
                        selectedDate = new Date(
                            this.flightsInfo.flights[sliceId].parseNewDateSelected.year,
                            this.flightsInfo.flights[sliceId].parseNewDateSelected.month,
                            this.flightsInfo.flights[sliceId].parseNewDateSelected.day
                        );
                        originalDate = new Date(
                            this.flightsInfo.flights[sliceId].departureDateParsed.year,
                            this.flightsInfo.flights[sliceId].departureDateParsed.monthNumber,
                            this.flightsInfo.flights[sliceId].departureDateParsed.day
                        );
                        diffDate = (selectedDate.getTime() - originalDate.getTime()) / (1000 * 3600 * 24);
                        if (diffDate > 365) {
                            modalBody = {
                                message:
                                    this.MmBAppConstants.COMMON_LABELS.CHANNEL[this.flags.dateLimit.channel].VALUE,
                                phone: this.MmBAppConstants.COMMON_LABELS.CHANNEL[this.flags.dateLimit.channel]
                                    .PHONE
                                    ? phoneNumber + '.'
                                    : '',
                            };
                            this.MmBModalService.showGenericInfoModal(
                                modalBody,
                                false,
                                'ib-modal-contact-callcenter'
                            ).result.then(() => { }, angular.noop);
                            return;
                        }
                    }
                }
            }
        }

        modeFlight = this.SimulatorVoluntaryChangesService.getModelFlighVC(
            dataByVC,
            this.slicesId,
            this.numberFlights
        );
        availabilityRequest = this.SimulatorAvailabilityTransformer.searchFlights(
            dataByVC,
            modeFlight
        );
        this.MmBModalService.showWaitingModal();
        this.SimulatorVoluntaryChangesService.getAvailability(availabilityRequest).then((availabilityResponseCV) => {
                dataModelRibbon = this.SimulatorAvailabilityTransformer.generateFlightsModelRibbon(
                    availabilityResponseCV.originDestinations,
                    dataByVC.flights
                );
                for (index = 0; index < dataModelRibbon.length; index++) {
                    dataselectedSlide[index] = {
                        date: dataModelRibbon[index].calendarData.slides[
                            dataModelRibbon[index].calendarData.selectedSlide
                        ],
                        index: dataModelRibbon[index].index,
                    };
                }
                availabilityResponseCV.modeFlight = modeFlight;
                dataModelRibbon.flights = dataByVC.flights;
                this.openModalVoluntaryChanges(
                    availabilityResponseCV,
                    dataModelRibbon,
                    dataselectedSlide,
                    this.penalty,
                    this.filterRangeParsed
                );
            },(error) => {
                var buildModel = [],
                    dataAvailability = {
                        modeFlight: [],
                        empty: false,
                        originDestinations: [],
                    };
                if (error.internalErrorCode !== 'noFares' && error.internalErrorCode !== 'SSE_AVM_13017' && error.internalErrorCode !== 'SSE_AVM_13018') {
                    buildModel = this.IbFlexFlexibilizationTransformer.getBuildModelVC(dataByVC.flights);
                    dataModelRibbon = this.SimulatorAvailabilityTransformer.generateFlightsModelRibbon(
                        buildModel,
                        dataByVC.flights
                    );
                    for (index = 0; index < dataModelRibbon.length; index++) {
                        dataselectedSlide[index] = {
                            date: dataModelRibbon[index].calendarData.slides[
                                dataModelRibbon[index].calendarData.selectedSlide
                            ],
                            index: dataModelRibbon[index].index,
                        };
                    }
                    dataAvailability.modeFlight = modeFlight;
                    dataAvailability.empty = true;
                    dataAvailability.originDestinations = buildModel;
                    dataModelRibbon.flights = dataByVC.flights;
                    this.openModalVoluntaryChanges(dataAvailability, dataModelRibbon, dataselectedSlide, this.penalty, this.filterRangeParsed);
                } else {
                    this.MmBModalService.finishWaiting();
                    this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.STCERD, MMBDatalayerConstants.DIGITAL_DATA_STEP.STCERD, this.MmBAppConstants.QUADRIGAM.SIMULATOR_SEARCH_ERROR);
                    this.MmBModalService.showGenericError(error).result.then(() => {
                        this.addQuadrigam();
                    }, angular.noop);
                }
            }
        );
        this.$window.scrollTo(0, 0);
    };

    private openModalVoluntaryChanges = (
        availabilityData,
        modelRibbonData,
        datesSelectedSlideData,
        penalty,
        filterRangeParsed
    ) => {
        this.localStorageService.remove('manualCloseVCModal');
        availabilityData.flightsLength = Object.keys(modelRibbonData.flights).length;
        this.MmBModalService.showVoluntaryChangeModal(
            false,
            'ib-MmB-simulator-availability-view.html',
            {
                availability: availabilityData,
                modelRibbon: modelRibbonData,
                selectedSlide: datesSelectedSlideData,
                penalty: penalty,
                filterRangeParsed: filterRangeParsed,
            },
            'ib-modals-full',
            'ibMmbSimulatorAvailabilityComponent'
        );
        this.MmBModalService.finishWaiting();
    };

    changeTimeRange = (index: number) => {
        const sliceId = this.slicesId[index];
        const flight = this.flightsInfo.flights[sliceId];

        if (!flight) return;

        const flightType = index === 0 ? 'outbound' : 'return';
        const timeRange = this.parseTimeRange(flight.timeRangeSelected.name);

        if (timeRange) {
            if (!this.filterRangeParsed[flightType]) {
                this.filterRangeParsed[flightType].departure = {};
            }

            this.filterRangeParsed[flightType].departure = {
                min: timeRange.min,
                max: timeRange.max
            };
        }
    };

    parseTimeRange = (rangeName: string) => {
        if (!rangeName || rangeName === 'Indiferente') {
            return null;
        }
        const [start, end] = rangeName.split(' - ').map(s => s.trim());
        const startHour = parseInt(start.split(':')[0], 10);
        const endHour = parseInt(end.split(':')[0], 10);
        return { min: startHour, max: endHour };
    };

    private generateFeesUrl = () => {
        const tagsInfo = {
            link: {
                tag: 'a',
                href: '#',
                target: '_blank',
                title: '',
                class: 'ib-link u-text-underline'
            }
        };
        let mainUrl, endPath, url;
        let market = this.$rootScope.appMarket.toLowerCase();
        let language = this.$rootScope.appLang.toUpperCase();
        mainUrl = this.$window.location.origin + `/${market}/`;
        endPath = this.MmBAppConstants.SIMULATOR_MANAGEMENT_FEES_ROUTES[language] ? this.MmBAppConstants.SIMULATOR_MANAGEMENT_FEES_ROUTES[language] : this.MmBAppConstants.SIMULATOR_MANAGEMENT_FEES_ROUTES['DEFAULT'];
        tagsInfo.link.href = mainUrl + endPath;
        url = this.$filter('literalFormatter')(this.$filter('translate')('MMB_SVC_DISCLAIMER'), tagsInfo);
        return url;
    };
}
