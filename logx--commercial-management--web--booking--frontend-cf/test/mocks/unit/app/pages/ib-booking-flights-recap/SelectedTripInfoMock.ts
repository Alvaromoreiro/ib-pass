
export class SelectedTripInfoMockClass {
    #selectedTripInfo: any ;
    constructor () {
        this.#selectedTripInfo = require( './SelectedTripInfoMockValue.json' );
    }

    get selectedTripInfo () {
        return structuredClone(this.#selectedTripInfo); // Return a deep copy of the property value to prevent mutations during tests
    }
}



