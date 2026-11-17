import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';

import { AJSRootScope } from 'ib-web-commons/utils';

import { IbPassengerInfoHeaderComponent } from './ib-passenger-info-header.component';
import { axeMatchers, checkA11y } from '@test/helpers/axe-helper';
import { getPassengerInfoMock } from '@src/components/ib-check-in-flights-passengers/components/ib-passenger-info/components/ib-passenger-info-header/mocks/ib-passenger-info.mock';
import { RootScopeMock } from '@test/class/RootScopeMock';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

const mockRootScope = new RootScopeMock();
const mockIbUtilsService = {
    getBpSubscriptionMode: jasmine.createSpy('getBpSubscriptionMode').and.returnValue(false)
};

describe('IbPassengerInfoHeaderComponent', () => {
    let component: IbPassengerInfoHeaderComponent;
    let fixture: ComponentFixture<IbPassengerInfoHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbPassengerInfoHeaderComponent, TranslatePipeMock],
            providers: [
                { provide: AJSRootScope, useValue: mockRootScope },
                { provide: IbUtilsService, useValue: mockIbUtilsService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPassengerInfoHeaderComponent);
        component = fixture.componentInstance;

        const passengerInfoMock = getPassengerInfoMock();
        component.passengerInfo = passengerInfoMock;
        component.index = 0;
        component.isOpen = true;

        jasmine.addMatchers(axeMatchers);
        fixture.detectChanges();
    });

    it('should have no accessibility violations', async () => {
        const results = await checkA11y(fixture.nativeElement);
        //@ts-ignore
        expect(results).toHaveNoA11yViolations();
    });
});
