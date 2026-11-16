import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbFlexibilizationInfoVoucherDigitalComponent } from "../../../../../src/components/ib-MmB-flexibilization/components/ib-flexibilization-info-voucher-digital/ib-flexibilization-info-voucher-digital.component";
import { TranslatePipeMock } from 'test/unit/utils/pipe-mock.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('test for module ib-flexibilization-info-voucher-digital-module', () => {
  let component: IbFlexibilizationInfoVoucherDigitalComponent;
  let fixture: ComponentFixture<IbFlexibilizationInfoVoucherDigitalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule,],
      declarations: [
        IbFlexibilizationInfoVoucherDigitalComponent,
        TranslatePipeMock
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(IbFlexibilizationInfoVoucherDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create the component when init', () => {
    expect(component).toBeTruthy();
  });

  it('should have openInfo attribute as true when init', () => {
    component.ngOnInit();
    expect(component.openInfo).toBeTruthy();
  });

})