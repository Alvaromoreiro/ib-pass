import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageServiceMock } from '../../../../../../../../mocks/Services/StorageServiceMock'
import { AJSRootScope, AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../../../../../../mocks/Services/TranslateServiceAngularMock';
import { IbBasketTransformerService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/services/ib-booking-header-basket-transformer.service';
import dayjs from 'dayjs';

describe( 'IbBasketTransformerService tests', () => {
    let service: IbBasketTransformerService;
    let fakeSessionStorage = new StorageServiceMock();
    let fakeTranslate = new TranslateServiceMock();

    const mockHeaderModel = {
        headerModel:{
            shoppingBasket:{
                currency: '€',
                trips:{
                    trips:[{
                        passengers:[{
                            type:'ADULT',
                            quantity: 1,
                            perPassengerPrice:10,
                            taxes: 1,
                            description: 'name'
                        }],
                        scales:false}],
                    total: {
                        totalPrice: 15
                    }
                }
            }
        }
    }
    const mockSeats = {
        segments: [{
            seats:[{
                passengers:[{
                    amount:0
                }]
            }]
        }]
    }
    const mockSeatsNotFree = {
        segments: [{
            seats:[{
                passengers:[{
                    amount:5
                }]
            }]
        }]
    }
    const fakeCurrencyService = {
        formatAvios: jasmine.createSpy().and.callFake((symbol, value) => {
            return `${value} Avios`;
        }),
        formatPrice: jasmine.createSpy().and.callFake((symbol, value) => {
            return `${value} €`;
        }),
        getCurrencyObject: jasmine.createSpy().and.callFake(() => {
            return `€`;
        })

    };
    beforeEach( () => {
        TestBed.configureTestingModule( {
            imports: [ HttpClientTestingModule ],
            providers: [
                IbBasketTransformerService,
                { provide: AJSCurrencyService, useValue: fakeCurrencyService },
                {provide: AJSRootScope, useValue: { appLang: 'ES'}},
                {provide: CommonsSessionStorageService, useValue: fakeSessionStorage},
                {provide: TranslateService, useValue: fakeTranslate}
            ]
        } );
        service = TestBed.inject( IbBasketTransformerService );
    } );

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );
    describe( 'should be checkFreeSeats', () => {
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel',mockHeaderModel);
        })
        it('should return transformed free seats',()=>{
            const returnSeats = {segments: [{ seats: [{ passengers: [{ amount: 0, amountFormatted: '0 €' }], freePassenger: [{ amount: 0, amountFormatted: '0 €' }], totalAmountFreePassenger: '0 € €', paymentPassenger: [], totalAmountPaymentPassenger: '0 €' } ] }]}
            let returnValue = service.checkFreeSeats(mockSeats);
            expect( returnValue ).toEqual(returnSeats);
        })
        it('should return transformed non free seats',()=>{
            const returnSeats = { segments: [ { seats: [ {passengers: [{ amount: 5, amountFormatted: '5 €' } ], freePassenger: [  ], totalAmountFreePassenger: '0 €', paymentPassenger: [ { amount: 5, amountFormatted: '5 €' } ], totalAmountPaymentPassenger: '5 €' }]}]}
            let returnValue = service.checkFreeSeats(mockSeatsNotFree);
            expect( returnValue ).toEqual(returnSeats);
        })
    });
    describe( 'should be deleteTripsCartFromDispo', () => {
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel',mockHeaderModel);
        })
        it('should return transformed free seats',()=>{
            let returnValue = service.deleteTripsCartFromDispo();
            expect( returnValue ).toEqual({total:{totalPrice:0,original:0, formatted: '0 €'},trips:[]});
        })
    });
    describe( 'should be transformTripsCartFromDispo', () => {
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel',mockHeaderModel);
        })
        it('should return transformed free seats',()=>{
            const mockOfferSelected = {discountsApplied:{discounts:[], originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}], originalPrice:{total:10}}, price:{ticketingFee:5, total:10}, offerItems:[{passengerIds:['534523'], price:{fare:5, tax:1}}]};
            const mockModel = {availabilityData:{originDestinations:[{originCity:{code:'MAD',country:{description:'Spain', code:'ES'},description:'Madrid'}, destinationCity: {code:'BCN',country:{description:'Spain', code:'ES'}, description:'Barcelona'}}]},selectedSlices:[{info:{departureDateTime:new Date('12/30/2070')},destination:'BCN'}]}
            let returnValue = service.transformTripsCartFromDispo(mockOfferSelected, mockModel);
            expect( returnValue ).toEqual({
                trips: [
                    {
                        scales: false,
                        segments: [
                            {
                                date: dayjs(new Date('12/30/2070')).locale('ES').format('dddd DD MMM YYYY / HH:mm'),
                                origin: {
                                    code: 'MAD',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Madrid'
                                },
                                destination: {
                                    code: 'BCN',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Barcelona'
                                },
                                segments: []
                            }
                        ],
                        passengers: [
                            {
                                quantity: 1,
                                type: 'ADULT',
                                description: 'ADULT',
                                perPassengerPrice: '5 €',
                                taxes: '1 €'
                            }
                        ]
                    }
                ],
                total: {
                    totalPrice: 5,
                    formatted:'5 €',
                    original: 10
                },
                ticketingFee: 5,
                ticketingFeeFormatted:'5 €'
            });
        })
    });
    describe( 'should be transformTripsCart', () => {
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel',mockHeaderModel);
            fakeSessionStorage.set('fareData',{contextMetadata:{currencies:['€']},offers:[{price:{total:10},discountsApplied:{discounts:[], originalPrice:{total:10},originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}]},slices:[
                {departureDateTime:new Date('12/30/2070'), discountsApplied:{discounts:[], originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}], originalPrice:{total:10}}, price:{ticketingFee:5, total:10}, offerItems:[{passengerIds:['534523'], price:{fare:5, tax:1}}], segments:[{departure:{city:{code: 'MAD',country:{description:'Spain', code:'ES'},description:'Madrid'}}, arrival:{city:{code: 'BCN',country:{description:'Spain', code:'ES'},description:'Barcelona'}},departureDateTime:new Date('12/30/2070')}]}
            ]}]});
            fakeSessionStorage.set('breakdownPassengers',{selectedRedeption:{pricePerPax:{'ADULT':{cash:{fare:3},points:{fare:3}, paxType: 'ADULT'}}}})
        })
        it('should return transformed trips',()=>{
            fakeSessionStorage.set('breakdownPassengers', null)
            let returnValue = service.transformTripsCart(null,{summaryInfo:{passengers:{generalData:[[{number:1,totalTax:1, fare: 5, aviosFare: 2}]]}}});
            expect(returnValue).toEqual({
                trips: [
                    {
                        scales: false,
                        segments: [
                            {
                                date: dayjs(new Date('12/30/2070')).locale('ES').format('dddd DD MMM YYYY / HH:mm'),
                                origin: {
                                    code: 'MAD',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Madrid'
                                },
                                destination: {
                                    code: 'BCN',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Barcelona'
                                },
                                segments: [{ origin: { code: 'MAD', country: { description: 'Spain', code: 'ES' }, description: 'Madrid' }, destination: { code: 'BCN', country: { description: 'Spain', code: 'ES' }, description: 'Barcelona' }, date: 'Tuesday 30 Dec 2070 / 00:00' }as any]
                            }
                        ],
                        passengers: [
                            {
                                quantity: 1,
                                type: 'ADULT',
                                description: 'ADULT',
                                perPassengerPrice: '5 €',
                                taxes: '1 €'
                            }
                        ]
                    }
                ],
                total: {
                    totalPrice: 10,
                    formatted:'10 €',
                    original: 10
                }
            });
        })
        it('should return transformed trips and it has ticketingFee',()=>{
            fakeSessionStorage.set('fareData',{contextMetadata:{currencies:['€']},offers:[{redemptionOptions:{},price:{total:10, ticketingFee:1},discountsApplied:{discounts:[], originalPrice:{total:10},originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}]},slices:[
                {departureDateTime:new Date('12/30/2070'), discountsApplied:{discounts:[], originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}], originalPrice:{total:10}}, price:{ticketingFee:5, total:10}, offerItems:[{passengerIds:['534523'], price:{fare:5, tax:1}}], segments:[{departure:{city:{code: 'MAD',country:{description:'Spain', code:'ES'},description:'Madrid'}}, arrival:{city:{code: 'BCN',country:{description:'Spain', code:'ES'},description:'Barcelona'}},departureDateTime:new Date('12/30/2070')}]}
            ]}]});
            let returnValue = service.transformTripsCart(null,{totalPrice:{price:{totalAvios:10,totalPoints:10, tax:1},tax:1},summaryInfo:{passengers:{generalData:{ADULT:[{number:1,totalTax:1, fare: 5, aviosFare: 2}]}}}});
            expect(returnValue).toEqual({
                trips: [
                    {
                        scales: true,
                        segments: [
                            {
                                date: dayjs(new Date('12/30/2070')).locale('ES').format('dddd DD MMM YYYY / HH:mm'),
                                origin: {
                                    code: 'MAD',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Madrid'
                                },
                                destination: {
                                    code: 'BCN',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Barcelona'
                                },
                                segments: [{ origin: { code: 'MAD', country: { description: 'Spain', code: 'ES' }, description: 'Madrid' }, destination: { code: 'BCN', country: { description: 'Spain', code: 'ES' }, description: 'Barcelona' }, date: 'Tuesday 30 Dec 2070 / 00:00' }as any]
                            }
                        ],
                        passengers: [{ parsedAviosFare: '3 Avios' as any, quantity: 1, type: 'ADULT', description: 'ADULT', perPassengerPrice: '3 €', taxes: '1 €' }]
                    }
                ],
                total: {
                    totalAvios:10,
                    original: 10,
                    totalPrice: 6,
                    formatted: '6 €',
                },
                ticketingFee: 1,
                ticketingFeeFormatted: '1 €'
            });
        })
        it('should return transformed trips and it is redemption flow',()=>{
            fakeSessionStorage.set('fareData',{contextMetadata:{currencies:['€']},offers:[{redemptionOptions:{},price:{total:10},discountsApplied:{discounts:[], originalPrice:{total:10},originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}]},slices:[
                {departureDateTime:new Date('12/30/2070'), discountsApplied:{discounts:[], originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}], originalPrice:{total:10}}, price:{ticketingFee:5, total:10}, offerItems:[{passengerIds:['534523'], price:{fare:5, tax:1}}], segments:[{departure:{city:{code: 'MAD',country:{description:'Spain', code:'ES'},description:'Madrid'}}, arrival:{city:{code: 'BCN',country:{description:'Spain', code:'ES'},description:'Barcelona'}},departureDateTime:new Date('12/30/2070')}]}
            ]}]});
            let returnValue = service.transformTripsCart(null,{totalPrice:{price:{totalAvios:10,totalPoints:10, tax:1},tax:1},summaryInfo:{passengers:{generalData:{ADULT:[{number:1,totalTax:1, fare: 5, aviosFare: 2}]}}}});
            expect(returnValue).toEqual({
                trips: [
                    {
                        scales: true,
                        segments: [
                            {
                                date: dayjs(new Date('12/30/2070')).locale('ES').format('dddd DD MMM YYYY / HH:mm'),
                                origin: {
                                    code: 'MAD',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Madrid'
                                },
                                destination: {
                                    code: 'BCN',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Barcelona'
                                },
                                segments: [{ origin: { code: 'MAD', country: { description: 'Spain', code: 'ES' }, description: 'Madrid' }, destination: { code: 'BCN', country: { description: 'Spain', code: 'ES' }, description: 'Barcelona' }, date: 'Tuesday 30 Dec 2070 / 00:00' }as any]
                            }
                        ],
                        passengers: [{ parsedAviosFare: '3 Avios' as any, quantity: 1, type: 'ADULT', description: 'ADULT', perPassengerPrice: '3 €', taxes: '1 €' }]
                    }
                ],
                total: {
                    totalAvios:10,
                    original: 10,
                    totalPrice: 6,
                    formatted: '6 €'
                }
            });
        })
    });
    describe( 'should be transformTripsFromOrder', () => {
        beforeEach(()=>{
            fakeSessionStorage.set('headerModel',mockHeaderModel);
            fakeSessionStorage.set('fareData',{contextMetadata:{currencies:['€']},offers:[{price:{total:10},discountsApplied:{discounts:[], originalPrice:{total:10},originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}]},slices:[
                {departureDateTime:new Date('12/30/2070'), discountsApplied:{discounts:[], originalOfferItems:[{passengerIds:['42354325'],price:{fare:5, tax:1}}], originalPrice:{total:10}}, price:{ticketingFee:5, total:10}, offerItems:[{passengerIds:['534523'], price:{fare:5, tax:1}}], segments:[{departure:{city:{code: 'MAD',country:{description:'Spain', code:'ES'},description:'Madrid'}}, arrival:{city:{code: 'BCN',country:{description:'Spain', code:'ES'},description:'Barcelona'}},departureDateTime:new Date('12/30/2070')}]}
            ]}]});
        })
        it('should return transformed trips',()=>{
            let returnValue = service.transformTripsFromOrder({
                order:{
                    discountsApplied:{
                        originalOrderItems:[{type:'flight', passengerPrices:[{passengerId:'ADULT_01', price: {tax:1, fare:3}, fare: 3}], price:{ticketingFee:1, total:9}}],originalPrice:{total:10}},
                         price:{ticketingFee:1, total:15},
                         orderItems:[{price:{ticketingFee:1, total:9}, type:'flight'}],
                         slices:[{segments:[{departure:{city:{code: 'MAD',country:{description:'Spain', code:'ES'},
                         description:'Madrid'}}, arrival:{city:{code: 'BCN',country:{description:'Spain', code:'ES'},description:'Barcelona'}},
                        departureDateTime:new Date('12/30/2070')}],departureDateTime:new Date('12/30/2070')}]},
                    passengers:[{
                            passengerType: "ADULT",
                            externalPersonalInfo: {
                                name: "Eneas",
                                firstSurname: "De Anquises",
                                lastSurname: "",
                                title: "MR"
                            }}]
                } as any);
            expect(returnValue).toEqual({
                trips: [
                    {
                        scales:false,
                        segments: [
                            {
                                date: dayjs(new Date('12/30/2070')).locale('ES').format('dddd DD MMM YYYY / HH:mm'),
                                origin: {
                                    code: 'MAD',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Madrid'
                                },
                                destination: {
                                    code: 'BCN',
                                    country:{description:'Spain', code:'ES'},
                                    description:'Barcelona'
                                },
                                segments: [{ origin: { code: 'MAD', country: { description: 'Spain', code: 'ES' }, description: 'Madrid' }, destination: { code: 'BCN', country: { description: 'Spain', code: 'ES' }, description: 'Barcelona' }, date: 'Tuesday 30 Dec 2070 / 00:00' }as any]
                            }
                        ],
                        passengers: [
                            {
                                quantity: 1,
                                type: 'ADULT',
                                perPassengerPrice: '3 €',
                                taxes: '1 €',
                                namesList:['Eneas De Anquises'],
                                description:'ADULT',
                            }
                        ]
                    }
                ],
                total: {
                    totalPrice: 8,
                    formatted:'8 €',
                    original: 9
                },
                ticketingFee: 1,
                ticketingFeeFormatted: '1 €'
            });
        })
    });
} );

