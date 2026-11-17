import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IbGenderSelectorTooltipComponent } from './ib-gender-selector-tooltip.component';
import { Pipe, PipeTransform } from '@angular/core';
import { axeMatchers, checkA11y } from '@test/helpers/axe-helper';
import { getPassengerInfoMock } from '@src/components/ib-check-in-flights-passengers/components/ib-passenger-info/components/ib-passenger-info-header/mocks/ib-passenger-info.mock';

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe('IbGenderSelectorTooltipComponent', () => {
    let component: IbGenderSelectorTooltipComponent;
    let fixture: ComponentFixture<IbGenderSelectorTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbGenderSelectorTooltipComponent, TranslatePipeMock],
            imports: [FormsModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbGenderSelectorTooltipComponent);
        component = fixture.componentInstance;

        const passengerInfoMock = getPassengerInfoMock();
        component.passengerInfo = passengerInfoMock;
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
