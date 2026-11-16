import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingHeaderBasketComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/ib-booking-header-basket.component';
import { NewMainHeaderFacadeTokenMock } from 'test/mocks/class/NewMainHeaderFacadeMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { WindowMock } from 'test/mocks/class/WindowMock';
import { BookingModalServiceMock } from 'test/mocks/Services/BookingModalServiceMock';
import { CurrencyServiceMock } from 'test/mocks/Services/CurrencyServiceMocks';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import ShoppingBasketModel from './shared/mocks/ShoppingBasketModel.json';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils/';
import { AJSCommonsAncillariesServiceToken } from '@src/app/shared/components/ib-booking-header/services/upgraded/ib-commons-ancillaries-bridge.service';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { ShoppingBasketViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import HeaderModel from '../../mocks/HeaderModelRT.json';
import SeatsData from './shared/mocks/SeatsData.json';
import SegmentsInfo from './shared/mocks/SegmentsInfo.json';
import SeatsTemp from './shared/mocks/SeatsTemp.json';
import HeaderModelWithSeats from './shared/mocks/HeaderModelWithSeats.json';
import SeatsDataModify from './shared/mocks/SeatsDataModify.json';
import SeatsSelectedInfoData from './shared/mocks/SeatsSelectedInfoData.json';
import HeaderModel2PxNoAncillarie from './shared/mocks/HeaderModel2PxNoAncillarie.json';
import PassengersBaggages from './shared/mocks/PassengersBaggages.json';
import PassengerBaggagesModify from './shared/mocks/PassengerBaggagesModify.json';
import AddedBundles from './shared/mocks/AddedBundles.json';
import SelectedBundle from './shared/mocks/SelectedBundle.json';
import PassengerSpeqs from './shared/mocks/PassengerSpeqs.json';
import InsuranceData from './shared/mocks/InsuranceData.json';
import AllianzInsuranceData from './shared/mocks/AllianzInsuranceData.json';
import TransferData from './shared/mocks/TransferData.json';
import { IbBasketTransformerService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/services/ib-booking-header-basket-transformer.service';
import { type ShoppingBasketPetc } from '@src/app/core/models/ib-booking-availability/header-model';
import { Subject } from 'rxjs';
import { IbAncillariesManagementService, IbPetcBasketService as IbAncPetcBasketService, IbAssistCardBasketService as IbAncAssistCardBasketService } from 'ib-web-ancillaries';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { IbBookingPetsFlowServiceMock } from 'test/mocks/Services/IbBookingPetsFlowServiceMock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

class CommonsAncillariesServiceMock { }
class ShoppingBasketViewModelServiceMock {
    updateOthersFee = jasmine.createSpy('updateOthersFee')
}
class IbBasketTransformerServiceMock {
    checkFreeSeats = jasmine.createSpy('checkFreeSeats').and.callFake(() => SeatsTemp);
}
class IbAncPetcBasketServiceMock {
    public petcBasketUpdates$ = new Subject<ShoppingBasketPetc>();
    initPetcSummarySubject = jasmine.createSpy('initPetcSummarySubject')

}
class IbAncAssistCardBasketServiceMock {
    public assistCardBasketUpdates$ = new Subject<any>();
    updateAssistCardBasket = jasmine.createSpy('updateAssistCardBasket');
}

class FakeAJSDatalayerUtilsService {
    updateDatalayerEvent = jasmine.createSpy('updateDatalayerEvent')
}

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(() => {
        return {
            componentInstance: {},
            result: Promise.resolve()
        }
    });
}

class BookingUtilServiceMock {
    getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName');
}
class IbAncillariesManagementServiceMock {
}



let fakeRootScope: RootScopeMock;
let fakeEvent: Event;
let fakeWindow: WindowMock;
let fakeAJSCurrencyService: CurrencyServiceMock;
let fakeBookingModalService: BookingModalServiceMock;
let fakeCommonsAncillariesService: CommonsAncillariesServiceMock;
let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeIbBasketTransformerService: IbBasketTransformerServiceMock;
let fakeShoppingBasketViewModelService: ShoppingBasketViewModelServiceMock;
let fakeNewMainHeaderFacade: NewMainHeaderFacadeTokenMock;
let fakeIbAncPetcBasketService: IbAncPetcBasketServiceMock;
let fakeIbAncAssistCardBasketService: IbAncAssistCardBasketServiceMock;
let fakeIbCModalService: IbCModalServiceMock;
let fakeAJSDatalayerUtilsService: FakeAJSDatalayerUtilsService;
let fakeIbBookingPetsFlowService: IbBookingPetsFlowServiceMock;
let fakeIbAncManagementService: IbAncillariesManagementServiceMock;

describe('IbBookingHeaderBasketComponent', () => {
    let component: IbBookingHeaderBasketComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketComponent>;

    beforeEach(() => {
        fakeRootScope = new RootScopeMock();
        fakeWindow = new WindowMock();
        fakeAJSCurrencyService = new CurrencyServiceMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeCommonsAncillariesService = new CommonsAncillariesServiceMock();
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeIbBasketTransformerService = new IbBasketTransformerServiceMock();
        fakeShoppingBasketViewModelService = new ShoppingBasketViewModelServiceMock();
        fakeNewMainHeaderFacade = new NewMainHeaderFacadeTokenMock();
        fakeIbAncPetcBasketService = new IbAncPetcBasketServiceMock();
        fakeIbAncAssistCardBasketService = new IbAncAssistCardBasketServiceMock();
        fakeAJSDatalayerUtilsService = new FakeAJSDatalayerUtilsService();
        fakeIbCModalService = new IbCModalServiceMock();
        fakeIbBookingPetsFlowService = new IbBookingPetsFlowServiceMock();
        fakeIbAncManagementService = new IbAncillariesManagementServiceMock();
        TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule,
                HttpClientTestingModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyService },
                { provide: AJSCommonsAncillariesServiceToken, useValue: fakeCommonsAncillariesService },
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: ShoppingBasketViewModelService, useValue: fakeShoppingBasketViewModelService },
                { provide: IbBookingHeaderFacadeService, useValue: fakeNewMainHeaderFacade },
                { provide: IbBasketTransformerService, useValue: fakeIbBasketTransformerService },
                { provide: IbAncPetcBasketService, useValue: fakeIbAncPetcBasketService },
                { provide: IbAncAssistCardBasketService, useValue: fakeIbAncAssistCardBasketService },
                { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: AJSBookingUtilsService, useClass: BookingUtilServiceMock },
                { provide: IbAncillariesManagementService, useValue: fakeIbAncManagementService },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderBasketComponent);
        component = fixture.componentInstance;
        fakeCommonsSessionStorageService.set(BkiStorageConstants.HEADER_MODEL, HeaderModel);
        component.model = ShoppingBasketModel;
        component.showButtonPay = true;
        component.flightType = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('When ngOnChanges is called', () => {
        it('it should set property isONB to default false', () => {
            component.ngOnChanges();
            expect(component.isONB).toBe(false);
        });
        it('it should set property isONB equal to rootScope value', () => {
            fakeRootScope['isPointsOBFlow'] = true;
            component.ngOnChanges();
            expect(component.isONB).toBe(true);
        });
    });
    describe('When goToPayment is called', () => {
        it('it should call broadcast and toggle fn', () => {
            spyOn(component, 'toggle');
            component.goToPayment();
            expect(fakeRootScope.$broadcast).toHaveBeenCalledWith('goToPayment');
            expect(component.toggle).toHaveBeenCalled();
        });
    });
    describe('When changeStatusBasket is called', () => {
        it('It should set model.showBasket property with status', () => {
            component.changeStatusBasket({}, true);
            expect(component.model.showBasket).toBe(true);
        });
    });
    describe('When updateTotalBasket is called on ibcmtv', () => {
        it('It should call formatPrice and check actualPage', () => {
            fakeWindow.location.hash = '!#/ibcmtv';
            component.updateTotalBasket();
            expect(fakeRootScope.$broadcast).toHaveBeenCalled();
        });
    });

    describe('When removeDiscounts is called', () => {
        beforeEach(() => {
            component.model.discountsModel = {};
        });

        it('should update the model correctly when receiving data', () => {
            component.removeDiscounts();
            const newDiscountsModel = {
                hasDiscounts: false,
                discounts: {},
                total: 0
            };

            expect(component.model.discountsModel.hasDiscounts).toEqual(newDiscountsModel.hasDiscounts);
            expect(component.model.discountsModel.discounts).toEqual(newDiscountsModel.discounts);
            expect(component.model.discountsModel.total).toEqual(newDiscountsModel.total);

        });
    });

    describe('When updateBasket is called', () => {
        it('should update basket with new data recived', () => {
            const newBasketData = { ...component.model, total: { totalPrice: 120.22, original: 108.2, formatted: "108,20€" } }
            component.updateBasket({}, newBasketData)

            expect(component.model.total.totalPrice).toBe(120.22);
        })
    })

    describe('When updateHeaderSeats is called', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('segmentsInfo', SegmentsInfo);
        });
        it('it should modify model to add seat and save', () => {
            component.updateHeaderSeats({}, SeatsData);
            expect(component.model.seats.hasSeats).toBe(true);
        });
        it('it should modify model to remove seat and save', () => {
            fakeCommonsSessionStorageService.set('seatsSelectedInfoData', SeatsSelectedInfoData);
            fakeCommonsSessionStorageService.set(BkiStorageConstants.HEADER_MODEL, HeaderModelWithSeats);
            component.updateHeaderSeats({}, SeatsDataModify);
            expect(component.model.seats.hasSeats).toBe(true);
        });
    });

    describe('When updateHeaderBaggages is called', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set(BkiStorageConstants.HEADER_MODEL, HeaderModel2PxNoAncillarie);
        });
        it('It should modify model to add baggages and save', () => {
            component.updateHeaderBaggages({}, PassengersBaggages);
            expect(component.model.baggages.hasBaggage).toBe(true);
        });
        it('It should modify model to remove baggages and save', () => {
            fakeCommonsSessionStorageService.set('selectedBundle', SelectedBundle);
            component.updateHeaderBaggages({}, PassengerBaggagesModify);
            expect(component.model.baggages.hasBaggage).toBe(true);
        });
    });
    describe('When updateHeaderBundle is called', () => {
        it('It should modify model to add bundle items', () => {
            component.updateHeaderBundle({}, AddedBundles);
            expect(component.model.bundle.hasBundle).toBe(true);
        });
    });
    describe('When updateHeaderSpeqs is called', () => {
        it('It should modify model to add speqs', () => {
            component.updateHeaderSpeqs({}, PassengerSpeqs);
            expect(component.model.speqs.hasSpeqs).toBe(true);
        });
    });
    describe('When updateHeaderInsurance is called', () => {
        it('It should modify model and add insurance', () => {
            component.updateHeaderInsurance({}, InsuranceData);
            expect(component.model.insurance.hasInsurance).toBe(true);
        });
        it('It should modify model and remove insurance', () => {
            component.updateHeaderInsurance({}, null);
            expect(component.model.insurance.hasInsurance).toBe(false);
        });
    });
    describe('When updateHeaderAllianzFusionInsurance is called', () => {
        it('It should modify model and add allianz insurance', () => {
            component.updateHeaderAllianzFusionInsurance({}, AllianzInsuranceData);
            expect(component.model.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion).toBe(true);
        });
        it('It should modify model and remove allianz insurance', () => {
            component.updateHeaderAllianzFusionInsurance({}, null);
            expect(component.model.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion).toBe(false);
        });
    });
    describe('When updateHeaderGlobickTransfers is called', () => {
        it('It should modify model to add transfer', () => {
            component.updateHeaderGlobickTransfers({}, TransferData);
            expect(component.model.globickTransfers.hasTransfersGlobick).toBe(true);
        });
        it('It should modify model and remove transfer', () => {
            component.updateHeaderGlobickTransfers({}, null);
            expect(component.model.globickTransfers.hasTransfersGlobick).toBe(false);
        });
    });
    describe('When updateHeaderCarbonFootprint is called', () => {
        it('It should modify model to add carbon footprint ', () => {
            component.updateHeaderCarbonFootprint({}, {
                price: 10,
                kilosCo2Equivalent: 1.1
            });
            expect(component.model.carbonFootprint.hasCarbonFootprint).toBe(true);
        });
        it('It should modify model to remove carbon footprint', () => {
            component.updateHeaderCarbonFootprint({}, null);
            expect(component.model.carbonFootprint.hasCarbonFootprint).toBe(false);
        });
    });
    describe('When isLoadingBasket is called', () => {
        it('It should set isLoading to true', () => {
            component.isLoadingBasket();
            expect(component.isLoading).toBe(true);
        });
    });
    describe('When isNotLoadingBasket is called', () => {
        it('It should set isLoading to false', () => {
            component.isNotLoadingBasket();
            expect(component.isLoading).toBe(false);
        });
    });
    describe('When updateCurrency is called', () => {
        it('it should update model with currency data', () => {
            component.model.currency = null;
            const currencyData = { total: { original: 10 } };
            component.updateCurrency({}, currencyData);
            expect(component.model.currency.total.original).toEqual(10);
        });
    });
    describe('When toggle is called', () => {
        it('It should switch isOpen', () => {
            component.open = false;
            component.toggle();
            expect(component.open).toBe(true);
        });
    });
    describe('When deleteAncillarie is called', () => {
        it('It should call Facade provider', () => {
            component.deleteAncillarie(true);
            expect(fakeNewMainHeaderFacade.setAncillariesDeletion).toHaveBeenCalled();
        });
    });
    describe('When updatePendingItems is called', () => {
        it('It should call calculateAllBasket', () => {
            spyOn(component, 'calculateAllBasket');
            component.updatePendingItems();
            expect(component.calculateAllBasket).toHaveBeenCalled();
        });
    });
    describe('When deleteFees is called', () => {
        it('It should call provider ShoppingBasketViewModelService.updateOthersFee', () => {
            component.deleteFees();
            expect(fakeShoppingBasketViewModelService.updateOthersFee).toHaveBeenCalled();
        });
    });
    describe('When updateTripList is called', () => {
        it('It should update model trips', () => {
            component.updateTripList({}, [{}]);
            expect(component.model.trips.list).toEqual([{}]);
        });
    });
    describe('Integration with IbAncPetcBasketService', () => {
        beforeEach(() => {
            component.ngOnInit();
        });
        it('should subscribe to petUpdates$ on init and call updatePetcBasket when data is emitted', () => {

            spyOn(component, 'updatePetcBasket');

            // El observable usa skip(1), por lo que necesitamos emitir dos valores
            // El primero se omitirá y el segundo activará la suscripción
            fakeIbAncPetcBasketService.petcBasketUpdates$.next(null);

            const testPetData: ShoppingBasketPetc = {
                hasPetc: true,
                segments: [{ segmentId: 'SEG1' } as any],
                total: { total: 100, totalFormatted: '100€' }
            };

            fakeIbAncPetcBasketService.petcBasketUpdates$.next(testPetData);

            expect(component.updatePetcBasket).toHaveBeenCalledWith(testPetData);
        });
    });
    describe('When updatePetcBasket is called', () => {
        beforeEach(() => {
            spyOn(component, 'calculateAllBasket');
            spyOn(component, 'saveHeaderModel');

            if (!component.model.petc) {
                component.model.petc = {};
            }
        });

        it('should update the model correctly when receiving valid pet data', () => {
            const newPetData: ShoppingBasketPetc = {
                hasPetc: true,
                segments: [{ segmentId: 'NEW_SEG' } as any],
                total: { total: 150, totalFormatted: '150€' }
            };

            component.updatePetcBasket(newPetData);

            expect(component.model.petc.segments).toEqual(newPetData.segments);
            expect(component.model.petc.total).toEqual(newPetData.total);
            expect(component.model.petc.hasPetc).toBe(true);
            expect(component.calculateAllBasket).toHaveBeenCalled();
            expect(component.saveHeaderModel).toHaveBeenCalled();
        });

        it('should reset the model when receiving null', () => {
            component.model.petc = { hasPetc: true, segments: [{ segmentId: 'OLD_SEG' } as any], total: { total: 100, totalFormatted: '100€' } };

            component.updatePetcBasket(null);

            expect(component.model.petc.segments).toEqual([]);
            expect(component.model.petc.total).toBe(0);
            expect(component.model.petc.hasPetc).toBe(false);
            expect(component.calculateAllBasket).toHaveBeenCalled();
            expect(component.saveHeaderModel).toHaveBeenCalled();
        });

        it('should set hasPetc to false if segments array is empty', () => {
            const emptyPetData: ShoppingBasketPetc = {
                hasPetc: true,
                segments: [],
                total: { total: 0, totalFormatted: '0€' }
            };

            component.updatePetcBasket(emptyPetData);

            expect(component.model.petc.hasPetc).toBe(false);
        });
    });

    describe('Integration with IbAncAssistCardBasketService', () => {
        beforeEach(() => {
            component.ngOnInit();
        });

        it('should call updateAssistCardBasket() on service when setAssistCardSubscription is initialized', () => {
            // setAssistCardSubscription se ejecuta dentro de ngOnInit
            expect(fakeIbAncAssistCardBasketService.updateAssistCardBasket).toHaveBeenCalledWith();
        });

        it('should subscribe to assistCardBasketUpdates$ and call updateAssistCardBasket when data is emitted', () => {
            spyOn(component, 'updateAssistCardBasket');

            // El observable usa skip(1): el primer next se omite, el segundo dispara la suscripción
            fakeIbAncAssistCardBasketService.assistCardBasketUpdates$.next(null);

            const testAssistCardData: any = {
                passengers: 2,
                total: { total: 200, totalFormatted: '200€' },
                name: 'ASSIST_CARD_TEST'
            };

            fakeIbAncAssistCardBasketService.assistCardBasketUpdates$.next(testAssistCardData);

            expect(component.updateAssistCardBasket).toHaveBeenCalledWith(testAssistCardData);
        });
    });

    describe('When updateAssistCardBasket is called', () => {
        beforeEach(() => {
            spyOn(component, 'calculateAllBasket');
            spyOn(component, 'saveHeaderModel');

            component.model.assistCard = component.model.assistCard || {};
        });

        it('should update the model correctly when receiving valid assist card data', () => {
            const assistCardData: any = {
                passengers: 2,
                total: { total: 300, totalFormatted: '300€' },
                hasAssistCard: true,
                name: 'ASSIST_CARD_NAME'
            };

            component.updateAssistCardBasket(assistCardData);

            expect(component.model.assistCard.total).toEqual(assistCardData.total);
            expect(component.model.assistCard.hasAssistCard).toBe(true);
            expect(component.calculateAllBasket).toHaveBeenCalled();
            expect(component.saveHeaderModel).toHaveBeenCalled();
        });

        it('should reset the model when receiving null', () => {
            component.model.assistCard = {
                segments: [{ id: 'SEG1' }],
                total: { total: 100, totalFormatted: '100€' },
                hasAssistCard: true,
                name: 'OLD_NAME'
            } as any;

            component.updateAssistCardBasket(null);

            expect(component.model.assistCard.segments).toEqual([{ id: 'SEG1' }]);
            expect(component.model.assistCard.total).toBeNull();
            expect(component.model.assistCard.hasAssistCard).toBe(false);
            expect(component.calculateAllBasket).toHaveBeenCalled();
            expect(component.saveHeaderModel).toHaveBeenCalled();
        });
    });

    afterEach(() => {
        fakeCommonsSessionStorageService.clear();
        TestBed.resetTestingModule();
    });
});
