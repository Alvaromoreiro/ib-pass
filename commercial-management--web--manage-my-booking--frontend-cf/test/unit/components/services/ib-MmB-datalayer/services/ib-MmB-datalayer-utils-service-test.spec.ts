import { AncillariesConstantsMock } from './../../../../../mocks/constants/AncillariesConstants-mock';
import { TestBed } from "@angular/core/testing";
import { MmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MMBDigitalDataParametersToRemove } from '@src/components/services/ib-MmB-datalayer/model/ib-mmb-digital-data-params-to-deleate';

describe('MmBDatalayerUtilsService test ', () => {
    let localStorageService: any = new StorageServiceMock();
    let transformer;
    let $q;
    const fakeImportOrder = {
        order: {
            orderItems: [
                {
                    type: 'flight',
                    bookingReferences: [
                        {
                            'provider': 'IB',
                            'reference': 'P7GYV'
                        }
                    ],
                    price: {
                        'fare': 12,
                        'tax': 20.37,
                        'total': 32.37,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    }
                },
                {
                    type: 'specialBaggage',
                    orderItemId: 'IB330d7b7825584d62b5dbbfd63890b614OP_02',
                    price: {
                        'fare': 0,
                        'tax': 0,
                        'total': 0,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    serviceCode: 'BIKE',
                    passengerId: 'ADULT_01',
                    sliceId: 'MADBIO20260112221000',
                    segmentId: 'IB044120260112',
                    name: 'ssr.name.BIKE',
                    text: '',
                    description: 'ssr.description.BIKE',
                    status: {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ]
        }
    }
    const mockHeaderModel = {
        "flightType": "",
        "redemption": "",
        "trips": [],
        "isMultiflight": false,
        "passengers": null,
        "shoppingBasket": {
            "baggages": {
                "segments": [
                    {
                        "segmentId": "MADBIO20240520072500",
                        "baggages": [
                            {
                                "type": "BAGGAGE_15",
                                "quanty": 1,
                                "description": "15Kg",
                                "passengers": [
                                    "ADULT_01"
                                ],
                                "total": 13,
                                "totalFormatted": "13,00€"
                            },
                            {
                                "type": "BAGGAGE_23",
                                "quanty": 1,
                                "description": "23Kg",
                                "passengers": [
                                    "ADULT_01"
                                ],
                                "total": 28,
                                "totalFormatted": "28,00€"
                            },
                            {
                                "type": "BAGGAGE_32",
                                "quanty": 1,
                                "description": "32Kg",
                                "passengers": [
                                    "ADULT_01"
                                ],
                                "total": 35,
                                "totalFormatted": "35,00€"
                            }
                        ],
                        "total": 76,
                        "origin": {
                            "code": "MAD",
                            "description": "Madrid",
                            "countryCode": "ES",
                            "country": {
                                "code": "ES",
                                "description": "España"
                            }
                        },
                        "destination": {
                            "code": "BIO",
                            "description": "Bilbao",
                            "countryCode": "ES",
                            "country": {
                                "code": "ES",
                                "description": "España"
                            }
                        }
                    },
                    {
                        "segmentId": "BIOMAD20240531091000",
                        "baggages": [
                            {
                                "type": "BAGGAGE_15",
                                "quanty": 1,
                                "description": "15Kg",
                                "passengers": [
                                    "ADULT_01"
                                ],
                                "total": 13,
                                "totalFormatted": "13,00€"
                            },
                            {
                                "type": "BAGGAGE_23",
                                "quanty": 1,
                                "description": "23Kg",
                                "passengers": [
                                    "ADULT_01"
                                ],
                                "total": 28,
                                "totalFormatted": "28,00€"
                            },
                            {
                                "type": "BAGGAGE_32",
                                "quanty": 1,
                                "description": "32Kg",
                                "passengers": [
                                    "ADULT_01"
                                ],
                                "total": 35,
                                "totalFormatted": "35,00€"
                            }
                        ],
                        "total": 76,
                        "origin": {
                            "code": "BIO",
                            "description": "Bilbao",
                            "countryCode": "ES",
                            "country": {
                                "code": "ES",
                                "description": "España"
                            }
                        },
                        "destination": {
                            "code": "MAD",
                            "description": "Madrid",
                            "countryCode": "ES",
                            "country": {
                                "code": "ES",
                                "description": "España"
                            }
                        }
                    }
                ],
                "hasBaggage": true,
                "total": {
                    "total": 152,
                    "totalFormatted": "152,00€"
                }
            },
            "seats": {
                "segments": [
                    {
                        "segmentId": "IB044820240520",
                        "isEarly": false,
                        "seats": [
                            {
                                "type": "UPFRONT",
                                "description": "Delantero",
                                "quanty": 1,
                                "passengers": [
                                    {
                                        "id": "ADULT_01",
                                        "amount": 8,
                                        "amountFormatted": "8,00€"
                                    }
                                ],
                                "amount": 8,
                                "totalFormatted": "8,00€",
                                "freePassenger": [],
                                "totalAmountFreePassenger": "0€",
                                "paymentPassenger": [
                                    {
                                        "id": "ADULT_01",
                                        "amount": 8,
                                        "amountFormatted": "8,00€"
                                    }
                                ],
                                "totalAmountPaymentPassenger": "8,00€"
                            }
                        ],
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "quanty": 1,
                        "total": 8,
                        "totalFormatted": "8,00€"
                    },
                    {
                        "segmentId": "IB042320240531",
                        "isEarly": false,
                        "seats": [
                            {
                                "type": "EMERGENCY_EXIT",
                                "description": "Salida de emergencia",
                                "quanty": 1,
                                "passengers": [
                                    {
                                        "id": "ADULT_01",
                                        "amount": 13,
                                        "amountFormatted": "13,00€"
                                    }
                                ],
                                "amount": 13,
                                "totalFormatted": "13,00€",
                                "freePassenger": [],
                                "totalAmountFreePassenger": "0€",
                                "paymentPassenger": [
                                    {
                                        "id": "ADULT_01",
                                        "amount": 13,
                                        "amountFormatted": "13,00€"
                                    }
                                ],
                                "totalAmountPaymentPassenger": "13,00€"
                            }
                        ],
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "quanty": 1,
                        "total": 13,
                        "totalFormatted": "13,00€"
                    }
                ],
                "hasSeats": true,
                "total": {
                    "total": 21,
                    "totalFormatted": "21,00€"
                }
            },
            "insurance": {
                "info": null,
                "hasInsurance": false,
                "total": {
                    "total": 21,
                    "totalFormatted": "21,00€"
                }
            },
            "flexibilization": {
                "info": null,
                "hasFlexibilization": false
            },
            "speqs": {
                "segments": [],
                "hasSpeqs": false,
                "total": {
                    "total": 21,
                    "totalFormatted": "21,00€"
                }
            },

        }
    }
    const fakeMmBDataLayerService: any = {
        isDatalayerInit: jasmine.createSpy(),
        initDatalayer: jasmine.createSpy(),
        addDataLayerGeneralInfo: jasmine.createSpy(),
        removeDatalayerGeneralInfo: jasmine.createSpy(),
        callUpdateTagManager: jasmine.createSpy(),
        addDataLayerEcommerceInfo: jasmine.createSpy(),
        getDatalayerGeneral: jasmine.createSpy(),
        getEcommerceDatalayer: jasmine.createSpy()
    };

    const $rootScope: any = {
        $broadcast: jasmine.createSpy()
    };

    let $timeout: any = {};

    const fakeMmBAppConstants: any = {
        DISCOUNT_TYPE: {
            RESIDENT: 'RESIDENT',
            LARGE_FAMILY : 'LARGE_FAMILY',
            CORPORATE: 'CORPORATE',
            PARTNER: 'PARTNER'
        },
        LARGE_FAMILY_DISCOUNT_TYPE_MAP: {
            'SPECIAL': 'ESPECIAL',
            'GENERAL': 'GENERAL'
        },
        OH_FLIGHT_TYPES: {
            MULTITRIP: 'MULTITRIP'
        },
        DATALAYER_INFO: {
            ANCILLARIES_ACTION: 'ANCILLARIES_ACTION'
        }
    };

    let fakeCommonsUtilService: any = {
        getUserTypeByToken: jasmine.createSpy(),
        sha256: jasmine.createSpy('sha256').and.returnValue(Promise.resolve({})),
        getIdItem: jasmine.createSpy().and.returnValue('idtest'),
        checkIsAddToCart: jasmine.createSpy(),
    };

    const $filter: any = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            case 'EliminateHyphenFilter':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            case 'EliminateAccentFilter':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    })

    const fakeCommonsUserUtilsService: any = {
        getUserRole: jasmine.createSpy(),
        isIbPlus: jasmine.createSpy(),
        isSoftUser: jasmine.createSpy(),
        isUserLoggedONB: jasmine.createSpy(),
        getFrequentFlyer: jasmine.createSpy()
    };

    const fakeMonetateUtilsService: any = {
        updateDigitalDataMonetate: jasmine.createSpy()
    };

    const fakeMmBDigitalDataService: any = {
        isDigitalDataInit: jasmine.createSpy(),
        initDigitalData: jasmine.createSpy(),
        addDigitalDataInfo: jasmine.createSpy(),
        removeDigitalDataInfo: jasmine.createSpy(),
        emitEvent: jasmine.createSpy(),
        emitViewEvent: jasmine.createSpy(),
        setAddInfoAddToCart: jasmine.createSpy(),
        setRemoveInfoAddToCart: jasmine.createSpy(),
        addDigitalDataEcommerceEvent: jasmine.createSpy(),
    };

    const fakeMMBDatalayerConstants: any = MMBDatalayerConstants;
    const fakeAncillariesConstants = AncillariesConstantsMock;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [MmBDatalayerUtilsService],
        });
        spyOn(fakeMmBDigitalDataService, 'removeDigitalDataInfo');

        transformer = new MmBDatalayerUtilsService(
            fakeMmBDataLayerService,
            $rootScope,
            $timeout,
            fakeMmBAppConstants,
            localStorageService,
            fakeCommonsUtilService,
            $filter,
            fakeCommonsUserUtilsService,
            fakeMonetateUtilsService,
            fakeMmBDigitalDataService,
            fakeAncillariesConstants);

        localStorageService.set('userLogged', false);
        localStorageService.set('EstadoUsuario', null);
        localStorageService.set('confirmationDigitalInfo', {});
        localStorageService.set('paymentsInfo', {});
        localStorageService.set('membershipData', undefined)
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('when updateDigitalDataForAncillaries is called', () => {
        const updatePrices = true;
        const ancillariesAction = "click";
        const headerModel = {
            headerModel: mockHeaderModel
        };
        const insuranceType = "";
        it('addDigitalDataInfo should be called', () => {
            transformer.updateDigitalDataForAncillaries(updatePrices, ancillariesAction, headerModel, insuranceType);
            expect(fakeMmBDataLayerService.callUpdateTagManager).toHaveBeenCalled()
        })
    });
    describe('should call cleanDigitalDataParametersFromIncludesString for each param in MMBDigitalDataParametersToRemove', () => {
        it('should call cleanDigitalDataParametersFromIncludesString for each param', () => {
            spyOn(transformer, 'cleanDigitalDataParametersFromIncludesString');
            transformer.cleanDigitalDataParameters();

            const expectedParams = Object.values(MMBDigitalDataParametersToRemove);
            expectedParams.forEach(param => {
                expect(transformer.cleanDigitalDataParametersFromIncludesString).toHaveBeenCalledWith(param);
            });

            expect(transformer.cleanDigitalDataParametersFromIncludesString).toHaveBeenCalledTimes(expectedParams.length);
        });
    });
    describe('cleanDigitalDataParametersFromIncludesString', () => {
        beforeEach(() => {
            fakeMmBDigitalDataService.removeDigitalDataInfo.calls.reset(); // <-- reset entre pruebas
        });

        it('should remove keys from confirmationDigitalInfo that include the given string', () => {
            localStorageService.set('confirmationDigitalInfo', {
                'Seats_1': {},
                'Seats_2': {},
                'Baggages_1': {},
                'Unrelated': {}
            });

            const expectedKeys = ['Seats_1', 'Seats_2'];

            transformer.cleanDigitalDataParametersFromIncludesString('Seats');

            expect(fakeMmBDigitalDataService.removeDigitalDataInfo).toHaveBeenCalledWith(expectedKeys);
            expect(fakeMmBDigitalDataService.removeDigitalDataInfo).toHaveBeenCalledTimes(1);
        });

        it('should not call removeDigitalDataInfo if confirmationDigitalInfo is not present', () => {
            localStorageService.remove('confirmationDigitalInfo');

            transformer.cleanDigitalDataParametersFromIncludesString('Seats');

            expect(fakeMmBDigitalDataService.removeDigitalDataInfo).not.toHaveBeenCalled();
        });
    });


describe('addAllianzFusionInsurance', () => {
  it('should add insurance info to extendedDatalayerInfo when insurance is present', () => {
    const headerModel = {
      headerModel: {
        shoppingBasket: {
          insuranceAllianzFusionInfo: {
            hasInsuranceAllianzFusion: true,
            info: { description: 'Seguro de viaje Allianz' },
            total: { total: 42.5 }
          }
        }
      }
    };

    const extendedDatalayerInfo: any = {};

    transformer.addAllianzFusionInsurance(headerModel, extendedDatalayerInfo);

    expect(extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE])
      .toEqual('Seguro de viaje Allianz');
    expect(extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE])
      .toEqual(42.5);
  });

  it('should not modify extendedDatalayerInfo if insurance is not present', () => {
    const headerModel = {
      headerModel: {
        shoppingBasket: {
          insuranceAllianzFusionInfo: {
            hasInsuranceAllianzFusion: false,
            info: { description: 'No debe incluirse' },
            total: { total: 100 }
          }
        }
      }
    };

    const extendedDatalayerInfo: any = {};

    transformer.addAllianzFusionInsurance(headerModel, extendedDatalayerInfo);

    expect(extendedDatalayerInfo).toEqual({});
  });

  it('should not throw if insuranceAllianzFusionInfo is undefined', () => {
    const headerModel = {
      headerModel: {
        shoppingBasket: {}
      }
    };

    const extendedDatalayerInfo: any = {};

    expect(() => {
      transformer.addAllianzFusionInsurance(headerModel, extendedDatalayerInfo);
    }).not.toThrow();

    expect(extendedDatalayerInfo).toEqual({});
  });
});




    describe('and initializeDatalayer', () => {
        it(' have been called', (done) => {
            transformer.initializeDatalayer('language', 'market', 'deviceType')
            expect(fakeMmBDataLayerService.initDatalayer).toHaveBeenCalled()
            expect(fakeMmBDigitalDataService.initDigitalData).toHaveBeenCalled()
            done();
        });
    });

    describe('and sendDatalayerEvent', () => {
        it(' have been called', (done) => {
            transformer.sendDatalayerEvent('type')
            expect($rootScope.$broadcast).toHaveBeenCalled()
            expect(fakeMmBDataLayerService.callUpdateTagManager).toHaveBeenCalled()
            done();
        });
    });

    describe('and updateLoggedDatalayer', () => {
        it('datalayer have been called', (done) => {
            transformer.updateLoggedDatalayer({})
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            done();
        });
        it('and datalayer customerData email', (done) => {
            fakeCommonsUserUtilsService.isUserLoggedONB = jasmine.createSpy().and.returnValue(false);
            transformer.updateLoggedDatalayer({ email: 'test@test.com' })
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            done();
        });
        it('and datalayer customerData hashEID', (done) => {
            fakeCommonsUserUtilsService.isUserLoggedONB = jasmine.createSpy().and.returnValue(false);
            transformer.updateLoggedDatalayer({ hashEID: 'test' })
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            done();
        });
        it('and datalayer customerData category user level and loggedONB', (done) => {
            localStorageService.set('membershipData', { clid: 'test', tierStatus: { status: 'test' } })
            fakeCommonsUserUtilsService.isUserLoggedONB = jasmine.createSpy().and.returnValue(true);
            transformer.updateLoggedDatalayer({ category: 'test' })
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            done();
        });
    });

    describe('and updateLoggedDigitalData', () => {
        it('digital data have been called', (done) => {
            transformer.updateLoggedDigitalData({})
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled()
            done();
        });
        it('and customerData email', (done) => {
            transformer.updateLoggedDigitalData({ email: 'test@test.com' })
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled()
            done();
        });
        it('and customerData hashEID', (done) => {
            transformer.updateLoggedDigitalData({ hashEID: 'test' })
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled()
            done();
        });
        it('and customerData category user level and loggedONB', (done) => {
            localStorageService.set('membershipData', { clid: 'test' })
            fakeCommonsUserUtilsService.isUserLoggedONB = jasmine.createSpy().and.returnValue(true);
            transformer.updateLoggedDigitalData({ category: 'test' })
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled()
            done();
        });
    });

    describe('and getAviosCoins', () => {
        it(' have been called', (done) => {
            const result = transformer.getAviosCoins({})
            expect(result).toEqual(0)
            done();
        });
    });

    describe('and generateDatalayerDOM', () => {
        it(' have been called', (done) => {
            const result = transformer.generateDatalayerDOM()
            expect(result).toBeDefined()
            done();
        });
    });

    describe('and removeDatalayerModalAttrs', () => {
        it(' have been called', (done) => {
            transformer.removeDatalayerModalAttrs()
            expect(fakeMmBDataLayerService.removeDatalayerGeneralInfo).toHaveBeenCalled()
            expect(fakeMmBDigitalDataService.removeDigitalDataInfo).toHaveBeenCalled()
            done();
        });
    });

    describe('and addDataLayerEcommerceInfo', () => {
        it(' have been called', (done) => {
            transformer.addDataLayerEcommerceInfo({})
            expect(fakeMmBDataLayerService.addDataLayerEcommerceInfo).toHaveBeenCalled()
            done();
        });
    });

    describe('and updateDatalayerForAncillaries', () => {
        it(' have been called', (done) => {
            transformer.updateDatalayerForAncillaries(true)
            expect(fakeMmBDataLayerService.callUpdateTagManager).toHaveBeenCalled()
            done();
        });
    });

    describe('and generateConfirmationDigitalDataObject', () => {
        it(' have been called', (done) => {
            transformer.generateConfirmationDigitalDataObject()
            done();
        });
    });

    describe('and updateTripDetailsDatalayerObject', () => {
        it(' have been called', (done) => {
            const bookingInfo = {
                passengers: [
                    {
                        passengerType: 'ADULT'
                    }
                ],
                order: {
                    slices: [{
                        segments: [{
                            departure: { code: 'MAD' },
                            arrival: { code: 'BIO' },
                            type: 'test',
                            departureDateTime: 'test test',
                            arrivalDateTime: 'test test',
                            flight: { operationalDisclosure: 'test' }
                        }]
                    }]
                }
            };
            transformer.updateTripDetailsDatalayerObject(bookingInfo)
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            done();
        });
    });

    describe('and updateDatalayerActionForAncillaries', () => {
        it(' have been called', (done) => {
            transformer.updateDatalayerActionForAncillaries('eventCategory', 'eventAction', 'eventLabel')
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            expect(fakeMmBDataLayerService.callUpdateTagManager).toHaveBeenCalled()
            done();
        });
    });

    describe('and updateDatalayerViewEvent', () => {
        it(' have been called', (done) => {
            transformer.updateDatalayerViewEvent()
            expect(fakeMmBDigitalDataService.emitViewEvent).toHaveBeenCalled()
            done();
        });
    });

    describe('and updateDatalayerWithTaxs', () => {
        it(' have been called', (done) => {
            transformer.updateDatalayerWithTaxs({})
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled()
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled()
            done();
        });
    });

    describe('and generateDatalayerConfirmation', () => {
        it(' have been called', (done) => {
            const fakeConfirmData = {
                generalInfo: {
                    test: 'test',
                    flightInfo: [
                        {
                            departureDateParsed: {originalDate: 'test test'},
                            segments: [{
                                cabin: {
                                    fareFamily : 'test',
                                    code: 'IB'
                                },
                                flight: {
                                    operationalCarrier: {
                                        code: 'IB'
                                    }
                                }
                            }]
                        },
                        {
                            departureDateParsed: {originalDate: 'test test'},
                            segments: [{
                                cabin: {
                                    fareFamily : 'test',
                                    code: 'IB'
                                },
                                flight: {
                                    operationalCarrier: {
                                        code: 'IB'
                                    }
                                }
                            }]
                        }
                    ],
                    passengerInfo: [{
                        precioPax: 50,
                        fFliyer: 'test',
                        type: 0
                    }],
                    specialDiscounts: [{
                        type: 'test'
                    }],
                    passengerPrices: [{
                        fare: 34,
                        tax: 30
                    }],
                    orderPrice: {
                        currency: 'EUR',
                        total: 60,
                        fare: 50
                    },
                    origin: {
                        code: 'MAD',
                        city: {
                            countryCode : 'MAD',
                        }
                    },
                    destination: {
                        code: 'BIO',
                        city: {
                            countryCode : 'BIO',
                        }
                    }
                },
            };
            transformer.generateDatalayerConfirmation(fakeConfirmData);
            done();
        });
    });

    describe('and mapLargeFamilyDiscountType', () => {
        it('should map SPECIAL to ESPECIAL', () => {
            const result = (transformer as any).mapLargeFamilyDiscountType('SPECIAL');
            expect(result).toEqual('ESPECIAL');
        });

        it('should map special (lowercase) to ESPECIAL', () => {
            const result = (transformer as any).mapLargeFamilyDiscountType('special');
            expect(result).toEqual('ESPECIAL');
        });

        it('should keep GENERAL as GENERAL', () => {
            const result = (transformer as any).mapLargeFamilyDiscountType('GENERAL');
            expect(result).toEqual('GENERAL');
        });

        it('should return original value if not mapped', () => {
            const result = (transformer as any).mapLargeFamilyDiscountType('UNKNOWN');
            expect(result).toEqual('UNKNOWN');
        });

        it('should handle null gracefully', () => {
            const result = (transformer as any).mapLargeFamilyDiscountType(null);
            expect(result).toBeNull();
        });

        it('should handle undefined gracefully', () => {
            const result = (transformer as any).mapLargeFamilyDiscountType(undefined);
            expect(result).toBeUndefined();
        });
    });
    describe('and updateDigitalDataForFlexFlights', () => {
        it(' have been called', (done) => {
            localStorageService.set('bookingInfo', {
                order: {
                    status: 'ENABLED',
                    slices: [{
                        segments: [{
                            cabin: {
                                fareFamily: 'Turista',
                                bookingClass: 'Standard'
                            },
                            flight: {
                                operationalDisclosure: 'IB',
                                operationalFlightNumber: '0256',
                                marketingFlightNumber: '0256'
                            },
                            departure: {
                                city: {
                                    code: 'MAD'
                                }
                            },
                            arrival: {
                                city: {
                                    code: 'BCN'
                                }
                            }
                        }],
                        departureDateTime: '2024-03-06 14:55',
                        arrivalDateTime: '2024-04-10 18:35'
                    }],
                    specialDiscounts: [{
                        type: 'RESIDENT'
                    },
                    {
                        type: 'LARGE_FAMILY'
                    }],

                }
            });
            let fakeobjectDigitalDataForFlexFlights = {
                passengersInfo: {
                    totalAmount: 50,
                    adults: 2,
                    kids: 1,
                    babies: 1,
                    seniors: 0,
                    young: 0
                }
            };
            transformer.updateDigitalDataForFlexFlights(fakeobjectDigitalDataForFlexFlights)
            done();
        });
    });

    describe('and updateSlicesDatalayerForFlexFlights', () => {
        it(' have been called', (done) => {
            const info = {
                order: {
                    slices: [
                        {
                            segments: [
                                {
                                    departure: {
                                        code: 'code',
                                        city: 'code'
                                    },
                                    arrival: {
                                        code: 'code',
                                        city: 'code'
                                    },
                                    cabin: {
                                        bookingClass: 'bookingClass',
                                        fareFamily: 'fareFamily'
                                    }
                                }
                            ],
                            stopsNumber: '0',
                            departureDateTime: '2023-11-24'
                        }
                    ]
                }
            };
            const summary = {
                context: {
                    segments: [
                        {
                            departureDate: '2023-11-24',
                            haul: 'SH'
                        }
                    ]
                }
            };
            transformer.updateSlicesDatalayerForFlexFlights(info, summary)
            done();
        });
    });

    describe('and addDatalayerInfoHashEID', () => {
        it(' have been called', (done) => {
            inject(() => {
                fakeCommonsUtilService.sha256 = jasmine.createSpy().and.returnValue(Promise.resolve('hash'))
            })
            transformer.addDatalayerInfoHashEID({ personalInfo: { contactEmail: 'contactEmail' } })
            done();
        });
    });

    describe('and addDigitalDataInfoHashEID', () => {
        it(' have been called', (done) => {
            inject(() => {
                fakeCommonsUtilService.sha256 = jasmine.createSpy().and.returnValue(Promise.resolve('hash'))
            })
            transformer.addDigitalDataInfoHashEID({ personalInfo: { contactEmail: 'contactEmail' } });
            done();
        });
    });

    describe('and updateDatalayerEvents', () => {
        it(' have been called', (done) => {
            transformer.updateDatalayerEvents('eventCategory', 'eventAction', 'eventLabel');
            expect(fakeMmBDataLayerService.callUpdateTagManager).toHaveBeenCalled();
            expect(fakeMonetateUtilsService.updateDigitalDataMonetate).toHaveBeenCalled();
            expect($rootScope.$broadcast).toHaveBeenCalled();
            done();
        });
    });

    describe('and updateDatalayerInfo', () => {
        it(' have been called', (done) => {
            transformer.updateDatalayerInfo('process', 'step', 'quadrigam');
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled();
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
            expect($rootScope.$broadcast).toHaveBeenCalled();
            done();
        });
    });

    describe('and setProcessAndStep', () => {
        it(' have been called', (done) => {
            transformer.setProcessAndStep('process', 'step', 'quadrigam');
            expect(fakeMmBDataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled();
            expect(fakeMmBDigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
            done();
        });
    });

    describe('and removeProcessAndStep', () => {
        it(' have been called', (done) => {
            transformer.removeProcessAndStep();
            done();
        });
    });

    describe('and getStepFromQuadrigam', () => {
        it(' have been called', (done) => {
            const result = transformer.getStepFromQuadrigam('ONHOLD');
            expect(result).toEqual('pago');
            done();
        });

        it(' have been called with default value', (done) => {
            const result = transformer.getStepFromQuadrigam('', 'test');
            expect(result).toEqual('test');
            done();
        });
    });

    describe('and getUserState', () => {
        it(' have been called without logged', (done) => {
            const result = transformer.getUserState(false);
            expect(result).toEqual('no_logado');
            done();
        });

        it(' have been called logged', (done) => {
            const result = transformer.getUserState(true);
            expect(result).toEqual('logado_ib_hard');
            done();
        });
    });

    describe('call sendDatalayerErrorEvent', () => {
        it(' have been called ', (done) => {
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.sendDatalayerErrorEvent({ errorCode: 400, message: 'testmessage', quadrigam: 'test', isLogged: false, eventCategory: 'test', eventAction: 'test', eventLabel: 'test', internalErrorCode: 'testinternal' });
            expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('call removeDatalayerErrorAttrs', () => {
        it(' have been called', (done) => {
            spyOn(transformer, 'removeDigitalDataObjects');
            transformer.removeDatalayerErrorAttrs();
            expect(transformer.removeDigitalDataObjects).toHaveBeenCalled();
            done();
        });
    });

    describe('call sendDatalayerModalEvent', () => {
        it(' have been called', (done) => {
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.sendDatalayerModalEvent({ errorCode: 400, message: 'testmessage', quadrigam: 'test', isLogged: false, eventCategory: 'test', eventAction: 'test', eventLabel: 'test', internalErrorCode: 'testinternal' });
            expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
    });


    describe('call setInsuranceEcommerce', () => {
        it('have been called', (done) => {
            let fakeInsurance = {
                provider: '',
                originalPrice: 30,
                id: ''
            }
            transformer.setInsuranceEcommerce(fakeInsurance, '');
            expect(fakeMmBDigitalDataService.setRemoveInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('have been called and event add to cart', (done) => {
            let fakeInsurance = {
                provider: '',
                originalPrice: 30,
                id: ''
            }
            transformer.setInsuranceEcommerce(fakeInsurance, 'ADD_TO_CART');
            expect(fakeMmBDigitalDataService.setRemoveInfoAddToCart).toHaveBeenCalled();
            done();
        });
    });

    xdescribe('call updateDiscountData', () => {
        it(' have been called and type CORPORATE', (done) => {
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.updateDiscountData([{acc:'', current: {type: 'CORPORATE', discountType: '', corporateCodes: ''}}]);
            expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it(' have been called and type RESIDENT', (done) => {
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.updateDiscountData([{acc:'', current: {type: 'RESIDENT'}}]);
            expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it(' have been called and type LARGE_FAMILY', (done) => {
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.updateDiscountData([{acc:'', current: {type: 'LARGE_FAMILY'}}]);
            expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it(' have been called and type PARTNER', (done) => {
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.updateDiscountData([{acc:'', current: {type: 'PARTNER'}}]);
            expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
    });

    // Failed itemCategory3 params
    xdescribe('call getAncillariesDigitalDataEcommerce', () => {
        it('have been called with baggages', (done) => {
            localStorageService.set('ancillariesInfo', {ancillaries: [{type: 'BAGGAGE', slices: [{id:'testidtest', segments:[{departure:{code:'MAD'}, arrival:{code:'BIO'}}], passengers:[{pieces: [{availablePriceRanges:[{amount:50}]}]}]}]}], bundles: [{priceItemsDiscount: 50, id: 'id'}]});
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.getAncillariesDigitalDataEcommerce('baggages', '');
            // expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it('have been called with seat', (done) => {
            localStorageService.set('ancillariesInfo', {ancillaries: [{type: 'SEAT', slices: [{id:'testidtest', segments:[{departure:{code:'MAD'}, arrival:{code:'BIO'}}], passengers:[{pieces: [{availablePriceRanges:[{amount:50}]}]}]}]}], bundles: [{priceItemsDiscount: 50, id: 'id'}]});
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.getAncillariesDigitalDataEcommerce('seat', '');
            // expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it('have been called with insurance', (done) => {
            localStorageService.set('ancillariesInfo', {ancillaries: [{type: 'INSURANCE', slices: [{id:'testidtest', segments:[{departure:{code:'MAD'}, arrival:{code:'BIO'}}], passengers:[{pieces: [{availablePriceRanges:[{amount:50}]}]}]}]}], bundles: [{priceItemsDiscount: 50, id: 'id'}]});
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.getAncillariesDigitalDataEcommerce('insurance', '');
            // expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it('have been called with flexibilization', (done) => {
            localStorageService.set('ancillariesInfo', {ancillaries: [{type: 'FLEXIBILITY_ON_DEMAND', slices: [{id:'testidtest', segments:[{departure:{code:'MAD'}, arrival:{code:'BIO'}}], passengers:[{pieces: [{availablePriceRanges:[{amount:50}]}]}]}]}], bundles: [{priceItemsDiscount: 50, id: 'id'}]});
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.getAncillariesDigitalDataEcommerce('flexibilization', '');
            // expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
        it('have been called with special baggages', (done) => {
            localStorageService.set('ancillariesInfo', {ancillaries: [{type: 'SPECIAL_EQUIPMENT', slices: [{id:'testidtest', segments:[{departure:{code:'MAD'}, arrival:{code:'BIO'}}], passengers:[{pieces: [{availablePriceRanges:[{amount:50}]}]}]}]}], bundles: [{priceItemsDiscount: 50, id: 'id'}]});
            spyOn(transformer, 'sendDatalayerEvent');
            transformer.getAncillariesDigitalDataEcommerce('special baggages', '');
            // expect(transformer.sendDatalayerEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('call setSelectItemAndAddToCartBundle', () => {
        it('and type baggage and subtype 15', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'BAGGAGE',
                    subtype: 'BAGGAGE_15'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type baggage and subtype 23', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'BAGGAGE',
                    subtype: 'BAGGAGE_23'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type baggage and subtype 32', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'BAGGAGE',
                    subtype: 'BAGGAGE_32'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type SPECIAL_EQUIPMENT and subtype BICYCLE', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'SPECIAL_EQUIPMENT',
                    subtype: 'BICYCLE'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type SPECIAL_EQUIPMENT and subtype GOLF_EQUIPMENT', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'SPECIAL_EQUIPMENT',
                    subtype: 'GOLF_EQUIPMENT'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type SPECIAL_EQUIPMENT and subtype SKI_SNOW', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'SPECIAL_EQUIPMENT',
                    subtype: 'SKI_SNOW'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type FLEXIBILITY_ON_DEMAND and subtype FLEXIBILITY_PACK', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'FLEXIBILITY_ON_DEMAND',
                    subtype: 'FLEXIBILITY_PACK'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type FLEXIBILITY_ON_DEMAND and subtype FLIGHT_CHANGE', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'FLEXIBILITY_ON_DEMAND',
                    subtype: 'FLIGHT_CHANGE'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and type FLEXIBILITY_ON_DEMAND and subtype VOUCHER_REFUND', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'FLEXIBILITY_ON_DEMAND',
                    subtype: 'VOUCHER_REFUND'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
        it('and default  type PRIORITY_BOARDING and subtype PRIORITY_BOARDING', (done) => {
            let fakeselectedBundle = {
                priceItemsDiscount: '50',
                id: 'id',
                items: [{
                    priceItemDiscount: '50',
                    type: 'PRIORITY_BOARDING',
                    subtype: 'PRIORITY_BOARDING'
                }]
            };
            transformer.setSelectItemAndAddToCartBundle(fakeselectedBundle);
            expect(fakeMmBDigitalDataService.setAddInfoAddToCart).toHaveBeenCalled();
            done();
        });
    });

    describe('call setAncillariesAction', () => {
        it(' have been called', (done) => {
            transformer.setAncillariesAction({});
            done();
        });
    });
    describe('call setAncillariesDatalayer', () => {
        it(' have been called', (done) => {
            let fakeHeaderModel = {
                headerModel: {...mockHeaderModel}
            };
            
            fakeHeaderModel.headerModel.shoppingBasket.insurance.hasInsurance = true;
            fakeHeaderModel.headerModel.shoppingBasket.insurance.info = {
                type: 'test'
            };
            fakeHeaderModel.headerModel.shoppingBasket.speqs.hasSpeqs = true;
            fakeHeaderModel.headerModel.shoppingBasket.speqs.segments = [{
                speqs: [{
                    quanty: 2
                }]
            }];

            fakeHeaderModel.headerModel.shoppingBasket.flexibilization = {
                "info": {
                    amount: {
                        price: 30
                    }
                },
                "hasFlexibilization": true,
            };
            localStorageService.set('headerModel', fakeHeaderModel)
            localStorageService.set('bookingInfo', fakeImportOrder)
            transformer.setAncillariesDatalayer();
            done();
        });
    });


});
