import { TestBed } from "@angular/core/testing";
import { LoadingSpinnerService } from "../../../../../src/app/shared/components/loading-spinner/loading-spinner.service";

describe("LoadingSpinnerService", () => {
    let service: LoadingSpinnerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoadingSpinnerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should start with loading in false", () => {
        expect(service.isLoading()).toBeFalse();
    });

    it("should emit initial false value to new subscribers", () => {
        let latestValue: boolean | undefined;

        service.loading$.subscribe(value => {
            latestValue = value;
        });

        expect(latestValue).toBeFalse();
    });

    it("should set loading to true when show is called", () => {
        service.show();

        expect(service.isLoading()).toBeTrue();
    });

    it("should set loading to false when hide is called", () => {
        service.show();
        service.hide();

        expect(service.isLoading()).toBeFalse();
    });

    it("should emit true then false when show and hide are called", () => {
        const emittedValues: boolean[] = [];

        service.loading$.subscribe(value => {
            emittedValues.push(value);
        });

        service.show();
        service.hide();

        expect(emittedValues).toEqual([false, true, false]);
    });
});
