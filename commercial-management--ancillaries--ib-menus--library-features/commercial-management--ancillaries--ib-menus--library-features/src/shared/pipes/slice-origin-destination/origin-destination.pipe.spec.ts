import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { OriginDestinationPipe } from './origin-destination.pipe';
import { TestBed } from '@angular/core/testing';


interface City {
    description: string;
    code: string;
}

interface FlightSegment {
    departure: { city: City };
    arrival: { city: City };
}

interface FlightSlice {
    sliceId: string;
    segments: FlightSegment[];
}

interface OrderData {
    order: {
        slices: FlightSlice[];
    };
}

const MAD_BIO: FlightSlice = {
    sliceId: 'MADBIO20251111114500',
    segments: [
        {
            departure: { city: { description: 'Madrid', code: 'MAD' } },
            arrival: { city: { description: 'Bilbao', code: 'BIO' } }
        }
    ]
};

const BCN_SEV_ESCALA: FlightSlice = {
    sliceId: 'BCNSEVESC2025',
    segments: [
        {
            departure: { city: { description: 'Barcelona', code: 'BCN' } },
            arrival: { city: { description: 'Valencia', code: 'VLC' } }
        },
        {
            departure: { city: { description: 'Valencia', code: 'VLC' } },
            arrival: { city: { description: 'Sevilla', code: 'SEV' } }
        }
    ]
};

const SIN_SEGMENTOS: FlightSlice = {
    sliceId: 'EMPTYSLICE',
    segments: []
};

const MOCK_ORDER_DATA: OrderData = {
    order: {
        slices: [MAD_BIO, BCN_SEV_ESCALA, SIN_SEGMENTOS]
    }
};

let mockSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;

describe('OriginDestinationPipe', () => {
    let pipe: OriginDestinationPipe;

    beforeEach(() => {

        mockSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);

        TestBed.configureTestingModule({
            providers: [
                OriginDestinationPipe,
                { provide: CommonsSessionStorageService, useValue: mockSessionStorageService }
            ]
        });

        pipe = TestBed.inject(OriginDestinationPipe);

        mockSessionStorageService.get.withArgs('flowApp').and.returnValue('BKI');
        mockSessionStorageService.get.withArgs('createOrderData').and.returnValue(MOCK_ORDER_DATA as any);
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return "slice not valid" when sliceId is null', () => {
        expect(pipe.transform(null)).toBe(null);
    });

    it('should return "slice not valid" when slices array is null', () => {
        mockSessionStorageService.get.withArgs('createOrderData').and.returnValue({ order: { slices: null } } as any);
        expect(pipe.transform('MADBIO20251111114500')).toBe('MADBIO20251111114500');
    });

    it('should return the sliceId when the slice is not found', () => {
        const missingId = 'slice not valid';
        expect(pipe.transform(missingId)).toBe(missingId);
    });

    it('should return "no segments found" if the slice has no segments', () => {
        const result = pipe.transform('EMPTYSLICE');
        expect(result).toBe('no segments found');
    });

    it('should format a direct flight correctly (single segment)', () => {
        const result = pipe.transform('MADBIO20251111114500');
        expect(result).toBe('Madrid (MAD) - Bilbao (BIO)');
    });

    it('should format a flight with layovers correctly (multiple segments)', () => {
        const result = pipe.transform('BCNSEVESC2025');
        expect(result).toBe('Barcelona (BCN) - Sevilla (SEV)');
    });

    it('should return flight from bookingInfo when flowApp is MMB', () => {
        mockSessionStorageService.get.withArgs('flowApp').and.returnValue('MMB');
        mockSessionStorageService.get.withArgs('bookingInfo').and.returnValue(MOCK_ORDER_DATA as any);

        const result = pipe.transform('MADBIO20251111114500');
        expect(result).toBe('Madrid (MAD) - Bilbao (BIO)');
    });

    it('should return flight from createOrderData when flowApp is BBKI', () => {
        mockSessionStorageService.get.withArgs('flowApp').and.returnValue('BBKI');
        mockSessionStorageService.get.withArgs('createOrderData').and.returnValue(MOCK_ORDER_DATA as any);

        const result = pipe.transform('MADBIO20251111114500');
        expect(result).toBe('Madrid (MAD) - Bilbao (BIO)');
    });
});