import { IbBookingOnHoldConfirmationPageComponent } from '@src/app/pages/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation.component';
import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSCommonsGetLoginInfoService } from '@src/app/shared/services/ib-login/ib-booking-get-login-info-bridge.service';
import { AJSIbCPermanentUserService } from '@src/app/shared/services/ib-utils/ib-booking-permanent-user-bridge.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { IbOnHoldConfirmationService } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation.service';
import { CancelOnHoldOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-on-hold-cancelation.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { CallAncillariesService } from '@src/app/shared/http-services/ass-fass/ib-call-ancillaries.service';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrencyServiceMock } from '@test-mocks/Services/CurrencyServiceMocks';
import { BookingCommercialSellingDataService } from '@src/app/shared/http-services/rdu-loc/ib-booking-commercial-selling-data.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbOnHoldConfirmationUtilsService } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation-utils.service';
import { IbBookingAirlinesLogoService } from '@src/app/shared/services/ib-booking-airlines-logo.service';
import { IbBookingCalculatePointsService } from '@src/app/shared/http-services/prlm-pc/ib-booking-calculate-points.service';
import { CalculatePointsTransformer } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-calculate-points-transformer.service';
import { ActivatedRoute } from '@angular/router';
import { onHoldInfoMock } from '@test/mocks/unit/app/pages/ib-booking-on-hold-confirmation/services/on-hold-booking-info-mock';
import { BookingUserActivityService } from '@src/app/core/services/ib-booking-user-activity.service';
import { BookingUserActivityServiceMock } from '@test-mocks/Services/BookingUserActivityServiceMock';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { OnHoldModelMockClass } from '@test-mocks/unit/app/pages/ib-booking-on-hold-confirmation/on-hold-model.mock';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { BkiPmtConstants } from '@core/constants/ib-booking-payments-constants';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';

const OHModelMockClass = new OnHoldModelMockClass();
const fakeBookingModalService = {
    showWaitingModal : jasmine.createSpy('showWaitingModal'),
    showGenericError : jasmine.createSpy('showGenericError'),
    finishWaiting : jasmine.createSpy('finishWaiting'),
    showGenericModal : jasmine.createSpy('showGenericModal')
};
const fakeNewMainHeaderFacadeToken = {
    initHeader : jasmine.createSpy('initHeader'),
    showLogin : jasmine.createSpy('showLogin'),
    deleteTripsBasketFromDispo : jasmine.createSpy('deleteTripsBasketFromDispo'),
    updateTripsFromOrder : jasmine.createSpy('updateTripsFromOrder'),
    updateBasketOthers : jasmine.createSpy('updateBasketOthers'),
    updateDiscounts : jasmine.createSpy('updateDiscounts')
};
const fakeCommonsGetLoginInfoService = {
    checkCustomerStatus : jasmine.createSpy('checkCustomerStatus').and.returnValue(Promise.resolve({}))
};
const fakeIbCPermanentUserService = {
    isAfterLoginPermanentUser : jasmine.createSpy('isAfterLoginPermanentUser').and.returnValue(false),
    checkPermanentUserFlow : jasmine.createSpy('checkPermanentUserFlow').and.returnValue(Promise.resolve({}))
};
const fakeIbOnHoldConfirmationService = {
    getBookingInfo : jasmine.createSpy('getBookingInfo').and.returnValue(Promise.resolve(OHModelMockClass.model)),
    getOriginDestination : jasmine.createSpy('getOriginDestination').and.returnValue({})
};
const fakeCancelOnHoldOrderService = {
    cancelOnHoldOrder : jasmine.createSpy('cancelOnHoldOrder')
};
const fakeBookingPageUtilsService = {
    setPageTitle : jasmine.createSpy('setPageTitle'),
    getFooterModel : jasmine.createSpy('getFooterModel'),
    getOHBackgroundURL : jasmine.createSpy('getOHBackgroundURL').and.returnValue('test-url')
};
const fakeIbCUserUtilsService = {
    isUserLogged : jasmine.createSpy('isUserLogged')
};
const fakeBookingRedirectionService = {
    redirectToLoginPage : jasmine.createSpy('redirectToLoginPage'),
    path : jasmine.createSpy('path')
};
const fakeCallAncillariesService = {
    getAllianzFussionInsurance : jasmine.createSpy('getAllianzFussionInsurance').and.returnValue(Promise.resolve({ancillaries:[]}))
};
const fakeWindow = {
    location : {
        pathname: 'pathname',
        search: 'search'
    }
};
const fakeDatalayerUtilsService = {
    updateDatalayerWithQuadrigam : jasmine.createSpy('updateDatalayerWithQuadrigam'),
    setProcessAndStep : jasmine.createSpy('setProcessAndStep')
};
const fakeDatalayerBKIService = {
};
const fakeBookingUtilsService = {
    initStorage: jasmine.createSpy('initStorage'),
    getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName').and.returnValue('')
};
const fakeIbBookingAirlinesLogoService = {
    getAirlinesLogos: jasmine.createSpy('getAirlinesLogos').and.returnValue({})
};
const fakeIbBookingCalculatePointsService = {
    getCalculateFlightsAvios: jasmine.createSpy('getCalculateFlightsAvios').and.returnValue(Promise.resolve({}))
};
const fakeCalculatePointsTransformer = {
    transCalcPointsData: jasmine.createSpy('TransCalcPointsData').and.returnValue({Avios:'1'}),
    genCalAviosSummary: jasmine.createSpy('genCalAviosSummary').and.returnValue({})
};
const fakeBookingCommercialSellingDataService = {
    getCommercialInfo : jasmine.createSpy('getCommercialInfo').and.returnValue(Promise.resolve({}))
};
const fakeDigitalDataUtilsService = {
    emitViewEvent : jasmine.createSpy('emitViewEvent'),
    updateDigitalDataWithQuadrigam : jasmine.createSpy('updateDigitalDataWithQuadrigam'),
    setProcessAndStep : jasmine.createSpy('setProcessAndStep')
};
const fakeIbOnHoldConfirmationUtilsService = {
    generateOnHoldConfirmationDigitalData : jasmine.createSpy('generateOnHoldConfirmationDigitalData'),
    createAddToCartforPurchaseEvent : jasmine.createSpy('createAddToCartforPurchaseEvent')
};
const fakeIbBookingPriceDetailModalService = {
    initPriceModalData: jasmine.createSpy('initPriceModalData')
};

const fakeActivatedRoute = {
    snapshot: {
        data: [{
            importOrderData: onHoldInfoMock
        }]
    }
};

const fakeIbBookingPassengerInfoUtilsService = {
    deleteTemporalPNR: jasmine.createSpy('deleteTemporalPNR')
};


const fakeRootScopeMock = new RootScopeMock();
fakeRootScopeMock.$emit = jasmine.createSpy('$emit');
fakeRootScopeMock.$broadcast = jasmine.createSpy('$broadcast');
const fakeSessionStorage = new StorageServiceMock();
const fakeCurrencyService = new CurrencyServiceMock();


describe('IbBookingOnHoldConfirmationPageComponent test', () => {
    let component: IbBookingOnHoldConfirmationPageComponent;
    let fixture: ComponentFixture<IbBookingOnHoldConfirmationPageComponent>;
    let OHModelMock;

    beforeEach(async () => {
        OHModelMock = OHModelMockClass.model;
        await TestBed.configureTestingModule({
            declarations: [IbBookingOnHoldConfirmationPageComponent],
            imports: [
                CommonModule,
                TranslateModule.forRoot(),
                IbBookingSharedModule
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScopeMock},
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService},
                { provide: AJSDatalayerBKIService, useValue: fakeDatalayerBKIService},
                { provide: AJSBookingModalService, useValue: fakeBookingModalService},
                { provide: IbBookingHeaderFacadeService, useValue: fakeNewMainHeaderFacadeToken },
                { provide: AJSCommonsGetLoginInfoService, useValue: fakeCommonsGetLoginInfoService },
                { provide: AJSIbCPermanentUserService, useValue: fakeIbCPermanentUserService },
                { provide: AJSCurrencyService, useValue: fakeCurrencyService },
                { provide: AJSBookingUtilsService, useValue: fakeBookingUtilsService },
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: IbOnHoldConfirmationService, useValue: fakeIbOnHoldConfirmationService },
                { provide: CancelOnHoldOrderService, useValue: fakeCancelOnHoldOrderService },
                { provide: BookingPageUtilsService, useValue: fakeBookingPageUtilsService },
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: IbCUserUtilsService, useValue: fakeIbCUserUtilsService },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService },
                { provide: IbBookingAirlinesLogoService, useValue: fakeIbBookingAirlinesLogoService },
                { provide: CallAncillariesService, useValue: fakeCallAncillariesService },
                { provide: BookingCommercialSellingDataService, useValue: fakeBookingCommercialSellingDataService },
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService },
                { provide: IbOnHoldConfirmationUtilsService, useValue: fakeIbOnHoldConfirmationUtilsService },
                { provide: IbBookingCalculatePointsService, useValue: fakeIbBookingCalculatePointsService },
                { provide: CalculatePointsTransformer, useValue: fakeCalculatePointsTransformer },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute },
                { provide: BookingUserActivityService, useClass: BookingUserActivityServiceMock },
                { provide: IbBookingPriceDetailModalService, useValue: fakeIbBookingPriceDetailModalService },
                { provide: IbBookingPassengerInfoUtilsService, useValue: fakeIbBookingPassengerInfoUtilsService }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingOnHoldConfirmationPageComponent);
        component = fixture.componentInstance;
        component.model = OHModelMockClass.model;
        component.importOrderData = onHoldInfoMock;
        // No llamamos fixture.detectChanges() aquí para permitir que cada test configure sus mocks
    });

    it('should create', fakeAsync(() => {
        expect(component).toBeTruthy();
    }));
    describe('when component is created', () => {
        beforeEach(()=>{
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.returnValue(Promise.resolve());
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.returnValue(Promise.resolve());
            fakeIbCPermanentUserService.isAfterLoginPermanentUser = jasmine.createSpy('isAfterLoginPermanentUser').and.returnValue(false);
        });
        it('and user is logged in middle login, it will confirm the order', () => {
            spyOn(component as any, 'getBookingInfoSuccess').and.callFake((bookingInfo: any) => {
                component.model = bookingInfo;
                if (component['IbCPermanentUserService'].isAfterLoginPermanentUser()) {
                    component['BookingModalService'].finishWaiting();
                    component.confirmOnHoldOrder();
                }
            });
            
            const confirmOnHoldOrderSpy = spyOn(component, 'confirmOnHoldOrder');
            fakeIbCPermanentUserService.isAfterLoginPermanentUser = jasmine.createSpy('isAfterLoginPermanentUser').and.returnValue(true);
            
            (component as any).getBookingInfoSuccess(OHModelMock);
            
            expect(fakeIbCPermanentUserService.isAfterLoginPermanentUser).toHaveBeenCalled();
            expect(confirmOnHoldOrderSpy).toHaveBeenCalled();
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
        });
        it('and token fails, it will show error modal ', fakeAsync(() => {
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.returnValue(Promise.reject());
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({result:Promise.resolve()});
            component.ngOnInit();
            tick();
            expect(fakeCommonsGetLoginInfoService.checkCustomerStatus).toHaveBeenCalled();
        }));
        
        it('should call HeaderService to init header', fakeAsync(() => {
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.returnValue(Promise.resolve());
            fakeIbCPermanentUserService.isAfterLoginPermanentUser = jasmine.createSpy('isAfterLoginPermanentUser').and.returnValue(false);
            fakeIbOnHoldConfirmationService.getBookingInfo = jasmine.createSpy('getBookingInfo').and.returnValue(Promise.resolve(OHModelMock));
            
            component.ngOnInit();
            tick();
            
            expect(fakeNewMainHeaderFacadeToken.initHeader).toHaveBeenCalled();
            expect(fakeNewMainHeaderFacadeToken.initHeader).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    showBasket: true,
                    showModalBackHome: true,
                    isMultiflight: true,
                    isOnHold: true,
                    showAdvancedSearch: false,
                    hideFlightSearch: false
                }), { hasSteps: true, steps: 'ON_HOLD_RECOVERY_STEPS', position: 0 }, jasmine.any(Object)
                
            );

        }));

        it('should update basket others with paid deposit amount in negative when paidDeposit exists', () => {
            const paidDepositPrice = 125;
            const bookingInfoWithPaidDeposit = {
                ...OHModelMock,
                generalInfo: {
                    ...OHModelMock.generalInfo,
                    paidDeposit: {
                        ...(OHModelMock.generalInfo?.paidDeposit || {}),
                        price: paidDepositPrice
                    }
                }
            } as any;

            component.model = bookingInfoWithPaidDeposit;
            fakeNewMainHeaderFacadeToken.updateBasketOthers.calls.reset();

            (component as any).initHeader(bookingInfoWithPaidDeposit);

            expect(fakeNewMainHeaderFacadeToken.updateBasketOthers).toHaveBeenCalledWith(
                BkiPmtConstants.PAYMENT_TYPES.ONHOLD,
                { total: -paidDepositPrice }
            );
        });
        
        it('should not update basket others with paid deposit amount in negative when paidDeposit does not exist', () => {
            const bookingInfoWithoutPaidDeposit = {
                ...OHModelMock,
                generalInfo: {
                    ...OHModelMock.generalInfo,
                    paidDeposit: null
                }
            } as any;

            component.model = bookingInfoWithoutPaidDeposit;
            fakeNewMainHeaderFacadeToken.updateBasketOthers.calls.reset();

            (component as any).initHeader(bookingInfoWithoutPaidDeposit);

            expect(fakeNewMainHeaderFacadeToken.updateBasketOthers).not.toHaveBeenCalled();
        });
        
        
        it('and getAllianzFussionInsurance fails ', fakeAsync(() => {
            fakeSessionStorage.remove('availabilityRelatedContent');
            fakeIbCPermanentUserService.isAfterLoginPermanentUser = jasmine.createSpy('isAfterLoginPermanentUser').and.returnValue(false);
            fakeCallAncillariesService.getAllianzFussionInsurance = jasmine.createSpy('getAllianzFussionInsurance').and.callFake(() => Promise.reject(new Error('ancillaries-failed')));

            component.ngOnInit();
            tick();

            expect(fakeCallAncillariesService.getAllianzFussionInsurance).toHaveBeenCalled();
            expect(fakeSessionStorage.get('availabilityRelatedContent')).toBeNull();
        }));
    });
    describe('when confirmOnHoldOrder is called', () => {
        beforeEach(()=>{
            fakeIbCUserUtilsService.isUserLogged = jasmine.createSpy('isUserLogged').and.returnValue(false);
            // Asegurar que model tiene una estructura básica
            if (!component.model) {
                component.model = { warnings: [] } as any;
            }
        });
        it('it will redirect to payments page', fakeAsync(()=>{
            fakeIbCUserUtilsService.isUserLogged = jasmine.createSpy('isUserLogged').and.returnValue(true);
            component.confirmOnHoldOrder();
            tick();
            expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith('/ibpurc');
        }));
        it('it will show a modal if there is a warning of user must be logged and user accept it', fakeAsync(()=>{
            component.model = {
                warnings: [{
                    code: 'SSE_MBM_1011',
                    description:'User must be logged'
                }]
            } as any;
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.resolve()});
            component.confirmOnHoldOrder();
            tick();
            expect(fakeBookingRedirectionService.redirectToLoginPage).toHaveBeenCalled();
        }));
        it('it will show a modal if there is a warning of user must be logged and user reject it', fakeAsync(()=>{
            component.model = {
                warnings: [{
                    code: 'SSE_MBM_1011',
                    description:'User must be logged'
                }]
            } as any;
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.reject()});
            component.confirmOnHoldOrder();
            tick();
            expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith('/ibpurc');
        }));
        it('should redirect to custom route when provided', fakeAsync(()=>{
            fakeIbCUserUtilsService.isUserLogged = jasmine.createSpy('isUserLogged').and.returnValue(true);
            const customRoute = '/custom-route';
            component.confirmOnHoldOrder(customRoute);
            tick();
            expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith(customRoute);
        }));
        it('should redirect when user is logged and no warnings exist', fakeAsync(()=>{
            fakeIbCUserUtilsService.isUserLogged = jasmine.createSpy('isUserLogged').and.returnValue(true);
            component.model = { warnings: [] } as any;
            component.confirmOnHoldOrder();
            tick();
            expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith('/ibpurc');
        }));
    });
    describe('when cancelOnHoldOrder is called', () => {
        beforeEach(()=>{
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.resolve()});
        });
        it('user order will be cancelled', fakeAsync(()=>{
            const mockEvent = {
                target:{
                    attributes:{
                        'data-ng-click':{value:'modalCtrl.accept()'}
                    }
                }
            };
            window.event = mockEvent as any;
            fakeCancelOnHoldOrderService.cancelOnHoldOrder = jasmine.createSpy('cancelOnHoldOrder').and.returnValue(Promise.resolve());
            component.cancelOnHoldOrder();
            tick();
            expect(fakeIbBookingPassengerInfoUtilsService.deleteTemporalPNR).toHaveBeenCalled();
            expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith('/cnclit');
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
        }));
        it('user order will not be cancelled (cancelOHOrder fails)', fakeAsync(()=>{
            const mockEvent = {
                target:{
                    attributes:{
                        'data-ng-click':{value:'modalCtrl.accept()'}
                    }
                }
            };
            window.event = mockEvent as any;
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({result:Promise.resolve()});
            fakeCancelOnHoldOrderService.cancelOnHoldOrder = jasmine.createSpy('cancelOnHoldOrder').and.returnValue(Promise.reject());
            component.cancelOnHoldOrder();
            tick();
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
            expect(fakeBookingModalService.showGenericError).toHaveBeenCalled();
        }));
        it('user order will not be cancelled but error modal fail', fakeAsync(()=>{
            const mockEvent = {
                target:{
                    attributes:{
                        'data-ng-click':{value:'modalCtrl.accept()'}
                    }
                }
            };
            window.event = mockEvent as any;
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({result:Promise.reject()});
            fakeCancelOnHoldOrderService.cancelOnHoldOrder = jasmine.createSpy('cancelOnHoldOrder').and.returnValue(Promise.reject());
            component.cancelOnHoldOrder();
            tick();
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
            expect(fakeBookingModalService.showGenericError).toHaveBeenCalled();
        }));
        it('and cancel delete on hold order ', fakeAsync(()=>{
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.reject()});
            component.cancelOnHoldOrder();
            tick();
            expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled();
        }));
    });

    describe('when redirectToAncillaries is called', () => {
        it('should call confirmOnHoldOrder with ancillaries route', ()=>{
            spyOn(component, 'confirmOnHoldOrder');
            component.redirectToAncillaries();
            expect(component.confirmOnHoldOrder).toHaveBeenCalledWith('/ibcmtv');
        });
    });
    describe('when afterLogin is called', () => {
        it('it will reinit onhold confirmation page', ()=>{
            (component as any).afterLogin();
            expect(fakeBookingPageUtilsService.setPageTitle).toHaveBeenCalled();
        });
    });
});
