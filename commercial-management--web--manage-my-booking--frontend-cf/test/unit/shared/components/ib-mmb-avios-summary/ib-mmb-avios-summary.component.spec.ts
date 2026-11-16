import { TestBed } from "@angular/core/testing"
import { TranslateModule } from "@ngx-translate/core";
import { IbMmbAviosSummaryComponent } from "@src/app/shared/components/ib-MmB-avios-summary/ib-MmB-avios-summary.component";
import { IbMmbAviosSummaryService } from "@src/app/shared/components/ib-MmB-avios-summary/services/ib-MmB-avios-summary-service";
import { RootScopeMock } from "@test/mocks/class/RootScopeMock";
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";
import { IbCLinkPipeMock } from "@test/unit/utils/link-pipe-mock";
import { IbCLinkPipe } from "ib-web-commons/pipes";
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { of } from "rxjs";

describe('IbMmbAviosSummaryComponent', () => {

    let fixture;
    let component;

    let fakeIbMmbAviosSummaryService = {
        getCalculateAviosSummary: jasmine.createSpy()
    };
    let localStorageService: StorageServiceMock = new StorageServiceMock();
    let rootscope = new RootScopeMock();
    let fakeIbCLinkPipeMock = new IbCLinkPipeMock()

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            declarations: [
                IbMmbAviosSummaryComponent
            ],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                {provide: CommonsSessionStorageService, useValue: localStorageService },
                {provide: AJSRootScope, useValue: rootscope },
                {provide: IbCLinkPipe, useValue: fakeIbCLinkPipeMock},
                {provide: IbMmbAviosSummaryService, fakeIbMmbAviosSummaryService}
            ]
        }).overrideComponent(
            IbMmbAviosSummaryComponent,
            {
                set: {
                    providers: [
                        {
                            provide: IbMmbAviosSummaryService,
                            useValue: fakeIbMmbAviosSummaryService
                        }
                    ]
                }
            }
        )
        fixture = TestBed.createComponent(IbMmbAviosSummaryComponent);
        component = fixture.componentInstance;
        localStorageService.remove('flightAviosInfo')
        fixture.detectChanges();
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when ngOnInit is called', () => {
        it('and have got request', () => {
            const getCalculateAviosSummarySpy = spyOn(component, 'getCalculateAviosSummary')
            localStorageService.set('flightAviosInfo', {});
            fixture.detectChanges();
            component.ngOnInit()
            expect(getCalculateAviosSummarySpy).toHaveBeenCalled()
        })
        it('and haven`t got request', () => {
            const getMessageServiceErrorSpy = spyOn(component, 'getMessageServiceError')
            component.ngOnInit()
            expect(getMessageServiceErrorSpy).toHaveBeenCalled()
        })
    })

    it('when flightConfirmationEvent is called', () => {
        spyOn(rootscope, '$on');
        component.flightConfirmationEvent()
        expect(rootscope.$on).toHaveBeenCalled()
    })

    it('when getMessageServiceError is called', () => {
        component.getMessageServiceError()
        expect(component.service_error).toBe('SBE_SERVICE_ERROR_TEXT')
    })

    describe('when getCalculateAviosSummary is called', () => {
        beforeEach(inject(()=>{
            fakeIbMmbAviosSummaryService.getCalculateAviosSummary.and.returnValue(Promise.resolve(['test']));
        }));
        it('and reques goes ok', (done) => {
            component.getCalculateAviosSummary();
            expect(component.serviceError).toEqual(true);
            done();
        });
    });
    describe('when getCalculateAviosSummary is called', () => {
        beforeEach(inject(()=>{
            fakeIbMmbAviosSummaryService.getCalculateAviosSummary.and.returnValue(Promise.reject());
        }));
        it('and reques fail', (done) => {
            component.getCalculateAviosSummary()
            expect(component.serviceError).toEqual(true);
            done();
        });
    });
    describe('when updatedAvios  is called', () => {
        it('calculatePoints is true', (done) => {
            localStorageService.set('CalculatedPoints', 500)
            component.updatedAvios();
            expect(component.show).toEqual(true);
            done();
        });
    });
})
