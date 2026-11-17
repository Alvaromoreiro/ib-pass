import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AJSCheckinModalService, CheckinModalServiceType } from '@src/app/shared/services/ib-modal/ib-checkin-modal-service-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { AJSRootScope, CommonsCookiesService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { OnPaymentSuccessEvent, OnErrorEvent } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-model';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import { IbCheckinPmtComponent } from './ib-checkin-pmt.component';
import { IbCheckinPmtContextService } from '@src/app/pages/ib-checkin-payments/components/ib-checkin-pmt-component/services/ib-checkin-pmt-context.service';
import { IbCheckinPmtDigitalDataService } from '@src/app/pages/ib-checkin-payments/components/ib-checkin-pmt-component/services/ib-checkin-pmt-digital-data.service';
import { IbCheckInPmtFormService } from '@src/app/pages/ib-checkin-payments/components/ib-checkin-pmt-component/services/ib-checkin-pmt-form.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbCheckInHttpUtilsService } from '@src/app/shared/services/ib-utils/ib-check-in-http-utils.service';
import { RootScopeMock } from '@test/class/RootScopeMock';

describe('IbCheckinPmtComponent', () => {
    let component: IbCheckinPmtComponent;
    let fixture: ComponentFixture<IbCheckinPmtComponent>;
    let mockCheckinModalService: jasmine.SpyObj<CheckinModalServiceType>;
    let mockRedirectionService: jasmine.SpyObj<IbCheckinRedirectionUtilsService>;
    let mockPmtDigitalDataService: jasmine.SpyObj<IbCheckinPmtDigitalDataService>;
    let mockPmtFormService: jasmine.SpyObj<IbCheckInPmtFormService>;
    let mockSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let mockCookiesService: jasmine.SpyObj<CommonsCookiesService>;
    let mockPmtContextService: jasmine.SpyObj<IbCheckinPmtContextService>;
    let mockTranslateService: jasmine.SpyObj<TranslateService>;
    let rootscope = new RootScopeMock();

    const AJSCommonsHttpUtilService = new InjectionToken('CommonsHttpUtilService');

    const mockCommonsHttpUtilService = {
        refreshToken: jasmine.createSpy('refreshToken').and.returnValue(Promise.resolve())
    };

    beforeEach(async () => {
        mockCheckinModalService = jasmine.createSpyObj('CheckinModalServiceType', [
            'finishWaiting', 'showGenericError', 'showGenericComponentModal', 'showComponentModal'
        ]);
        mockRedirectionService = jasmine.createSpyObj('IbCheckinRedirectionUtilsService', ['path']);
        mockPmtDigitalDataService = jasmine.createSpyObj('IbCheckinPmtDigitalDataService', [
            'emitViewEvent', 'addDigitalDataInfo', 'setPaymentsDigitalData', 'manageDigitalDataVoucher', 'setDigitalDataVoucherShown', 'setDigitalDataPmtType'
        ]);
        mockPmtFormService = jasmine.createSpyObj('IbCheckInPmtFormService', ['getNewPaymentComponent', 'updatePrice', 'getPriceFormatted']);
        mockPmtFormService.getNewPaymentComponent.and.returnValue(Promise.resolve({
            subscribe: jasmine.createSpy('subscribe')
        }));
        mockSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get', 'set', 'remove']);
        mockCookiesService = jasmine.createSpyObj('CommonsCookiesService', ['get', 'set', 'remove']);
        mockPmtContextService = jasmine.createSpyObj('IbCheckinPmtContextService', ['getPaymentContextId']);

        await TestBed.configureTestingModule({
            declarations: [IbCheckinPmtComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: AJSRootScope, useValue: rootscope },
                { provide: AJSCheckinModalService, useValue: mockCheckinModalService },
                { provide: IbCheckinRedirectionUtilsService, useValue: mockRedirectionService },
                { provide: IbCheckinPmtDigitalDataService, useValue: mockPmtDigitalDataService },
                { provide: IbCheckInPmtFormService, useValue: mockPmtFormService },
                { provide: CommonsSessionStorageService, useValue: mockSessionStorageService },
                { provide: CommonsCookiesService, useValue: mockCookiesService },
                { provide: IbCheckinPmtContextService, useValue: mockPmtContextService },
                { provide: TranslateService, useValue: jasmine.createSpyObj('TranslateService', ['instant']) },
                { provide: AJSCommonsHttpUtilService, useValue: mockCommonsHttpUtilService },
                IbCheckInHttpUtilsService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinPmtComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the component', async () => {
            spyOn(component, 'checkPriceUpdate');
            spyOn(component, 'checkPaymentUpdate');
            const mockPriceUpdate: PriceSubscriptionModel = {
                total: 100,
                currency: { code: 'USD', format: {} },
                charges: [],
                discounts: []
            };

            const mockPaymentUpdate = { status: 'REDIRECTION' };

            component.pmtPriceUpdateStm.next(mockPriceUpdate);
            component.pmtPaymentUpdateStm.next(mockPaymentUpdate);

            await component.ngOnInit();

            expect(component.checkPriceUpdate).toHaveBeenCalledWith(mockPriceUpdate);
            expect(component.checkPaymentUpdate).toHaveBeenCalledWith(mockPaymentUpdate);
        });
    });

    describe('ngOnDestroy', () => {
        it('should complete unsuscribeUpdatesStm and clear timeouts', () => {
            spyOn(component.unsuscribeUpdatesStm, 'next');
            spyOn(component.unsuscribeUpdatesStm, 'complete');

            component.ngOnDestroy();

            expect(component.unsuscribeUpdatesStm.next).toHaveBeenCalled();
            expect(component.unsuscribeUpdatesStm.complete).toHaveBeenCalled();
            expect(component.initTimeout).toBeUndefined();
            expect(component.endTimeout).toBeUndefined();
        });
    });

    describe('initPaymentForm', () => {
        it('should initialize the payment form', async () => {
            const mockPaymentComponent = {
                subscribe: jasmine.createSpy('subscribe')
            };
            mockPmtFormService.getNewPaymentComponent.and.returnValue(Promise.resolve(mockPaymentComponent));

            await component.initPaymentForm();

            expect(mockPmtContextService.getPaymentContextId).toHaveBeenCalledWith(undefined);
            expect(mockPmtFormService.getNewPaymentComponent).toHaveBeenCalled();
            expect(mockPaymentComponent.subscribe).toHaveBeenCalled();
        });
    });

    describe('onPaymentSuccess', () => {
        it('should handle payment success event', async () => {
            const mockEvent: OnPaymentSuccessEvent = {
                status: undefined,
                methodType: 'CREDIT_CARD',
                details: {
                    creditCardType: 'VI'
                }
            };
            spyOn(component, 'boardingCardsRedirect');
            await component.onPaymentSuccess(mockEvent);
            expect(mockPmtDigitalDataService.setDigitalDataPmtType).toHaveBeenCalledWith(mockEvent);

            setTimeout(() => {
                expect(component.boardingCardsRedirect).toHaveBeenCalled();
            }, 20000);
        });
    });

    describe('onPaymentFailure', () => {
        it('should handle payment failure event', async () => {
            const mockEvent: OnErrorEvent = { status: 'UNAUTHORIZED' };
            spyOn(component, 'initPaymentForm');
            await component.onPaymentFailure(mockEvent);

            expect(component.initPaymentForm).toHaveBeenCalled();
        });
    });

    describe('boardingCardsRedirect', () => {
        it('should redirect to boarding cards', () => {
            component.boardingCardsRedirect();

            expect(mockRedirectionService.path).toHaveBeenCalledWith(CheckinAppConstants.PAGES_ROUTES.BOARDING_CARDS);
            expect(mockSessionStorageService.remove).toHaveBeenCalledWith(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
        });
    });
});
