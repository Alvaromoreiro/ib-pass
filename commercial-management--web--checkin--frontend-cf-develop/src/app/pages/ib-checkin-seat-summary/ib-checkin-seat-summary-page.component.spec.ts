import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import {
    AJSModalService,
    AJSModalServiceType
} from "@src/app/shared/services/ib-modal/ib-modal-service-bridge.service";
import { Pipe, PipeTransform } from "@angular/core";
import { IbCheckinSeatSummaryPageComponent } from "./ib-checkin-seat-summary-page.component";
import { IbCheckinRedirectionUtilsService } from "@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service";
import { IbCheckinSeatSummaryService } from "@src/app/pages/ib-checkin-seat-summary/services/ib-checkin-seat-summary.service";
import { IbCheckinSeatSummaryDigitalDataService } from "@src/app/pages/ib-checkin-seat-summary/services/ib-checkin-seat-summary-digital-data.service";
import { CKISeatSummaryEventsEnum } from "@src/app/core/constants/ib-checkin-seat-summary-constants";
import { CheckinFlowService } from "@src/app/shared/services/checkin-flow.service";

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe("IbCheckinSeatSummaryPageComponent", () => {
    let component: IbCheckinSeatSummaryPageComponent;
    let fixture: ComponentFixture<IbCheckinSeatSummaryPageComponent>;

    let fakeCommonsSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let fakeIbCheckinRedirectionUtilsService: jasmine.SpyObj<IbCheckinRedirectionUtilsService>;
    let fakeIbCheckinSeatSummaryService: jasmine.SpyObj<IbCheckinSeatSummaryService>;
    let fakeIbCheckinSeatSummaryServiceDigitalDataService: jasmine.SpyObj<IbCheckinSeatSummaryDigitalDataService>;
    let fakeCheckinFlowService: jasmine.SpyObj<CheckinFlowService>;
    let mockModalService: jasmine.SpyObj<AJSModalServiceType>;

    beforeEach(async () => {
        fakeCommonsSessionStorageService = jasmine.createSpyObj("CommonsSessionStorageService", ['get', 'set', 'remove']);
        mockModalService = jasmine.createSpyObj("AJSModalService", [
            "isWaiting",
            "isNotWaiting",
            "closeAllCurrentModals"
        ]);
        fakeIbCheckinRedirectionUtilsService = jasmine.createSpyObj(
            "IbCheckinRedirectionUtilsService",
            ["path"],
        );
        fakeIbCheckinSeatSummaryService = jasmine.createSpyObj(
            "IbCheckinSeatSummaryService",
            ["getSegmentsInformation"],
        );
        fakeIbCheckinSeatSummaryServiceDigitalDataService = jasmine.createSpyObj(
            "IbCheckinSeatSummaryDigitalDataService",
            ["setSeatSummaryDigitalData", "emitViewEvent", "handleButtonEvents"],
        );
        fakeCheckinFlowService = jasmine.createSpyObj("CheckinFlowService", ["warnUserOnBackPressed"]);

        await TestBed.configureTestingModule({
            declarations: [IbCheckinSeatSummaryPageComponent, TranslatePipeMock],
            providers: [
                { provide: AJSModalService, useValue: mockModalService },
                {
                    provide: CommonsSessionStorageService,
                    useValue: fakeCommonsSessionStorageService
                },
                {
                    provide: IbCheckinRedirectionUtilsService,
                    useValue: fakeIbCheckinRedirectionUtilsService
                },
                {
                    provide: IbCheckinSeatSummaryService,
                    useValue: fakeIbCheckinSeatSummaryService
                },
                {
                    provide: IbCheckinSeatSummaryDigitalDataService,
                    useValue: fakeIbCheckinSeatSummaryServiceDigitalDataService
                },
                { provide: CheckinFlowService, useValue: fakeCheckinFlowService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinSeatSummaryPageComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should init", () => {
        component.ngOnInit();
    });

    describe('ngOnInit', () => {
        it('should set the correct actualStepFlow in storage', () => {
            component.ngOnInit();

            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('actualStepFlow', 'ckiacpt');
        });

        it('should call and get the segmentsSummary from the service', () => {
            const fakeObj: CkiSeatSummary.ISegment[] = [{ id: 1 } as CkiSeatSummary.ISegment];

            fakeIbCheckinSeatSummaryService.getSegmentsInformation.and.returnValue(fakeObj);

            component.ngOnInit();

            expect(fakeIbCheckinSeatSummaryService.getSegmentsInformation).toHaveBeenCalled();
            expect(component.segmentsSummary.length).toBe(1);
            expect(component.segmentsSummary).toEqual(fakeObj);
        });

        it('should close the loading modal', () => {
            component.ngOnInit();

            expect(mockModalService.isNotWaiting).toHaveBeenCalled();
        });

        it('should set the ancillaries button state depends of sessionStorage ancillariesInfo', () => {
            fakeCommonsSessionStorageService.get.and.returnValue({});

            component.ngOnInit();

            expect(component.goToAncillariesAvailable).toBe(true);
        });

        it('should set the ancillaries button state false if the key doesn\'t exists in session storage', () => {
            component.ngOnInit();

            expect(component.goToAncillariesAvailable).toBe(false);
        });

        it('should call the service for initialize the digital data', () => {
            component.ngOnInit();

            expect(fakeIbCheckinSeatSummaryServiceDigitalDataService.setSeatSummaryDigitalData).toHaveBeenCalled();
        });

        it('should remove the showSeatMap from storage', () => {
            component.ngOnInit();

            expect(fakeCommonsSessionStorageService.remove).toHaveBeenCalledWith('showSeatMap');
        });
    });

    describe('goTo', () => {
        it('should set nextStepAllowed key from storage', () => {
            component.goTo('ckianc');

            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('nextStepAllowed', false);
        });

        const redirectionCases: { anc: boolean, quadrigam: CkiSeatSummary.GoToPageType, expectedQuadrigam: CkiSeatSummary.GoToPageType }[] = [
            { anc: false, quadrigam: 'ckianc', expectedQuadrigam: 'ibecbp' },
            { anc: true, quadrigam: 'ckianc', expectedQuadrigam: 'ckianc' },
            { anc: true, quadrigam: 'ibecbp', expectedQuadrigam: 'ibecbp' }
        ];

        redirectionCases.forEach(({ anc, quadrigam, expectedQuadrigam }) => {
            it(`should make the redirection to the specific quadrigam (${expectedQuadrigam}) if ancillaries is available (${anc})`, () => {
                component.goToAncillariesAvailable = anc;

                component.goTo(quadrigam);

                expect(fakeIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith(`/${expectedQuadrigam}`);
            });
        });

        it(`should set the correct GA4 event depends on quadrigam - ckianc`, () => {
            const expectedResult = CKISeatSummaryEventsEnum.ADD_EXTRAS;
            component.goTo('ckianc');

            expect(fakeIbCheckinSeatSummaryServiceDigitalDataService.handleButtonEvents).toHaveBeenCalledWith(expectedResult);
        });
    });

    describe('warnUserOnBackPressed', () => {
        it('should set nextStepAllowed true for block the user if go back', () => {
            component.warnUserOnBackPressed();

            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('nextStepAllowed', true);
        });

        it('should delegate the back warning to the flow service using its default modal callback', () => {
            component.warnUserOnBackPressed();

            expect(fakeCheckinFlowService.warnUserOnBackPressed).toHaveBeenCalledWith();
        });
    });
});