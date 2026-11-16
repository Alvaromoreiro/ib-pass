@Component(
    'ib-MmB-fare-item-module',
    'ibMmbFareItem',
    {
        controllerAs: 'fICtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-fare-item-view.html';
        }],
        bindings: {
            model: '=',
            sliceIndex: '<',
            cabinIndex: '<',
            selectedFare: '=',
            onSelect: '&',
            typeFlight: '<'
        }
    },
    ['$scope'],
[])
export class ibMmbFareItem {

    model;
    sliceIndex;
    cabinIndex;
    selectedFare;
    onSelect;
    typeFlight;
    index;

    constructor(
        private $scope) {}
        
    /**
     * When this function is called, it initializes due to defects of the 
     * controller and model variables.
     */
    $onInit = (): void => {
        this.model.index = this.index;
        this.selectedFare = 0;
    }
    
    /**
     * This function is called when a fare in the view is selected. It emits
     * the indices corresponding to the slice, cabin to component parent and
     * it emits selectedFare and typeFlight to abailability controller.
    */
    selectCabin = (event) => {
        this.onSelect({cabinIndex: this.cabinIndex, sliceIndex: this.sliceIndex});
        this.selectedFare = 0;
        this.$scope.$emit('updateFareSelected', {selectedFare : this.selectedFare, typeFlight : this.typeFlight});
    };

}