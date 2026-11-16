import { TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { IbSummaryTransformerService } from '@src/app/pages/ib-booking-payments-page/services/ib-summary-transformer.service';
import { EntriesArrayPipe } from '@src/app/shared/pipes/entries-array.pipe';
import { AJSRootScope } from 'ib-web-commons/utils';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import { HeaderDiscountObject } from '@test-mocks/unit/app/pages/ib-booking-payments-page/SummaryTransformerServiceMocks';
import HeaderModelRtDisAnc from '@test-mocks/unit/app/pages/ib-booking-payments-page/HeaderModel-RT-1PX-ANC-mock.json';
import BookingInfo from '@test-mocks/storage/BookingInfo-mock.json';
import { HeaderDataHeaderModel, ShoppingBasketTripPassenger, ShoppingBasketType } from '@src/app/core/models/ib-booking-availability/header-model';
import { Slice } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend( localizedFormat );

describe('IbSummaryTransformerService Test', () => {
    let service: IbSummaryTransformerService;
    // let fakeAJSCurrencyService: CurrencyServiceMock = new CurrencyServiceMock();
    // let fakeSessionStorageService = new StorageServiceMock();
    let fakeAJSRootScope = new RootScopeMock();
    let fakeTranslateService: TranslateServiceMock = new TranslateServiceMock();
    beforeEach(async () => {
        TestBed.configureTestingModule( {
            declarations: [
                EntriesArrayPipe
            ],
            imports: [
                TitleCasePipe
            ],
            providers: [
                IbSummaryTransformerService,
                { provide: AJSRootScope, useValue: fakeAJSRootScope },
                { provide: TranslateService, useValue: fakeTranslateService }
                // { provide: AJSCurrencyService, useValue: fakeAJSCurrencyService },
                // { provide: CommonsSessionStorageService, useValue: fakeSessionStorageService },
            ]
        } );
        service = TestBed.inject( IbSummaryTransformerService );
    });
    describe( 'When titleCasePipe is called', () => {
        it( 'it should return the string transformed', () => {
            const titleCase = service[ 'titleCasePipe' ]( 'aaa' );
            expect( titleCase ).toEqual( 'Aaa' );
        });
    });
    describe( 'When discountsArrayPipe is called', () => {
        it( 'it should object tranformed into array', () => {
            const discounts = service[ 'discountsArrayPipe' ]( HeaderDiscountObject );
            expect( discounts.length > 0 ).toBe( true );
            expect( discounts[0].type ).toBe( 'RES' );
        });
    });
    describe( 'When setTrips is called', () => {
        it( 'it should return the transformed trips list', () => {
            const slices = [ ...BookingInfo.order.slices ] as unknown as Slice[];
            const families = [ ...BookingInfo.fareFamilyConditions ] as unknown as AvailabilityTransformerModel.FareFamilyCondition[];
            const trips = service.setTrips( slices, families );
            expect( trips.length > 0 ).toBe( true );
            expect( trips[0].fare.title ).toBe( `${ families[0].cabinDescription } ${ families[0].commercialName }` );
            expect( trips[0].fare.items.length > 0 ).toBe( true );
        });
    });
    describe( 'When setPassengers is called', () => {
        it( 'it should return the transformed passengers list', () => {
            const headerPassengers: ShoppingBasketTripPassenger[] = <ShoppingBasketTripPassenger[]> [...HeaderModelRtDisAnc.headerModel.shoppingBasket.trips.trips[ 0 ].passengers];
            const passengers = service.setPassengers( headerPassengers );
            expect( passengers.length > 0 ).toBe( true );
        });
    });
    describe( 'When setOtherItemsFromBasket is called', () => {
        it( 'it should return the transformed other items list', () => {
            const headerBasket: ShoppingBasketType = <ShoppingBasketType> <unknown> { ...HeaderModelRtDisAnc.headerModel.shoppingBasket };
            const others = service.setOtherItemsFromBasket( headerBasket );
            expect( others.length > 0 ).toBe( true );
        });
    });
    describe( 'When getAncillaries is called', () => {
        it( 'it should return the transformed ancillaries list', () => {
            const headerModel: HeaderDataHeaderModel = <HeaderDataHeaderModel> <unknown> { ...HeaderModelRtDisAnc.headerModel };
            const ancillaries = service.getAncillaries( headerModel );
            expect( ancillaries.length > 0 ).toBe( true );
        });

        it( 'it should include assist card ancillarie when hasAssistCard is true', () => {
            const headerModel: HeaderDataHeaderModel = <HeaderDataHeaderModel> <unknown> {
                ...HeaderModelRtDisAnc.headerModel,
                shoppingBasket: {
                    ...HeaderModelRtDisAnc.headerModel.shoppingBasket,
                    assistCard: {
                        name: 'Assist Card Premium',
                        hasAssistCard: true,
                        total: {
                            total: 56,
                            totalFormatted: '56 EUR'
                        },
                        currency: 'EUR'
                    }
                }
            };

            const ancillaries = service.getAncillaries( headerModel );
            const assistCardAncillarie = ancillaries.find( ( item ) => item.code === 'JOURNEY_ASSISTANCE' );

            expect( assistCardAncillarie ).toBeTruthy();
            expect( assistCardAncillarie.total ).toBe( '56 EUR' );
            expect( assistCardAncillarie.segments[ 0 ].id ).toBe( 'assist-card-segment' );
            expect( assistCardAncillarie.segments[ 0 ].items[ 0 ].code ).toBe( 'assist-card' );
            expect( assistCardAncillarie.segments[ 0 ].items[ 0 ].price ).toBe( '56 EUR' );
            expect( assistCardAncillarie.segments[ 0 ].items[ 0 ].description ).toBe( 'Assist Card Premium' );
        });

        it( 'it should not include assist card ancillarie when hasAssistCard is false', () => {
            const headerModel: HeaderDataHeaderModel = <HeaderDataHeaderModel> <unknown> {
                ...HeaderModelRtDisAnc.headerModel,
                shoppingBasket: {
                    ...HeaderModelRtDisAnc.headerModel.shoppingBasket,
                    assistCard: {
                        name: 'Assist Card Premium',
                        hasAssistCard: false,
                        total: {
                            total: 56,
                            totalFormatted: '56 EUR'
                        },
                        currency: 'EUR'
                    }
                }
            };

            const ancillaries = service.getAncillaries( headerModel );
            const assistCardAncillarie = ancillaries.find( ( item ) => item.code === 'JOURNEY_ASSISTANCE' );

            expect( assistCardAncillarie ).toBeUndefined();
        });
    });
});
