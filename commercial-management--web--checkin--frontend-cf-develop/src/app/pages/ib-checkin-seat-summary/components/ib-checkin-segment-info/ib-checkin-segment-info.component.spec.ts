import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    AJSRootScope
} from 'ib-web-commons/utils';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { IbCheckinSegmentInfoComponent } from './ib-checkin-segment-info.component';
import { mockSegmentInfo } from '@test/unit/app/pages/ib-checkin-seat-summary/mocks/seat-summary.mocks';

@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = 'translate';

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe('IbCheckinSegmentInfoComponent', () => {
    let component: IbCheckinSegmentInfoComponent;
    let fixture: ComponentFixture<IbCheckinSegmentInfoComponent>;

    let fakeRootScope: { appLang: string, appMarket: string };

    beforeEach(async () => {
        fakeRootScope = {
            appLang: 'ES',
            appMarket: 'ES'
        };

        await TestBed.configureTestingModule({
            declarations: [IbCheckinSegmentInfoComponent, TranslatePipeMock],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: AJSRootScope,
                    useValue: fakeRootScope
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinSegmentInfoComponent);
        component = fixture.componentInstance;

        component.segmentInfo = mockSegmentInfo;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set initial variables from $rootScope', () => {
        expect(component.lang).toBe('ES');
        expect(component.market).toBe('ES');
    });

    it('should use default values if not exists in $rootScope', () => {
        fakeRootScope.appLang = null;
        fakeRootScope.appMarket = null;

        const fixture = TestBed.createComponent(IbCheckinSegmentInfoComponent);
        const component = fixture.componentInstance;

        expect(component.lang).toBe('es');
        expect(component.market).toBe('es');
    });

    describe('getFormatDate', () => {
        const dateMock = mockSegmentInfo.arrival.date;

        it('should return the correct date with month first in us market', () => {
            component.market = 'US';

            const result = component.getFormatDate(dateMock);

            expect(result).toBe('mar 18 2026');
        });

        it('should return the correct date', () => {
            const result = component.getFormatDate(dateMock);

            expect(result).toBe('18 mar 2026');
        });
    });
});