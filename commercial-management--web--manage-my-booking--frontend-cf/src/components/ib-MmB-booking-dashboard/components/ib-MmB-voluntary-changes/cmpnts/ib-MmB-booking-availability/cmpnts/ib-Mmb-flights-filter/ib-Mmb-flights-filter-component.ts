import angular from "angular";

@Component(
    'ib-Mmb-flights-filter-module',
    'ibMmbFlightsFilter',
    {
        controllerAs: 'flightsFilterCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-Mmb-flights-filter-view.html';
        }],
        bindings: {
            model: '=',
            configFilter: '=',
            typeFlight: '=',
        }
    },
    ['$filter', '$rootScope', '$scope', '$timeout', 'MmBModalService', 'CurrencyService', 'localStorageService'],
[])
export class FlightsDetailsController {

    model;
    configFilter;
    typeFlight;
    choosedFilter = '';
    filterReverse = true;
    filterTypeOld = null;
    filterData: any = {
        changes: false,
        company: false,
        fare: [],
        fareSelected: {},
        indexFormApis: '',
        rangeHoursArrival: {
            active: false
        },
        rangeHoursDeparture: {
            active: false
        },
        rangePrice: {
            active: false
        },
        scale: []
    };
    modifier = false;
    copyConfigModalModel: any = '';
    configModal: any = '';
    currency;
    listFlightFilterVC;
    selectedListFlightFilterVC;

    constructor(
        private $filter,
        private $rootScope,
        private $scope,
        private $timeout,
        private MmBModalService,
        private CurrencyService,
        private localStorageService) {
            this.$scope.$on('cleanFilter', this.cleanFilter);
            this.$scope.$on('cleanSortedSelection', this.cleanSortedSelection);
        }

    /**
     * Initialize the availability controller and its model calling the rest service for flights filter
     * @private
     */
    $onInit = () => {
        this.currency = this.localStorageService.get('currency');
        this.listFlightFilterVC = [
            { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME_TITLE', filterName: 'departureDateTime' },
            { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION_TITLE', filterName: 'duration' },
            { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE_TITLE', filterName: 'slicePrice' }
        ];
        this.selectedListFlightFilterVC = {};
        this.choosedFilter = '';
        this.filterReverse = false;
    }

    cleanFilter = (event, cleanExternal) => {
        this.filterData = {
            changes: false,
            company: false,
            fare: [],
            fareSelected: {},
            indexFormApis: '',
            rangeHoursArrival: {
                active: false
            },
            rangeHoursDeparture: {
                active: false
            },
            rangePrice: {
                active: false
            },
            scale: []
        };
        if(!cleanExternal){
            this.$scope.$emit('resetFilterDataModal',this.typeFlight);
        }
        this.modifier = false;
    }

    existFilters = () => {
        var item = angular.element('[data-filters-button]');
        if (item[0] && item[0].childElementCount === 2) {
            this.filterData.changes = false;
            this.modifier = false;
        }
    }

    deleteFilter = (name, numScale) => {
        if (angular.isNumber(numScale)) {
            this.filterData.scale.splice(numScale, 1);
        } else {
            delete this.filterData[name];
        }
        if (name === 'cabin') {
            this.copyConfigModalModel.fareSelected = this.configModal.fareSelected;
        } else if (angular.isNumber(numScale)) {
            this.copyConfigModalModel.scale[numScale] = this.configModal.scale[numScale];
        } else {
            this.copyConfigModalModel[name] = this.configModal[name];
        }
        this.existFilters();
        this.$scope.$emit('filterDataModal', {
            typeFlight: this.typeFlight,
            filter: this.filterData,
            model: this.configModal
        });
    }

    sendFilter = (data, model) => {
        var index;
        if (data.company) {
            if (data.company !== this.filterData.company) {
                this.filterData.company = data.company;
                this.filterData.changes = true;
            }
        }
        if (data.fareSelected.name) {
            if (data.fareSelected.name !== this.filterData.cabin) {
                this.filterData.cabin = {
                    'name': data.fareSelected.name
                };
                this.filterData.changes = true;
            }
        }
        if (data.rangeHoursArrival && data.rangeHoursArrival.min && data.rangeHoursArrival.max) {
            this.filterData.rangeHoursArrival = {
                'min': data.rangeHoursArrival.min,
                'max': data.rangeHoursArrival.max,
                active: true
            };
            this.filterData.changes = true;
            if (data.rangeHoursArrival.min === model.rangeHoursArrival.min && data.rangeHoursArrival.max === model.rangeHoursArrival.max) {
                this.filterData.rangeHoursArrival.active = false;
            }
        }
        if (data.rangeHoursDeparture && data.rangeHoursDeparture.min && data.rangeHoursDeparture.max) {
            this.filterData.rangeHoursDeparture = {
                'min': data.rangeHoursDeparture.min,
                'max': data.rangeHoursDeparture.max,
                active: true
            };
            this.filterData.changes = true;
            if (data.rangeHoursDeparture.min === model.rangeHoursDeparture.min && data.rangeHoursDeparture.max === model.rangeHoursDeparture.max) {
                this.filterData.rangeHoursDeparture.active = false;
            }
        }
        if (data.rangePrice && data.rangePrice.min !== null && data.rangePrice.max !== null) {
            data.rangePrice.minCurrency = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.currency), data.rangePrice.min, true);
            data.rangePrice.maxCurrency = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(this.currency), data.rangePrice.max, true);
            this.filterData.rangePrice = {
                'min': data.rangePrice.min,
                'max': data.rangePrice.max,
                'minCurrency': data.rangePrice.minCurrency,
                'maxCurrency': data.rangePrice.maxCurrency,
                active: true
            };
            this.filterData.changes = true;
            if (data.rangePrice.min === model.rangePrice.min && data.rangePrice.max === model.rangePrice.max) {
                this.filterData.rangePrice.active = false;
            }
        }
        if (data.scale) {
            this.filterData.scale = [];
            for (index = 0; index < data.scale.length; index++) {
                if (data.scale[index].checked) {
                    this.filterData.scale.push({
                        'numScale': data.scale[index].numScale,
                        'checked': data.scale[index].checked
                    });
                    this.filterData.changes = true;
                }
            }
        } else if(this.filterData.scale.length > 0){
            this.filterData.scale = [];
            this.filterData.changes = true;
        }

        if (this.filterData.changes) {
            this.$scope.$emit('filterDataModal', {
                filter: this.filterData,
                model: model,
                typeFlight: this.typeFlight
            });
        }
    }

    emitTypeFilter = (filterType, isOpenModal, configModal, filter) => {
        if (this.filterTypeOld === null) {
            this.filterTypeOld = filterType;
        }
        if (this.filterTypeOld !== filterType) {
            this.filterReverse = true;
            this.filterTypeOld = filterType;
        }

        if (filter) this.selectedListFlightFilterVC = { isOpenModal: isOpenModal, configModal: configModal, name: filter.name, title: filter.title, filterName: filterType };

        if (isOpenModal) {
            this.configModal = configModal.model;
            if (!this.modifier) {
                this.copyConfigModalModel = angular.copy(configModal.model);
            }
            this.copyConfigModalModel.idModal = 'modalFilterVoluntaryChanges';
            this.MmBModalService.showGenericModal(false, configModal.template, this.copyConfigModalModel, configModal.class).result.then((data) => {
                this.sendFilter(data, configModal.model);
                this.copyConfigModalModel = data;
                this.modifier = true;
            });
        } else {
            this.$timeout(() => {
                this.choosedFilter = filterType;
                this.filterReverse = !this.filterReverse;
                this.$scope.$emit('typeFilterAvailability', {
                    filterType: this.choosedFilter,
                    reverse: this.filterReverse,
                    typeFlight: this.typeFlight
                });
            });
        }
    }

    cleanSortedSelection = () => {
        this.choosedFilter = '';
        this.filterReverse = true;
        this.filterTypeOld = null;
        this.selectedListFlightFilterVC = {};
    }
};
