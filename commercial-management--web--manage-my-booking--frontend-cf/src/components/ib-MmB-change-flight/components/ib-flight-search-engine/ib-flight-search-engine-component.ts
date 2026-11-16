import angular from "angular";

@Component(
    'ib-flight-search-engine-module',
    'ibFlightSearchEngine',
    {
        controllerAs: 'flightSECtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-flight-search-engine-view.html';
        }],
        bindings: {
            flightSearchModel: '=',
            timeZoneOptions: '<'
        },
    },
    ['$scope', '$timeout', '$filter', 'CommonsUtilService'],
[])
export class ibFlightSearchEngine {

    flightSearchModel;
    timeZoneOptions;

    dateOptions;
    datePickerOpened: boolean;
    topClass: string;

    constructor(
        private $scope,
        private $timeout,
        private $filter,
        private CommonsUtilService: CommonsUtilService) {
            this.$scope.$watch('vm.datePickerOpened', this.datePickerOpenedChange);
        }

    $onInit = (): void => {
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_AIR_SHUTTLE_SEARCH_NEW_FLIGHTS');
        this.dateOptions = {
            showWeeks: false,
            maxMode: 'day',
            minDate: this.flightSearchModel.minDate,
            maxDate: this.flightSearchModel.maxDate
        };
        this.topClass = '';
        this.datePickerOpened = false;            
    }

    /**
     * Receives the info and if the form is correctly submited, emit the info to the parent scope with the daySelected and timeZoneSelected
     * from his model.
     * @param {Object} event the current Form submited
     */
    sendSearchInfo = (currentForm): void => {
        currentForm.$submitted = true;
        if (currentForm.$valid) {
            this.$scope.$emit('daySelectedInfo', {
                'selectedDay': this.flightSearchModel.daySelected,
                'selectedTimeZone': this.flightSearchModel.timeZoneSelected
            });
        }
    };


    /**
     * Event when change day of datepicker. 
     * @param {*} data 
     */
    changeDate = (): void => {
        this.$scope.$emit('changeZoneList', this.flightSearchModel.daySelected);
    }


    /**
     * Opened when recieve the form button click, and change the topClass of the element depending of his actual state
     * @param {Object} newValue boolean for swap the topClass state
     */

    datePickerOpenedChange = (newValue, oldValue): void => {
        if (newValue) {
            this.$timeout(() => {
                this.topClass = this.isTop() && 'ib-input__button--top' || 'ib-input__button--bottom';
            }, 50);
        }
    }

    private isTop = (): boolean => {
        return angular.element('.ib-datepicker')[0].offsetTop < 0;
    }

    /**
     * Compare value selected with input text and return value of filter
     * @param {String} actual 
     * @param {String} expected 
     * 
     */
    timeZoneComparator = (actual, expected): boolean => {
        var regexString = expected == null ? '' : expected;
        var filterExpresion, errorExpresion = false;
        var actualTimeZone = this.$filter('translate')(actual);
        try {
            filterExpresion = new RegExp(regexString, 'i');
        } catch (e) {
            errorExpresion = true;
        }
        return !angular.isObject(actual) && !errorExpresion && filterExpresion.test(actualTimeZone);
    }
}