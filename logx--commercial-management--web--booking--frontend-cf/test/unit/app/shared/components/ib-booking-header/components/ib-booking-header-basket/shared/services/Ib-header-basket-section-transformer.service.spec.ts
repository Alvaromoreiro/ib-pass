import { TestBed } from "@angular/core/testing";
import { IbBasketSectionTransformerService } from "@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-section-transformer.service";
import { AJSCurrencyService, CommonsSessionStorageService } from "ib-web-commons/utils";
import { CurrencyServiceMock } from "test/mocks/Services/CurrencyServiceMocks";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";


// @ts-ignore
interface TestService extends IbBasketSectionTransformerService {
    CommonsSessionStorageService: StorageServiceMock;
    CurrencyService: CurrencyServiceMock;
}


describe ('Test IbBasketSectionTransformerService', () => {
    let service: TestService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBasketSectionTransformerService,
                { provide: AJSCurrencyService, useClass: CurrencyServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock }
            ]
        });
        service = TestBed.inject<unknown>(IbBasketSectionTransformerService) as TestService;
    });
    describe ('Test setInfoAncillarie', ()=> {
        it ('Test setInfoAncillarie', () => {
            const {CommonsSessionStorageService, setInfoAncillarie} = service;
            const flexInfo = {
                total: 10,
                description: 'Flexibilidad'
            };
            const currency = 'EUR';
            CommonsSessionStorageService.set('currency', currency);
            const result = setInfoAncillarie(flexInfo);
            expect(result).toEqual({
                "info": {
                    "type": "ancillarie",
                    "title": "ANCILLARIES_FLEXIBILITY_TITLE",
                    "category": "flexibility",
                    "currency": "EUR",
                    "amount": {
                        "title": "ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT",
                        "price": 10,
                        "priceFormatted": "10€"
                    },
                    "items": [
                        {
                            "concepts": [
                                {
                                    "quantity": 1,
                                    "description": "Flexibilidad",
                                    "price": 10,
                                    "priceFormatted": "10€"
                                }
                            ]
                        }
                    ],
                    "delete": [
                        {
                            "type": "FLEXIBILITY_ON_DEMAND"
                        }
                    ]
                },
                "hasFlexibilization": true
            });
        });
    })
    describe ('Test setPriorityInfoAncillarie', ()=> {
        it ('Test setPriorityInfoAncillarie', () => {
            const {CommonsSessionStorageService, setPriorityInfoAncillarie} = service;
            const priorityInfo = getPriorityInfo();
            const currency = 'EUR';
            CommonsSessionStorageService.set('currency', currency);
            const result = setPriorityInfoAncillarie(priorityInfo);
            const expectedResult = getExpectedPriorityInfoResult();
            expect(result).toEqual(expectedResult);
        });

        function getPriorityInfo() {
            return [
                {
                    trips: [
                        { id: 1, amount: 10, checkedTrip: true },
                        { id: 2, amount: 20, checkedTrip: false }
                    ]
                },
                {
                    trips: [
                        { id: 3, amount: 30, checkedTrip: true },
                        { id: 4, amount: 40, checkedTrip: false }
                    ]
                }
            ];
        }

        function getExpectedPriorityInfoResult() {
            return {
                "info": {
                    "type": "ancillarie",
                    "title": "Prioridad de embarque",
                    "category": "priority",
                    "currency": "EUR",
                    "amount": 40,
                    "items": [],
                    "delete": [
                        { "type": "PRIORITY_BOARDING" }
                    ],
                    "trips": [
                        {
                            "id": 1,
                            "amount": 10,
                            "priceFormatted": "10€",
                            "quantity": 1,
                            arrival: undefined,
                            departure: undefined
                        },
                        {
                            "id": 3,
                            "amount": 30,
                            "priceFormatted": "30€",
                            "quantity": 1,
                            arrival: undefined,
                            departure: undefined
                        }
                    ],
                    "priceFormatted": "40€"
                },
                "hasPriorityBoarding": true
            };
        }
    });

});