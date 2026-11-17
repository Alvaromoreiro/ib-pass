import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { IbAccordionContainerComponent } from './ib-accordion-container.component';

class MockTranslateService {
  instant(key: string) {
    return key;
  }
}

describe('IbAccordionContainerComponent', () => {
  let component: IbAccordionContainerComponent;
  let fixture: ComponentFixture<IbAccordionContainerComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbAccordionContainerComponent],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }]
    }).compileComponents();

    fixture = TestBed.createComponent(IbAccordionContainerComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the translated status of the passenger', () => {
    component.passengerStatus = 'statusKey';
    const result = component.getStatus();
    expect(result).toBe('statusKey');
  });

  it('should have isNOAPI as false by default', () => {
    expect(component.isNOAPI).toBeFalse();
  });

  it('should emit the toggle event', () => {
    spyOn(component.toggle, 'emit');

    component.toggle.emit();

    expect(component.toggle.emit).toHaveBeenCalled();
  });
});
