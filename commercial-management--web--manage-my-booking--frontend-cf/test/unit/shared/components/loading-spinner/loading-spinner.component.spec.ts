import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { LoadingSpinnerComponent } from "../../../../../src/app/shared/components/loading-spinner/loading-spinner.component";
import { LoadingSpinnerService } from "../../../../../src/app/shared/components/loading-spinner/loading-spinner.service";

class LoadingSpinnerServiceMock {
    private readonly subject = new Subject<boolean>();
    loading$ = this.subject.asObservable();
    isLoading = jasmine.createSpy("isLoading").and.returnValue(false);

    emit(value: boolean): void {
        this.subject.next(value);
    }
}

describe("LoadingSpinnerComponent", () => {
    let component: LoadingSpinnerComponent;
    let fixture;
    let loadingSpinnerServiceMock: LoadingSpinnerServiceMock;
    let markForCheckSpy: jasmine.Spy;

    beforeEach(async() => {
        loadingSpinnerServiceMock = new LoadingSpinnerServiceMock();

        await TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [LoadingSpinnerComponent],
            providers: [
                { provide: LoadingSpinnerService, useValue: loadingSpinnerServiceMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingSpinnerComponent);
        component = fixture.componentInstance;
        markForCheckSpy = spyOn((component as any).cdr, "markForCheck");
        document.body.classList.remove("u-overflow-hidden");
    });

    afterEach(() => {
        document.body.classList.remove("u-overflow-hidden");
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should use default input values", () => {
        expect(component.text).toBe("Loading...");
        expect(component.size).toBe("big");
        expect(component.variant).toBe("dark");
        expect(component.orientation).toBe("horizontal");
        expect(component.className).toBe("ib-react-loading-spinner");
    });

    it("should map loadingProps from inputs", () => {
        component.text = "Please wait";
        component.size = "small";
        component.variant = "light";
        component.orientation = "vertical";
        component.className = "custom-spinner";

        expect(component.loadingProps).toEqual({
            children: "Please wait",
            size: "small",
            variant: "light",
            orientation: "vertical",
            className: "custom-spinner"
        });
    });

    it("should initialize showLoading from service isLoading value", () => {
        loadingSpinnerServiceMock.isLoading.and.returnValue(true);
        const newFixture = TestBed.createComponent(LoadingSpinnerComponent);
        const newComponent = newFixture.componentInstance;

        expect(newComponent.showLoading).toBeTrue();
    });

    it("should react to loading$ updates and call markForCheck", () => {
        component.ngOnInit();

        loadingSpinnerServiceMock.emit(true);
        expect(component.showLoading).toBeTrue();
        expect(markForCheckSpy).toHaveBeenCalled();
        expect(document.body.classList.contains("u-overflow-hidden")).toBeTrue();

        loadingSpinnerServiceMock.emit(false);
        expect(component.showLoading).toBeFalse();
        expect(document.body.classList.contains("u-overflow-hidden")).toBeFalse();
    });

    it("should stop reacting to loading$ after ngOnDestroy", () => {
        component.ngOnInit();
        component.ngOnDestroy();
        markForCheckSpy.calls.reset();

        loadingSpinnerServiceMock.emit(true);

        expect(component.showLoading).toBeFalse();
        expect(markForCheckSpy).not.toHaveBeenCalled();
    });

    it("should add and remove body scroll blocking class", () => {
        component.controlBodyScroll(true);
        expect(document.body.classList.contains("u-overflow-hidden")).toBeTrue();

        component.controlBodyScroll(false);
        expect(document.body.classList.contains("u-overflow-hidden")).toBeFalse();
    });
});
