@Component(
    'ib-change-flight-availability-module',
    'ibChangeFlightAvailability',
    {
        controllerAs: 'cfAvailCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-change-flight-availability-view.html';
        }],
        bindings: {
            availabilityModel: '<'
        },
    },
    ['$scope', '$timeout', 'ChangeFlightConstants'],
[])
export class ibChangeFlightAvailability {

    availabilityModel;

    MAX_MORNING_HOURS: number = 12;
    GROUPINGS = {
        'OUTBOUND': { 'id': 'outboundDate', 'description': 'AVAILABILITY_COLUMN_OUTBOUND' },
        'INBOUND': { 'id': 'inboundDate', 'description': 'AVAILABILITY_COLUMN_INBOUND' },
        'COMPANY': { 'id': 'company.description', 'description': 'AVAILABILITY_COLUMN_OPERATED_BY' },
        'SEATS': { 'id': 'remainingSeats', 'description': 'AVAILABILITY_COLUMN_SEAT' }
    };
    filters: Array<ChangeFlightFilter>;
    selectedFilter: ChangeFlightFilter;
    showOnlyAvailable: boolean;
    groupings: Array<ChangeFlightGroupings>;
    selectedGrouping: ChangeFlightGroupings;
    descendingOrder: boolean;

    constructor(
        private $scope,
        private $timeout,
        private ChangeFlightConstants) {
            this.$scope.$on('reloadAvailability', this.reloadAvailability);
        }

    $onInit = (): void => {
        this.filters = [
            this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES,
            this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_MORNING_TIMEZONE,
            this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE
        ];
        this.selectedFilter = this.ChangeFlightConstants.FILTERS[this.availabilityModel.selectedFilter] || this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES;
        this.showOnlyAvailable = true;
        this.groupings = [this.GROUPINGS.OUTBOUND, this.GROUPINGS.INBOUND, this.GROUPINGS.COMPANY, this.GROUPINGS.SEATS];
        this.selectedGrouping = this.selectedGrouping || this.groupings[0];
        this.descendingOrder = this.descendingOrder || false;
    };

    /**
     * Selects a time zone filter.
     * @param {Object} itemSelected the time zone filter selected by the user 
     */
    selectFilter = (itemSelected): void => {
        this.selectedFilter = itemSelected;
    };

    /**
     * Selects the 'group by' object and sets the order. If the users selects the same group by object, the function will change de order boolean.
     * If the users selects a different group by object, the order will be initilized to false
     * @param {Object} itemSelected the group by object selected by the user 
     */
    selectGrouping = (itemSelected): void => {
        this.descendingOrder = this.selectedGrouping.id === itemSelected.id && !this.descendingOrder;
        this.selectedGrouping = itemSelected;
    };

    /**
     * Emits a 'sliceSelected' event to parents controllers with the selected slice by the user
     * @param {Object} selectedSlice the selected slice by the user
     */
    selectSlice = (selectedSlice): void => {
        this.$scope.$emit('sliceSelected', selectedSlice);
    };

    /**
     * function called in every angular life cycle for filter the slice collection objects.
     * the function will return true if the current slice item matches with any filter:
     * <ul>
     *  <li>If the slice has zero remaining seats and the user does not has show only available slices checkbox checked</li>
     *  <li>
     *      If the selected filter is all timezones filter, or the selected filter is morning timezone and current slice hours are 
     *      less or equals than MAX_MORNING_HOURS, or the selected filter is afternoon timezone and current slice hours are 
     *      more or equals than MAX_MORNING_HOURS
     *  </li>
     * </ul>
     * @param {Object} value the current slice item in the collection
     * @returns {Boolean} a boolean that indicates if the current slice item should be shown in the view
     */
    availabilityFilter = (value): boolean => {
        const currentHours = parseInt(value.outbound.split(':')[0]);
        return !(this.showOnlyAvailable && value.remainingSeats === 0) &&
            (this.selectedFilter.id === this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES.id
                || this.selectedFilter.id === this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE.id && currentHours >= this.MAX_MORNING_HOURS
                || this.selectedFilter.id === this.ChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_MORNING_TIMEZONE.id && currentHours <= this.MAX_MORNING_HOURS);
    };

    /**
     * Reloads availability component
     */
    reloadAvailability = (): void => {
        this.$timeout(() => {
            this.$onInit();
            this.$scope.$apply();
        });
    }
}