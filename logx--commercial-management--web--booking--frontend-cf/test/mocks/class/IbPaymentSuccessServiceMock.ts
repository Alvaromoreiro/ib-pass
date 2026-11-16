export class IbPaymentSuccessServiceMock {
    postPaymentSuccess = jasmine.createSpy('postPaymentSuccess').and.callFake((request) => {
        return Promise.resolve();
    });
} 