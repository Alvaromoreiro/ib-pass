import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(() => {
        pipe = new TruncatePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('transform', () => {
        it('should return the full string when maxLength equals the string length', () => {
            const result = pipe.transform('hello', 5);
            expect(result).toBe('hello');
        });

        it('should truncate the string to the given maxLength', () => {
            const result = pipe.transform('hello world', 5);
            expect(result).toBe('hello');
        });

        it('should use the full string length as default maxLength', () => {
            const result = pipe.transform('hello');
            expect(result).toBe('hello');
        });

        it('should return a substring starting from initialIndex', () => {
            const result = pipe.transform('hello world', 8, 6);
            expect(result).toBe('wo');
        });

        it('should return an empty string when initialIndex equals maxLength', () => {
            const result = pipe.transform('hello', 3, 3);
            expect(result).toBe('');
        });

        it('should swap start and end when initialIndex is greater than maxLength (substring behavior)', () => {
            // String.prototype.substring swaps arguments when start > end
            const result = pipe.transform('hello', 2, 4);
            expect(result).toBe('ll');
        });

        it('should return an empty string when maxLength is 0', () => {
            const result = pipe.transform('hello', 0);
            expect(result).toBe('');
        });

        it('should handle an empty string input', () => {
            const result = pipe.transform('', 5);
            expect(result).toBe('');
        });
    });
});
