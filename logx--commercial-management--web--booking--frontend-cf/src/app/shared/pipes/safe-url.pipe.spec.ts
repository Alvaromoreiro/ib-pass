import { TestBed } from "@angular/core/testing";
import { DomSanitizer, BrowserModule } from "@angular/platform-browser";
import { SafeUrlPipe } from "@src/app/shared/pipes/safe-url.pipe";

describe("SafeUrlPipe", () => {
    let pipe: SafeUrlPipe;
    let sanitizer: DomSanitizer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
        });

        sanitizer = TestBed.inject(DomSanitizer);
        pipe = new SafeUrlPipe(sanitizer);
    });

    it("should create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should mark unsafe URL as safe", () => {
        const unsafeUrlString = 'javascript:alert("XSS")';
        const safeUrl = pipe.transform(unsafeUrlString);
        expect(safeUrl).toEqual(
            sanitizer.bypassSecurityTrustUrl(unsafeUrlString)
        );
    });
});
