import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { AJSRootScope } from "ib-web-commons/utils";

import { IbPassengerInfoHeaderComponent } from "./ib-passenger-info-header.component";
import { IbCheckinSharedModule } from "@src/app/shared/ib-checkin-shared.module";
import { RootScopeMock } from "@test/class/RootScopeMock";
import { IbUtilsService } from "@src/app/shared/services/ib-utils/ib-utils.service";
import { getPassengerInfoMock } from "./mocks/ib-passenger-info.mock";

const mockRootScope = new RootScopeMock();
const mockIbUtilsService = {
    getBpSubscriptionMode: jasmine.createSpy('getBpSubscriptionMode').and.returnValue(false)
};

describe('IbPassengerInfoHeaderComponent', () => {
    let component: IbPassengerInfoHeaderComponent;
    let fixture: ComponentFixture<IbPassengerInfoHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbPassengerInfoHeaderComponent],
            providers: [
                { provide: AJSRootScope, useValue: mockRootScope },
                { provide: IbUtilsService, useValue: mockIbUtilsService }
            ],
            imports: [TranslateModule.forRoot(), IbCheckinSharedModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPassengerInfoHeaderComponent);
        component = fixture.componentInstance;

        const passengerInfoMock = getPassengerInfoMock();
        component.passengerInfo = passengerInfoMock;
        component.index = 0;
        component.isOpen = true;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    [
        { testCase: 'should print subscription checked if the status is checked and isBPSubscriptionMode is true', isBpSubscriptionMode: true, isChecked: true, expected: true },
        { testCase: 'should not print subscription checked if the status is not checked and isBPSubscriptionMode is true', isBpSubscriptionMode: true, isChecked: false, expected: false }
    ].forEach(({ testCase, isBpSubscriptionMode, isChecked, expected }) => {
        it(testCase, () => {
            component.isBpSubscriptionMode = isBpSubscriptionMode;
            component.passengerInfo.pasStatus.isChecked = isChecked;
            fixture.detectChanges();

            const subscriptionElement = fixture.nativeElement.querySelector('.subscription-checked');
            if (expected) {
                expect(subscriptionElement).toBeTruthy();
            } else {
                expect(subscriptionElement).toBeFalsy();
            }
        });
    });

    it('should print infant information if exists', () => {
        component.passengerInfo.infant = { name: 'Baby', surname: 'Doe' };
        fixture.detectChanges();

        const infantElement = fixture.nativeElement.querySelector('.icon-bebe');
        expect(infantElement).toBeTruthy();
    });

    it('should print child information if passenger is child type', () => {
        component.passengerInfo.type = 'CHILD';
        fixture.detectChanges();

        const childElement = fixture.nativeElement.querySelector('.icon-iberia_ninos');
        expect(childElement).toBeTruthy();
    });
});