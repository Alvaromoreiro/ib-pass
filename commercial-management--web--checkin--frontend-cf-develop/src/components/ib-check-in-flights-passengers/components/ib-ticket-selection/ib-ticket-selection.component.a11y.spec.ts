import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe } from '@angular/core';
import { axeMatchers, checkA11y } from '@test/helpers/axe-helper';
import { IbTicketSelectionComponent } from './ib-ticket-selection.component';
import { AJSRootScope } from 'ib-web-commons/utils';
import { AJSWindow } from '@src/app/core/config/ib-checkin-app-tokens';
import { AJSCommonsUtilService } from '@src/app/shared/services/bridges/ib-commons-util-bridge.service';
import { AJSCheckForDeepLink } from '@src/app/shared/services/bridges/ib-check-for-deeplink-bridge.service';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeMock } from '@test/class/RootScopeMock';
import { getMockSelectionInfo } from './mocks/ib-selection-info.mock';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

const fakeRootScope = new RootScopeMock();
const fakeWindow = jasmine.createSpyObj('$window', ['location']);
const fakeCommonsUtilService = jasmine.createSpyObj<CommonsUtilService>('CommonsUtilService', ['translateTextAndAddVariablesArray']);
const fakeCheckForDeepLink = jasmine.createSpyObj('CheckForDeepLink', ['checkDeepLink']);
const fakeTranslateService = jasmine.createSpyObj<Partial<TranslateService>>('translateService', ['instant', 'get']);
const fakeIbUtilsService = jasmine.createSpyObj('IbUtilsService', ['getDeviceType', 'getBpSubscriptionMode', 'isCC']);

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe('IbTicketSelectionComponent', () => {
    let component: IbTicketSelectionComponent;
    let fixture: ComponentFixture<IbTicketSelectionComponent>;
    let mockSelectionInfo: CkiSegmentsSelected.Segment;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbTicketSelectionComponent, TranslatePipeMock],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: AJSWindow, useValue: fakeWindow },
                { provide: AJSCommonsUtilService, useValue: fakeCommonsUtilService },
                { provide: AJSCheckForDeepLink, useValue: fakeCheckForDeepLink },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: IbUtilsService, useValue: fakeIbUtilsService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbTicketSelectionComponent);
        component = fixture.componentInstance;

        mockSelectionInfo = getMockSelectionInfo();

        component.selectionInfo = mockSelectionInfo;
        component.index = 0;

        jasmine.addMatchers(axeMatchers);
        fixture.detectChanges();
    });

    it('should have no accessibility violations', async () => {
        const results = await checkA11y(fixture.nativeElement);
        //@ts-ignore
        expect(results).toHaveNoA11yViolations();
    });
});
