import { TestBed } from "@angular/core/testing";
import { ApisFormTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-apis-form-transformer";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";

describe('ApisFormTransformer test ', () => {
    let localStorageService: StorageServiceMock = new StorageServiceMock();
    let transformer;

    const caseApisInfo = require('./mocks/apis-info.json');
    const companiesList = require('./mocks/companies-list.json');
    const countriesList = require('./mocks/countries-list.json');
    const stateList = require('./mocks/states-list.json');

    const fakeBookingDashboardConstants = {
        APIS_FORM: {
            DOCUMENT_TYPES: {
                DNI: 'DNI',
                GREENCARD: 'GREENCARD',
                REDRESSNUMBER: 'REDRESSNUMBER',
                KNOWNTRAVELERNUMBER: 'KNOWNTRAVELERNUMBER',
                OTHERS: 'OTHERS',
                PSPT: 'PSPT',
                TITLE: 'TITLE',
                VISA: 'VISA',
                CREWCERT: 'CREWCERT',
                RESCARD: 'RESCARD',
                MILITARYCARD: 'MILITARYCARD'
            },
            DOCUMENT_FIELDS: {
                NUM_DOC: 'NUM_DOC',
                EXPIRY_DOC: 'EXPIRY_DOC',
                ISSUE_DOC: 'ISSUE_DOC',
                CNTRY_DOC: 'CNTRY_DOC',
                CITY_DOC: 'CITY_DOC'
            },
            FIELDS: {
                TITLE: 'TITLE',
                NAME: 'NAME',
                SURNAME: 'SURNAME',
                GENDER: 'GENDER',
                BIRTH_DATE: 'BIRTH_DATE',
                DESTINATION_ADDRESS: 'DESTINATION_ADDRESS',
                DESTINATION_CITY: 'DESTINATION_CITY',
                DESTINATION_STATE: 'DESTINATION_STATE',
                DESTINATION_ZIP: 'DESTINATION_ZIP',
                DESTINATION_COUNTRY: 'DESTINATION_COUNTRY',
                HOME_ADDRESS: 'HOME_ADDRESS',
                HOME_CITY: 'HOME_CITY',
                HOME_STATE: 'HOME_STATE',
                HOME_ZIP: 'HOME_ZIP',
                HOME_COUNTRY: 'HOME_COUNTRY',
                EMERGENCY_CONTACT_NAME: 'EMERGENCY_CONTACT_NAME',
                EMERGENCY_CONTACT_PHONE: 'EMERGENCY_CONTACT_PHONE',
                NATIONALITY: 'NATIONALITY',
                CITY_OF_BIRTH: 'CITY_OF_BIRTH'
            },
            USA_NATIONALITY: 'US'
        }
    };

    const fakeMmBAppConstants = {
        PASSENGER_TYPES: {
            adult: 'ADULT',
            child: 'CHILD',
            infant: 'INFANT'
        }
    };

    const fakeBookingInfoLocalStorage = {
        "passengers": [
            { passengerType: 'ADULT', passengerId: 'ADULT_01' },
            { passengerType: 'CHILD', passengerId: 'CHILD_01' },
            {
                passengerType: "INFANT",
                personalInfo: {
                    name: "TESTINFANT",
                    surname: "TEST",
                    birthDate: "2023-03-02"
                },
                passengerId: "INFANT_01",
                relatedPassengerId: "ADULT_01",
                ckiStatus: null,
                optionalInformation: [],
                residenceAccreditationStatus: null,
                resiberPassengerId: "2",
                securityInformation: {
                    relatedContent: [
                        {
                            "key": "APIS_DOCUMENT_INFO",
                            "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
                        },
                        {
                            "key": "APIS_STATUS_INFO",
                            "value": "Completar"
                        }
                    ]
                },
                externalPersonalInfo: {
                    name: "testinfant",
                    firstSurname: "test",
                    lastSurname: ""
                }
            },
        ]
    };

    const $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = () => {
            return ''
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return '';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    let fakePassengerInfo = {
        birthDate: "1990-04-03",
        cityOfBirth: null,
        countryOfResidence: null,
        destinationAddress: null,
        documents: [],
        emergencyContact: null,
        gender: "MALE",
        homeAddress: { address: null, city: '', state: '', zipCode: '', country: {} },
        id: "ADULT_01",
        inTransit: false,
        infantPassengerSecurityInformation: {
            documents: []
        },
        mandatoryDocuments: [{}],
        name: undefined,
        nationality: { code: 'AL', description: 'Albania' },
        optionalDocuments: [],
        requiredFields: ['SURNAME', 'NAME', 'GENDER', 'BIRTH_DATE', 'NATIONALITY'],
        surname: undefined,
        title: null,
    };

    let fakeStatesList = [
        {code: 'AL', normalizedCode: 'AL', description: 'Alabama'},
        {code: 'AK', normalizedCode: 'AK', description: 'Alaska'},
        {code: 'AZ', normalizedCode: 'AZ', description: 'Arizona'},
        {code: 'AR', normalizedCode: 'AR', description: 'Arkansas'},
        {code: 'NY', normalizedCode: 'NY', description: 'New York'}
    ]

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [ApisFormTransformer],
        });
        transformer = new ApisFormTransformer(localStorageService, fakeBookingDashboardConstants, $fakeFilter, fakeMmBAppConstants);

        localStorageService.set('bookingInfo', fakeBookingInfoLocalStorage);
        // localStorageService.set('specialNeedsPassengers', specialNeedsPassenger)
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and transformApisForm', () => {
        it(' have been called', (done) => {
            const apisInfo = {
                passengersSecurityInformation: [
                    {
                        requiredFields: [],
                        id: 'ADULT_01',
                        infantPassengerSecurityInformation: {
                            id: 'INFANT_01',
                            relatedPassengerId: 'ADULT_01',
                            documents: [],
                            name: 'testname',
                            surname: 'testruanme',
                            gender: 'test',
                            birthDate: '2023-25-09',
                            nationality: {
                                code: 'US'
                            },
                            homeAddress: {
                                country: {
                                    code: 'US'
                                }
                            },
                            requiredFields: ['DESTINATION_ADDRESS'],
                            mandatoryDocuments: [{
                                documents: []
                            }],
                            optionalDocuments: [],
                        },
                        title: 'title',
                        mandatoryDocuments: [{
                            documents: []
                        }],
                        optionalDocuments: [],
                        documents: []
                    }
                ]
            };
            const result = transformer.transformApisForm(apisInfo, [], [], []);
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters have been called', (done) => {
            const result = transformer.transformApisForm(caseApisInfo, companiesList, countriesList, stateList);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generatePassengerApisInfo', () => {
        it('Should generatePassengerApisInfo have been called', (done) => {
            const pasApisInfo = {
                requiredFields: ['DESTINATION_ADDRESS'],
                id: 'ADULT_01',
                "infantPassengerSecurityInformation": {
                    "id": "INFANT_01",
                    "requiredFields": [
                    "SURNAME",
                    "NAME",
                    "GENDER",
                    "BIRTH_DATE",
                    "NATIONALITY",
                    "HOME_COUNTRY",
                    "DESTINATION_ADDRESS",
                    "DESTINATION_CITY",
                    "DESTINATION_STATE",
                    "DESTINATION_ZIP",
                    "DESTINATION_COUNTRY"
                    ],
                    "name": "TESTBEBE",
                    "surname": "TEST ASDASD",
                    "gender": "MALE",
                    "birthDate": "2023-04-04",
                    "nationality": {
                    "code": "BB",
                    "description": "Barbados"
                    },
                    "cityOfBirth": null,
                    "countryOfResidence": null,
                    "mandatoryDocuments": [
                    {
                        "documents": [
                        {
                            "type": {
                            "code": "PSPT",
                            "description": "Pasaporte"
                            },
                            "requiredFields": [
                            "NUM_DOC",
                            "EXPIRY_DOC",
                            "CNTRY_DOC"
                            ],
                            "requiredFieldsOptions": []
                        }
                        ]
                    }
                    ],
                    "optionalDocuments": [
                    {
                        "type": {
                        "code": "VISA",
                        "description": "Visado"
                        },
                        "requiredFields": [
                        "EXPIRY_DOC",
                        "NUM_DOC",
                        "CNTRY_DOC"
                        ],
                        "requiredFieldsOptions": []
                    },
                    {
                        "type": {
                        "code": "GREENCARD",
                        "description": "Cartilla verde americana"
                        },
                        "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC",
                        "EXPIRY_DOC"
                        ],
                        "requiredFieldsOptions": []
                    },
                    {
                        "type": {
                        "code": "REDRESSNUMBER",
                        "description": "Passenger Redress Number"
                        },
                        "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC"
                        ],
                        "requiredFieldsOptions": [
                        {
                            "type": null,
                            "field": "CNTRY_DOC",
                            "values": [
                            "US"
                            ],
                            "minValue": "",
                            "maxValue": ""
                        }
                        ]
                    },
                    {
                        "type": {
                        "code": "OTHERS",
                        "description": "Otros documentos"
                        },
                        "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC",
                        "EXPIRY_DOC"
                        ],
                        "requiredFieldsOptions": []
                    },
                    {
                        "type": {
                        "code": "KNOWNTRAVELERNUMBER",
                        "description": "Known traveller ID"
                        },
                        "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC"
                        ],
                        "requiredFieldsOptions": [
                        {
                            "type": null,
                            "field": "CNTRY_DOC",
                            "values": [
                            "US"
                            ],
                            "minValue": "",
                            "maxValue": ""
                        }
                        ]
                    }
                    ],
                    "documents": [
                    {
                        "type": {
                        "code": "PSPT",
                        "description": "Pasaporte"
                        },
                        "issuedDate": null,
                        "expiryDate": "2027-03-03",
                        "number": "777777777",
                        "issuerCountry": {
                        "code": "BB",
                        "description": "Barbados"
                        }
                    }
                    ]
                },
                title: 'title',
                mandatoryDocuments: [{
                    documents: [{
                        type: {
                            code: 'DNI',
                            description: 'dni'
                        },
                        "requiredFields": [
                            "NUM_DOC",
                            "EXPIRY_DOC",
                            "CNTRY_DOC"
                        ],
                        requiredFieldsOptions: [],
                        number: '',
                        issuedDate: '',
                        expiryDate: '',
                        issuerCountry: '',
                        saveDocument: false
                    }]
                }],
                optionalDocuments: [],
                "documents": [
                    {
                        "type": {
                            "code": "PSPT",
                            "description": "Pasaporte"
                        },
                        "issuedDate": null,
                        "expiryDate": "2027-03-03",
                        "number": "777777777",
                        "issuerCountry": {
                            "code": "BB",
                            "description": "Barbados"
                        }
                    }
                ],
                homeAddress: {
                    country: {
                        code: 'US'
                    }
                },
                destinationAddress: {
                    address: 'Calle',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: {
                        code: 'US'
                    }
                }
            };
            const result = transformer.generatePassengerApisInfo(pasApisInfo, fakeStatesList);
            expect(result).toBeDefined();
            done();
        });

        it('Should generatePassengerApisInfo have been called without infant', (done) => {
            const pasApisInfo = {
                requiredFields: ['DESTINATION_ADDRESS'],
                id: 'ADULT_01',
                infantPassengerSecurityInformation: null,
                title: 'title',
                mandatoryDocuments: [{
                    documents: [{
                        type: {
                            code: 'DNI',
                            description: 'dni'
                        },
                        "requiredFields": [
                            "NUM_DOC",
                            "EXPIRY_DOC",
                            "CNTRY_DOC"
                        ],
                        requiredFieldsOptions: [],
                        number: '',
                        issuedDate: '',
                        expiryDate: '',
                        issuerCountry: '',
                        saveDocument: false
                    }]
                }],
                optionalDocuments: [],
                documents: [],
                homeAddress: {
                    country: {
                        code: 'US'
                    }
                },
                destinationAddress: {
                    address: 'Calle',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: {
                        code: 'US'
                    }
                }
            };
            const result = transformer.generatePassengerApisInfo(pasApisInfo, fakeStatesList);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getStateCode', () => {
        it(' have been called', (done) => {
            const result = transformer.getStateCode(null, []);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getPasDate', () => {
        it(' have been called', (done) => {
            const result = transformer.getPasDate(null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateDestination', () => {
        it(' have been called', (done) => {
            const result = transformer.generateDestination([]);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateBasicInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.generateBasicInfo([]);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateDocumentsInfo', () => {
        it(' have been called', (done) => {
            const passengerInfo = {
                mandatoryDocuments: [],
                optionalDocuments: [],
                documents: []
            };
            const result = transformer.generateDocumentsInfo(passengerInfo);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getDocumentValues', () => {
        it(' have been called', (done) => {
            const currentDocument = { isSaved: null };
            const passengerInfo = { documents: [] };
            transformer.getDocumentValues(currentDocument, passengerInfo);
            done();
        });
    });

    describe('and checkDocumentIssuerCountry', () => {
        it(' have been called', (done) => {
            const currentDocument = { type: { code: '' } }
            transformer.checkDocumentIssuerCountry(currentDocument, null);
            done();
        });
    });

    describe('and generateInf', () => {
        it(' have been called', (done) => {
            const result = transformer.generateInf([], null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('generateBasicInfo', () => {
        it('should get name and surname from externalPersonalInfo when not defined in passengerInfo', (done) => {
            transformer.localStorageService = {
                get: () => ({
                    passengers: [
                        {
                            passengerId: 'ADULT_01',
                            externalPersonalInfo: {
                                name: 'Tester Test',
                                firstSurname: 'Front Test'
                            }
                        }
                    ]
                })
            };
            const result = transformer.generateBasicInfo(fakePassengerInfo);
            expect(result.name).toBe('Tester Test');
            expect(result.surname).toBe('Front Test');
            done();
        });
    });
});
