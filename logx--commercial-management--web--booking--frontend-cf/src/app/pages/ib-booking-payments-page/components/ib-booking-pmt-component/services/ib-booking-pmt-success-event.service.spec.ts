import { TestBed } from '@angular/core/testing';
import { IbBookingPmtSuccessEventService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-success-event.service';
import { IbPaymentSuccessService } from '@src/app/shared/http-services/sse-orm/ib-payment-succes.service';
import { IbPaymentSuccessServiceMock } from 'test/mocks/class/IbPaymentSuccessServiceMock';
import { NewMainHeaderFacadeTokenMock } from 'test/mocks/class/NewMainHeaderFacadeMock';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

describe('IbBookingPmtSuccessEventService', () => {
    let service: IbBookingPmtSuccessEventService;
    let fakePaymentSuccessService: IbPaymentSuccessServiceMock;
    let fakeHeaderFacade: NewMainHeaderFacadeTokenMock;

    beforeEach(() => {
        fakePaymentSuccessService = new IbPaymentSuccessServiceMock();
        fakeHeaderFacade = new NewMainHeaderFacadeTokenMock();

        TestBed.configureTestingModule({
            providers: [
                IbBookingPmtSuccessEventService,
                { provide: IbPaymentSuccessService, useValue: fakePaymentSuccessService },
                { provide: IbBookingHeaderFacadeService, useValue: fakeHeaderFacade }
            ]
        });

        service = TestBed.inject(IbBookingPmtSuccessEventService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('calls deleteDiscountFromBasket when incident code PAY_PAY_8031 is present', async () => {
        fakePaymentSuccessService.postPaymentSuccess.and.callFake(() => Promise.resolve({
            incidentList: [{ code: 'PAY_PAY_8031' }]
        }));

        await service.processPaymentSuccessStatus('CTX', 'FLOW');

        expect(fakeHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledWith(BookingAppConstants.DISCOUNT_TYPES.PARTNER);
    });

    it('does nothing when postPaymentSuccess returns null', async () => {
        fakePaymentSuccessService.postPaymentSuccess.and.callFake(() => Promise.resolve(null));

        await service.processPaymentSuccessStatus('CTX', 'FLOW');

        expect(fakeHeaderFacade.deleteDiscountFromBasket).not.toHaveBeenCalled();
    });

    it('returns null when IbPaymentSuccessService throws and does not bubble', async () => {
        fakePaymentSuccessService.postPaymentSuccess.and.callFake(() => Promise.reject(new Error('fail')));

        const result = await service.processPaymentSuccessStatus('CTX', 'FLOW');

        expect(result).toBeNull();
        expect(fakeHeaderFacade.deleteDiscountFromBasket).not.toHaveBeenCalled();
    });

    it('ignores unknown incident codes', async () => {
        fakePaymentSuccessService.postPaymentSuccess.and.callFake(() => Promise.resolve({
            incidentList: [{ code: 'UNKNOWN_CODE' }]
        }));

        await service.processPaymentSuccessStatus('CTX', 'FLOW');

        expect(fakeHeaderFacade.deleteDiscountFromBasket).not.toHaveBeenCalled();
    });
});

