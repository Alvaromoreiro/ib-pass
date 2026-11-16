import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import {
    IbPlusAccordionComponent
} from '../../../../../src/app/shared/components/ib-plus-accordion/ib-plus-accordion/ib-plus-accordion.component';
import {
    IbPlusAccordionTabComponent
} from '../../../../../src/app/shared/components/ib-plus-accordion/ib-plus-accordion-tab/ib-plus-accordion-tab.component';
import { TranslatePipeMock } from '../../../utils/pipe-mock.pipe';

@Component({
    template: `<ib-plus-accordion>
        <ib-plus-accordion-tab [header]="header1" [disabled]="disabled1">
            Content 1
        </ib-plus-accordion-tab>
        <ib-plus-accordion-tab header="Header II">
            Content 2
        </ib-plus-accordion-tab>
    </ib-plus-accordion>`
})
class TestAccordionComponent {
    header1: string = 'Header I';
    disabled1: boolean = false;
}

describe('IbPlusAccordionComponent tests', () => {
    let accordion: IbPlusAccordionComponent;
    let firstAccordionTab: IbPlusAccordionTabComponent;
    let secondAccordionTab: IbPlusAccordionTabComponent;
    let fixture: ComponentFixture<TestAccordionComponent>;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NoopAnimationsModule],
            declarations: [IbPlusAccordionComponent, IbPlusAccordionTabComponent, TestAccordionComponent, TranslatePipeMock]
        });

        fixture = TestBed.createComponent(TestAccordionComponent);
        accordion = fixture.debugElement.children[0].componentInstance;
        firstAccordionTab = fixture.debugElement.children[0].children[0].children[0].componentInstance;
        secondAccordionTab = fixture.debugElement.children[0].children[0].children[1].componentInstance;
        fixture.detectChanges();
    });

    it('should have a two accordionTab', () => {
        fixture.detectChanges();
        expect(accordion.tabs.length).toBe(2);
    });

    it('when header customize, should change header', () => {
        fixture.detectChanges();
        fixture.componentInstance.header1 = 'Changed Header';
        firstAccordionTab.header = 'Changed Header';
        fixture.detectChanges();

        const accordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__headertext'));
        expect(accordionTabHeaderEl.nativeElement.textContent).toContain('Changed Header');
    });

    it('when second tab is open and fir tab is selected should select first tab and unselect second tab', () => {
        secondAccordionTab.selected = true;
        fixture.detectChanges();

        const firstAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__link')).nativeElement;
        firstAccordionTabOpenEl.click();
        fixture.detectChanges();

        const firstAccordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__header')).nativeElement;
        const secondAccordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__header')).nativeElement;
        expect(firstAccordionTabHeaderEl.className).toContain('ib-ng-accordion__header--active');
        expect(secondAccordionTabHeaderEl.className).not.toContain('ib-ng-accordion__header--active');
    });

    it('when second tab is open and first tab is selected, and is multiple, should select first tab and unselect second tab', () => {
        accordion.multiple = true;
        fixture.detectChanges();

        const firstAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__link')).nativeElement;
        const secondAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__link')).nativeElement;
        secondAccordionTabOpenEl.click();
        firstAccordionTabOpenEl.click();
        fixture.detectChanges();

        const firstAccordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__header')).nativeElement;
        const secondAccordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__header')).nativeElement;
        expect(firstAccordionTabHeaderEl.className).toContain('ib-ng-accordion__header--active');
        expect(secondAccordionTabHeaderEl.className).toContain('ib-ng-accordion__header--active');
    });

    it('when component disable, should disable logic', () => {
        fixture.componentInstance.disabled1 = true;
        fixture.detectChanges();

        const firstAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__link')).nativeElement;
        const accordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[0].query(By.css('.ib-ng-accordion__header')).nativeElement;
        firstAccordionTabOpenEl.click();
        expect(accordionTabHeaderEl.className).toContain('ib-ng-accordion__header--disabled');
        expect(accordionTabHeaderEl.className).not.toContain('ib-ng-accordion__header--active');
    });

    it('when the accordion change, should update active index', () => {
        fixture.detectChanges();

        let activeIndex;
        const secondAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__link')).nativeElement;
        accordion.opened.subscribe((value) => (activeIndex = value.index));
        secondAccordionTabOpenEl.click();
        expect(activeIndex).toEqual(1);
    });

    it('when accordion toggled, should be closed', fakeAsync(() => {
        fixture.detectChanges();

        let activeIndex;
        const secondAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__link')).nativeElement;
        accordion.opened.subscribe((value) => (activeIndex = value.index));
        secondAccordionTabOpenEl.click();
        fixture.detectChanges();
        tick(150);

        secondAccordionTabOpenEl.click();
        fixture.detectChanges();

        const secondAccordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__header')).nativeElement;
        expect(secondAccordionTabHeaderEl.className).not.toContain('ib-ng-accordion__header--active');
    }));


    it('when opened with accesibility, should open', () => {
        fixture.detectChanges();

        const secondAccordionTabOpenEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__link')).nativeElement;
        secondAccordionTabOpenEl.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true }));
        fixture.detectChanges();

        const secondAccordionTabHeaderEl = fixture.debugElement.children[0].children[0].children[1].query(By.css('.ib-ng-accordion__header')).nativeElement;
        expect(secondAccordionTabHeaderEl.className).toContain('ib-ng-accordion__header--active');
    });
});
