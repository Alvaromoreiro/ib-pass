import { ToCasePipe } from './toCase.pipe';

describe('ToCasePipe', () => {
    let pipe: ToCasePipe;

    beforeEach(() => {
        pipe = new ToCasePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('transform - UPPER', () => {
        it('should convert a lowercase string to uppercase', () => {
            const result = pipe.transform('hello', 'UPPER');
            expect(result).toBe('HELLO');
        });

        it('should keep an already uppercase string unchanged', () => {
            const result = pipe.transform('HELLO', 'UPPER');
            expect(result).toBe('HELLO');
        });

        it('should convert a mixed-case string to uppercase', () => {
            const result = pipe.transform('Hello World', 'UPPER');
            expect(result).toBe('HELLO WORLD');
        });
    });

    describe('transform - LOWER', () => {
        it('should convert an uppercase string to lowercase', () => {
            const result = pipe.transform('HELLO', 'LOWER');
            expect(result).toBe('hello');
        });

        it('should keep an already lowercase string unchanged', () => {
            const result = pipe.transform('hello', 'LOWER');
            expect(result).toBe('hello');
        });

        it('should convert a mixed-case string to lowercase', () => {
            const result = pipe.transform('Hello World', 'LOWER');
            expect(result).toBe('hello world');
        });
    });

    describe('transform - unknown casing', () => {
        it('should throw a TypeError when an unknown casing is provided', () => {
            expect(() => pipe.transform('hello', 'TITLE')).toThrowError(TypeError);
        });
    });
});
