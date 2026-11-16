import angular from "angular";

@Component(
    'ib-MmB-fare-type-module',
    'ibMmbFareType',
    {
        controllerAs: 'fTCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-fare-type-view.html';
        }],
        bindings: {
            model: '=',
            sliceIndex: '=',
            cabinIndex: '=',
            fareIndex: '=',
            selectedFare: '=',
            typeFlight: '<'
        }
    },
    ['$rootScope','$scope', '$timeout', 'CurrencyService', '$filter', 'MmBModalService', 'MmBAppConstants'],
[])
export class ibMmbFareType {

    model;
    sliceIndex;
    cabinIndex;
    fareIndex;
    selectedFare;
    typeFlight;

    constructor(
        private $rootScope,
        private $scope,
        private $timeout,
        private CurrencyService,
        private $filter,
        private MmBModalService,
        private MmBAppConstants) {}

    $onInit = (): void => {
    }

    /**
     * This function is called when a fare in the view is selected. It emits
     * the indices corresponding to the fare, and the flight mode to 
     * avaibility coontroller.
     */
    isFareSelected = () => {
        this.$scope.$emit('updateFareSelected', {selectedFare : this.selectedFare, typeFlight : this.typeFlight});
    }

    /**
     * This function is open a info model with the index of segment selected.
     * @param {number} segmentSelected Selected cabin.
     */
    openModalConditions = (event, segmentSelected) => {
        event.preventDefault();
        angular.forEach(segmentSelected.conditions, (condition) => {
            condition.icon = this.MmBAppConstants.FARE_FAMILY_ICON_PROPERTY_CODE[condition.code];
        });
        this.MmBModalService.showGenericModal(false, 'ib-compare-fares-modal-multiple.html', { 'selectedFareInfo': [segmentSelected] }).result.then(angular.noop, angular.noop);
    }
}