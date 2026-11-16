import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbContactInfoOnHoldConfComponent } from 'src/app/pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-contact-info-on-hold-conf/ib-contact-info-on-hold-conf.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('IbContactInfoOnHoldConfComponent', () => {
    let component: IbContactInfoOnHoldConfComponent;
    let fixture: ComponentFixture<IbContactInfoOnHoldConfComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbContactInfoOnHoldConfComponent ],
            imports: [TranslateModule.forRoot()],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IbContactInfoOnHoldConfComponent);
        component = fixture.componentInstance;
        component.contactInfo = { phone: '345555555555555555', email: 'TEST@TTTESTINGTEST.COM' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
