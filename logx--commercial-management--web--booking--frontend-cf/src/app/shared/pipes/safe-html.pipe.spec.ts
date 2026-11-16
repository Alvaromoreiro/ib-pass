import { TestBed } from "@angular/core/testing";
import { DomSanitizer, BrowserModule } from "@angular/platform-browser";
import { SafeHtmlPipe } from "@src/app/shared/pipes/safe-html.pipe";

describe("SafeHtmlPipe", () => {
    let pipe: SafeHtmlPipe;
    let sanitizer: DomSanitizer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
        });

        sanitizer = TestBed.inject(DomSanitizer);
        pipe = new SafeHtmlPipe(sanitizer);
    });

    it("should create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should mark unsafe HTML as safe", () => {
        const unsafeHtmlString = '<script>alert("XSS")</script>';
        const safeHtml = pipe.transform(unsafeHtmlString);
        expect(safeHtml).toEqual(
            sanitizer.bypassSecurityTrustHtml(unsafeHtmlString)
        );
    });
});
