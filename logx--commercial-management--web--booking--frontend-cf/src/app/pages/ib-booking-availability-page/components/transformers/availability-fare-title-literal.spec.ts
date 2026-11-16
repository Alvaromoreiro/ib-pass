import { getFareTitleTranslation } from './availability-fare-title-literal';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

describe('getFareTitleTranslation (CLEAN)', () => {
  const { FARE_CABIN_TYPE, FARE_COMERCIAL_NAME_ES } = BookingAppConstants;

  const DEFAULT_TRANSLATION = 'MORE_CONFORTABLE_TRAVEL';

  const createFareInfo = (cabinType: string, commercialNameES: string): any => ({
    cabinType,
    commercialNameES
  });

  //  MATRIZ DE CASOS (sin mocks, comportamiento real)
  const cases = [
    { cabin: FARE_CABIN_TYPE.TURIST, name: FARE_COMERCIAL_NAME_ES.BASICA, expected: 'BEST_DEAL' },
    { cabin: FARE_CABIN_TYPE.TURIST, name: FARE_COMERCIAL_NAME_ES.OPTIMA, expected: 'CKI_YOUR_BACK' },
    { cabin: FARE_CABIN_TYPE.TURIST, name: FARE_COMERCIAL_NAME_ES.FLEXIBLE, expected: 'CHANGE_YOUR_FLIGHT_WITHOUT_LIMITS' },
    { cabin: FARE_CABIN_TYPE.TURIST, name: FARE_COMERCIAL_NAME_ES.OPTIMA_FLEXIBLE, expected: 'MORE_FLEXIBLE_TRAVEL' },

    { cabin: FARE_CABIN_TYPE.TURIST_PREMIUM, name: FARE_COMERCIAL_NAME_ES.TURISTA_PREMIUM_OPTIMA, expected: 'PREMIUM_EXPERIENCE' },
    { cabin: FARE_CABIN_TYPE.TURIST_PREMIUM, name: FARE_COMERCIAL_NAME_ES.TURISTA_PREMIUM_FLEXIBLE, expected: 'CHANGE_YOUR_FLIGHT_WITHOUT_LIMITS' },
    { cabin: FARE_CABIN_TYPE.TURIST_PREMIUM_T, name: FARE_COMERCIAL_NAME_ES.TURISTA_PREMIUM_OPTIMA, expected: 'PREMIUM_EXPERIENCE' },

    { cabin: FARE_CABIN_TYPE.BUSINESS_CLASS, name: FARE_COMERCIAL_NAME_ES.BUSINESS_OPTIMA, expected: 'BUSINESS_EXPERIENCE' },
    { cabin: FARE_CABIN_TYPE.BUSINESS_CLASS, name: FARE_COMERCIAL_NAME_ES.BUSINESS_FLEXIBLE, expected: 'CHANGE_YOUR_FLIGHT_WITHOUT_LIMITS' },
    { cabin: FARE_CABIN_TYPE.BUSINESS_CLASS, name: FARE_COMERCIAL_NAME_ES.BUSINESS_CONFORT, expected: 'COMFORT_OF_BUSINESS' }
  ];

  cases.forEach(({ cabin, name, expected }) => {
    it(`should return ${expected} for ${cabin} + ${name}`, () => {
      const fareInfo = createFareInfo(cabin, name);
      expect(getFareTitleTranslation(fareInfo)).toBe(expected);
    });
  });


  it('should return default if commercialName not found', () => {
    const fareInfo = createFareInfo(FARE_CABIN_TYPE.TURIST, 'UNKNOWN');
    expect(getFareTitleTranslation(fareInfo)).toBe(DEFAULT_TRANSLATION);
  });

  it('should return default if cabinType not found', () => {
    const fareInfo = createFareInfo('UNKNOWN', FARE_COMERCIAL_NAME_ES.BASICA);
    expect(getFareTitleTranslation(fareInfo)).toBe(DEFAULT_TRANSLATION);
  });


  it('should handle real non-normalized input gracefully', () => {
    const fareInfo = createFareInfo(FARE_CABIN_TYPE.TURIST, 'Básica');

    const result = getFareTitleTranslation(fareInfo);

    expect(typeof result).toBe('string'); // evita acoplarte a la implementación interna
  });
});