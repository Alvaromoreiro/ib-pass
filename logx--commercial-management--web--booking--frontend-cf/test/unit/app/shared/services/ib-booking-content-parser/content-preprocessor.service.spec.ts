import { TestBed } from '@angular/core/testing';
import { ContentPreprocessorService } from '@src/app/shared/services/ib-booking-content-parser/content-preprocessor.service';

describe('ContentPreprocessorService', () => {
    let service: ContentPreprocessorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ContentPreprocessorService,
            ]
        });

        service = TestBed.inject(ContentPreprocessorService);
    });

    describe('parseTextWithLinks', () => {
        it('should parse text with links correctly', () => {
            const text = '<a href="example.com">Example</a> text <a href="test.com">Test</a>';
            const expectedResult = [
                { type: 'link', value: 'Example', attrs: { href: 'example.com' } },
                { type: 'text', value: ' text ' },
                { type: 'link', value: 'Test', attrs: { href: 'test.com' } }
            ];

            const result = service.parseTextWithLinks(text);
            expect(result).toEqual(expectedResult as any);
        });

        it('should handle text without links', () => {
            const text = 'Just some plain text.';
            const result = service.parseTextWithLinks(text);
            expect(result).toEqual([{ type: 'text', value: 'Just some plain text.' }]);
        });

        it('should handle empty string', () => {
            const text = '';
            const result = service.parseTextWithLinks(text);
            expect(result).toEqual([]);
        });

        it('should handle malformed links', () => {
            const text = '<a href="example.com">Example</a> <a>Malformed Link</a>';
            const result = service.parseTextWithLinks(text);
            expect(result).toEqual([
                { type: 'link', value: 'Example', attrs: { href: 'example.com' } },
                { type: 'text', value: ' ' },
                { type: 'text', value: 'Malformed Link' }
            ]);
        });
    });
});