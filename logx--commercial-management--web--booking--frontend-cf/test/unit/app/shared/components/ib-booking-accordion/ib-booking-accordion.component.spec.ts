import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingAccordionComponent } from '@shared/components/ib-booking-accordion/ib-booking-accordion.component';

describe('IbBookingAccordionComponent', () => {
  let component: IbBookingAccordionComponent;
  let fixture: ComponentFixture<IbBookingAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbBookingAccordionComponent ],
      imports:[
        TranslateModule.forRoot()
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbBookingAccordionComponent);
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
