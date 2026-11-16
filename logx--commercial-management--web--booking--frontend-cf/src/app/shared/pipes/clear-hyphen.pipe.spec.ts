import { ClearHyphenPipe } from '@src/app/shared/pipes/clear-hyphen.pipe';

describe("ClearHyphenPipe", () => {
    let pipe: ClearHyphenPipe = new ClearHyphenPipe();

    it("should create an instance", () => {
        expect( pipe ).toBeTruthy();
    });

    it("should return the string clean", () => {
        const result = pipe.transform('a-b');
        expect(result).toEqual( 'a b');
    });
});
