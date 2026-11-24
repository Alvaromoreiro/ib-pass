import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IbAccordionComponent } from 'src/app/shared/components/ib-accordion-component/ib-accordion.component';

describe('IbBookingAccordionComponent', () => {
    let component: IbAccordionComponent;
    let fixture: ComponentFixture<IbAccordionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbAccordionComponent ],
            imports:[
                TranslateModule.forRoot()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbAccordionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('Call toogleAccordion', () => {
        it('should open accordion', () => {
            component.opened = false;
            component.toogleAccordion();
            expect(component.opened).toBeTrue();
        });
        it('should close accordion', () => {
            component.opened = true;
            component.toogleAccordion();
            expect(component.opened).toBeFalse();
        });
    });
});
