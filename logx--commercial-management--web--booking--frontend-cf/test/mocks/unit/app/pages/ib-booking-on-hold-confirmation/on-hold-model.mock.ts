export class OnHoldModelMockClass {
    #model =  require( './OHModel.json' );

    get model () {
        return structuredClone(this.#model);
    }
}