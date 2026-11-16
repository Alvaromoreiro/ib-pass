import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingNoticeComponent } from '@src/app/shared/components/ib-booking-notice/ib-booking-notice.component';

describe('IbBookingNoticeComponent', () => {
  let component: IbBookingNoticeComponent;
  let fixture: ComponentFixture<IbBookingNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbBookingNoticeComponent ],
      imports:[
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbBookingNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('When toggleGenericLightBox is called', () => {
     it('should emit toggleGenBox event', () => {
        spyOn(component.toggleGenBox,'emit')
        component.toggleGenericLightBox('event');
        expect(component.viewNoticeHidden).toBeTrue();
        expect(component.toggleGenBox.emit).toHaveBeenCalled()
     });
  });
  describe('When action is called', () => {
     it('should emit toggleGenBox event', () => {
        spyOn(component.toggleGenBox,'emit')
        component.action('event');
        expect(component.toggleGenBox.emit).toHaveBeenCalled()
     });
  });
  describe('When close is called', () => {
     it('should emit toggleGenBox event', () => {
        spyOn(component.closeOnHoldBox,'emit')
        component.close();
        expect(component.closeOnHoldBox.emit).toHaveBeenCalled()
     });
  });
  describe('When acceptBuyOnhold is called', () => {
     it('should emit toggleGenBox event', () => {
        spyOn(component.acceptBuy,'emit')
        spyOn(component.closeOnHoldBox,'emit')
        component.acceptBuyOnhold();
        expect(component.acceptBuy.emit).toHaveBeenCalled()
        expect(component.closeOnHoldBox.emit).toHaveBeenCalled()
     });
  });
});
