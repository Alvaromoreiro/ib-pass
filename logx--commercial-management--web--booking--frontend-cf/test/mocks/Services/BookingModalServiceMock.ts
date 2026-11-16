
export class BookingModalServiceMock {
    showGenericModal = jasmine.createSpy( 'showGenericModal' );
    finishWaiting = jasmine.createSpy( 'finishWaiting' );
    showWaitingModal = jasmine.createSpy( 'showWaitingModal' );
    closeAllCurrentModals = jasmine.createSpy( 'closeAllCurrentModals' );
    showGenericError = jasmine.createSpy( 'showGenericError' ).and.callFake( () => {
        return { result: Promise.resolve() };
    } );
}
