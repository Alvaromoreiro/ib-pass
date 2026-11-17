import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { IbDuplicateButtonsComponent } from "./ib-duplicate-buttons.component";
import { IbCheckinSharedModule } from "@src/app/shared/ib-checkin-shared.module";

describe('IbDuplicateButtonsComponent', () => {
    let component: IbDuplicateButtonsComponent;
    let fixture: ComponentFixture<IbDuplicateButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbDuplicateButtonsComponent],
            imports: [TranslateModule.forRoot(), IbCheckinSharedModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbDuplicateButtonsComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    const cases: { value: boolean, quadrigam: CkiSeatSummary.GoToPageType }[] = [
        { value: true, quadrigam: 'ibecbp' },
        { value: false, quadrigam: 'ckianc' }
    ];

    cases.forEach(({ value, quadrigam }) => {
        it(`should emit callback with ${value} when goTo is executed and is ${quadrigam}`, () => {
            spyOn(component.callback, 'emit');

            component.goTo(quadrigam);

            expect(component.callback.emit).toHaveBeenCalledWith(value);
        });
    });
});