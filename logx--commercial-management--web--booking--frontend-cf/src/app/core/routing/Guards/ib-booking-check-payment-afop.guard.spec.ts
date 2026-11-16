import { TestBed } from '@angular/core/testing';
import { AJSIbBookingAvailabilityPageService, IbBookingAvailabilityPageServiceType } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-bridge.service';
import { CheckPaymentAFOPRedirectGuardFn } from '@src/app/core/routing/Guards/ib-booking-check-payment-afop.guard';


class TestBench {
    public Guard: any;
    public IbBookingAvailabilityPageService: any;
    constructor () {
        this.IbBookingAvailabilityPageService = jasmine.createSpyObj('IbBookingAvailabilityPageServiceType', ['checkPaymentRedirect', 'checkOldPaymentRedirect', 'getPaymentRedirectionInfo']);
        this.Guard = ()=> TestBed.runInInjectionContext(() => CheckPaymentAFOPRedirectGuardFn(null, null));
        TestBed.configureTestingModule({
            providers: [
                { provide: AJSIbBookingAvailabilityPageService, useValue: this.IbBookingAvailabilityPageService }
            ]
        });
    }
}

describe('CheckPaymentAFOPRedirectGuardFn', () => {
    let mockIbBookingAvailabilityPageUtilsService: jasmine.SpyObj<IbBookingAvailabilityPageServiceType>;
    let guard : any = CheckPaymentAFOPRedirectGuardFn;
    beforeEach(() => {
        const test = new TestBench();
        guard = test.Guard;
        mockIbBookingAvailabilityPageUtilsService = test.IbBookingAvailabilityPageService;
        window.location.hash = 'someHash';

    });


    it('should return false if there is no hash in the URL', () => {
        window.location.hash = '';
        expect(guard()).toBeFalse();
    });

    it('should return true if no redirection functions are triggered', () => {
        mockIbBookingAvailabilityPageUtilsService.checkPaymentRedirect.and.returnValue(false);
        mockIbBookingAvailabilityPageUtilsService.checkOldPaymentRedirect.and.returnValue(false);

        expect(guard()).toBeTrue();
    });

    it('should return false if any redirection function is triggered', () => {
        mockIbBookingAvailabilityPageUtilsService.checkPaymentRedirect.and.returnValue(true);
        mockIbBookingAvailabilityPageUtilsService.checkOldPaymentRedirect.and.returnValue(false);

        expect(guard()).toBeFalse();

        mockIbBookingAvailabilityPageUtilsService.checkPaymentRedirect.and.returnValue(false);
        mockIbBookingAvailabilityPageUtilsService.checkOldPaymentRedirect.and.returnValue(true);

        expect(guard()).toBeFalse();
    });

    it('should call checkPaymentRedirect and checkOldPaymentRedirect with correct parameters', () => {
        const paymentRedirectionInfo = { someKey: 'someValue' };
        mockIbBookingAvailabilityPageUtilsService.getPaymentRedirectionInfo.and.returnValue(paymentRedirectionInfo as any);

        guard();

        expect(mockIbBookingAvailabilityPageUtilsService.checkPaymentRedirect).toHaveBeenCalled();
        expect(mockIbBookingAvailabilityPageUtilsService.checkOldPaymentRedirect).toHaveBeenCalledWith(paymentRedirectionInfo as any);
    });
});

