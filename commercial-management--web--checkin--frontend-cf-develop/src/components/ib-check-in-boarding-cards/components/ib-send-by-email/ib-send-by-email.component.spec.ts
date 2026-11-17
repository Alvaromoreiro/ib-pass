import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbSendByEmailComponent } from './ib-send-by-email.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AJSRootScope } from 'ib-web-commons/utils';

const fakeBoardingCardsConstants = require('test/constants/boarding-cards-constants.json');
const fakeRootScope = jasmine.createSpyObj('AJSRootScope', ['$broadcast']);
fakeRootScope.CHECKIN_PATTERNS = {EMAIL_PATTERN: '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}'};

describe('IbSendByEmailComponent test', () => {
  let component: IbSendByEmailComponent;
  let fixture: ComponentFixture<IbSendByEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbSendByEmailComponent ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgbNavModule
      ],
      providers: [{ provide: AJSRootScope, useValue: fakeRootScope }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbSendByEmailComponent);
    component = fixture.componentInstance;
    component.model = fakeBoardingCardsConstants.model;
    component.formatsList = fakeBoardingCardsConstants.model.boardingInfo.formatsList;
    component.passengersList = fakeBoardingCardsConstants.model.boardingInfo.passengersList;
    component.channelsList = fakeBoardingCardsConstants.model.boardingInfo.channelsList;
    component.model.boardingInfo.selectedTab = 0;
    component.sendAllEmailForm;
    component.sendOneEmailForm;

    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when ngOnInit() is called', () => {
    it('should call functions', () => {
      spyOn(component, 'updateCheckboxes');
      spyOn(component, 'createForms');
      component.ngOnInit();
      expect(component.updateCheckboxes).toHaveBeenCalled();
      expect(component.createForms).toHaveBeenCalled();

    });

  });

  describe('when updateCheckbox() is called', () => {
    it('should update checkboxes', () => {
      component.updateCheckbox('sendAll', 'pdfFormat', 'qrFormat');
      expect(component.sendOneEmailForm.get('pdfFormat').value).toBeTrue();
      expect(component.sendAllEmailForm.get('pdfFormat2').value).toBeTrue();
      expect(component.pdfCheckBoxDisabled).toBeTrue();
      expect(component.pdf2CheckBoxDisabled).toBeTrue();

      component.sendAllEmailForm.get('qrFormat2').setValue(true);
      component.updateCheckbox('sendAll', 'qrFormat', 'pdfFormat');
      expect(component.pdfCheckBoxDisabled).toBeFalse();
      expect(component.pdf2CheckBoxDisabled).toBeFalse();

      component.updateCheckbox('sendOne', 'qrFormat', 'pdfFormat');
      expect(component.sendOneEmailForm.get('pdfFormat').value).toBeTrue();
      expect(component.sendAllEmailForm.get('pdfFormat2').value).toBeTrue();
      expect(component.pdfCheckBoxDisabled).toBeTrue();
      expect(component.pdf2CheckBoxDisabled).toBeTrue();


      component.sendAllEmailForm.get('pdfFormat2').setValue(false);
      component.sendAllEmailForm.get('qrFormat2').setValue(true);
      component.updateCheckbox('sendAll', 'pdfFormat', 'qrFormat');
      expect(component.qrCheckBoxDisabled).toBeTrue();
      expect(component.qr2CheckBoxDisabled).toBeTrue();

    });

  });

  describe('when isOtherCheckboxUnchecked() is called', () => {
    it('should return boolean', () => {
      expect(component.isOtherCheckboxUnchecked(0)).toBe(!component.formatsList[0].isSelected);
    });

  });

  describe('when sendEmailTickets() is called', () => {
    it('and email is correct should set channelList and emit event', () => {
      spyOn(component.askForCardsEvent, 'emit');
      component.sendOneEmailForm.get('email').setValue('asda@asad.com');
      component.sendEmailTickets();
      expect(component.oneFormSubmitted).toBeTrue();
      expect(component.channelsList[0].isSelected).toBeTrue();
      expect(component.channelsList[1].isSelected).toBeFalse();
      expect(component.askForCardsEvent.emit).toHaveBeenCalledWith(component.model)
    });

    it('and email is wrong should set channelList and emit event', () => {
      component.setSelectedTab(1);
      component.sendAllEmailForm.controls['email1'].setValue('asd@asd');
      component.channelsList[0].isSelected = false;
      component.channelsList[1].isSelected = true;
      component.sendEmailTickets();
      expect(component.allFormSubmitted).toBeTrue();
      expect(component.channelsList[0].isSelected).toBeFalse();
      expect(component.channelsList[1].isSelected).toBeTrue();

    });

  });

  describe('when setSelectedTab() is called', () => {
    it('should set selected tab', () => {
      component.setSelectedTab(1);
      expect(component.model.boardingInfo.selectedTab).toBe(1);
    });

  });

  describe('when setFocus() is called', () => {
    it('should set labelFocus', () => {
      component.setFocus('aaa');
      expect(component.labelFocus).toEqual('aaa');
    });

  });

  describe('when formatName(text) is called', () => {
    it('should format text', () => {
      const result = component.formatName('EJEMPLO TEST');
      expect(result).toEqual('Ejemplo Test');
    });

  });

});
