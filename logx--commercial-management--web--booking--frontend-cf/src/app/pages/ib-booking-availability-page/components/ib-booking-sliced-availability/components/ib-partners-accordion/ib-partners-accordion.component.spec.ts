import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IbPartnersAccordionComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-partners-accordion/ib-partners-accordion.component';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { AJSRootScope } from 'ib-web-commons/utils';

describe('IbPartnersAccordionComponent', () => {
    let component: IbPartnersAccordionComponent;
    let fixture: ComponentFixture<IbPartnersAccordionComponent>;
    const rootScope = {
        appLang: 'es'
    };
    const fakeBookingRedirectionService = {
        newNavigation: jasmine.createSpy('newNavigation')
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbPartnersAccordionComponent],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule],
            providers: [
                { provide: AJSRootScope, useValue: rootScope },
                { provide: BookingRedirectionService, useValue: fakeBookingRedirectionService}
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPartnersAccordionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('redirectToConditions', () => {
        component.redirectToConditions();
        expect(fakeBookingRedirectionService.newNavigation).toHaveBeenCalled();
    });
    it('Test collapseAccordion', () => {
        component.opened = true;
        component.collapseAccordion();
        expect(component.opened).toBe(false);
    });
    it('Test toggleOpened', () => {
        component.opened = true;
        component.toggleOpened();
        expect(component.opened).toBe(false);
    });
});
