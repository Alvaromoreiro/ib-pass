import { TestBed } from '@angular/core/testing';
import { PaymentViewType } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { NewPaymentAvailableResponse } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { IbBookingPaymentsPageService } from '@src/app/pages/ib-booking-payments-page/services/ib-booking-payments-page.service';
import { BookingNewPaymentAvailableService } from '@src/app/shared/http-services/pmt-ppm/ib-new-payment-available.service';
import { CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

class BookingNewPaymentAvailableServiceMock {
    public response: NewPaymentAvailableResponse = {available: true};
    public callPromised = ()=> {
        if (this.response) {
            return Promise.resolve(this.response);
        } else {
            return Promise.reject();
        }
    };
}




describe('Test IbBookingPaymentsPageService', () => {
    let service: IbBookingPaymentsPageService;
    let fakeBrowserStorage = new StorageServiceMock();
    let fakeBookingNewPaymentAvailableService: BookingNewPaymentAvailableServiceMock;
    beforeEach(() => {
        fakeBookingNewPaymentAvailableService = new BookingNewPaymentAvailableServiceMock();
        TestBed.configureTestingModule({
            imports: [  ],
            providers: [
                IbBookingPaymentsPageService,
                { provide: CommonsBrowserStorageService, useValue: fakeBrowserStorage },
                { provide: BookingNewPaymentAvailableService, useValue: fakeBookingNewPaymentAvailableService }
            ]
        });
        service = TestBed.inject( IbBookingPaymentsPageService );
        fakeBrowserStorage.set('ib-booking-app.forcePaymentType', 'CHECK');
    });
    it('feature toggle as disabled', (done) => {
        fakeBrowserStorage.remove('ib-booking-app.forcePaymentType');
        service.checkPaymentsViewType()
            .then((data) => {
                expect(data).toBe(PaymentViewType.OLD);
                done();
            }, ()=> {done.fail();});
    });
    it('feature toggle forcing NEW', (done) => {
        fakeBrowserStorage.set('ib-booking-app.forcePaymentType', 'NEW');
        service.checkPaymentsViewType()
            .then((data) => {
                expect(data).toBe(PaymentViewType.NEW);
                done();
            }, ()=> {done.fail();});
    });
    it('feature toggle forcing OLD', (done) => {
        fakeBrowserStorage.set('ib-booking-app.forcePaymentType', 'OLD');
        service.checkPaymentsViewType()
            .then((data) => {
                expect(data).toBe(PaymentViewType.OLD);
                done();
            }, ()=> {done.fail();});
    });
    it('Payment viewtype is retrived from server - returned old', (done) => {
        const assignValue = PaymentViewType.OLD;
        fakeBookingNewPaymentAvailableService.response = {available: false};
        service.checkPaymentsViewType()
            .then((data) => {
                expect(data).toBe(assignValue);
                done();
            }, ()=> {done.fail();});
    });
    it('Payment viewtype is retrived from server - returned new', (done) => {
        const assignValue = PaymentViewType.NEW;
        fakeBookingNewPaymentAvailableService.response = {available: true};
        service.checkPaymentsViewType()
            .then((data) => {
                expect(data).toBe(assignValue);
                done();
            }, ()=> {done.fail();});
    });
    it('Payment viewtype is retrived from server an response error', (done) => {
        fakeBookingNewPaymentAvailableService.response = null;
        service.checkPaymentsViewType()
            .then((data) => {
                expect(data).toBe(PaymentViewType.OLD);
                done();
            }, (data)=> {
                done.fail();
            });
    });


});
