export class BasketFunctionsMock {
    isLoading = jasmine.createSpy( 'isLoading' );
    calculateAllBasket = jasmine.createSpy( 'calculateAllBasket' );
    saveHeaderModel = jasmine.createSpy( 'saveHeaderModel' );
    isNotLoading = jasmine.createSpy( 'isNotLoading' );
    deleteAncillarie = jasmine.createSpy( 'deleteAcillarie' );
    modalService = {
        setErrorMessage: jasmine.createSpy( 'setErrorMessage' ),
        setErrorCode: jasmine.createSpy( 'setErrorCode' ),
        isError: jasmine.createSpy( 'isError' ),
        showGenericError: jasmine.createSpy( 'showGenericError' ).and.returnValue({result:Promise.resolve()})
    };
    collapseHeader = {
        closeCollapse: jasmine.createSpy( 'closeCollapse' )
    };
    deleteAncillariesService = {
        deleteAncillarie: jasmine.createSpy( 'deleteAncillarie' ).and.callFake( () => Promise.resolve() ),
        deleteBundleService: jasmine.createSpy( 'deleteBundleService' ).and.callFake( () => Promise.resolve() )
    };
}
