@Component(
    'ib-MmB-list-fare-item-module',
    'ibMmbListFareItem',
    {
        controllerAs: 'lFICtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-list-fare-item-view.html';
        }],
        bindings: {
            model: '=',
            index: '<',
            open: '=',
            onOpen: '&',
            cabinSelected: '<',
            typeFlight: '<',
            unifiedOfferType: '<'
        }
    },
    [],
[])
export class ibMmbListFareItem {

    model;
    index;
    open;
    onOpen;
    cabinSelected;
    typeFlight;
    unifiedOfferType;
    lengthText;
    selectedFare = 0;
    sliceSelected;

    constructor() {}

    /**
     * When this function is called, it initializes the lengthText variable
     * with the number strings that are used in the view.
     */
    $onInit = () => {
        this.lengthText = ['one', 'two', 'three', 'four'];
    }

    /**
     * This function is called when a cabin in the view is selected. It emits
     *  the indices corresponding to the Slice, cabin and the flight mode to
     * its parent component using the OnOpen function.
     * @param {number} cabinIndex Selected cabin.
     * @param {number} sliceIndex Selected slice.
     */
    selectCabin = (cabinIndex, sliceIndex) => {
        this.cabinSelected = cabinIndex;
        this.sliceSelected = sliceIndex;
        this.onOpen({ sliceIndex: sliceIndex , cabinIndex: cabinIndex, typeFlight: this.typeFlight});
    };
}
