import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingMobileSliceInfoComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-mobile-slice-info/ib-booking-mobile-slice-info.component';
import { IbSliceDetailsComponentService } from '@src/app/shared/components/ib-booking-slice-details-info/ib-booking-slice-details.service';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSRootScope } from 'ib-web-commons/utils';
import { CurrencyServiceMock } from '@test-mocks/Services/CurrencyServiceMocks';
import { DatalayerBKIServiceMock } from '@test-mocks/class/DatalayerBKIServiceMock';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import { IbSliceDetailsComponentServiceMock } from '@test-mocks/class/IbSliceDetailsComponentServiceMock';
import { IbBookingMobileSliceInfoMockClass } from '@test/mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-mobile-slice-info/ib-booking-mobile-slice-info.mock';


let fakeRootScope;
let fakeDatalayerBKIService;
let fakeIbSliceDetailsComponentService: IbSliceDetailsComponentServiceMock;
let IbBookingMobileSliceInfoMock: IbBookingMobileSliceInfoMockClass;


describe( 'IbBookingMobileSliceInfoComponent', () => {
    let component: IbBookingMobileSliceInfoComponent;
    let fixture: ComponentFixture<IbBookingMobileSliceInfoComponent>;
    IbBookingMobileSliceInfoMock = new IbBookingMobileSliceInfoMockClass();
    const sliceInfoModelMock = IbBookingMobileSliceInfoMock.sliceInfoModel;
    fakeRootScope = new RootScopeMock();
    fakeDatalayerBKIService = new DatalayerBKIServiceMock();
    fakeIbSliceDetailsComponentService =  new IbSliceDetailsComponentServiceMock();
    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            declarations: [ IbBookingMobileSliceInfoComponent ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: AJSDatalayerBKIService, useValue: fakeDatalayerBKIService },
                { provide: IbSliceDetailsComponentService, useValue: fakeIbSliceDetailsComponentService }

            ]
        } ).compileComponents();
        fixture = TestBed.createComponent( IbBookingMobileSliceInfoComponent );
        component = fixture.componentInstance;
        component.sliceInfoModel = sliceInfoModelMock;
        component.origin = 'MAD';
        component.destination = 'NYC';
        component.showFaresSelected = false;
        component.showCompanyLogo = true;
        component.originDestinationId = 'ODI_0';
        component.currencies = new CurrencyServiceMock().getCurrencyObject();
        component.selectedSliceIndex = 0;
        component.selectedSlicesLength = 0;
        component.selectedSliceMode = false;
        fixture.detectChanges();
    });
    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
    describe( 'ngOnInit is called', () => {
        it( 'cabins should exist as array and newFare should be false as default', () => {
            component.ngOnInit();
            expect( component.cabins.length > 0 ).toBe( true );
            expect( component.newFare ).toBe( false );
        } );
    } );
    describe( 'handleCompanyLogoError is called', () => {
        it( 'showCompanyLogo should be false', () => {
            component.showCompanyLogo = true;
            component.handleCompanyLogoError();
            fixture.detectChanges();
            expect( component.showCompanyLogo ).toBe( false );
        } );
    } );
    describe( 'toggleCabins is called', () => {
        it( 'collapsedCabins should be true', () => {
            component.collapsedCabins = false;
            component.toggleCabins();
            fixture.detectChanges();
            const someCollapsed = component.cabins.some( cabin => !cabin.collapsed );
            expect( component.collapsedCabins ).toBe( true );
            expect( someCollapsed ).toBe( false );
        } );
    } );
    describe( 'toggleDetails is called', () => {
        it( 'collapsedDetails should be true', () => {
            component.toggleDetails();
            fixture.detectChanges();
            expect( fakeIbSliceDetailsComponentService.show ).toHaveBeenCalled(  );
        } );
    } );
    describe( 'toggleFareCabin is called', () => {
        it( 'collapsedCabins should be true', () => {
            component.cabins[1].collapsed = false;
            component.toggleFareCabin( 1, false);
            fixture.detectChanges();
            expect( component.cabins[1].collapsed ).toBe( true );
        } );
    } );
    describe( 'sendSelectedSlice is called', () => {
        it( 'should dispatch the event with the selectedSlice', () => {
            component.showFaresSelected = false;
            component.sendSelectedSlice( component.cabins[1] );
        } );
    } );
    describe( 'showAirlineName is called,', () => {
        it( ' it will return true if allOperatedBy airlines are equal', () => {
            let returnValue = component.showAirlineName();
            expect( returnValue ).toBeTrue();
        } );
    } );
    describe( 'OnDestroy', () => {
        it( ' it will return true if allOperatedBy airlines are equal', () => {
            component.ngOnDestroy();
            expect(fakeIbSliceDetailsComponentService.destroy).toHaveBeenCalled();
        } );
    } );
    describe('createCabins is called', () => {
        it('should return an array of cabins with correct properties', () => {
            component.sliceInfoModel = {
                cabins: {
                    E: { name: 'Economy' },
                    B: { name: 'Business' },
                    T: { name: 'Turist Premium' },
                    N: { name: 'Flex' }
                },
                showedCabin: 'E'
            } as any;
            component.showFaresSelected = true;

            component.ngOnInit();
            const {cabins} = component;

            expect(cabins[0].type).toBe('E');
            expect(cabins[0].collapsed).toBe(false);
            expect(cabins[0].cabinMobileStyleClass).toBe('');
            expect(cabins[1].type).toBe('B');
            expect(cabins[1].collapsed).toBe(true);
            expect(cabins[1].cabinMobileStyleClass).toBe('cabin-button--business');
            expect(cabins[2].type).toBe('T');
            expect(cabins[2].collapsed).toBe(true);
            expect(cabins[2].cabinMobileStyleClass).toBe('cabin-button--premium');
            expect(cabins[3].type).toBe('N');
            expect(cabins[3].collapsed).toBe(true);
            expect(cabins[3].cabinMobileStyleClass).toBe('cabin-button--premium');
        });

        it('should return an empty array if sliceInfoModel.cabins is undefined', () => {
            component.sliceInfoModel = {} as any;
            component.showFaresSelected = true;

            const cabins = component['createCabins']();

            expect(cabins.length).toBe(0);
        });
    });
});
