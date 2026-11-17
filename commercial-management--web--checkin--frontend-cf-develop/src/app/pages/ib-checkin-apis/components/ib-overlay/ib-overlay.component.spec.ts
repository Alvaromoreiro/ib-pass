import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbOverlayComponent } from './ib-overlay.component';
import {
  OverlayStatus,
  CommonTranslationKeys
} from 'commercial-management--digital--web-components-design--library';

describe('IbOverlayComponent', () => {
  let component: IbOverlayComponent;
  let fixture: ComponentFixture<IbOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbOverlayComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize overlayProps in constructor', () => {
    expect(component.overlayProps).toEqual({
      status: undefined,
      messageKey: undefined,
      isOpen: true
    });
  });

  it('should update overlayProps on ngOnChanges', () => {
    component.status = 'success' as OverlayStatus;
    component.messageKey = 'DATA_BEING_VALIDATED' as CommonTranslationKeys;
    component.isOpen = false;
    component.ngOnChanges({});
    expect(component.overlayProps).toEqual({
      status: 'success',
      messageKey: 'DATA_BEING_VALIDATED',
      isOpen: false
    });
  });
});
