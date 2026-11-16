import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateServiceMock } from '@test/mocks/services/translate-service-angular-mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbMmBVoluntaryRefundsConfirmationComponent } from '@src/components/ib-MmB-voluntary-refunds/components/ib-MmB-voluntary-refunds-confirmation/ib-MmB-voluntary-refunds-confirmation.component';
import { IbMmbVoluntaryRefundsService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test/mocks/services/StorageServiceMock';
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import { MmBAppConstants } from '@src/ib-MmB-constants';

class IbMmbVoluntaryRefundsServiceMock {
    updateWorkflowDatalayerInfo = jasmine.createSpy('updateWorkflowDatalayerInfo').and.returnValue({});
}

describe('Component: IbMmBVoluntaryRefundsConfirmationComponent', () => {
    let component: IbMmBVoluntaryRefundsConfirmationComponent;
    let fixture: ComponentFixture<IbMmBVoluntaryRefundsConfirmationComponent>;
    let fakeTranslate: TranslateServiceMock;
    let fakeIbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsServiceMock;
    let fakeStorageService: StorageServiceMock;
    let fakeRootScope: any;

    const createComponent = (rootScopeOverrides: any = {}) => {
        fakeRootScope = { ...rootScopeOverrides };
        fakeIbMmbVoluntaryRefundsService = new IbMmbVoluntaryRefundsServiceMock();
        fakeTranslate = new TranslateServiceMock();
        fakeStorageService = new StorageServiceMock();

        TestBed.configureTestingModule({
            imports: [TranslateModule],
            declarations: [IbMmBVoluntaryRefundsConfirmationComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useValue: fakeTranslate },
                { provide: IbMmbVoluntaryRefundsService, useValue: fakeIbMmbVoluntaryRefundsService },
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: fakeStorageService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbMmBVoluntaryRefundsConfirmationComponent);
        component = fixture.componentInstance;
    };

    describe('Component initialization', () => {
        beforeEach(() => {
            createComponent({ appMarket: 'ES', appLang: 'es' });
        });

        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should call updateWorkflowDatalayerInfo in the constructor with correct params', () => {
            expect(fakeIbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo).toHaveBeenCalledWith(
                MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVBK,
                MmBAppConstants.QUADRIGAM.VOL_REFUND_PAGE_CONFIRMATION
            );
        });
    });

    describe('ngOnInit', () => {
        beforeEach(() => {
            createComponent({ appMarket: 'ES', appLang: 'es' });
        });

        it('should increment currentStep by 1', () => {
            component.currentStep = 2;
            component.ngOnInit();
            expect(component.currentStep).toEqual(3);
        });

        it('should increment currentStep from 0 to 1', () => {
            component.currentStep = 0;
            component.ngOnInit();
            expect(component.currentStep).toEqual(1);
        });
    });

    describe('generateTrackingRefundUrl', () => {
        describe('with data in rootScope', () => {
            it('should generate URL for ES market and language', () => {
                createComponent({ appMarket: 'ES', appLang: 'es' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos/#/REFUNDS');
            });

            it('should generate URL for EN language', () => {
                createComponent({ appMarket: 'GB', appLang: 'en' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/gb/refund-tracking/#/REFUNDS');
            });

            it('should generate URL for PT language', () => {
                createComponent({ appMarket: 'PT', appLang: 'pt' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/pt/acompanhar-reembolsos/#/REFUNDS');
            });

            it('should generate URL for FR language', () => {
                createComponent({ appMarket: 'FR', appLang: 'fr' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/fr/suivi-remboursements/#/REFUNDS');
            });

            it('should generate URL for DE language', () => {
                createComponent({ appMarket: 'DE', appLang: 'de' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/de/rueckverfolgung-rueckerstattungen/#/REFUNDS');
            });
        });

        describe('special languages (ZH and JA)', () => {
            it('should generate URL for ZH language with special market cn', () => {
                createComponent({ appMarket: 'CN', appLang: 'zh' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/cn/zh/refund-tracking/#/REFUNDS');
            });

            it('should generate URL for JA language with special market jp', () => {
                createComponent({ appMarket: 'JP', appLang: 'ja' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/jp/ja/refund-tracking/#/REFUNDS');
            });
        });

        describe('unrecognized language', () => {
            it('should fall back to ES route when language is not in VOLUNTARY_REFUNDS_TRACKING_ROUTES', () => {
                createComponent({ appMarket: 'AR', appLang: 'ar' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/ar/seguimiento-reembolsos/#/REFUNDS');
            });
        });

        describe('without data in rootScope — fallback to sessionStorage', () => {
            it('should use bookingInfo from sessionStorage when rootScope lacks locale', () => {
                createComponent({});
                fakeStorageService.set('bookingInfo', {
                    contextMetadata: { country: 'PT', language: 'pt' }
                });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/pt/acompanhar-reembolsos/#/REFUNDS');
            });

            it('should use EN route when sessionStorage language is EN', () => {
                createComponent({});
                fakeStorageService.set('bookingInfo', {
                    contextMetadata: { country: 'GB', language: 'en' }
                });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/gb/refund-tracking/#/REFUNDS');
            });

            it('should apply special language ZH from sessionStorage', () => {
                createComponent({});
                fakeStorageService.set('bookingInfo', {
                    contextMetadata: { country: 'CN', language: 'zh' }
                });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/cn/zh/refund-tracking/#/REFUNDS');
            });

            it('should default to ES/es when sessionStorage has no bookingInfo', () => {
                createComponent({});
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos/#/REFUNDS');
            });

            it('should default to ES/es when bookingInfo has no contextMetadata', () => {
                createComponent({});
                fakeStorageService.set('bookingInfo', {});
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos/#/REFUNDS');
            });
        });

        describe('with caseNumber in confirmationData', () => {
            it('should insert caseNumber query param before hash in endPath', () => {
                createComponent({ appMarket: 'ES', appLang: 'es' });
                component.confirmationData = { caseNumber: 'CASE-001' } as any;
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos/?caseNumber=CASE-001#/REFUNDS');
            });

            it('should append caseNumber at end when endPath has no hash', () => {
                const originalRoutes = (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES;
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = { ES: '/seguimiento-reembolsos' };
                createComponent({ appMarket: 'ES', appLang: 'es' });
                component.confirmationData = { caseNumber: 'CASE-001' } as any;
                const url = component.generateTrackingRefundUrl();
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = originalRoutes;
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos?caseNumber=CASE-001');
            });

            it('should use & separator when endPath already contains query params', () => {
                const originalRoutes = (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES;
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = { ES: '/seguimiento-reembolsos?param=value#/REFUNDS' };
                createComponent({ appMarket: 'ES', appLang: 'es' });
                component.confirmationData = { caseNumber: 'CASE-001' } as any;
                const url = component.generateTrackingRefundUrl();
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = originalRoutes;
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos?param=value&caseNumber=CASE-001#/REFUNDS');
            });
        });

        describe('when VOLUNTARY_REFUNDS_TRACKING_ROUTES is not available', () => {
            let originalRoutes: any;

            beforeEach(() => {
                originalRoutes = (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES;
            });

            afterEach(() => {
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = originalRoutes;
            });

            it('should use DEFAULT_TRACKING_ROUTE when VOLUNTARY_REFUNDS_TRACKING_ROUTES is null', () => {
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = null;
                createComponent({ appMarket: 'ES', appLang: 'es' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/es/seguimiento-reembolsos/#/REFUNDS');
            });

            it('should use DEFAULT_TRACKING_ROUTE when language and ES route are both missing', () => {
                (MmBAppConstants as any).VOLUNTARY_REFUNDS_TRACKING_ROUTES = { EN: '/refund-tracking/#/REFUNDS' };
                createComponent({ appMarket: 'AR', appLang: 'ar' });
                const url = component.generateTrackingRefundUrl();
                expect(url).toBe('https://www.iberia.com/ar/seguimiento-reembolsos/#/REFUNDS');
            });
        });
    });
});
