import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ShoppingBasketPetc } from '@src/app/core/models/ib-booking-availability/header-model';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { CommonModule } from '@angular/common';
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { IbBookingHeaderBasketPetcComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-petc/ib-booking-header-basket-petc.component';
import { IbCModalService } from 'ib-web-commons/ib-modal/';
import { IbPetcBasketService as IbAncPetcBasketService, PetcDatalayerUtilsService } from 'ib-web-ancillaries';
import { Subject } from 'rxjs';

const mockPetcData: ShoppingBasketPetc = {
    hasPetc: true,
    segments: [
        {
            segmentId: 'SEG1',
            origin: { description: 'Madrid', code: 'MAD' },
            destination: { description: 'Barcelona', code: 'BCN' },
            quantity: 1,
            description: 'PET_HEADER_BASKET_ITEM',
            totalFormatted: '100,00€'
        } as any,
        {
            segmentId: 'SEG2',
            origin: { description: 'Barcelona', code: 'BCN' },
            destination: { description: 'Madrid', code: 'MAD' },
            quantity: 2,
            description: 'PETC_HEADER_BASKET_ITEMS',
            totalFormatted: '200,00€'
        } as any
    ],
    total: {
        total: 300,
        totalFormatted: '300,00€'
    }
};

const mockEmptyPetcData: ShoppingBasketPetc = {
    hasPetc: false,
    segments: [],
    total: { total: 0, totalFormatted: '0,00€' }
};

class IbAncPetcBasketServiceMock {
    public petcBasketUpdates$ = new Subject<ShoppingBasketPetc>();
    public deletePetFromBasket = jasmine.createSpy('deletePetFromBasket').and.callFake(() => {
        deleteSubject = new Subject<void>(); 
        return deleteSubject.asObservable(); // Devuelve el Observable del Subject
    });
}

class IbCModalServiceMock {
  showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
    return {
      componentInstance: {},
      result: Promise.resolve()
    };
  });
}
let deleteSubject: Subject<void>;

describe('IbBookingHeaderBasketPetcComponent', () => {
    let component: IbBookingHeaderBasketPetcComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketPetcComponent>;
    let compiled: HTMLElement;
    let fakeIbAncPetcBasketService: IbAncPetcBasketServiceMock;
    let fakeIbCModalService: IbCModalServiceMock;
    let petcDatalayerUtilsServiceMock: jasmine.SpyObj<PetcDatalayerUtilsService>;


    const fakeSessionStorage = new StorageServiceMock();
    const fakeRootscope: any = {
        $emit: ()=>{},
        $broadcast: jasmine.createSpy('$broadcast')
    }
    const fakeDatalayerUtilsService = {
        setAncillariesDatalayer: jasmine.createSpy('setAncillariesDatalayer')
    }
    const fakeDatalayerBasketService = {
        deleteSeats: jasmine.createSpy('deleteSeats'),
        removePetItemFromBasket: jasmine.createSpy('removePetItemFromBasket')
    }

    const fakeBasketFunctions = {
        calculateAllBasket: jasmine.createSpy('calculateAllBasket'),
        saveHeaderModel: jasmine.createSpy('saveHeaderModel') ,
        deleteAncillarie: jasmine.createSpy('deleteAncillarie'),
        isLoading: jasmine.createSpy('isLoadingBasket'),
        isNotLoading: jasmine.createSpy('isNotLoadingBasket'),
        modalService: {
            setErrorMessage: jasmine.createSpy('setErrorMessage'),
            setErrorCode: jasmine.createSpy('setErrorCode'),
            isError: jasmine.createSpy('isError')
        },
        deleteAncillariesService: {
            deleteAncillarie: jasmine.createSpy('deleteAncillarie')
        },
        CurrencyService: {
            formatPrice: jasmine.createSpy('formatPrice')
        },
        collapseHeader:{
            closeCollapse: jasmine.createSpy('closeCollapse')
        }
    }

    beforeEach(async () => {
        fakeIbAncPetcBasketService = new IbAncPetcBasketServiceMock();
        fakeIbCModalService = new IbCModalServiceMock();
        petcDatalayerUtilsServiceMock = jasmine.createSpyObj('PetcDatalayerUtilsService', ['removeItemFromBasket']);


        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketPetcComponent],
            imports: [
                TranslateModule.forRoot(),
                CommonModule
            ],
            providers: [
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: AJSRootScope, useValue: fakeRootscope },
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService },
                { provide: DatalayerBasketService, useValue: fakeDatalayerBasketService },
                { provide: IbAncPetcBasketService, useValue: fakeIbAncPetcBasketService },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: PetcDatalayerUtilsService, useValue: petcDatalayerUtilsServiceMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderBasketPetcComponent);
        component = fixture.componentInstance;
        component.basketFunctions = fakeBasketFunctions;
        compiled = fixture.nativeElement;
    });

    it('should create', () => {
        component.model = mockEmptyPetcData;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('Rendering Logic', () => {
        it('should NOT render the section if model.hasPetc is false', () => {
            component.model = mockEmptyPetcData;

            fixture.detectChanges();

            const section = compiled.querySelector('.ib-petc__header-basket');
            expect(section).toBeNull();
        });

        it('should render the section if model.hasPetc is true', () => {
            component.model = mockPetcData;

            fixture.detectChanges();

            const section = compiled.querySelector('.ib-petc__header-basket');
            expect(section).toBeTruthy();
        });

        it('should render the correct title', () => {
            component.model = mockPetcData;
            fixture.detectChanges();
            const title = compiled.querySelector('.ib-summary-breakdown__section-title');

            expect(title?.textContent).toContain('PETC_HEADER_BASKET_TITLE');
        });

        it('should render the correct number of trip segments', () => {
            component.model = mockPetcData;
            fixture.detectChanges();

            const tripItems = compiled.querySelectorAll('.ib-summary-breakdown__item--bottom-small');
            expect(tripItems.length).toBe(2);
        });

        it('should display the correct quantity and total for a trip', () => {
            component.model = mockPetcData;
            fixture.detectChanges();
            const firstTrip = compiled.querySelector('.ib-summary-breakdown__item--bottom-small');
            const quantityText = firstTrip?.querySelector('.ib-summary-breakdown__item-content');
            const totalText = firstTrip?.querySelector('.ib-summary-breakdown__item-text--text-right');

            expect(quantityText?.textContent).toContain('1'); // Cantidad del primer viaje
            expect(totalText?.textContent).toContain('100,00€'); // Total del primer viaje
        });

        it('should display the correct overall total', () => {
            component.model = mockPetcData;
            fixture.detectChanges();
            const subtotal = compiled.querySelector('.ib-summary-breakdown__subtotal .ib-summary-breakdown__item-text--text-right');
            expect(subtotal?.textContent).toContain('300,00€');
        });
    });

    describe('Inputs and User Interaction', () => {
        it('should display the delete button when deleteFlag and loadingVoucher are false', () => {
            component.model = mockPetcData;
            component.deleteFlag = false;
            component.loadingVoucher = false;
            fixture.detectChanges();

            const deleteButton = compiled.querySelector('.ib-link--primary');
            expect(deleteButton).toBeTruthy();
        });
    
        it('should HIDE the delete button if deleteFlag is true', () => {
            component.model = mockPetcData;
            component.deleteFlag = true;
            component.loadingVoucher = false;
            fixture.detectChanges();

            const deleteButton = compiled.querySelector('.ib-link--primary');
            expect(deleteButton).toBeNull();
        });

        it('should call the deletePet method with the correct trip when clicked', () => {
            spyOn(component, 'deletePet');
            component.model = mockPetcData;
            component.deleteFlag = false;
            component.loadingVoucher = false;
            fixture.detectChanges();

            const deleteButton = fixture.debugElement.query(By.css('.ib-link--primary'));
            deleteButton.triggerEventHandler('click', null);

            expect(component.deletePet).toHaveBeenCalledTimes(1);
           
            expect(component.deletePet).toHaveBeenCalledWith(mockPetcData.segments[0]);
        });
    });

    describe('Method deletePet', () => {
        const mockSegment = mockPetcData.segments[0];
        const mockActualStepFlow = 'ITINERARY';
        
        beforeEach(() => {
            component.model = mockPetcData;
            fakeBasketFunctions.isLoading.calls.reset(); 
            fakeBasketFunctions.isNotLoading.calls.reset();
            fakeSessionStorage.set('actualStepFlow', mockActualStepFlow);
        });

        it('should call delegation service, set loading state, and subscribe', () => {
            component.deletePet(mockSegment);

            expect(fakeBasketFunctions.isLoading).toHaveBeenCalledTimes(1);
            expect(fakeDatalayerBasketService.removePetItemFromBasket).toHaveBeenCalled();
            expect(fakeIbAncPetcBasketService.deletePetFromBasket).toHaveBeenCalledWith(mockSegment);

            expect(deleteSubject).toBeTruthy();
        });

        it('should execute SUCCESS logic (broadcasts, calculations, and setNotLoading) when service succeeds', () => {
            component.deletePet(mockSegment);

            deleteSubject.next(undefined);
            deleteSubject.complete(); 
            fixture.detectChanges();

            expect(fakeRootscope.$broadcast).toHaveBeenCalledWith('basketUpdateCommonHeader');
            expect(fakeBasketFunctions.calculateAllBasket).toHaveBeenCalledWith('/' + mockActualStepFlow);
            expect(fakeBasketFunctions.saveHeaderModel).toHaveBeenCalled();
            expect(fakeBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(true);

            expect(fakeBasketFunctions.isNotLoading).toHaveBeenCalledTimes(1);
        });

        it('should execute ERROR logic (show modal and setNotLoading) when service fails', (done) => {
            const mockError = { status: 500, message: 'API failed', internalErrorCode: 500 };
            
            component.deletePet(mockSegment);

            deleteSubject.error(mockError); 
            fixture.detectChanges();


            expect(fakeBasketFunctions.isNotLoading).toHaveBeenCalledTimes(1);
            expect(fakeIbCModalService.showGenericError).toHaveBeenCalledTimes(1);

            const callArgs = fakeIbCModalService.showGenericError.calls.mostRecent().args;
            expect(callArgs[1].title).toBe('MODAL_ERROR_TITLE');
            expect(callArgs[1].body).toBe('REST_SERVICE_ERROR_GENERAL'); 

            expect(fakeBasketFunctions.collapseHeader.closeCollapse).toHaveBeenCalledTimes(1);
            expect(fakeBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(false);
            done();
        });
    });
});