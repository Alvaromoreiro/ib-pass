import { TestBed } from "@angular/core/testing";
import { IbMmbSummaryService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-summary/services/ib-Mmb-summary.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { headerModelBaggage } from "./mocks/header-model-baggage.mock";
import { headerModelSeat } from "./mocks/header-model-seat.mock";
import { headerModelPriorityBoarding } from "./mocks/header-model-priority-boarding.mock";
import { headerModelSpeqs } from "./mocks/header-model-speqs.mock";
import { headerModelInsurance } from "./mocks/header-model-insurance.mock";
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";
import { CurrencyServiceMock } from "@test/unit/utils/CurrencyServiceMocks";
import { TranslateTestingModule } from "ngx-translate-testing";
import { of } from "rxjs";
import { AJSCurrencyService, CommonsSessionStorageService } from "ib-web-commons/utils";

const fakeTranslateService = jasmine.createSpyObj<TranslateService>(['get','instant']);

const SPANISH_LANGUAGE = 'es';
const SPANISH_TRANSLATIONS = {
  'PRIORITY_BOARDING_TITLE': 'Prioridad de embarque',
  'SEATS_MIN_TEXT': 'asientos',
  'BAGGAGE_SINGULAR_TEXT': 'maleta',
  'BAGGAGE_PLURAL_TEXT': 'maletas'
};

let fakeProps = {
    stopover: false,
    upgradingBid: false,
    collapsed: false,
    ancillaries: [{
        code: 'BAGGAGE',
        segments: [{
            id: 'seg0',
            title: 'Madrid - Roma',
            items: [{
                amount: 1,
                code: 'BAGGAGE_15',
                price: '28,00€',
                description: 'maleta 15Kg'
            }]
        }],
        total: '28,00€'
    }],
    totalPrice: '28,00€'
};

let fakePaymentInfoWithoutDiscount = {
    "total": 28,
    "charges": [],
    "discounts": [],
    "currency": {
        "code": "EUR",
        "format": {
            "code": "EUR",
            "symbol": {
                "value": "€",
                "alignment": "R"
            },
            "decimalDigits": {
                "value": 2,
                "rounding": "UP"
            },
            "separator": {
                "decimal": ".",
                "grouping": ","
            }
        }
    }
}

let fakePaymentInfoWithDiscount = {
    "total": 8,
    "charges": [],
    "discounts": [
        {
            "id": "BON20EUR",
            "total": 20,
            "type": "VOUCHER"
        }
    ],
    "currency": {
        "code": "EUR",
        "format": {
            "code": "EUR",
            "symbol": {
                "value": "€",
                "alignment": "R"
            },
            "decimalDigits": {
                "value": 2,
                "rounding": "UP"
            },
            "separator": {
                "decimal": ".",
                "grouping": ","
            }
        }
    }
}

let fakePaymentInfoWithAviosDiscount = {
    "total": 8,
    "charges": [],
    "discounts": [
        {
            "id": "BON20EUR",
            "total": 20,
            "type": 'AVIOS'
        }
    ],
    "currency": {
        "code": "EUR",
        "format": {
            "code": "EUR",
            "symbol": {
                "value": "€",
                "alignment": "R"
            },
            "decimalDigits": {
                "value": 2,
                "rounding": "UP"
            },
            "separator": {
                "decimal": ".",
                "grouping": ","
            }
        }
    }
}

describe('Test IbMmbSummaryService', () => {
    let service: IbMmbSummaryService;
    let fakeCommonsSessionStorageService: any = new StorageServiceMock();
    let fakeAJSCurrencyUtilsService: any = new CurrencyServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                TranslateTestingModule,
                TranslateTestingModule.withTranslations(SPANISH_LANGUAGE, SPANISH_TRANSLATIONS).withDefaultLanguage('es')
            ],
            providers: [
                IbMmbSummaryService,
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyUtilsService },
                { provide: TranslateService, useValue: fakeTranslateService},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService }
            ]
        });
        service = TestBed.inject(IbMmbSummaryService);
    });

    beforeEach(() => {
        fakeTranslateService.get.and.returnValue(of([
        'PRIORITY_BOARDING_TITLE', 'SEATS_MIN_TEXT', 'BAGGAGE_SINGULAR_TEXT', 'BAGGAGE_PLURAL_TEXT']));
    });

    it(' call getAncillaries and return baggages', () => {
        const ancillaries = service.getAncillaries(headerModelBaggage);
        expect(ancillaries[0].segments.length).toBe(2);
        expect(ancillaries[0].code).toBe('BAGGAGE');
        expect(ancillaries[0].total).toBe('258.00€');
    });

    it(' call getBaggageAncillarie and return baggages', () => {
        // @ts-expect-error
        const ancillarie = service.getBaggageAncillarie(headerModelBaggage.shoppingBasket.baggages);
        expect(ancillarie.segments.length).toBe(2);
        expect(ancillarie.code).toBe('BAGGAGE');
        expect(ancillarie.total).toBe('258.00€');
    });

    it(' call getBaggageSegments and return segments from baggages', () => {
        // @ts-expect-error
        const ancillarieSegment = service.getBaggageSegments(headerModelBaggage.shoppingBasket.baggages);
        expect(ancillarieSegment[0].items.length).toBe(3);
        expect(ancillarieSegment[0].id).toBe('seg0');
        expect(ancillarieSegment[0].title).toBe('Madrid - Geneva');
        expect(ancillarieSegment[1].items.length).toBe(2);
        expect(ancillarieSegment[1].id).toBe('seg1');
        expect(ancillarieSegment[1].title).toBe('Geneva - Madrid');
    });

    it(' call getBaggageItems and return items from each baggage segment', () => {
        // @ts-expect-error
        const generalItem = service.getBaggageItems(headerModelBaggage.shoppingBasket.baggages.segments[0]);
        expect(generalItem[0].amount).toBe(3);
        expect(generalItem[0].code).toBe('BAGGAGE_15');
        expect(generalItem[0].price).toBe('69.00€');
        expect(generalItem[0].description = 'maletas 15kg');
        expect(generalItem[1].amount).toBe(1);
        expect(generalItem[1].code).toBe('BAGGAGE_23');
        expect(generalItem[1].price).toBe('28.00€');
        expect(generalItem[1].description = 'maleta 23kg');
        expect(generalItem[2].amount).toBe(1);
        expect(generalItem[2].code).toBe('BAGGAGE_32');
        expect(generalItem[2].price).toBe('50.00€');
        expect(generalItem[2].description = 'maleta 32kg');
    });

    it(' call getSeatAncillarie and return seats', () => {
        // @ts-expect-error
        const ancillarie = service.getSeatAncillarie(headerModelSeat.shoppingBasket.seats);
        expect(ancillarie.segments.length).toBe(2);
        expect(ancillarie.code).toBe('SEAT');
        expect(ancillarie.total).toBe('53.00€');
    });

    it(' call getSeatSegments and return segments from seats', () => {
        // @ts-expect-error
        const ancillarieSegment = service.getSeatSegments(headerModelSeat.shoppingBasket.seats);
        expect(ancillarieSegment[0].items.length).toBe(2);
        expect(ancillarieSegment[0].id).toBe('seg0');
        expect(ancillarieSegment[0].title).toBe('Madrid - Geneva');
        expect(ancillarieSegment[1].items.length).toBe(2);
        expect(ancillarieSegment[1].id).toBe('seg1');
        expect(ancillarieSegment[1].title).toBe('Geneva - Madrid');
    });

    it(' call getSeatItems and return items from each seat segment', () => {
        // @ts-expect-error
        const generalItem = service.getSeatItems(headerModelSeat.shoppingBasket.seats.segments[0]);
        expect(generalItem[0].amount).toBe(1);
        expect(generalItem[0].code).toBe('UPFRONT');
        expect(generalItem[0].price).toBe('11.00€');
        expect(generalItem[0].description = 'SEAT_MIN_TEXT Upfront');
        expect(generalItem[1].amount).toBe(1);
        expect(generalItem[1].code).toBe('EXTRA_SIZE');
        expect(generalItem[1].price).toBe('18.00€');
        expect(generalItem[1].description = 'SEAT_MIN_TEXT XL');
    });

    it(' call getPriorityBoardingAncillarie and return priorityBoarding', () => {
        // @ts-expect-error
        const ancillarie = service.getPriorityBoardingAncillarie(headerModelPriorityBoarding.shoppingBasket.priorityBoarding);
        expect(ancillarie.segments.length).toBe(2);
        expect(ancillarie.code).toBe('PRIORITY_BOARDING');
        expect(ancillarie.total).toBe('32.00€');
    });

    it(' call getPriorityBoardingSegments and return segments from priorityBoarding', () => {
        // @ts-expect-error
        const ancillarieSegment = service.getPriorityBoardingSegments(headerModelPriorityBoarding.shoppingBasket.priorityBoarding);
        expect(ancillarieSegment[0].items.length).toBe(1);
        expect(ancillarieSegment[0].id).toBe('seg0');
        expect(ancillarieSegment[0].title).toBe('Madrid - Geneva');
        expect(ancillarieSegment[1].items.length).toBe(1);
        expect(ancillarieSegment[1].id).toBe('seg1');
        expect(ancillarieSegment[1].title).toBe('Geneva - Madrid');
    });

    it(' call getPiorityBoardingItems and return items from each priorityboarding segment', () => {
        // @ts-expect-error
        const generalItem = service.getPiorityBoardingItems(headerModelPriorityBoarding.shoppingBasket.priorityBoarding.info.trips[0]);
        expect(generalItem[0].amount).toBe(2);
        expect(generalItem[0].code).toBe('IB348020240517');
        expect(generalItem[0].price).toBe('16.00€');
        expect(generalItem[0].description = 'Prioridad de embarque');
    });

    it(' call getSpeqsAncillarie and return speqs', () => {
        // @ts-expect-error
        const ancillarie = service.getSpeqsAncillarie(headerModelSpeqs.shoppingBasket.speqs);
        expect(ancillarie.segments.length).toBe(2);
        expect(ancillarie.code).toBe('SPECIAL_EQUIPMENT');
        expect(ancillarie.total).toBe('570.00€');
    });

    it(' call getSpeqsSegments and return segments from speqs', () => {
        // @ts-expect-error
        const ancillarieSegment = service.getSpeqsSegments(headerModelSpeqs.shoppingBasket.speqs);
        expect(ancillarieSegment[0].items.length).toBe(6);
        expect(ancillarieSegment[0].id).toBe('seg0');
        expect(ancillarieSegment[0].title).toBe('Madrid - Geneva');
        expect(ancillarieSegment[1].items.length).toBe(4);
        expect(ancillarieSegment[1].id).toBe('seg1');
        expect(ancillarieSegment[1].title).toBe('Geneva - Madrid');
    });

    it(' call getSpeqsItems and return items from each speq segment', () => {
        // @ts-expect-error
        const generalItem = service.getSpeqsItems(headerModelSpeqs.shoppingBasket.speqs.segments[0]);
        expect(generalItem[0].amount).toBe(1);
        expect(generalItem[0].code).toBe('BICYCLE');
        expect(generalItem[0].price).toBe('50.00€');
        expect(generalItem[0].description).toBe('Bicycles');
        expect(generalItem[1].amount).toBe(1);
        expect(generalItem[1].code).toBe('SURFBOARD');
        expect(generalItem[1].price).toBe('65.00€');
        expect(generalItem[1].description).toBe('Surfboard');
        expect(generalItem[2].amount).toBe(1);
        expect(generalItem[2].code).toBe('SKI_SNOW');
        expect(generalItem[2].price).toBe('40.00€');
        expect(generalItem[2].description).toBe('Ski equipment');
        expect(generalItem[3].amount).toBe(1);
        expect(generalItem[3].code).toBe('GOLF_EQUIPMENT');
        expect(generalItem[3].price).toBe('40.00€');
        expect(generalItem[3].description).toBe('Golf equipment');
        expect(generalItem[4].amount).toBe(1);
        expect(generalItem[4].code).toBe('FISHING_EQUIPMENT');
        expect(generalItem[4].price).toBe('40.00€');
        expect(generalItem[4].description).toBe('Fishing equipment');
        expect(generalItem[5].amount).toBe(1);
        expect(generalItem[5].code).toBe('SCUBA_DIVING');
        expect(generalItem[5].price).toBe('40.00€');
        expect(generalItem[5].description).toBe('Scuba diving');
    });

    it(' call getInsuranceAncillarie and return insturances', () => {
        // @ts-expect-error
        const ancillarie = service.getInsuranceAncillarie(headerModelInsurance.shoppingBasket.insurance);
        expect(ancillarie.type).toBe('Travel Assistance and Medical Teleconsultation');
        expect(ancillarie.code).toBe('INSURANCE');
        expect(ancillarie.total).toBe('29.38€');
    });

    describe('When call updateSummaryInfo without discount', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('headerModel', headerModelPriorityBoarding);
        });
        it ('Must return correct updatedProps data', () => {
            // @ts-expect-error
            const updatedProps = service.updateSummaryInfo(fakeProps, fakePaymentInfoWithoutDiscount);
            expect(updatedProps.totalPrice).toBe('28€');
            expect(updatedProps.otherItems).toBe(undefined);
        });
    });

    describe('When call updateSummaryInfo with discount', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('headerModel', headerModelPriorityBoarding);
        });
        it('Must return correct updatedProps data', () => {
            // @ts-expect-error
            const updatedProps = service.updateSummaryInfo(fakeProps, fakePaymentInfoWithDiscount);
            expect(updatedProps.totalPrice).toBe('8€');
            expect(updatedProps.otherItems.length).toBe(1);
        });
        it('Must return correct updatedProps data', () => {
            const fakePaymentInfoWithAviosDiscountModified = {
                ...fakePaymentInfoWithAviosDiscount,
                discounts: [
                    {
                        ...fakePaymentInfoWithAviosDiscount.discounts[0],
                    }
                ]
            };
            // @ts-expect-error
            const updatedProps = service.updateSummaryInfo(fakeProps, fakePaymentInfoWithAviosDiscountModified);
            expect(updatedProps.totalPrice).toBe('8€');
            expect(updatedProps.otherItems.length).toBe(1);
        });
    });
});
