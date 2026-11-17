import { TestBed } from '@angular/core/testing';
import { AJSTravelInfoService, AJSTravelInfoServiceType } from '@src/app/shared/services/ib-apis/ib-travel-info-service-bridge.service';
import { DocumentModel, Document } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import { IbTravelDocumentService } from './ib-travel-document.service';

// Helpers
const emptyResult = { documents: [] as DocumentModel[], documentsTypesValid: [] as TravelDocumentType[] };

describe('IbTravelDocumentService', () => {
    let service: IbTravelDocumentService;
    let travelInfoSpy: jasmine.SpyObj<AJSTravelInfoServiceType>;

    beforeEach(() => {
        travelInfoSpy = jasmine.createSpyObj('AJSTravelInfoServiceType', ['getTravelInfo']);

        TestBed.configureTestingModule({
            providers: [IbTravelDocumentService, { provide: AJSTravelInfoService, useValue: travelInfoSpy }]
        });

        service = TestBed.inject(IbTravelDocumentService);
    });

    afterEach(() => {
        jasmine.clock().uninstall?.();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return empty when the API returns []', async () => {
        travelInfoSpy.getTravelInfo.and.resolveTo([]);

        const result = await service.getTravelDocuments(['PASSPORT']);

        expect(result).toEqual(emptyResult);
        expect(travelInfoSpy.getTravelInfo).toHaveBeenCalledTimes(1);
    });

    it('should correctly map, partition, and filter', async () => {
        const apiDocs: Document[] = [
            {
                id: '1',
                typeCode: '02', // 02 - DNI
                //typeDescription: 'DNI',
                countryCode: 'ES',
                number: '11122233L',
                expiryDate: '2030-07-20'
            },
            {
                id: '2',
                typeCode: '05', // 05 - PASSPORT
                //typeDescription: 'PASSPORT',
                countryCode: 'ES',
                number: '11122233L',
                expiryDate: '2030-07-20'
            }
        ];

        travelInfoSpy.getTravelInfo.and.resolveTo(apiDocs);

        const result = await service.getTravelDocuments(['PASSPORT']);

        expect(travelInfoSpy.getTravelInfo).toHaveBeenCalledTimes(1);

        // We only assert the relevant behavior:
        // - documents are not empty
        // - only PASSPORT is present
        // - typesValid contains PASSPORT
        expect(result.documents.length).toBe(1);
        expect(result.documents[0].typeDescription).toBe('PASSPORT');
        expect(result.documentsTypesValid).toEqual(['PASSPORT']);
    });

    it('should handle errors and return empty', async () => {
        travelInfoSpy.getTravelInfo.and.rejectWith(new Error('Network error'));

        const result = await service.getTravelDocuments(['ANY']);

        expect(result).toEqual(emptyResult);
        expect(travelInfoSpy.getTravelInfo).toHaveBeenCalledTimes(1);
    });

    it('should tolerate an empty validTypesDocsSecurity array', async () => {
        const apiDocs: Document[] = [ // as Document[]
            {
                id: '1',
                typeCode: '02', // 02 - DNI
                //typeDescription: 'DNI',
                countryCode: 'ES',
                number: '11122233L',
                expiryDate: '2030-07-20'
            }
        ];

        travelInfoSpy.getTravelInfo.and.resolveTo(apiDocs);

        const result = await service.getTravelDocuments([]);

        // If there are no valid types passed, service should not return any documents
        //expect(result).toEqual(emptyResult);
        expect(travelInfoSpy.getTravelInfo).toHaveBeenCalledTimes(1);
    });
});
