export class BookingUserActivityServiceMock {
    initActivityWorker = jasmine.createSpy('initActivityWorker');
    initActivityListener = jasmine.createSpy( 'initActivityListener' );
    terminateWorker = jasmine.createSpy( 'terminateWorker' );
    initKeepAliveTimer = jasmine.createSpy('initKeepAliveTimer');
    stopActivityListener = jasmine.createSpy('stopActivityListener');
    setOrderTimeoutTimer = jasmine.createSpy('setOrderTimeoutTimer');
    stopOrderTimeoutTimer = jasmine.createSpy('stopOrderTimeoutTimer');
    stopKeepAliveTimer = jasmine.createSpy('stopKeepAliveTimer');
}