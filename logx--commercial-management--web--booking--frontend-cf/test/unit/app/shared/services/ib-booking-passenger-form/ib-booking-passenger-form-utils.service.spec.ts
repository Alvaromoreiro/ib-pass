import { TestBed } from '@angular/core/testing';
import { IbBookingPassengerFormUtilsService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-utils.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

describe('IbBookingPassengerFormUtilsService', () => {
  let service: IbBookingPassengerFormUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbBookingPassengerFormUtilsService);
  });


  describe('getOptionalDocsArray', () => {
    it('should handle array input', () => {
      const docs = ['doc1', 'doc2'];
      const passenger = { optionalDocs: docs };
      expect(service.getOptionalDocsArray(passenger)).toEqual(docs);
    });

    it('should handle object input', () => {
      const docs = { doc1: 'value1', doc2: 'value2' };
      const passenger = { optionalDocs: docs };
      expect(service.getOptionalDocsArray(passenger)).toEqual(['value1', 'value2']);
    });

    it('should return empty array for invalid input', () => {
      expect(service.getOptionalDocsArray(null)).toEqual([]);
      expect(service.getOptionalDocsArray({})).toEqual([]);
    });
  });

  describe('filterByProperty', () => {
    const items = [
      { name: 'John' },
      { name: 'Jane' },
      { name: 'Joe' }
    ];

    it('should filter items by property value', () => {
      const result = service.filterByProperty('jo', items, 'name');
      expect(result).toEqual([{ name: 'John' }, { name: 'Joe' }]);
    });

    it('should return empty array for invalid input', () => {
      expect(service.filterByProperty('test', null, 'name')).toEqual([]);
    });
  });

  describe('filterStringArray', () => {
    const items = ['NIE', 'DNI', 'pasaporte'];

    it('should filter string array', () => {
      const result = service.filterStringArray('pasap', items);
      expect(result).toEqual(['pasaporte']);
    });

    it('should return empty array for invalid input', () => {
      expect(service.filterStringArray('test', null)).toEqual([]);
    });
  });

  describe('getMaxLengthMandatoryDocNumber', () => {
    it('should return correct length for RUC', () => {
      expect(service.getMaxLengthMandatoryDocNumber('RUC'))
        .toBe(BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_MANDATORY_DOC_RUC);
    });

    it('should return correct length for DN', () => {
      expect(service.getMaxLengthMandatoryDocNumber('DN'))
        .toBe(BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_DNI);
    });

    it('should return default length for other codes', () => {
      expect(service.getMaxLengthMandatoryDocNumber('OTHER'))
        .toBe(BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_MANDATORY_DOC);
    });
  });

  describe('getMandatoryDocCleaner', () => {
    it('should return correct cleaner for RUC', () => {
      expect(service.getMandatoryDocCleaner('RUC'))
        .toBe(BookingAppConstants.bookingPatterns.RUC_CLEANER);
    });

    it('should return correct cleaner for NI', () => {
      expect(service.getMandatoryDocCleaner('NI'))
        .toBe(BookingAppConstants.bookingPatterns.NI_CLEANER);
    });

    it('should return default cleaner for other codes', () => {
      expect(service.getMandatoryDocCleaner('OTHER'))
        .toBe(BookingAppConstants.bookingPatterns.DOCS_CLEANER);
    });
  });
  
  describe('cleanEdgeChars', () => {
      it('should remove leading spaces, hyphens and apostrophes', () => {
          expect(service.cleanEdgeChars('-Álvaro')).toBe('Álvaro');
          expect(service.cleanEdgeChars(" 'Maria")).toBe('Maria');
          expect(service.cleanEdgeChars('---Juan')).toBe('Juan');
      });

      it('should remove trailing spaces, hyphens and apostrophes', () => {
          expect(service.cleanEdgeChars('Álvaro-')).toBe('Álvaro');
          expect(service.cleanEdgeChars("Maria' ")).toBe('Maria');
          expect(service.cleanEdgeChars('Juan---')).toBe('Juan');
      });

      it('should remove both leading and trailing edge chars', () => {
          expect(service.cleanEdgeChars('-Álvaro-')).toBe('Álvaro');
          expect(service.cleanEdgeChars(" 'Maria' ")).toBe('Maria');
      });

      it('should preserve internal hyphens, apostrophes and spaces', () => {
          expect(service.cleanEdgeChars('Anne-Marie')).toBe('Anne-Marie');
          expect(service.cleanEdgeChars("O'Brien")).toBe("O'Brien");
          expect(service.cleanEdgeChars('De la Cruz')).toBe('De la Cruz');
      });

      it('should return the value unchanged when there are no edge chars', () => {
          expect(service.cleanEdgeChars('Álvaro')).toBe('Álvaro');
      });

      it('should handle empty or falsy values', () => {
          expect(service.cleanEdgeChars('')).toBe('');
          expect(service.cleanEdgeChars(null as any)).toBeNull();
          expect(service.cleanEdgeChars(undefined as any)).toBeUndefined();
      });
  });

});
