import { LiteralFormatterPipe } from "./literalFormatter.pipe";

describe('LiteralFormatterPipe', () => {
    let pipe: LiteralFormatterPipe;

    beforeEach(() => {
        pipe = new LiteralFormatterPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return empty string if input is null or undefined', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should format bold text correctly', () => {
        const input = "Tarjeta Regalo, $$bold$#email#$$.".replace('#email#', 'pepe@pepe.com');
        const expectedOutput = 'Tarjeta Regalo, <span class="text-bold">pepe@pepe.com</span>.';
        expect(pipe.transform(input)).toBe(expectedOutput);
    });

    it('should format underlined text correctly', () => {
        const input = "Tarjeta Regalo, $$under$#email#$$.".replace('#email#', 'pepe@pepe.com');
        const expectedOutput = 'Tarjeta Regalo, <span class="text-underline">pepe@pepe.com</span>.';
        expect(pipe.transform(input)).toBe(expectedOutput);
    });

    it('should ignore unknown tags', () => {
        const input = 'This is $$unknown$$ text';
        const expectedOutput = 'This is $$unknown$$ text';
        expect(pipe.transform(input)).toBe(expectedOutput);
    });
});