
export class MmbModalServiceMock {
    showGenericModal = jasmine.createSpy( 'showGenericModal' );
    finishWaiting = jasmine.createSpy( 'finishWaiting' );
    showWaitingModal = jasmine.createSpy( 'showWaitingModal' );
    showGenericError = jasmine.createSpy( 'showGenericError' );
}
