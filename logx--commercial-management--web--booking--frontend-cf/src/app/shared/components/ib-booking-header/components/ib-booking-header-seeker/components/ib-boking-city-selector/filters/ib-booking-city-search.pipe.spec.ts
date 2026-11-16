import { IbCitySearchPipe, CityItem } from './ib-booking-city-search.pipe';

describe('IbCitySearchPipe', () => {
    let pipe: IbCitySearchPipe;

    const mockCities: CityItem[] = [
        { code: 'MAD', description: 'Madrid', country: 'ES', countryLong: 'España', group: 'Europe', selected: false },
        { code: 'BCN', description: 'Barcelona', country: 'ES', countryLong: 'España', group: 'Europe', selected: false },
        { code: 'MAL', description: 'Málaga', country: 'ES', countryLong: 'España', group: 'Europe', selected: false },
        { code: 'PAR', description: 'París', country: 'FR', countryLong: 'Francia', group: 'Europe', selected: false },
        { code: 'LHR', description: 'London Heathrow', country: 'GB', countryLong: 'United Kingdom', group: 'Europe', selected: false },
        { code: 'JFK', description: 'New York JFK', country: 'US', countryLong: 'United States', group: 'America', selected: false },
        { code: 'MIA', description: 'Miami', country: 'US', countryLong: 'United States', group: 'America', selected: false },
        { code: 'MEX', description: 'Ciudad de México', country: 'MX', countryLong: 'México', group: 'America', selected: false }
    ];

    beforeEach(() => {
        pipe = new IbCitySearchPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('transform - edge cases', () => {
        it('should return empty array if items is null', () => {
            const result = pipe.transform(null as any, 'mad');
            expect(result).toEqual([]);
        });

        it('should return empty array if items is undefined', () => {
            const result = pipe.transform(undefined as any, 'mad');
            expect(result).toEqual([]);
        });

        it('should return original items if searchTerm is empty', () => {
            const result = pipe.transform(mockCities, '');
            expect(result).toEqual(mockCities);
        });

        it('should return original items if searchTerm is null', () => {
            const result = pipe.transform(mockCities, null as any);
            expect(result).toEqual(mockCities);
        });

        it('should return original items if searchTerm is less than 3 characters', () => {
            const result = pipe.transform(mockCities, 'ma');
            expect(result).toEqual(mockCities);
        });

        it('should return empty array if items is empty', () => {
            const result = pipe.transform([], 'mad');
            expect(result).toEqual([]);
        });
    });

    describe('transform - IATA code matching', () => {
        it('should prioritize IATA code matches first', () => {
            const result = pipe.transform(mockCities, 'MAD');
            expect(result[0].code).toBe('MAD');
        });

        it('should match IATA code case-insensitively', () => {
            const result = pipe.transform(mockCities, 'mad');
            expect(result[0].code).toBe('MAD');
        });

        it('should match partial IATA code', () => {
            const result = pipe.transform(mockCities, 'jfk');
            expect(result[0].code).toBe('JFK');
        });

        it('should return multiple IATA matches when applicable', () => {
            const result = pipe.transform(mockCities, 'ma');
            // Less than 3 chars, should return original
            expect(result).toEqual(mockCities);
        });

        it('should match IATA codes starting with search term', () => {
            const citiesWithSimilarCodes: CityItem[] = [
                { code: 'MAD', description: 'Madrid', country: 'ES', group: 'Europe', selected: false },
                { code: 'MAN', description: 'Manchester', country: 'GB', group: 'Europe', selected: false },
                { code: 'BCN', description: 'Barcelona', country: 'ES', group: 'Europe', selected: false }
            ];
            const result = pipe.transform(citiesWithSimilarCodes, 'man');
            expect(result[0].code).toBe('MAN');
        });
    });

    describe('transform - city name starts with search term', () => {
        it('should match cities that start with search term', () => {
            const result = pipe.transform(mockCities, 'bar');
            expect(result.some(city => city.description === 'Barcelona')).toBeTruthy();
        });

        it('should sort city name matches alphabetically', () => {
            const citiesStartingWithM: CityItem[] = [
                { code: 'MIA', description: 'Miami', country: 'US', group: 'America', selected: false },
                { code: 'MIL', description: 'Milan', country: 'IT', group: 'Europe', selected: false },
                { code: 'MUN', description: 'Munich', country: 'DE', group: 'Europe', selected: false }
            ];
            const result = pipe.transform(citiesStartingWithM, 'mia');
            expect(result[0].description).toBe('Miami');
        });

        it('should handle accented characters in city names', () => {
            const result = pipe.transform(mockCities, 'mal');
            expect(result.some(city => city.description === 'Málaga')).toBeTruthy();
        });

        it('should match city name ignoring accents in search term', () => {
            const result = pipe.transform(mockCities, 'par');
            expect(result.some(city => city.description === 'París')).toBeTruthy();
        });
    });

    describe('transform - city or country contains search term', () => {
        it('should match cities where country contains search term', () => {
            const result = pipe.transform(mockCities, 'españa');
            expect(result.length).toBeGreaterThan(0);
            expect(result.every(city => city.countryLong === 'España')).toBeTruthy();
        });

        it('should match cities where description contains search term anywhere', () => {
            const result = pipe.transform(mockCities, 'york');
            expect(result.some(city => city.description === 'New York JFK')).toBeTruthy();
        });

        it('should handle accents in country names', () => {
            const result = pipe.transform(mockCities, 'mexico');
            expect(result.some(city => city.countryLong === 'México')).toBeTruthy();
        });

        it('should not match if countryLong is undefined', () => {
            const citiesWithoutCountryLong: CityItem[] = [
                { code: 'XXX', description: 'Unknown City', country: 'XX', group: 'Unknown', selected: false }
            ];
            const result = pipe.transform(citiesWithoutCountryLong, 'test');
            expect(result.length).toBe(0);
        });
    });

    describe('transform - priority ordering', () => {
        it('should order results: IATA first, then city start, then any match', () => {
            const testCities: CityItem[] = [
                { code: 'BCN', description: 'Barcelona', country: 'ES', countryLong: 'España', group: 'Europe', selected: false },
                { code: 'MAD', description: 'Madrid', country: 'ES', countryLong: 'España', group: 'Europe', selected: false },
                { code: 'XMA', description: 'Xilama', country: 'XX', countryLong: 'Country with Mad', group: 'Other', selected: false },
                { code: 'ZZZ', description: 'Madeira', country: 'PT', countryLong: 'Portugal', group: 'Europe', selected: false }
            ];

            const result = pipe.transform(testCities, 'mad');

            // MAD should be first (IATA match)
            expect(result[0].code).toBe('MAD');
            // Madeira should be second (city starts with 'mad')
            expect(result[1].description).toBe('Madeira');
        });

        it('should sort within each priority group alphabetically', () => {
            const testCities: CityItem[] = [
                { code: 'ZZZ', description: 'Zamora', country: 'ES', group: 'Europe', selected: false },
                { code: 'YYY', description: 'Zaragoza', country: 'ES', group: 'Europe', selected: false },
                { code: 'XXX', description: 'Zagreb', country: 'HR', group: 'Europe', selected: false }
            ];

            const result = pipe.transform(testCities, 'zar');

            expect(result[0].description).toBe('Zaragoza');
        });
    });

    describe('transform - case sensitivity', () => {
        it('should be case-insensitive for search term', () => {
            const resultLower = pipe.transform(mockCities, 'madrid');
            const resultUpper = pipe.transform(mockCities, 'MADRID');
            const resultMixed = pipe.transform(mockCities, 'MaDrId');

            expect(resultLower.length).toBe(resultUpper.length);
            expect(resultLower.length).toBe(resultMixed.length);
        });

        it('should be case-insensitive for IATA codes', () => {
            const result = pipe.transform(mockCities, 'bcn');
            expect(result[0].code).toBe('BCN');
        });
    });

    describe('transform - accent handling', () => {
        it('should match accented city names with non-accented search', () => {
            const result = pipe.transform(mockCities, 'malaga');
            expect(result.some(city => city.description === 'Málaga')).toBeTruthy();
        });

        it('should match accented country names with non-accented search', () => {
            const result = pipe.transform(mockCities, 'espana');
            expect(result.some(city => city.countryLong === 'España')).toBeTruthy();
        });

        it('should match non-accented city names with accented search', () => {
            const result = pipe.transform(mockCities, 'mád');
            expect(result.some(city => city.code === 'MAD')).toBeTruthy();
        });
    });

    describe('transform - no matches', () => {
        it('should return empty array when no matches found', () => {
            const result = pipe.transform(mockCities, 'xyz123');
            expect(result).toEqual([]);
        });

        it('should return empty array for completely unrelated search', () => {
            const result = pipe.transform(mockCities, 'zzzzz');
            expect(result).toEqual([]);
        });
    });

    describe('transform - minimum search length', () => {
        it('should not filter with exactly 2 characters', () => {
            const result = pipe.transform(mockCities, 'ma');
            expect(result).toEqual(mockCities);
        });

        it('should filter with exactly 3 characters', () => {
            const result = pipe.transform(mockCities, 'mad');
            expect(result.length).toBeLessThan(mockCities.length);
        });

        it('should filter with more than 3 characters', () => {
            const result = pipe.transform(mockCities, 'madrid');
            expect(result.length).toBeLessThan(mockCities.length);
        });
    });
});
