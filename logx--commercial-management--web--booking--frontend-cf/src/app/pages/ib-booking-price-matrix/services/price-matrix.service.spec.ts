import { TestBed } from '@angular/core/testing';
import { PriceMatrixService } from './price-matrix.service';
import { CallPriceMatrixService } from '@src/app/shared/http-services/sse-avm/ib-call-booking-price-matrix-service.service';
import { PriceMatrixTransformer, TransformedPriceMatrixData } from '../transformers/price-matrix-transformer.service';
import { RibbonRequest } from '@src/app/core/models/ib-booking-availability/ribbon-models';
import { BookingHttpResponse, BookingHttpErrorModel } from '@src/app/core/models/generic-models/generic-models';
import { CalendarInfo } from 'ib-web-payments/dist/app/core/models/ib-booking-availability-transformer-model';

describe('PriceMatrixService', () => {

    let service: PriceMatrixService;

    let callServiceMock: jasmine.SpyObj<CallPriceMatrixService>;
    let transformerMock: jasmine.SpyObj<PriceMatrixTransformer>;

    const mockRequestData: RibbonRequest = {
        slices: [],
        passengers: [],
        marketCode: 'ES',
        preferredCabin: 'ECONOMY'
    };
    
    const mockApiData = {} as unknown as CalendarInfo;

    const mockResponse: BookingHttpResponse<CalendarInfo | BookingHttpErrorModel> = {
        code: 200,
        data: mockApiData
    };


    const transformedResponse: TransformedPriceMatrixData = {
        availability: {},
        currency: {},
        calendarGrid: { cells: [], columns: [], rows: [] },
        flightRatio: '',
        ribbon: false,
        trip: {}
    };

    beforeEach(() => {
        callServiceMock = jasmine.createSpyObj('CallPriceMatrixService', [
            'getPriceMatrixPromised'
        ]);

        transformerMock = jasmine.createSpyObj('PriceMatrixTransformer', [
            'generateRequestData',
            'transformGetPriceMatrixData'
        ]);

        TestBed.configureTestingModule({
            providers: [
                PriceMatrixService,
                { provide: CallPriceMatrixService, useValue: callServiceMock },
                { provide: PriceMatrixTransformer, useValue: transformerMock }
            ]
        });

        service = TestBed.inject(PriceMatrixService);
    });

    it('should call service and transform response correctly', async () => {
        transformerMock.generateRequestData.and.returnValue(mockRequestData);
        callServiceMock.getPriceMatrixPromised.and.returnValue(Promise.resolve(mockResponse));
        transformerMock.transformGetPriceMatrixData.and.returnValue(transformedResponse);

        const result = await service.getPriceMatrix();

        expect(transformerMock.generateRequestData).toHaveBeenCalledTimes(1);

        expect(callServiceMock.getPriceMatrixPromised)
            .toHaveBeenCalledWith(mockRequestData, false);

        expect(transformerMock.transformGetPriceMatrixData)
            .toHaveBeenCalledWith(mockResponse);

        expect(result).toEqual(transformedResponse);
    });

    it('should propagate error when service call fails', async () => {
        const mockError: BookingHttpErrorModel = {
            errorCode: 400,
            requestURL: '',
        };

        transformerMock.generateRequestData.and.returnValue(mockRequestData);
        callServiceMock.getPriceMatrixPromised.and.returnValue(Promise.reject(mockError));

        try {
            await service.getPriceMatrix();
            fail('Expected promise to be rejected');
        } catch (error) {
            expect(error).toEqual(mockError);
        }
    });

    it('should call transformer even if response.data is undefined', async () => {
        const emptyResponse: BookingHttpResponse<any> = {
            code: 200,
            data: undefined
        };

        transformerMock.generateRequestData.and.returnValue(mockRequestData);
        callServiceMock.getPriceMatrixPromised.and.returnValue(Promise.resolve(emptyResponse));
        transformerMock.transformGetPriceMatrixData.and.returnValue(transformedResponse);

        const result = await service.getPriceMatrix();

        expect(transformerMock.transformGetPriceMatrixData)
            .toHaveBeenCalledWith(emptyResponse);

        expect(result).toEqual(transformedResponse);
    });

    it('should call dependencies exactly once', async () => {
        transformerMock.generateRequestData.and.returnValue(mockRequestData);
        callServiceMock.getPriceMatrixPromised.and.returnValue(Promise.resolve(mockResponse));
        transformerMock.transformGetPriceMatrixData.and.returnValue(transformedResponse);

        await service.getPriceMatrix();

        expect(transformerMock.generateRequestData).toHaveBeenCalledTimes(1);
        expect(callServiceMock.getPriceMatrixPromised).toHaveBeenCalledTimes(1);
        expect(transformerMock.transformGetPriceMatrixData).toHaveBeenCalledTimes(1);
    });

});
