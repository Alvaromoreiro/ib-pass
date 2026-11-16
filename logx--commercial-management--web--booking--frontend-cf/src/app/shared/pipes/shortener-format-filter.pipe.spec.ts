import { ShortenerFormatFilterPipe } from './shortener-format-filter.pipe';

describe('ShortenerFormatFilterPipe', () => {
    let pipe: ShortenerFormatFilterPipe;

    beforeEach(() => {
        pipe = new ShortenerFormatFilterPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('transform - basic truncation', () => {
        it('should truncate a string to the default maxlength of 3', () => {
            const result = pipe.transform('hello');
            expect(result).toBe('hel');
        });

        it('should truncate a string to the given maxlength', () => {
            const result = pipe.transform('hello world', 5);
            expect(result).toBe('hello');
        });

        it('should return the full string when it is shorter than maxlength', () => {
            const result = pipe.transform('hi', 5);
            expect(result).toBe('hi');
        });

        it('should return the full string when it equals maxlength', () => {
            const result = pipe.transform('hey', 3);
            expect(result).toBe('hey');
        });
    });

    describe('transform - null and undefined inputs', () => {
        it('should handle null input and return empty string after truncation', () => {
            const result = pipe.transform(null, 3);
            expect(result).toBe('');
        });

        it('should handle undefined input and return empty string after truncation', () => {
            const result = pipe.transform(undefined, 3);
            expect(result).toBe('');
        });
    });

    describe('transform - capitalized', () => {
        it('should capitalize the string before truncating', () => {
            const result = pipe.transform('hELLO WORLD', 5, true);
            expect(result).toBe('Hello');
        });

        it('should return empty string when capitalizing a single-character string', () => {
            const result = pipe.transform('h', 3, true);
            expect(result).toBe('');
        });
    });

    describe('transform - toLowerCase', () => {
        it('should convert to lowercase before truncating', () => {
            const result = pipe.transform('HELLO WORLD', 5, false, true);
            expect(result).toBe('hello');
        });

        it('should return empty string when lowercasing a single-character string', () => {
            const result = pipe.transform('H', 3, false, true);
            expect(result).toBe('');
        });
    });

    describe('transform - no formatting flags', () => {
        it('should leave the string as-is when no casing flags are set', () => {
            const result = pipe.transform('HeLLo', 5, false, false);
            expect(result).toBe('HeLLo');
        });
    });

    describe('transform - non-string inputs', () => {
        it('should handle a numeric input', () => {
            const result = pipe.transform(12345, 3);
            expect(result).toBe('123');
        });
    });
});
