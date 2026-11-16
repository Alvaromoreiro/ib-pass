import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { IbBookingHeaderBasketSeatsComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-seats/ib-booking-header-basket-seats.component';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { of, throwError } from 'rxjs';

describe('IbBookingHeaderBasketSeatsComponent', () => {
    let component: IbBookingHeaderBasketSeatsComponent;
    let fixture: ComponentFixture<IbBookingHeaderBasketSeatsComponent>;

    const fakeSessionStorage = new StorageServiceMock();
    const fakeRootscope: any = {
        $emit: ()=>{},
        $broadcast: ()=>{}
    }
    const fakeDatalayerUtilsService = {
        setAncillariesDatalayer: jasmine.createSpy('setAncillariesDatalayer')
    }
    const fakeDatalayerBasketService = {
        deleteSeats: jasmine.createSpy('deleteSeats')
    }

    const fakeModel = {
        segments:[{
            seats:[{
                type:'SEAT',
                paymentPassenger: 5,
                passengers:[{
                    amount:1
                }],
                totalAmountPaymentPassenger:5,
                freePassenger:[]
            }],
            total:5,
            totalFormatted:'5€',
            segmentId: '01'
        }]
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
        deleteNewAncillariesService: {
            deleteAncillaries: jasmine.createSpy('deleteAncillaries')
        },
        CurrencyService: {
            formatPrice: jasmine.createSpy('formatPrice')
        },
        collapseHeader:{
            closeCollapse: jasmine.createSpy('closeCollapse')
        }
    }

    const mockSeat = {
        type:'SEAT',
        paymentPassenger: 5,
        passengers:[{
            amount:1,
            id: '01'
        }],
        totalAmountPaymentPassenger:5,
        amount:1
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingHeaderBasketSeatsComponent],
            imports:[
                TranslateModule.forRoot(),
                CommonModule
            ],
            providers:[
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: AJSRootScope, useValue: fakeRootscope },
            ]
        }).overrideComponent(
            IbBookingHeaderBasketSeatsComponent,
            {
                set: {
                    providers: [
                        { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService },
                        { provide: DatalayerBasketService, useValue: fakeDatalayerBasketService }

                    ]
                }
            }
        ).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderBasketSeatsComponent);
        component = fixture.componentInstance;
        component.model = fakeModel;
        component.basketFunctions = fakeBasketFunctions;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('should call deleteSeat function', ()=>{
        beforeEach(()=>{
            fakeSessionStorage.set('seatsSelectedInfoData',{'01':{
                id: '01',
                passengers:[{
                    id: '01',
                    seatType: 'SEAT'
                }]
            }});
        })
        it(', deleteAncillarie resolves promise and ancillarie will be deleted',fakeAsync(()=>{
            fakeBasketFunctions.deleteNewAncillariesService.deleteAncillaries = jasmine.createSpy( 'deleteAncillaries' ).and.returnValue(of({ancillaries: []}))
            fixture.detectChanges();
            component.deleteSeat('01', mockSeat);
            tick(1000);
            expect(fakeDatalayerBasketService.deleteSeats).toHaveBeenCalledWith('01', mockSeat);
            expect(fakeBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(true);
            expect(fakeBasketFunctions.saveHeaderModel).toHaveBeenCalled();
            expect(fakeBasketFunctions.calculateAllBasket).toHaveBeenCalled();
            expect(fakeBasketFunctions.isNotLoading).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
        }))
        it(', deleteAncillarie rejects promise and ancillarie will not be deleted',fakeAsync(()=>{
            fakeBasketFunctions.deleteNewAncillariesService.deleteAncillaries = jasmine.createSpy( 'deleteAncillaries' ).and.returnValue(throwError(() => ('error')));
            fixture.detectChanges();
            component.deleteSeat('01', mockSeat);
            tick(1000);
            expect(fakeBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(false);
            expect(fakeBasketFunctions.isNotLoading).toHaveBeenCalled();
            expect(fakeBasketFunctions.modalService.isError).toHaveBeenCalledWith('error');
        }))
    })
});
