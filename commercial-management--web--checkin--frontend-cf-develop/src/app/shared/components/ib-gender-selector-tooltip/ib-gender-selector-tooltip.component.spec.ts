import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";

import { IbGenderSelectorTooltipComponent } from "./ib-gender-selector-tooltip.component";
import { IbCheckinSharedModule } from "@src/app/shared/ib-checkin-shared.module";
import { getPassengerInfoMock } from "@src/components/ib-check-in-flights-passengers/components/ib-passenger-info/components/ib-passenger-info-header/mocks/ib-passenger-info.mock";

describe('IbGenderSelectorTooltipComponent', () => {
    let component: IbGenderSelectorTooltipComponent;
    let fixture: ComponentFixture<IbGenderSelectorTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbGenderSelectorTooltipComponent],
            imports: [FormsModule, TranslateModule.forRoot(), IbCheckinSharedModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbGenderSelectorTooltipComponent);
        component = fixture.componentInstance;

        const passengerInfoMock = getPassengerInfoMock();
        component.passengerInfo = passengerInfoMock;
        component.index = 0;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});