export class IbBookingPmtSuccessEventServiceMock {
    processPaymentSuccessStatus = jasmine.createSpy('processPaymentSuccessStatus').and.returnValue(Promise.resolve());
}