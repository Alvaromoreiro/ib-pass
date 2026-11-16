import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ibMmbVoluntaryRefundsTabComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/ib-MmB-voluntary-refunds-tab.component';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { AJSMmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';
import { VoluntaryRefundsTabService } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/services/ib-MmB-voluntary-refunds-tab.service';
import { VoluntaryRefundsTabTransformer } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/transformers/ib-MmB-voluntary-refunds-tab.transformer';
import { MmBRxProxy } from '@src/components/services/proxy/ib-MmB-rx-proxy.service';
import { StorageServiceMock } from '@test/unit/utils/StorageServiceMock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';
import { LiteralFormatterPipe } from '@shared/pipes/literalFormatter.pipe';

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({result:Promise.resolve(''), componentInstance: {
        dataModelRefund: undefined
    }});
};

class VoluntaryRefundsTabServiceMock {
    voluntaryRefundsItinRefundPromised = jasmine.createSpy('voluntaryRefundsItinRefundPromised').and.returnValue(Promise.resolve('test'));
}

const fakeData = require('@test/mocks/responses/voluntary-refunds-data-service-mock.json');

const SPANISH_LANGUAGE = 'es';
const SPANISH_TRANSLATIONS = {
    'MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY': 'Obtén tu reembolso a través de nuestro Centro de Atención al Cliente, llamando al 901 201 214.',
    'MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY_NO_CC':'Para solicitar tu reembolso tendrás que contactar con la agencia de viajes o proveedor donde adquiriste tu reserva.',
    'MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_REFUND': 'Reembolsable',
    'MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_REFUND': 'No Reembolsable'

};

const fakeTranslateService = jasmine.createSpyObj<TranslateService>(['get','instant']);
const fakeLiteralFormatterPipe = jasmine.createSpyObj<LiteralFormatterPipe>(['transform']);

describe('Component: ibMmbVoluntaryRefundsTabComponent', () => {
    let component: ibMmbVoluntaryRefundsTabComponent;
    let fixture: ComponentFixture<ibMmbVoluntaryRefundsTabComponent>;

    let fakeCommonsSessionStorageService: any = new StorageServiceMock();
    let fakeVoluntaryRefundsTabService: VoluntaryRefundsTabServiceMock;
    let fakeIbCModalService: IbCModalServiceMock;

    let responseItinRefund = {
        code: 200,
        data: fakeData
    };

    let responseTransformer = {
        "less24Hours": false,
        "price": {
            "currency": "EUR",
            "symbol": "€",
            "avios": 0,
            "cash": 209,
            "tax": 30.63,
            "ticketingFee": 0,
            "totalAvios": 0,
            "totalCash": 239.63,
            "totalRefundPrice": 30.63
        },
        "penalty": {
            "currency": "EUR",
            "symbol": "€",
            "avios": 0,
            "cash": 189,
            "formatPenalty": "189,00 €"
        },
        "totalRefund": "30,63 €",
        "totalRefundWithoutPenalty": "239,63 €",
        "totalBookingPrice": "239,63 €",
        "summaryRefund": [
            {
                "passengerType": "ADULT",
                "quantityPassenger": 1,
                "avios": 0,
                "cash": 189,
                "formatCash": "189,00 €",
                "tax": 30.63,
                "formatTax": "30,63 €",
                "currency": "EUR",
                "symbol": "€",
                "totalAvios": 0,
                "totalCash": 219.63,
                "formatTotalCash": "219,63 €"
            }
        ],
        "summaryAncillariesRefund": [
            {
                "serviceType": "baggage",
                "slice": [
                    {
                        "sliceId": "MADSVQ20240520072000",
                        "segment": [
                            {
                                "segmentId": "",
                                "origin": {
                                    "description": "",
                                    "code": ""
                                },
                                "destination": {
                                    "description": "",
                                    "code": ""
                                },
                                "groupsType": [
                                    {
                                        "subtype": "BAGGAGE_23",
                                        "quantity": 2,
                                        "avios": 0,
                                        "cash": 48,
                                        "formatCash": "48,00 €",
                                        "currency": "GBP",
                                        "symbol": "€",
                                        "totalAvios": 0,
                                        "totalCash": 96,
                                        "formatTotalCash": "96,00 €"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "serviceType": "seat",
                "slice": [
                    {
                        "sliceId": "",
                        "segment": [
                            {
                                "segmentId": "IB395420240520",
                                "origin": {
                                    "description": "",
                                    "code": ""
                                },
                                "destination": {
                                    "description": "",
                                    "code": ""
                                },
                                "groupsType": [
                                    {
                                        "quantity": 2,
                                        "avios": 0,
                                        "cash": 10,
                                        "formatCash": "10,00 €",
                                        "currency": "GBP",
                                        "symbol": "€",
                                        "totalAvios": 0,
                                        "totalCash": 20,
                                        "formatTotalCash": "20,00 €"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "serviceType": "priorityBoarding",
                "slice": [
                    {
                        "sliceId": "BIOMAD20231228174000",
                        "segment": [
                            {
                                "segmentId": "IB042320240330",
                                "origin": {
                                    "description": "Bilbao",
                                    "code": "SDQ"
                                },
                                "destination": {
                                    "description": "Madrid",
                                    "code": "MAD"
                                },
                                "groupsType": [
                                    {
                                        "quantity": 1,
                                        "avios": 0,
                                        "cash": 10,
                                        "formatCash": "10,00 €",
                                        "currency": "EUR",
                                        "symbol": "€",
                                        "totalAvios": 0,
                                        "totalCash": 10,
                                        "formatTotalCash": "10,00 €"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "summaryAncillariesNotRefund": [
            {serviceType: 'specialEquipment'},
            {serviceType: 'creditCardFee'}
        ],
        "summaryAncillariesNotRefundOnline": [
            {serviceType: 'specialEquipment'},
            {serviceType: 'preOrder'},
            {serviceType: 'globickV2'},
            {serviceType: 'insurance'},
            {serviceType: 'wineClub'},
            {serviceType: 'bob'},
            {serviceType: 'stopover'}
        ],
        "summaryPenalty": {
            "summaryPassengerPenalties": [
                {
                    "passengerType": "ADULT",
                    "quantityPassenger": 1,
                    "avios": 0,
                    "cash": 189,
                    "formatCash": "189,00 €",
                    "currency": "EUR",
                    "symbol": "€",
                    "totalAvios": 0,
                    "totalCash": 189,
                    "formatTotalCash": "189,00 €"
                }
            ]
        },
        "withPayments": true,
        "noPenalty": "0,00 €",
        "refundItems": [
            "baggage",
            "seat",
            "priorityBoarding",
            "TAXES"
        ],
        "notRefundItems": [
            "specialEquipment",
            "creditCardFee"
        ],
        "notRefundOnlineItems": [
            "insurance",
            "preOrder",
            "bob",
            "wineClub",
            "globickV2",
            "TRANS",
            "EXP",
            "stopover"
        ],
        "taxes": {
            "listTaxedRefundInfo": [
                {
                  "type": "YQ",
                  "parcial": false,
                  "refundable": false
                },
                {
                    "type": "OTHER",
                    "parcial": false,
                    "refundable": false
                }
            ]
        },
        "listFareBasisRefundInfo": [
            {
                "sliceId": "MADBIO20240619072500",
                "refundable": true,
                "segmentIds": ["IB650120231220"],
                "noShow": true,
                "refundableNoShow": true
            },
            {
                "sliceId": "BIOMAD20231228174000",
                "refundable": false,
                "segmentIds": ["IB650020231228"],
                "noShow": false,
                "refundableNoShow": false
            }
        ],
        "refundType": "TOTAL"
    }

    let fakeRootScope = {
        isDisruptionFlow: false,
        appMarket: 'ES',
        appLang: 'es'
    };

    let fakeMmBDatalayerUtilsService = {
        updateDatalayerInfo: jasmine.createSpy()
    };

    let fakeVoluntaryRefundsTabTransformer = {
        voluntaryRefundsTransfomedInfo: jasmine.createSpy('voluntaryRefundsTransfomedInfo').and.returnValue(responseTransformer)
    };

    let fakeMmBRxProxy = {
        post: jasmine.createSpy().and.returnValue({
            pipe: jasmine.createSpy()
        })
    };

    let fakeModel = {
        summaryInfo: {},
        bookingGeneralInfo: {},
        summaryModel: {},
        yourFlightsModel: {},
        yourDocumentsModel: {},
        passengersModel: {},
        managementModel: {
            managePassengers: [],
            flights: []
        },
        tabs: {},
        activeTab: '',
        showMenu: false,
        showCustomizeTab: false,
        seatBid: {},
        sisterCitiesModel: {},
        voucherPartialRefund: false,
        pricesInfo: {},
        seatChangeConditions: null,
        showSpinner: false,
        flags: {
            allowedVoluntaryRefundCash: false,
            allowedVoluntaryPartialRefundCash: false
        },
        canceledSeatsFlag: false,
        initializeModel: () => {}
    };

    let DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM = {
        VOL_REFUND_OBTAINING: 'reembolso voluntario obtencion',
        VOL_REFUND_OBTAINING_BOND: 'reembolso voluntario obtencion bono',
        VOL_REFUND_OBTAINING_CASHAVIOS: 'reembolso voluntario obtencion  cashavios',
        VOL_REFUND_OBTAINING_REDENTION: 'reembolso voluntario redencion'
    };

    let DIGITAL_DATA_REFUND_PROCESS_BY_TYPE = {
        PENALTY: 'penalizado',
        WITHOUT_PENALTY: 'sin penalización',
        QUALITY_COMMITMENT: 'compromiso calidad'
    };

    let fakeRefundBookingType = {
        GETTING_BOOKING: 'GETTING_BOOKING',    //CASO RESERVA OBTENCIÓN
        GETTING_CASH_AVIOS_BOOKING: 'GETTING_CASH_AVIOS_BOOKING',      //CASO RESERVA OBTENCIÓN CASH&AVIOS
        EXEMPTION_AVIOS_BOOKING: 'EXEMPTION_AVIOS_BOOKING',    //CASO RESERVA REDENCIÓN AVIOS
        EXEMPTION_AVIOS_MONEY_BOOKING: 'EXEMPTION_AVIOS_MONEY_BOOKING',    //CASO RESERVA REDENCIÓN AVIOS&MONEY
        MULTI_COIN_BOOKING: 'MULTI_COIN_BOOKING',      //CASO RESERVA MULTIMONEDA
        GETTING_QUALITY_BOOKING: 'GETTING_QUALITY_BOOKING',    //CASO OBTENCIÓN CALIDAD
        EXEMPTION_QUALITY_BOOKING: 'EXEMPTION_QUALITY_BOOKING',    //CASO REDENCIÓN CALIDAD
        EXEMPTION_PAY_WIP: 'EXEMPTION_PAY_WIP'     //CASO REDENCIÓN PAGO WIP (FUERA MVP)
    };

    let fakeBookingInfo = require('@test/mocks/storage/booking-info-voluntary-refunds-mock.json');

    let fakeBookingInfoLanguages = { ...fakeBookingInfo };

    let fakefareFamilyConditions = require('@test/mocks/storage/fare-family-conditions-mock.json');

    beforeEach(async() => {
        fakeIbCModalService = new IbCModalServiceMock();
        fakeVoluntaryRefundsTabService = new VoluntaryRefundsTabServiceMock();
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                TranslateTestingModule,
                TranslateTestingModule.withTranslations(SPANISH_LANGUAGE, SPANISH_TRANSLATIONS).withDefaultLanguage('es')
            ],
            declarations: [ibMmbVoluntaryRefundsTabComponent],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: IbCModalService, useValue: fakeIbCModalService },
                // { provide: IbCBaseRestService, useValue: fakeIbCBaseRestService },
                { provide: AJSMmBDatalayerUtilsService, useValue: fakeMmBDatalayerUtilsService },
                { provide: VoluntaryRefundsTabService, useValue: fakeVoluntaryRefundsTabService },
                { provide: VoluntaryRefundsTabTransformer, useValue: fakeVoluntaryRefundsTabTransformer },
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: TranslateService, useValue: fakeTranslateService},
                { provide: LiteralFormatterPipe, useValue: fakeLiteralFormatterPipe}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ibMmbVoluntaryRefundsTabComponent);
        component = fixture.componentInstance;
        component.model = fakeModel;
        fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);

        fakeTranslateService.get.and.returnValue(of([
            'MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY',
            'MMB_VOLUNTARY_REFUNDS_REFUND_NOT_AVAILABLE_BODY_NO_CC',
            'MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_REFUND',
            'MMB_VOLUNTARY_REFUNDS_BOX_YOUR_REFUND_DOES_NOT_REFUND'
        ]));



    });

    it('should create the component when init', () => {
        expect(component).toBeTruthy();
    });

    it('when ngOnInit is called properties should be initialized correctly & flag allowedVoluntaryRefundCash is false', () => {
        component.model.flags.allowedVoluntaryRefundCash = false;
        component.ngOnInit();
        expect(component.model.showSpinner).toBe(false);
    });

    it('when ngOnInit is called properties should be initialized correctly & flag allowedVoluntaryRefundCash is true', () => {
        component.model.flags.allowedVoluntaryRefundCash = true;
        component.ngOnInit();
        expect(component.model.showSpinner).toBe(true);
    });

    describe('when ngOnInit is called properties should be initialized correctly & flag allowedVoluntaryRefundCash is false & channel is CALL_CENTER', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('pnrChannel', 'CALL_CENTER');
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
        });
        it('should return correct literal', () => {
            component.model.flags.allowedVoluntaryRefundCash = false;
            component.ngOnInit();
            expect(component.model.showSpinner).toBe(false);
            expect(component.voluntaryRefundNotAvailableBody = 'Obtén tu reembolso a través de nuestro Centro de Atención al Cliente, llamando al 901 201 214.');
        });
    });

    describe('when ngOnInit is called properties should be initialized correctly & flag allowedVoluntaryRefundCash is false & channel is NDC_DIRECT', () => {
        beforeEach(() => {
            fakeCommonsSessionStorageService.set('pnrChannel', 'NDC_DIRECT');
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
        });
        it('should return correct literal', () => {
            component.model.flags.allowedVoluntaryRefundCash = false;
            component.ngOnInit();
            expect(component.model.showSpinner).toBe(false);
            expect(component.voluntaryRefundNotAvailableBody = 'Para solicitar tu reembolso tendrás que contactar con la agencia de viajes o proveedor donde adquiriste tu reserva.');
        });
    });

    describe('should return different process when processByPaymentItem is called', () => {
        it('should return reembolso voluntario obtencion', () => {
            component['processByPaymentItem']();
            expect(component['processByPaymentItem']()).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING);
        });
    });

    describe('should return different process when processByPaymentItem is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'VOUCHER'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return reembolso voluntario obtencion bono', () => {
            component['processByPaymentItem']();
            expect(component['processByPaymentItem']()).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_BOND);
        });
    });

    describe('should return different process when processByPaymentItem is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'AVIOS'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return reembolso voluntario obtencion cashavios', () => {
            component['processByPaymentItem']();
            expect(component['processByPaymentItem']()).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_CASHAVIOS);
        });
    });

    describe('should return different process when processByPaymentItem is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'AVIOS_REDEMPTION'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return reembolso voluntario redencion', () => {
            component['processByPaymentItem']();
            expect(component['processByPaymentItem']()).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING_REDENTION);
        });
    });

    describe('should return correct ProcessDigitalData when addProcessDigitalData is called', () => {

        it('should return reembolso voluntario obtencion sin penalización', () => {
            component['addProcessDigitalData'](false, {cash: 0, avios: 0, currency: 'DOLAR', symbol: '$', formatPenalty: '0 $'});
            expect(component['addProcessDigitalData'](false, {cash: 0, avios: 0, currency: 'DOLAR', symbol: '$', formatPenalty: '0 $'})).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING + ' ' + DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.WITHOUT_PENALTY);
        });
    });

    describe('should return correct ProcessDigitalData when addProcessDigitalData is called', () => {

        it('should return reembolso voluntario obtencion penalizado', () => {
            component['addProcessDigitalData'](false, {cash: 10, avios: 0, currency: 'DOLAR', symbol: '$', formatPenalty: '10 $'});
            expect(component['addProcessDigitalData'](false, {cash: 10, avios: 0, currency: 'DOLAR', symbol: '$', formatPenalty: '10 $'})).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING + ' ' + DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.PENALTY);
        });
    });

    describe('should return correct ProcessDigitalData when addProcessDigitalData is called', () => {

        it('should return reembolso voluntario obtencion compromiso calidad', () => {
            component['addProcessDigitalData'](true, {cash: 10, avios: 0, currency: 'DOLAR', symbol: '$', formatPenalty: '10 $'});
            expect(component['addProcessDigitalData'](true, {cash: 10, avios: 0, currency: 'DOLAR', symbol: '$', formatPenalty: '10 $'})).toBe(DIGITAL_DATA_REFUND_PROCESS_BY_PAYMENT_ITEM.VOL_REFUND_OBTAINING + ' ' + DIGITAL_DATA_REFUND_PROCESS_BY_TYPE.QUALITY_COMMITMENT);
        });
    });

    describe('when requestRefund is called', () => {

        it('should open IbMmBVoluntaryRefundsComponent', () => {
            component.requestRefund();
            expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
        });
    });

    describe('should commute refundBookingType when toggleRefundBookingType is called', () => {

        it('should return GETTING_QUALITY_BOOKING', () => {
            component['toggleRefundBookingType'](true);
            expect(component.refundBookingType).toBe(fakeRefundBookingType.GETTING_QUALITY_BOOKING);
        });
    });

    describe('should commute refundBookingType when toggleRefundBookingType is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'VOUCHER'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return GETTING_BOOKING', () => {
            component['toggleRefundBookingType'](false);
            expect(component.refundBookingType).toBe(fakeRefundBookingType.GETTING_BOOKING);
        });
    });

    describe('should commute refundBookingType when toggleRefundBookingType is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'AVIOS'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return GETTING_CASH_AVIOS_BOOKING', () => {
            component['toggleRefundBookingType'](false);
            expect(component.refundBookingType).toBe(fakeRefundBookingType.GETTING_CASH_AVIOS_BOOKING);
        });
    });

    describe('should commute refundBookingType when toggleRefundBookingType is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'AVIOS_REDEMPTION'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return EXEMPTION_AVIOS_BOOKING', () => {
            component['toggleRefundBookingType'](false);
            expect(component.refundBookingType).toBe(fakeRefundBookingType.EXEMPTION_AVIOS_BOOKING);
        });
    });

    describe('should commute refundBookingType when toggleRefundBookingType is called', () => {
        beforeEach(() => {
            let fakeBookingInfoPaymentItems = { ...fakeBookingInfo };
            fakeBookingInfoPaymentItems.paymentItems = [{type: 'AVIOS_REDEMPTION'}];
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoPaymentItems);
        });
        it('should return EXEMPTION_QUALITY_BOOKING', () => {
            component['toggleRefundBookingType'](true);
            expect(component.refundBookingType).toBe(fakeRefundBookingType.EXEMPTION_QUALITY_BOOKING);
        });
    });

    describe('when requestRefund is called with less24hours false', () => {
        beforeEach(()=>{
            let copyResponseTransformer = {...responseTransformer};
            copyResponseTransformer.less24Hours = false;
            fakeVoluntaryRefundsTabTransformer.voluntaryRefundsTransfomedInfo = jasmine.createSpy('voluntaryRefundsTransfomedInfo').and.returnValue(copyResponseTransformer);
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoLanguages);
            fakeCommonsSessionStorageService.set('fareFamilyConditions', fakefareFamilyConditions);
        });
        it('should voluntaryRefundsSuccess', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'es';
            fakeBookingInfoLanguages.contextMetadata.country = 'es';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should voluntaryRefundsSuccess and case lang ca', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'ca';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should voluntaryRefundsSuccess and case lang de', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'de';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should voluntaryRefundsSuccess and case lang en', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'en';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should voluntaryRefundsSuccess and case lang zh', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'zh';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should voluntaryRefundsSuccess and case lang ja', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'ja';
            fakeBookingInfoLanguages.contextMetadata.country = 'ja';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should voluntaryRefundsSuccess and case lang ru', () => {
            fakeBookingInfoLanguages.contextMetadata.language = 'ru';
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should notFlownFlights every slices refundable', () => {
            let copyResponseTransformer = {...responseTransformer};
            copyResponseTransformer.listFareBasisRefundInfo[0].noShow = false;
            copyResponseTransformer.listFareBasisRefundInfo[0].refundable = true;
            copyResponseTransformer.listFareBasisRefundInfo[1].refundable = true;
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should notFlownFlights every slices not refundable', () => {
            let copyResponseTransformer = {...responseTransformer};
            copyResponseTransformer.listFareBasisRefundInfo[0].refundable = false;
            copyResponseTransformer.listFareBasisRefundInfo[1].refundable = false;
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
        it('should notFlownFlights slices partial refund', () => {
            let copyResponseTransformer = {...responseTransformer};
            copyResponseTransformer.listFareBasisRefundInfo[0].noShow = false;
            copyResponseTransformer.listFareBasisRefundInfo[0].refundable = true;
            copyResponseTransformer.listFareBasisRefundInfo[1].refundable = false;
            component['voluntaryRefundsSuccess'](responseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
    });

    describe('when requestRefund is called with less24hours true', () => {
        beforeEach(()=>{
            let copyResponseTransformer = {...responseTransformer};
            copyResponseTransformer.less24Hours = true;
            fakeVoluntaryRefundsTabTransformer.voluntaryRefundsTransfomedInfo = jasmine.createSpy('voluntaryRefundsTransfomedInfo').and.returnValue(copyResponseTransformer);
        });
        it('should voluntaryRefundsSuccess', () => {
            let copyResponseItinRefund = {...responseItinRefund};
            copyResponseItinRefund.data.less24Hours = true;
            component['voluntaryRefundsSuccess'](copyResponseItinRefund);
            expect(component.isvoluntaryRefundSuccess).toBeTrue();
        });
    });

    describe('when generateMoreInfoUrl  is called', () => {
        it('should language es', () => {
            component['$rootScope'].appLang = 'es';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/preguntas-frecuentes/cambios-cancelaciones-reembolsos/');
        });
        it('should language pt', () => {
            component['$rootScope'].appLang = 'pt';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/duvidas-mais-habituais/alteracoes-cancelamentos-reembolsos/');
        });
        it('should language ca', () => {
            component['$rootScope'].appLang = 'ca';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/preguntes-frequents/canvis-cancellacions-reembossaments/');
        });
        it('should language en', () => {
            component['$rootScope'].appLang = 'en';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/faqs/changes-cancellations-refunds/');
        });
        it('should language fr', () => {
            component['$rootScope'].appLang = 'fr';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/questions-frequentes/changements-annulations-remboursements/');
        });
        it('should language it', () => {
            component['$rootScope'].appLang = 'it';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/domande-frequenti/cambi-cancellazioni-rimborsi/');
        });
        it('should language nl', () => {
            component['$rootScope'].appLang = 'nl';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/veelgestelde-vragen/wijzigingen-annuleringen-terugbetalingen/');
        });
        it('should language de', () => {
            component['$rootScope'].appLang = 'de';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/die-haufigsten-fragen/anderungen-stornierungen-erstattungen/');
        });
        it('should language ru', () => {
            component['$rootScope'].appLang = 'ru';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/chasto-zadavaemye-voprosy/vnesenie-izmeneniy-otmena-vozvrat/');
        });
        it('should language default', () => {
            component['$rootScope'].appLang = 'ja';
            let generateMoreInfoUrl = component['generateMoreInfoUrl']();
            expect(generateMoreInfoUrl).toEqual('https://www.iberia.com/es/faqs/changes-cancellations-refunds/');
        });
    });

    describe('when checkCarrierChargeAmount  is called', () => {
        it('should return allYQRefundable true when is less24Hours', () => {
            let fakeDataModel = {
                "taxes": {
                    "listTaxedRefundInfo": [
                        {
                          "type": "YQ",
                          "parcial": false,
                          "refundable": false
                        }
                    ]
                },
            };
            //@ts-ignore
            component.dataModel = fakeDataModel;
           component['checkCarrierChargeAmount'](true);
           expect(component.allYQRefundable).toBe(true);
        });

        it('should return allYQRefundable true when is not less24Hours, every slice is refundable and YQ is refundable', () => {
            let fakeDataModel = {
                "taxes": {
                    "listTaxedRefundInfo": [
                        {
                          "type": "YQ",
                          "parcial": false,
                          "refundable": true
                        }
                    ]
                },
                "listFareBasisRefundInfo": [
                    {
                        sliceId: 'MADSDQ20231220115000',
                        refundable: true,
                        segmentIds:  []
                    },
                    {
                        sliceId: 'SDQMAD20231228174000',
                        refundable: true,
                        segmentIds:  []
                    },
                ]
            };
            //@ts-ignore
            component.dataModel = fakeDataModel;
           component['checkCarrierChargeAmount'](false);
           expect(component.allYQRefundable).toBe(true);
        });

        it('should return allYQNotRefundable true when is not less24Hours, every slice is not refundable and YQ is not refundable', () => {
            let fakeDataModel = {
                "taxes": {
                    "listTaxedRefundInfo": [
                        {
                          "type": "YQ",
                          "parcial": false,
                          "refundable": false
                        }
                    ]
                },
                "listFareBasisRefundInfo": [
                    {
                        sliceId: 'MADSDQ20231220115000',
                        refundable: false,
                        segmentIds:  []
                    },
                    {
                        sliceId: 'SDQMAD20231228174000',
                        refundable: false,
                        segmentIds:  []
                    },
                ]
            };
            //@ts-ignore
            component.dataModel = fakeDataModel;
           component['checkCarrierChargeAmount'](false);
           expect(component.allYQNotRefundable).toBe(true);
        });

        it('should return partialYQRefundable true when is not less24Hours, not all slices are refundable and YQ is parcial refundable', () => {
            let fakeDataModel = {
                "taxes": {
                    "listTaxedRefundInfo": [
                        {
                          "type": "YQ",
                          "parcial": true,
                          "refundable": true
                        }
                    ]
                },
                "listFareBasisRefundInfo": [
                    {
                        sliceId: 'MADSDQ20231220115000',
                        refundable: true,
                        segmentIds:  []
                    },
                    {
                        sliceId: 'SDQMAD20231228174000',
                        refundable: false,
                        segmentIds:  []
                    },
                ]
            };
            //@ts-ignore
            component.dataModel = fakeDataModel;
           component['checkCarrierChargeAmount'](false);
           expect(component.partialYQRefundable).toBe(true);
        });

        describe('when checkCarrierChargeAmountPartial is called', () => {
            beforeEach(() => {
                let fakeBookingInfo = {
                    "order": {
                        "slices": [
                        {
                          "sliceId": "MADMIA20240617213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-06-17 21:35",
                          "arrivalDateTime": "2024-06-18 17:30",
                          "duration": 1555,
                          "stopsNumber": 1,
                          "detailedPrices": [
                            {
                              "fare": 0,
                              "currency": null,
                              "passengerIds": [
                                "ADULT_01"
                              ],
                              "segmentPrices": []
                            }
                          ],
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKED",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": true,
                              "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "BCN",
                                "name": "AIRPORT",
                                "terminal": "1",
                                "city": {
                                  "code": "BCN",
                                  "description": "Barcelona",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "arrivalCity": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "3034",
                                "operationalFlightNumber": "3034",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "32A",
                                  "description": "Airbus A320"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": false,
                              "id": "IB303420240617",
                              "duration": 75,
                              "waitingTime": 0,
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-06-17 21:35",
                              "departureUtcDateTime": "2024-06-17T19:35:00.000",
                              "arrivalDateTime": "2024-06-17 22:50",
                              "arrivalUtcDateTime": "2024-06-17T20:50:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ],
                          "overnight": true,
                          "passengerFlags": [
                            {
                              "passengerId": "ADULT_01",
                              "flags": [
                                {
                                  "type": "FLIGHT_REFUND",
                                  "enabled": false
                                },
                                {
                                  "type": "FREQUENT_FLYER_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "SPECIAL_NEEDS_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "CONTACT_DATA_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "EMERGENCY_CONTACT_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "PASSENGER_NAME_CORRECTION",
                                  "enabled": false
                                },
                                {
                                  "type": "ANCILLARIES",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                  "enabled": false
                                }
                              ]
                            }
                          ],
                          "originDestinationKey": null
                        },
                        {
                          "sliceId": "MIAMAD20240731213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-07-31 21:35",
                          "arrivalDateTime": "2024-08-01 12:35",
                          "duration": 540,
                          "stopsNumber": 0,
                          "detailedPrices": [
                            {
                              "fare": 0,
                              "currency": null,
                              "passengerIds": [
                                "ADULT_01"
                              ],
                              "segmentPrices": []
                            }
                          ],
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": false,
                              "departure": {
                                "code": "MIA",
                                "name": "INTERNATIONAL",
                                "terminal": null,
                                "city": {
                                  "code": "MIA",
                                  "description": "Miami",
                                  "countryCode": "US",
                                  "country": {
                                    "code": "US",
                                    "description": "USA"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4S",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MIA",
                                "description": "Miami",
                                "countryCode": "US",
                                "timeZone": "US/Eastern"
                              },
                              "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "6118",
                                "operationalFlightNumber": "6118",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "330",
                                  "description": "Airbus A330"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": true,
                              "id": "IB611820240731",
                              "duration": -420,
                              "waitingTime": 0,
                              "warnings": [
                                {
                                  "code": "SSE_ORM_20003",
                                  "description": "Vuelo nocturno"
                                }
                              ],
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-07-31 21:35",
                              "departureUtcDateTime": "2024-08-01T01:35:00.000",
                              "arrivalDateTime": "2024-08-01 12:35",
                              "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ],
                          "overnight": true,
                          "passengerFlags": [
                            {
                              "passengerId": "ADULT_01",
                              "flags": [
                                {
                                  "type": "FLIGHT_REFUND",
                                  "enabled": false
                                },
                                {
                                  "type": "FREQUENT_FLYER_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "SPECIAL_NEEDS_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "CONTACT_DATA_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "EMERGENCY_CONTACT_MODIFICATION",
                                  "enabled": true
                                },
                                {
                                  "type": "PASSENGER_NAME_CORRECTION",
                                  "enabled": false
                                },
                                {
                                  "type": "ANCILLARIES",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION",
                                  "enabled": true
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                  "enabled": false
                                }
                              ]
                            }
                          ],
                          "originDestinationKey": null
                        }
                    ]
                    }
                };
                fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            });
            it('should return allYQRefundable true when is not less24Hours, is partial refund, all slices are refundable and have 2 slices', () => {
                let fakeDataModel = {
                    "taxes": {
                        "listTaxedRefundInfo": [
                            {
                              "type": "YQ",
                              "parcial": true,
                              "refundable": true
                            }
                        ]
                    },
                    "listFareBasisRefundInfo": [
                        {
                            sliceId: 'MADSDQ20231220115000',
                            refundable: true,
                            segmentIds:  []
                        },
                        {
                            sliceId: 'SDQMAD20231228174000',
                            refundable: true,
                            segmentIds:  []
                        },
                    ],
                    "refundType": "PARTIAL"
                };
                //@ts-ignore
                component.dataModel = fakeDataModel;
                component['checkCarrierChargeAmount'](false);
                expect(component.allYQRefundable).toBe(true);
            });
        });

        describe('when checkCarrierChargeAmountPartial is called', () => {
            beforeEach(() => {
                let fakeBookingInfo = {
                    "order": {
                        "slices": [
                        {
                          "sliceId": "MADMIA20240617213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-06-17 21:35",
                          "arrivalDateTime": "2024-06-18 17:30",
                          "duration": 1555,
                          "stopsNumber": 1,
                          "detailedPrices": [
                            {
                              "fare": 0,
                              "currency": null,
                              "passengerIds": [
                                "ADULT_01"
                              ],
                              "segmentPrices": []
                            }
                          ],
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKED",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": true,
                              "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "BCN",
                                "name": "AIRPORT",
                                "terminal": "1",
                                "city": {
                                  "code": "BCN",
                                  "description": "Barcelona",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "arrivalCity": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "3034",
                                "operationalFlightNumber": "3034",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "32A",
                                  "description": "Airbus A320"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": false,
                              "id": "IB303420240617",
                              "duration": 75,
                              "waitingTime": 0,
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-06-17 21:35",
                              "departureUtcDateTime": "2024-06-17T19:35:00.000",
                              "arrivalDateTime": "2024-06-17 22:50",
                              "arrivalUtcDateTime": "2024-06-17T20:50:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ],
                          "overnight": true,
                          "passengerFlags": [
                            {
                              "passengerId": "ADULT_01",
                              "flags": [
                                {
                                  "type": "FLIGHT_REFUND",
                                  "enabled": false
                                },
                                {
                                  "type": "FREQUENT_FLYER_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "SPECIAL_NEEDS_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "CONTACT_DATA_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "EMERGENCY_CONTACT_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "PASSENGER_NAME_CORRECTION",
                                  "enabled": false
                                },
                                {
                                  "type": "ANCILLARIES",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                  "enabled": false
                                }
                              ]
                            }
                          ],
                          "originDestinationKey": null
                        },
                        {
                          "sliceId": "MIAMAD20240731213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-07-31 21:35",
                          "arrivalDateTime": "2024-08-01 12:35",
                          "duration": 540,
                          "stopsNumber": 0,
                          "detailedPrices": [
                            {
                              "fare": 0,
                              "currency": null,
                              "passengerIds": [
                                "ADULT_01"
                              ],
                              "segmentPrices": []
                            }
                          ],
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": false,
                              "departure": {
                                "code": "MIA",
                                "name": "INTERNATIONAL",
                                "terminal": null,
                                "city": {
                                  "code": "MIA",
                                  "description": "Miami",
                                  "countryCode": "US",
                                  "country": {
                                    "code": "US",
                                    "description": "USA"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4S",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MIA",
                                "description": "Miami",
                                "countryCode": "US",
                                "timeZone": "US/Eastern"
                              },
                              "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "6118",
                                "operationalFlightNumber": "6118",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "330",
                                  "description": "Airbus A330"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": true,
                              "id": "IB611820240731",
                              "duration": -420,
                              "waitingTime": 0,
                              "warnings": [
                                {
                                  "code": "SSE_ORM_20003",
                                  "description": "Vuelo nocturno"
                                }
                              ],
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-07-31 21:35",
                              "departureUtcDateTime": "2024-08-01T01:35:00.000",
                              "arrivalDateTime": "2024-08-01 12:35",
                              "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ],
                          "overnight": true,
                          "passengerFlags": [
                            {
                              "passengerId": "ADULT_01",
                              "flags": [
                                {
                                  "type": "FLIGHT_REFUND",
                                  "enabled": false
                                },
                                {
                                  "type": "FREQUENT_FLYER_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "SPECIAL_NEEDS_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "CONTACT_DATA_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "EMERGENCY_CONTACT_MODIFICATION",
                                  "enabled": true
                                },
                                {
                                  "type": "PASSENGER_NAME_CORRECTION",
                                  "enabled": false
                                },
                                {
                                  "type": "ANCILLARIES",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION",
                                  "enabled": true
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                  "enabled": false
                                }
                              ]
                            }
                          ],
                          "originDestinationKey": null
                        }
                    ]
                    }
                };
                fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            });
            it('should return allYQNotRefundable true when is not less24Hours, is partial refund, all slices are not refundable and have 2 slices', () => {
                let fakeDataModel = {
                    "taxes": {
                        "listTaxedRefundInfo": [
                            {
                              "type": "YQ",
                              "parcial": true,
                              "refundable": true
                            }
                        ]
                    },
                    "listFareBasisRefundInfo": [
                        {
                            sliceId: 'MADSDQ20231220115000',
                            refundable: false,
                            segmentIds:  []
                        },
                        {
                            sliceId: 'SDQMAD20231228174000',
                            refundable: false,
                            segmentIds:  []
                        },
                    ],
                    "refundType": "PARTIAL"
                };
                //@ts-ignore
                component.dataModel = fakeDataModel;
                component['checkCarrierChargeAmount'](false);
                expect(component.allYQNotRefundable).toBe(true);
            });
        });

        describe('when checkCarrierChargeAmountPartial is called', () => {
            beforeEach(() => {
                let fakeBookingInfo = {
                    "order": {
                        "slices": [
                        {
                          "sliceId": "MADMIA20240617213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-06-17 21:35",
                          "arrivalDateTime": "2024-06-18 17:30",
                          "duration": 1555,
                          "stopsNumber": 1,
                          "detailedPrices": [
                            {
                              "fare": 0,
                              "currency": null,
                              "passengerIds": [
                                "ADULT_01"
                              ],
                              "segmentPrices": []
                            }
                          ],
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKED",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": true,
                              "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "BCN",
                                "name": "AIRPORT",
                                "terminal": "1",
                                "city": {
                                  "code": "BCN",
                                  "description": "Barcelona",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "arrivalCity": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "3034",
                                "operationalFlightNumber": "3034",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "32A",
                                  "description": "Airbus A320"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": false,
                              "id": "IB303420240617",
                              "duration": 75,
                              "waitingTime": 0,
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-06-17 21:35",
                              "departureUtcDateTime": "2024-06-17T19:35:00.000",
                              "arrivalDateTime": "2024-06-17 22:50",
                              "arrivalUtcDateTime": "2024-06-17T20:50:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ],
                          "overnight": true,
                          "passengerFlags": [
                            {
                              "passengerId": "ADULT_01",
                              "flags": [
                                {
                                  "type": "FLIGHT_REFUND",
                                  "enabled": false
                                },
                                {
                                  "type": "FREQUENT_FLYER_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "SPECIAL_NEEDS_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "CONTACT_DATA_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "EMERGENCY_CONTACT_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "PASSENGER_NAME_CORRECTION",
                                  "enabled": false
                                },
                                {
                                  "type": "ANCILLARIES",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                  "enabled": false
                                }
                              ]
                            }
                          ],
                          "originDestinationKey": null
                        },
                        {
                          "sliceId": "MIAMAD20240731213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-07-31 21:35",
                          "arrivalDateTime": "2024-08-01 12:35",
                          "duration": 540,
                          "stopsNumber": 0,
                          "detailedPrices": [
                            {
                              "fare": 0,
                              "currency": null,
                              "passengerIds": [
                                "ADULT_01"
                              ],
                              "segmentPrices": []
                            }
                          ],
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": false,
                              "departure": {
                                "code": "MIA",
                                "name": "INTERNATIONAL",
                                "terminal": null,
                                "city": {
                                  "code": "MIA",
                                  "description": "Miami",
                                  "countryCode": "US",
                                  "country": {
                                    "code": "US",
                                    "description": "USA"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4S",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MIA",
                                "description": "Miami",
                                "countryCode": "US",
                                "timeZone": "US/Eastern"
                              },
                              "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "6118",
                                "operationalFlightNumber": "6118",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "330",
                                  "description": "Airbus A330"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": true,
                              "id": "IB611820240731",
                              "duration": -420,
                              "waitingTime": 0,
                              "warnings": [
                                {
                                  "code": "SSE_ORM_20003",
                                  "description": "Vuelo nocturno"
                                }
                              ],
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-07-31 21:35",
                              "departureUtcDateTime": "2024-08-01T01:35:00.000",
                              "arrivalDateTime": "2024-08-01 12:35",
                              "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ],
                          "overnight": true,
                          "passengerFlags": [
                            {
                              "passengerId": "ADULT_01",
                              "flags": [
                                {
                                  "type": "FLIGHT_REFUND",
                                  "enabled": false
                                },
                                {
                                  "type": "FREQUENT_FLYER_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "SPECIAL_NEEDS_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "CONTACT_DATA_MODIFICATION",
                                  "enabled": false
                                },
                                {
                                  "type": "EMERGENCY_CONTACT_MODIFICATION",
                                  "enabled": true
                                },
                                {
                                  "type": "PASSENGER_NAME_CORRECTION",
                                  "enabled": false
                                },
                                {
                                  "type": "ANCILLARIES",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION",
                                  "enabled": true
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_DISRUPTION_SEARCH",
                                  "enabled": false
                                },
                                {
                                  "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                  "enabled": false
                                }
                              ]
                            }
                          ],
                          "originDestinationKey": null
                        }
                    ]
                    }
                };
                fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            });
            it('should return allYQRefundable true when is not less24Hours, is partial refund, not all slices are not refundable and have 2 slices', () => {
                let fakeDataModel = {
                    "taxes": {
                        "listTaxedRefundInfo": [
                            {
                              "type": "YQ",
                              "parcial": true,
                              "refundable": true
                            }
                        ]
                    },
                    "listFareBasisRefundInfo": [
                        {
                            sliceId: 'MADSDQ20231220115000',
                            refundable: false,
                            segmentIds:  []
                        },
                        {
                            sliceId: 'SDQMAD20231228174000',
                            refundable: true,
                            segmentIds:  []
                        },
                    ],
                    "refundType": "PARTIAL"
                };
                //@ts-ignore
                component.dataModel = fakeDataModel;
                //@ts-ignore
                component.notFlownFlights = [{ sliceId: 'SDQMAD20231228174000', refundable: true }];
                component['checkCarrierChargeAmount'](false);
                expect(component.allYQRefundable).toBe(true);
            });
        });

        describe('when checkCarrierChargeAmountPartial is called', () => {
            beforeEach(() => {
                let fakeBookingInfo = {
                    "order": {
                        "slices": [
                        {
                          "sliceId": "MADMIA20240617213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-06-17 21:35",
                          "arrivalDateTime": "2024-06-18 17:30",
                          "duration": 1555,
                          "stopsNumber": 1,
                          "segments": [
                            {
                              "noShow": false,
                              "flyNow": false,
                              "flown": true,
                              "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "BCN",
                                "name": "AIRPORT",
                                "terminal": "1",
                                "city": {
                                  "code": "BCN",
                                  "description": "Barcelona",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "arrivalCity": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "3034",
                                "operationalFlightNumber": "3034",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "32A",
                                  "description": "Airbus A320"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": false,
                              "id": "IB303420240617",
                              "duration": 75,
                              "waitingTime": 0,
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-06-17 21:35",
                              "departureUtcDateTime": "2024-06-17T19:35:00.000",
                              "arrivalDateTime": "2024-06-17 22:50",
                              "arrivalUtcDateTime": "2024-06-17T20:50:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ]
                        },
                        {
                          "sliceId": "MIAMAD20240731213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-07-31 21:35",
                          "arrivalDateTime": "2024-08-01 12:35",
                          "duration": 540,
                          "stopsNumber": 0,
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": false,
                              "departure": {
                                "code": "MIA",
                                "name": "INTERNATIONAL",
                                "terminal": null,
                                "city": {
                                  "code": "MIA",
                                  "description": "Miami",
                                  "countryCode": "US",
                                  "country": {
                                    "code": "US",
                                    "description": "USA"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4S",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MIA",
                                "description": "Miami",
                                "countryCode": "US",
                                "timeZone": "US/Eastern"
                              },
                              "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "6118",
                                "operationalFlightNumber": "6118",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "330",
                                  "description": "Airbus A330"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": true,
                              "id": "IB611820240731",
                              "duration": -420,
                              "waitingTime": 0,
                              "warnings": [
                                {
                                  "code": "SSE_ORM_20003",
                                  "description": "Vuelo nocturno"
                                }
                              ],
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-07-31 21:35",
                              "departureUtcDateTime": "2024-08-01T01:35:00.000",
                              "arrivalDateTime": "2024-08-01 12:35",
                              "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ]
                        },
                        {
                            "sliceId": "MADBIO20240731213500",
                            "type": "REGULAR",
                            "departureDateTime": "2024-07-31 21:35",
                            "arrivalDateTime": "2024-08-01 12:35",
                            "duration": 540,
                            "stopsNumber": 0,
                            "segments": [
                              {
                                "type": "CONFIRMED",
                                "mmbAllowed": true,
                                "ckiStatus": {
                                  "code": "CHECKABLE",
                                  "message": null
                                },
                                "noShow": false,
                                "flyNow": false,
                                "flown": false,
                                "departure": {
                                  "code": "MAD",
                                  "name": "BARAJAS",
                                  "terminal": null,
                                  "city": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                      "code": "ES",
                                      "description": "España"
                                    }
                                  }
                                },
                                "arrival": {
                                  "code": "BIO",
                                  "name": "BILBAO",
                                  "terminal": "4S",
                                  "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                      "code": "ES",
                                      "description": "España"
                                    }
                                  }
                                },
                                "departureCity": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "timeZone": "Europe/Madrid"
                                },
                                "arrivalCity": {
                                  "code": "BIO",
                                  "description": "Bilbao",
                                  "countryCode": "ES",
                                  "timeZone": "Europe/Bilbao"
                                },
                                "flight": {
                                  "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                  },
                                  "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                  },
                                  "marketingFlightNumber": "6118",
                                  "operationalFlightNumber": "6118",
                                  "operationalDisclosure": "IB",
                                  "aircraft": {
                                    "code": "330",
                                    "description": "Airbus A330"
                                  }
                                },
                                "cabin": {
                                  "rbd": "I",
                                  "description": "Business",
                                  "remainingSeats": 0,
                                  "fareFamily": "BFLEXESJB",
                                  "code": "B",
                                  "type": "BUSINESS",
                                  "brandCode": "",
                                  "bookingClass": "BUSINESS"
                                },
                                "overnight": true,
                                "id": "IB611820240731",
                                "duration": -420,
                                "waitingTime": 0,
                                "warnings": [
                                  {
                                    "code": "SSE_ORM_20003",
                                    "description": "Vuelo nocturno"
                                  }
                                ],
                                "operatorLocator": null,
                                "stop": null,
                                "departureDateTime": "2024-07-31 21:35",
                                "departureUtcDateTime": "2024-08-01T01:35:00.000",
                                "arrivalDateTime": "2024-08-01 12:35",
                                "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                                "status": {
                                  "code": "HK",
                                  "description": "Confirmado"
                                }
                              }
                            ]
                        }
                    ]
                    }
                };
                fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            });
            it('should return allYQRefundable true when is not less24Hours, is partial refund, all slices are refundable and have 3 slices', () => {
                let fakeDataModel = {
                    "taxes": {
                        "listTaxedRefundInfo": [
                            {
                              "type": "YQ",
                              "parcial": true,
                              "refundable": true
                            }
                        ]
                    },
                    "listFareBasisRefundInfo": [
                        {
                            sliceId: 'MADMIA20240617213500',
                            refundable: true,
                            segmentIds:  ["IB303420240617"]
                        },
                        {
                            sliceId: 'MIAMAD20240731213500',
                            refundable: true,
                            segmentIds:  ["IB611820240731"]
                        },
                        {
                            sliceId: 'MADBIO20240731213500',
                            refundable: true,
                            segmentIds:  ["IB611820240731"]
                        }
                    ],
                    "refundType": "PARTIAL"
                };
                //@ts-ignore
                component.dataModel = fakeDataModel;
                //@ts-ignore
                component.notFlownFlights = [{sliceId: "MADMIA20240617213500", refundable: true}, {sliceId: "MIAMAD20240731213500", refundable: true}, {sliceId: "MADBIO20240731213500", refundable: true}];
                component['checkCarrierChargeAmount'](false);
                expect(component.allYQRefundable).toBe(true);
            });
        });

        describe('when checkCarrierChargeAmountPartial is called', () => {
            beforeEach(() => {
                let fakeBookingInfo = {
                    "order": {
                        "slices": [
                        {
                          "sliceId": "MADMIA20240617213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-06-17 21:35",
                          "arrivalDateTime": "2024-06-18 17:30",
                          "duration": 1555,
                          "stopsNumber": 1,
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKED",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": true,
                              "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "BCN",
                                "name": "AIRPORT",
                                "terminal": "1",
                                "city": {
                                  "code": "BCN",
                                  "description": "Barcelona",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "arrivalCity": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "3034",
                                "operationalFlightNumber": "3034",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "32A",
                                  "description": "Airbus A320"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": false,
                              "id": "IB303420240617",
                              "duration": 75,
                              "waitingTime": 0,
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-06-17 21:35",
                              "departureUtcDateTime": "2024-06-17T19:35:00.000",
                              "arrivalDateTime": "2024-06-17 22:50",
                              "arrivalUtcDateTime": "2024-06-17T20:50:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ]
                        },
                        {
                          "sliceId": "MIAMAD20240731213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-07-31 21:35",
                          "arrivalDateTime": "2024-08-01 12:35",
                          "duration": 540,
                          "stopsNumber": 0,
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": false,
                              "departure": {
                                "code": "MIA",
                                "name": "INTERNATIONAL",
                                "terminal": null,
                                "city": {
                                  "code": "MIA",
                                  "description": "Miami",
                                  "countryCode": "US",
                                  "country": {
                                    "code": "US",
                                    "description": "USA"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4S",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MIA",
                                "description": "Miami",
                                "countryCode": "US",
                                "timeZone": "US/Eastern"
                              },
                              "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "6118",
                                "operationalFlightNumber": "6118",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "330",
                                  "description": "Airbus A330"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": true,
                              "id": "IB611820240731",
                              "duration": -420,
                              "waitingTime": 0,
                              "warnings": [
                                {
                                  "code": "SSE_ORM_20003",
                                  "description": "Vuelo nocturno"
                                }
                              ],
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-07-31 21:35",
                              "departureUtcDateTime": "2024-08-01T01:35:00.000",
                              "arrivalDateTime": "2024-08-01 12:35",
                              "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ]
                        },
                        {
                            "sliceId": "MADBIO20240731213500",
                            "type": "REGULAR",
                            "departureDateTime": "2024-07-31 21:35",
                            "arrivalDateTime": "2024-08-01 12:35",
                            "duration": 540,
                            "stopsNumber": 0,
                            "segments": [
                              {
                                "type": "CONFIRMED",
                                "mmbAllowed": true,
                                "ckiStatus": {
                                  "code": "CHECKABLE",
                                  "message": null
                                },
                                "noShow": false,
                                "flyNow": false,
                                "flown": false,
                                "departure": {
                                  "code": "MAD",
                                  "name": "BARAJAS",
                                  "terminal": null,
                                  "city": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                      "code": "ES",
                                      "description": "España"
                                    }
                                  }
                                },
                                "arrival": {
                                  "code": "BIO",
                                  "name": "BILBAO",
                                  "terminal": "4S",
                                  "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                      "code": "ES",
                                      "description": "España"
                                    }
                                  }
                                },
                                "departureCity": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "timeZone": "Europe/Madrid"
                                },
                                "arrivalCity": {
                                  "code": "BIO",
                                  "description": "Bilbao",
                                  "countryCode": "ES",
                                  "timeZone": "Europe/Bilbao"
                                },
                                "flight": {
                                  "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                  },
                                  "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                  },
                                  "marketingFlightNumber": "6118",
                                  "operationalFlightNumber": "6118",
                                  "operationalDisclosure": "IB",
                                  "aircraft": {
                                    "code": "330",
                                    "description": "Airbus A330"
                                  }
                                },
                                "cabin": {
                                  "rbd": "I",
                                  "description": "Business",
                                  "remainingSeats": 0,
                                  "fareFamily": "BFLEXESJB",
                                  "code": "B",
                                  "type": "BUSINESS",
                                  "brandCode": "",
                                  "bookingClass": "BUSINESS"
                                },
                                "overnight": true,
                                "id": "IB611820240731",
                                "duration": -420,
                                "waitingTime": 0,
                                "warnings": [
                                  {
                                    "code": "SSE_ORM_20003",
                                    "description": "Vuelo nocturno"
                                  }
                                ],
                                "operatorLocator": null,
                                "stop": null,
                                "departureDateTime": "2024-07-31 21:35",
                                "departureUtcDateTime": "2024-08-01T01:35:00.000",
                                "arrivalDateTime": "2024-08-01 12:35",
                                "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                                "status": {
                                  "code": "HK",
                                  "description": "Confirmado"
                                }
                              }
                            ]
                        }
                    ]
                    }
                };
                fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            });
            it('should return allYQNotRefundable true when is not less24Hours, is partial refund, all slices are not refundable and have 3 slices', () => {
                let fakeDataModel = {
                    "taxes": {
                        "listTaxedRefundInfo": [
                            {
                              "type": "YQ",
                              "parcial": true,
                              "refundable": true
                            }
                        ]
                    },
                    "listFareBasisRefundInfo": [
                        {
                            sliceId: 'MADMIA20240617213500',
                            refundable: false,
                            segmentIds:  ["IB303420240617"]
                        },
                        {
                            sliceId: 'MIAMAD20240731213500',
                            refundable: false,
                            segmentIds:  ["IB611820240731"]
                        },
                        {
                            sliceId: 'MADBIO20240731213500',
                            refundable: false,
                            segmentIds:  ["IB611820240731"]
                        }
                    ],
                    "refundType": "PARTIAL"
                };
                //@ts-ignore
                component.dataModel = fakeDataModel;
                //@ts-ignore
                component.notFlownFlights = [{sliceId: "MADMIA20240617213500", refundable: false}, {sliceId: "MIAMAD20240731213500", refundable: false}, {sliceId: "MADBIO20240731213500", refundable: false}];
                component['checkCarrierChargeAmount'](false);
                expect(component.allYQNotRefundable).toBe(true);
            });
        });

        describe('when checkCarrierChargeAmountPartial is called', () => {
            beforeEach(() => {
                let fakeBookingInfo = {
                    "order": {
                        "slices": [
                        {
                          "sliceId": "MADMIA20240617213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-06-17 21:35",
                          "arrivalDateTime": "2024-06-18 17:30",
                          "duration": 1555,
                          "stopsNumber": 1,
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKED",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": true,
                              "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "BCN",
                                "name": "AIRPORT",
                                "terminal": "1",
                                "city": {
                                  "code": "BCN",
                                  "description": "Barcelona",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "arrivalCity": {
                                "code": "BCN",
                                "description": "Barcelona",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "3034",
                                "operationalFlightNumber": "3034",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "32A",
                                  "description": "Airbus A320"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": false,
                              "id": "IB303420240617",
                              "duration": 75,
                              "waitingTime": 0,
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-06-17 21:35",
                              "departureUtcDateTime": "2024-06-17T19:35:00.000",
                              "arrivalDateTime": "2024-06-17 22:50",
                              "arrivalUtcDateTime": "2024-06-17T20:50:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ]
                        },
                        {
                          "sliceId": "MIAMAD20240731213500",
                          "type": "REGULAR",
                          "departureDateTime": "2024-07-31 21:35",
                          "arrivalDateTime": "2024-08-01 12:35",
                          "duration": 540,
                          "stopsNumber": 0,
                          "segments": [
                            {
                              "type": "CONFIRMED",
                              "mmbAllowed": true,
                              "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                              },
                              "noShow": false,
                              "flyNow": false,
                              "flown": false,
                              "departure": {
                                "code": "MIA",
                                "name": "INTERNATIONAL",
                                "terminal": null,
                                "city": {
                                  "code": "MIA",
                                  "description": "Miami",
                                  "countryCode": "US",
                                  "country": {
                                    "code": "US",
                                    "description": "USA"
                                  }
                                }
                              },
                              "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
                                "terminal": "4S",
                                "city": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "country": {
                                    "code": "ES",
                                    "description": "España"
                                  }
                                }
                              },
                              "departureCity": {
                                "code": "MIA",
                                "description": "Miami",
                                "countryCode": "US",
                                "timeZone": "US/Eastern"
                              },
                              "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                              },
                              "flight": {
                                "marketingCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "operationalCarrier": {
                                  "code": "IB",
                                  "name": "Iberia"
                                },
                                "marketingFlightNumber": "6118",
                                "operationalFlightNumber": "6118",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                  "code": "330",
                                  "description": "Airbus A330"
                                }
                              },
                              "cabin": {
                                "rbd": "I",
                                "description": "Business",
                                "remainingSeats": 0,
                                "fareFamily": "BFLEXESJB",
                                "code": "B",
                                "type": "BUSINESS",
                                "brandCode": "",
                                "bookingClass": "BUSINESS"
                              },
                              "overnight": true,
                              "id": "IB611820240731",
                              "duration": -420,
                              "waitingTime": 0,
                              "warnings": [
                                {
                                  "code": "SSE_ORM_20003",
                                  "description": "Vuelo nocturno"
                                }
                              ],
                              "operatorLocator": null,
                              "stop": null,
                              "departureDateTime": "2024-07-31 21:35",
                              "departureUtcDateTime": "2024-08-01T01:35:00.000",
                              "arrivalDateTime": "2024-08-01 12:35",
                              "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                              "status": {
                                "code": "HK",
                                "description": "Confirmado"
                              }
                            }
                          ]
                        },
                        {
                            "sliceId": "MADBIO20240731213500",
                            "type": "REGULAR",
                            "departureDateTime": "2024-07-31 21:35",
                            "arrivalDateTime": "2024-08-01 12:35",
                            "duration": 540,
                            "stopsNumber": 0,
                            "segments": [
                              {
                                "type": "CONFIRMED",
                                "mmbAllowed": true,
                                "ckiStatus": {
                                  "code": "CHECKABLE",
                                  "message": null
                                },
                                "noShow": false,
                                "flyNow": false,
                                "flown": false,
                                "departure": {
                                  "code": "MAD",
                                  "name": "BARAJAS",
                                  "terminal": null,
                                  "city": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                      "code": "ES",
                                      "description": "España"
                                    }
                                  }
                                },
                                "arrival": {
                                  "code": "BIO",
                                  "name": "BILBAO",
                                  "terminal": "4S",
                                  "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                      "code": "ES",
                                      "description": "España"
                                    }
                                  }
                                },
                                "departureCity": {
                                  "code": "MAD",
                                  "description": "Madrid",
                                  "countryCode": "ES",
                                  "timeZone": "Europe/Madrid"
                                },
                                "arrivalCity": {
                                  "code": "BIO",
                                  "description": "Bilbao",
                                  "countryCode": "ES",
                                  "timeZone": "Europe/Bilbao"
                                },
                                "flight": {
                                  "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                  },
                                  "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                  },
                                  "marketingFlightNumber": "6118",
                                  "operationalFlightNumber": "6118",
                                  "operationalDisclosure": "IB",
                                  "aircraft": {
                                    "code": "330",
                                    "description": "Airbus A330"
                                  }
                                },
                                "cabin": {
                                  "rbd": "I",
                                  "description": "Business",
                                  "remainingSeats": 0,
                                  "fareFamily": "BFLEXESJB",
                                  "code": "B",
                                  "type": "BUSINESS",
                                  "brandCode": "",
                                  "bookingClass": "BUSINESS"
                                },
                                "overnight": true,
                                "id": "IB611820240731",
                                "duration": -420,
                                "waitingTime": 0,
                                "warnings": [
                                  {
                                    "code": "SSE_ORM_20003",
                                    "description": "Vuelo nocturno"
                                  }
                                ],
                                "operatorLocator": null,
                                "stop": null,
                                "departureDateTime": "2024-07-31 21:35",
                                "departureUtcDateTime": "2024-08-01T01:35:00.000",
                                "arrivalDateTime": "2024-08-01 12:35",
                                "arrivalUtcDateTime": "2024-08-01T10:35:00.000",
                                "status": {
                                  "code": "HK",
                                  "description": "Confirmado"
                                }
                              }
                            ]
                        }
                    ]
                    }
                };
                fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            });
            it('should return partialYQRefundable true when is not less24Hours, is partial refund, not all slices are not refundable and have 3 slices', () => {
                let fakeDataModel = {
                    "taxes": {
                        "listTaxedRefundInfo": [
                            {
                              "type": "YQ",
                              "parcial": true,
                              "refundable": true
                            }
                        ]
                    },
                    "listFareBasisRefundInfo": [
                        {
                            sliceId: 'MADMIA20240617213500',
                            refundable: false,
                            segmentIds:  ["IB303420240617"]
                        },
                        {
                            sliceId: 'MIAMAD20240731213500',
                            refundable: false,
                            segmentIds:  ["IB611820240731"]
                        },
                        {
                            sliceId: 'MADBIO20240731213500',
                            refundable: true,
                            segmentIds:  ["IB611820240731"]
                        }
                    ],
                    "refundType": "PARTIAL"
                };
                //@ts-ignore
                component.dataModel = fakeDataModel;
                //@ts-ignore
                component.notFlownFlights = [{sliceId: "MADMIA20240617213500", refundable: false}, {sliceId: "MIAMAD20240731213500", refundable: false}, {sliceId: "MADBIO20240731213500", refundable: true}];
                component['checkCarrierChargeAmount'](false);
                expect(component.partialYQRefundable).toBe(true);
            });
        });
    });
});
