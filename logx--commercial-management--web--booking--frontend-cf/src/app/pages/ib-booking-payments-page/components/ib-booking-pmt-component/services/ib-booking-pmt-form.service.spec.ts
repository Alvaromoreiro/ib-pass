import { TestBed } from '@angular/core/testing';
import { IbBookingPmtFormService } from '@pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-form.service';
import { IbPaymentContextService } from '@shared/http-services/sse-orm/ib-payment-context.service';
import { AJSBookingHttpUtilsServiceLegacy } from '@src/app/shared/services/ib-utils/ib-booking-http-utils-bridge.service';

class PaymentComponent {
    init = jasmine.createSpy('init');
    subscribe = jasmine.createSpy('subscribe');
}
describe('IbBookingPmtFormService', () => {
    let service: IbBookingPmtFormService;
    let mockIbPaymentContextService: jasmine.SpyObj<IbPaymentContextService>;
    let mockBookingHttpUtilsService: jasmine.SpyObj<any>;

    beforeEach(() => {
        mockIbPaymentContextService = jasmine.createSpyObj('IbPaymentContextService', ['getPaymentContextId']);
        mockBookingHttpUtilsService = jasmine.createSpyObj('AJSBookingHttpUtilsServiceLegacy', ['refreshToken']);

        TestBed.configureTestingModule({
            providers: [
                IbBookingPmtFormService,
                { provide: IbPaymentContextService, useValue: mockIbPaymentContextService },
                { provide: AJSBookingHttpUtilsServiceLegacy, useValue: mockBookingHttpUtilsService }
            ]
        });

        service = TestBed.inject(IbBookingPmtFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getNewPaymentComponent', () => {
        it('should import and initialize the payment web component', ((done) => {

          

            spyOn<any>(service, 'importWebComponent').and.callFake(()=> {
                service['PaymentWebComponentClass'] = PaymentComponent;
                return Promise.resolve(service['PaymentWebComponentClass']);
            });

            service.getNewPaymentComponent().then((result)=> {
                expect(service['importWebComponent']).toHaveBeenCalled();
                expect(result).toBeInstanceOf(PaymentComponent);
                done();
            });
            

            
        }));
    });

    describe('getPaymentContext', () => {
        it('should refresh the token and get the payment context ID', (done) => {
            const mockPaymentContextInput: any= {};
            const mockPaymentContextResponse: any = {};

            mockBookingHttpUtilsService.refreshToken.and.returnValue(Promise.resolve());
            mockIbPaymentContextService.getPaymentContextId.and.returnValue(Promise.resolve(mockPaymentContextResponse));

            service.getPaymentContext(mockPaymentContextInput).then((result)=> {
                expect(mockBookingHttpUtilsService.refreshToken).toHaveBeenCalled();
                expect(mockIbPaymentContextService.getPaymentContextId).toHaveBeenCalledWith(mockPaymentContextInput);
                expect(result).toBe(mockPaymentContextResponse);
                done();
            });

            
        });
    });
});