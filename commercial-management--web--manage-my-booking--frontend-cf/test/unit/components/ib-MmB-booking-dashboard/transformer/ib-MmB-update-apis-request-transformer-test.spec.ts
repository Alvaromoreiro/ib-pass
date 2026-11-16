import { TestBed } from "@angular/core/testing";
import { UpdateApisRequestTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-update-apis-request-transformer";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";

describe('UpdateSpecialNeedsTransformer test ', () => {
    let localStorageService: StorageServiceMock = new StorageServiceMock();
    let transformer;

    const casePassApisData = require('./mocks/pass-apis-data.json');
    const casePassApisData2 = require('./mocks/pass-apis-data2.json');
    const passengersApis = require('./mocks/passengers-apis.json');
    const bookingInfo = require('./mocks/booking-info-apis.json');
    const emergecyContactData = {
        "name": "",
        "phone": "",
        "countryCode": "ES",
        "code": "34",
        "phoneDetails": ""
    };

    const fakeBookingDashboardConstants = {
        APIS_FORM: {
            USA_NATIONALITY: 'US'
        }
    };

    const fakeMmBUtilsSharedService:any = {
        getUniqueElementByProperty: jasmine.createSpy()
    };

    const fakeMmBAppConstants = {
        PASSENGER_TYPES: {
            adult: 'ADULT',
            child: 'CHILD',
            infant: 'INFANT'
        }
    };

    const fakeBookingInfoLocalStorage = {
        "passengers": []
    }

    beforeEach(async ()=>{
        TestBed.configureTestingModule({
            declarations: [UpdateApisRequestTransformer],
        });
        transformer = new UpdateApisRequestTransformer(localStorageService , fakeBookingDashboardConstants, fakeMmBUtilsSharedService, fakeMmBAppConstants);

        localStorageService.set('bookingInfo', bookingInfo);
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and generateUpdateApisRequest', () => {
        it(' have been called', (done) => {
            const passApisData = {
                view: { showInTransitForAll: true},
                id: 'id',
                basicInfo: {
                    name: 'name',
                    surname: 'surname',
                    gender: 'gender',
                    nationality: 'nationality'
                },
                mandatoryDocuments: {
                    selectedDoc: null
                },
                visaDocument: null,
                optionalDocuments: {
                    selectedDoc: null
                }
            };
            const result = transformer.generateUpdateApisRequest(passApisData, null, null);
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and showInTransitForAll = false have been called', (done) => {
            const result = transformer.generateUpdateApisRequest(casePassApisData, emergecyContactData, passengersApis);
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and showInTransitForAll = true have been called', (done) => {
            const result = transformer.generateUpdateApisRequest(casePassApisData2, emergecyContactData, passengersApis);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateDocumentsAndHomeAdress', () => {
        it(' have been called', (done) => {
            const result = transformer.generateDocumentsAndHomeAdress(null, []);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and destinationAddressByPassengers', () => {
        it(' have been called', (done) => {
            const result = transformer.destinationAddressByPassengers([], null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateCommonPasInfo', () => {
        it(' have been called', (done) => {
            const pasInfo = {
                id: 'id',
                basicInfo: {
                    name: 'name',
                    surname: 'surname',
                    gender: 'gender',
                    nationality: 'nationality'
                },
                mandatoryDocuments: {
                    selectedDoc: null
                },
                visaDocument: null,
                optionalDocuments: {
                    selectedDoc: null
                }
            }
            const result = transformer.generateCommonPasInfo(pasInfo, null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and transformDate', () => {
        it(' have been called', (done) => {
            const result = transformer.transformDate('20/12/2023');
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and applyTransitForAll', () => {
        it(' have been called', (done) => {
            transformer.applyTransitForAll(null, null);
            done();
        });
    });

    describe('and generateDocumentsRequest', () => {
        it(' have been called', (done) => {
            const result = transformer.generateDocumentsRequest(null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and transformCountry', () => {
        it(' have been called', (done) => {
            const doc = { issuerCountry: null };
            const result = transformer.transformCountry(doc);
            expect(result).toBeDefined();
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
});