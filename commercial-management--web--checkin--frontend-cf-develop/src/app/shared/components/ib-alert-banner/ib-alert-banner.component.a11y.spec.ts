import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbAlertBannerComponent } from './ib-alert-banner.component';
import { Pipe } from '@angular/core';
import { axeMatchers, checkA11y } from '@test/helpers/axe-helper';
import { IbCLinkPipe } from 'ib-web-commons/pipes';

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

const IbCLinkPipeMock = {
    transform: jasmine.createSpy('IbCLinkPipeMock.transform')
}

describe('IbAlertBannerComponent', () => {
    let component: IbAlertBannerComponent;
    let fixture: ComponentFixture<IbAlertBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbAlertBannerComponent, TranslatePipeMock],
            providers: [{ provide: IbCLinkPipe, useValue: IbCLinkPipeMock }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbAlertBannerComponent);
        component = fixture.componentInstance;
        jasmine.addMatchers(axeMatchers);
        fixture.detectChanges();
    });

    it('should have no accessibility violations', async () => {
        const results = await checkA11y(fixture.nativeElement);
        //@ts-ignore
        expect(results).toHaveNoA11yViolations();
    });
});
