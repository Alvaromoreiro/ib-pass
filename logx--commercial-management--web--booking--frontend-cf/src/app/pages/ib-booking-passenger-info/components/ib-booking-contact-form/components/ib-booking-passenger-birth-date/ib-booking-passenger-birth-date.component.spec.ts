import { AJSRootScope } from 'ib-web-commons/utils';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingPassengerBirthDateComponent } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/components/ib-booking-passenger-birth-date/ib-booking-passenger-birth-date.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BookingBirthDatesConstants } from '@src/app/core/constants/ib-booking-dates-constant';
import dayjs from 'dayjs';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

@Component({
  selector: 'p-autoComplete',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PAutoCompleteStubComponent),
      multi: true
    }
  ]
})
class PAutoCompleteStubComponent implements ControlValueAccessor {
  @Input() suggestions: any;
  @Input() forceSelection: any;
  @Input() dropdown: any;
  @Input() placeholder: any;
  @Output() onFocus = new EventEmitter<any>();
  @Output() onShow = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();
  @Output() completeMethod = new EventEmitter<any>();
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

describe('IbBookingPassengerBirthDateComponent', () => {
  let component: IbBookingPassengerBirthDateComponent;
  let fixture: ComponentFixture<IbBookingPassengerBirthDateComponent>;

class MockRootScope {
    public $on = jasmine.createSpy( '$on' );
    public $broadcast = jasmine.createSpy( '$broadcast' );
    public $emit = jasmine.createSpy( '$emit' );
    public appLang = 'es';
}

class MockAJSBookingModalService { showBKIGenericModal() { return { result: { then: () => {} } }; } }
class MockCommonsSessionStorageService {
  get(key?: string) {
    if (key === 'languages') {
      return [{ code: 'es', format: 'dd/MM/yyyy', short: 'es' }];
    }
    if (key === 'slices') {
      return [{ date: '2025-07-07' }];
    }
    if (key === 'commercialData') {
      return {
        languages: [
          {
            code: 'es',
            dateFormat: {
              short: 'dd/MM/yyyy'
            }
          }
        ]
      };
    }
    
    return {
      slices: [{ date: '2025-07-07' }],
      languages: [{ code: 'es', format: 'dd/MM/yyyy', short: 'es' }]
    };
  }
}
class FakeBookingModalService {
  showWaitingModal = jasmine.createSpy('showWaitingModal');
  showGenericError = jasmine.createSpy('showGenericError');
  finishWaiting = jasmine.createSpy('finishWaiting');
  showGenericModal = jasmine.createSpy('showGenericModal');
}
class FakeWindow {
    location : {
        pathname: 'pathname',
        search: 'search',
    }
}

let mockTranslate =  [
      { index: 1, name: 'Jan' },
      { index: 2, name: 'Feb' },
      { index: 3, name: 'Mar' },
      { index: 4, name: 'Apr' },
      { index: 5, name: 'May' },
      { index: 6, name: 'Jun' },
      { index: 7, name: 'Jul' },
      { index: 8, name: 'Aug' },
      { index: 9, name: 'Sep' },
      { index: 10, name: 'Oct' },
      { index: 11, name: 'Nov' },
      { index: 12, name: 'Dec' }
    ];
let originalDaysArray: any;
beforeEach(async () => {
  originalDaysArray = BookingBirthDatesConstants.DAYS_ARRAY;  
  await TestBed.configureTestingModule({
    declarations: [IbBookingPassengerBirthDateComponent, PAutoCompleteStubComponent],
    imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), IbCPipeModule],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
      { provide: AJSRootScope, useClass: MockRootScope},
      { provide: AJSBookingModalService, useClass: FakeBookingModalService},
      { provide: WINDOW_TOKEN, useClass: FakeWindow },
      { provide: AJSBookingModalService, useClass: MockAJSBookingModalService },
      { provide: CommonsSessionStorageService, useClass: MockCommonsSessionStorageService },
    ]
  }).compileComponents();

    fixture = TestBed.createComponent(IbBookingPassengerBirthDateComponent);
    component = fixture.componentInstance;
       component.birthDateForm = new FormGroup({
      day: new FormControl({ value: '', disabled: false }),
      month: new FormControl({ value: '', disabled: false }),
      year: new FormControl({ value: '', disabled: false })
    });
    component.type = 'ADULT';
    component.yearsFrom = 12;
    component.yearsTo = 100;
    component.index = 0;
    component.haveBirthDate = false;
    component.isFormSubmitted = false;
    fixture.detectChanges();
    component.ngOnChanges({});
});

 afterEach(() => {
    (BookingBirthDatesConstants as any).DAYS_ARRAY = originalDaysArray;
  });
  
  it('should initialize form with empty values', () => {
    expect(component.birthDateForm.value).toEqual({ day: '', month: '', year: '' });
  });

  it('should mark form as invalid if fields are empty', () => {
    expect(component.birthDateForm.valid).toBeFalse();
  });

  it('should validate required fields', fakeAsync(() => {
    component.birthDateForm.patchValue({ day: '', month: '', year: '' }, {emitEvent: true});
    tick(101);
    component.birthDateForm.patchValue({ day: '01', month: '01', year: '2000' }, {emitEvent: true});
    tick(101);
    expect(component.birthDateForm.valid).toBeTrue();
  }));

  it('should call showDateOfBirthError without errors', () => {
    expect(() => component.showDateOfBirthError()).not.toThrow(); 
  });

  it('should set dateChange to true when showBKIGenericModal resolves', () => {
    const mockResult = { then: (resolve: Function, reject: Function) => resolve() };
    spyOn((component as any).BookingModalService, 'showBKIGenericModal').and.returnValue({ result: mockResult });

    component.showDateOfBirthError();

    expect(component.dateChange).toBeTrue();
  });

  it('should call convertMonthNumberToName if month is defined in activate', () => {
    spyOn(component, 'convertMonthNumberToName');
    component.month = '1';
    component['alreadyInitialized'] = false;
    component['activate']();

    expect(component.convertMonthNumberToName).toHaveBeenCalled();
  });

  
  it('should update availableDays when month or year changes', () => {
    component.month = '02';
    component.year = '2020';
    const days = component.getDaysOfMonth(2, 2020);
    expect(days.length).toBe(29);
  });

  it('should handle ngOnChanges for day/month/year', fakeAsync(() => {
    component.birthDateForm.patchValue({ day: '01', month: '01', year: '2000' });
    component.ngOnChanges({
      day: { currentValue: '02', previousValue: '01', firstChange: false, isFirstChange: () => false }
    });
    tick(101);
    expect(component.birthDateForm.value.day).toBe('02');
  }));

  it('should call toggleBirthDateFields if haveBirthDate changes', () => {
    spyOn(component as any, 'toggleBirthDateFields');
    component.haveBirthDate = true;

    component.ngOnChanges({
    haveBirthDate: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false }
    });

    expect((component as any).toggleBirthDateFields).toHaveBeenCalledWith(true);
  });

  it('should mark all fields as touched and update validity if isFormSubmitted changes to true', () => {
    spyOn(component.birthDateForm, 'markAllAsTouched');
    spyOn(component.birthDateForm, 'updateValueAndValidity');

    component.ngOnChanges({
    isFormSubmitted: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false }
    });

    expect(component.birthDateForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.birthDateForm.updateValueAndValidity).toHaveBeenCalled();
  });
  
  it('should toggle fields enabled/disabled', () => {
    (component as any).toggleBirthDateFields(true);
    expect(component.birthDateForm.get('day')?.disabled).toBeTrue();
    (component as any).toggleBirthDateFields(false);
    expect(component.birthDateForm.get('day')?.enabled).toBeTrue();
  });

  it('should return true for hasBirthDateData if any field is filled', () => {
    component.day = '01';
    expect(component.hasBirthDateData()).toBeTrue();
    component.day = '';
    component.month = '01';
    expect(component.hasBirthDateData()).toBeTrue();
    component.month = '';
    component.year = '2000';
    expect(component.hasBirthDateData()).toBeTrue();
  });
    

  it('should return false for hasBirthDateData if all fields are empty', () => {
    component.day = '';
    component.month = '';
    component.year = '';
    expect(component.hasBirthDateData()).toBeFalse();
  });

  it('should calculate maxYears for INFANT and non-INFANT', () => {
    component.type = 'INFANT';
    expect(component.calculateMaxYears(2, 12, 2024, 2023)).toBe(11);
    component.type = 'ADULT';
    expect(component.calculateMaxYears(12, 100, 2024, 2024)).toBe(88);
  });

  it('should get days of month correctly', () => {
    const days = component.getDaysOfMonth(2, 2020);
    expect(days.length).toBe(29);
  });

 it('should call daysSelected and validChildDate/validInfantDate', () => {
    component.type = 'CHILD';
    component.day = '01';
    component.month = '01';
    component.year = '2020';
    spyOn(component as any, 'validChildDate');
    component.daysSelected();
    expect((component as any).validChildDate).toHaveBeenCalled();

    component.type = 'INFANT';
    spyOn(component as any, 'validInfantDate');
    component.daysSelected();
    expect((component as any).validInfantDate).toHaveBeenCalled();
  });

  it('should call showDateOfBirthError if dayChanged is true in handleDayChanged', () => {
    component.dayChanged = true;
    spyOn(component, 'showDateOfBirthError');
    (component as any).handleDayChanged();
    expect(component.showDateOfBirthError).toHaveBeenCalled();
  });

  it('should set dayChanged true if isFirstAvailableMonth returns true in validInfantDate', () => {
    spyOn(component as any, 'isLastAvailableMonthForInfant').and.returnValue(false);
    spyOn(component as any, 'isFirstAvailableMonth').and.returnValue(true);
    spyOn(component as any, 'isAfterLastAvailableMonth').and.returnValue(false);
    spyOn(component as any, 'handleDayChanged');
    (component as any).validInfantDate(false);
    expect(component.dayChanged).toBeTrue();
    expect((component as any).handleDayChanged).toHaveBeenCalled();
  });

  it('should set dayChanged true if isAfterLastAvailableMonth returns true in validInfantDate', () => {
    spyOn(component as any, 'isLastAvailableMonthForInfant').and.returnValue(false);
    spyOn(component as any, 'isFirstAvailableMonth').and.returnValue(false);
    spyOn(component as any, 'isAfterLastAvailableMonth').and.returnValue(true);
    spyOn(component as any, 'handleDayChanged');
    (component as any).validInfantDate(false);
    expect(component.dayChanged).toBeTrue();
    expect((component as any).handleDayChanged).toHaveBeenCalled();
  });

  const setupValidDateTest = (type: string, mocks: any, methodName: string) => {
    component.type = type;
    component.day = '01';
    component.month = '01';
    component.year = component.availableYears[0];
    component.flightDate = '2025-07-07';

    Object.entries(mocks).forEach(([method, returnValue]) => {
      spyOn(component as any, method).and.returnValue(returnValue);
    });

    (component as any)[methodName](false);

    expect((component as any).handleDayChanged).toHaveBeenCalled();
    if (type === 'CHILD') {
      expect((component as any).setAvailableDaysForChild).toHaveBeenCalled();
    } else if (type === 'INFANT') {
      expect((component as any).handleLastAvailableMonthForInfant).toHaveBeenCalled();
    }
  };

  it('should handle validChildDate and set availableDays', () => {
    setupValidDateTest(
      'CHILD',
      {
        getMonthDaysForChild: ['01', '02', '03'],
        lastAvailableMonthIndex: 1,
        isLastAvailableMonthForChild: true,
        setAvailableDaysForChild: undefined,
        handleDayChanged: undefined
      },
      'validChildDate'
    );
  });

  it('should handle validInfantDate', () => {
    setupValidDateTest(
      'INFANT',
      {
        getDaysOfMonth: ['01', '02', '03'],
        firstAvailableMonthIndex: 1,
        lastAvailableMonthIndex: 1,
        isLastAvailableMonthForInfant: true,
        handleLastAvailableMonthForInfant: undefined,
        handleDayChanged: undefined
      },
      'validInfantDate'
    );
  });
  
  it('should set availableDays for INFANT using currentDay', () => {
    component.type = 'INFANT';
    const monthDays = ['01', '02', '03', '04', '05'];
    (component as any).handleLastAvailableMonthForInfant(monthDays, 3, 5);
    expect(component.availableDays).toEqual(['01', '02']);
  });

  it('should set dayChanged true if day > last available day and type is INFANT', () => {
    component.type = 'INFANT';
    component.day = '05';
    const monthDays = ['01', '02', '03', '04', '05'];
    (component as any).handleLastAvailableMonthForInfant(monthDays, 4, 5);
    
    expect(component.dayChanged).toBeTrue();
  });

  it('should not set dayChanged if day <= last available day or type is not INFANT', () => {
    component.type = 'INFANT';
    component.day = '03';
    const monthDays = ['01', '02', '03', '04', '05'];
    (component as any).handleLastAvailableMonthForInfant(monthDays, 4, 5);
    expect(component.dayChanged).toBeFalse();

    component.type = 'ADULT';
    component.day = '05';
    (component as any).handleLastAvailableMonthForInfant(monthDays, 4, 5);
    expect(component.dayChanged).toBeFalse();
  });

  it('should return true for isAfterLastAvailableMonth if month > lastAvailableMonthIndex and year matches first available', () => {
    component.month = '3';
    component.year = '2020';
    component.availableYears = ['2020', '2019'];
    const result = (component as any).isAfterLastAvailableMonth(2);
    expect(result).toBeTrue();
  }); 

  it('should getMonthDaysForChild when month is set', () => {
    component.month = '2';
    component.year = '2020';
    spyOn(component, 'getDaysOfMonth').and.returnValue(['01', '02', '03']);
    const result = (component as any).getMonthDaysForChild();
    expect(component.getDaysOfMonth).toHaveBeenCalledWith(2, 2020);
    expect(result).toEqual(['01', '02', '03']);
  });

  it('should getMonthDaysForChild when month is not set', () => {
    component.month = '';
    const originalDaysArray = BookingBirthDatesConstants.DAYS_ARRAY;
    const DAYS_ARRAY = ['01', '02', '03', '04', '05'];
    (BookingBirthDatesConstants as any).DAYS_ARRAY = DAYS_ARRAY;
    const result = (component as any).getMonthDaysForChild();
    expect(result).toEqual(DAYS_ARRAY);
    
    (BookingBirthDatesConstants as any).DAYS_ARRAY = originalDaysArray;
  });

  it('should use availableYears[0].toString() if year is not set in getMonthDaysForChild', () => {
    component.month = '2';
    component.year = '';
    component.availableYears = ['2020', '2019'];
    const spy = spyOn(component, 'getDaysOfMonth').and.returnValue(['01', '02', '03']);
    const result = (component as any).getMonthDaysForChild();
    expect(spy).toHaveBeenCalledWith(2, 2020);
    expect(result).toEqual(['01', '02', '03']);
  });

  it('should return true for isLastAvailableMonthForChild if month and year match', () => {
    component.month = '2';
    component.year = '2020';
    component.availableYears = ['2020'];
    const result = (component as any).isLastAvailableMonthForChild(2);
    expect(result).toBeTrue();
  });

  it('should return false for isLastAvailableMonthForChild if month or year do not match', () => {
    component.month = '1';
    component.year = '2020';
    component.availableYears = ['2020'];
    expect((component as any).isLastAvailableMonthForChild(2)).toBeFalse();
    component.month = '2';
    component.year = '2019';
    expect((component as any).isLastAvailableMonthForChild(2)).toBeFalse();
  });

describe('setAvailableDaysForChild', () => {
  const testCases = [
    {
      type: 'CHILD',
      description: 'CHILD and set dayChanged if day > returnDay',
      flightDate: '2025-07-07',
      expectLength: (len: number) => expect(len).toBeGreaterThan(0)
    },
    {
      type: 'ADULT',
      description: 'non-CHILD and set dayChanged if day > returnDay',
      flightDate: undefined,
      expectLength: (len: number) => expect(len).toBe(5)
    }
  ];

  testCases.forEach(({ type, description, flightDate, expectLength }) => {
    it(`should set availableDays for ${description}`, () => {
     
      component.type = type;
      component.day = '10';

      if (flightDate) {
        component.flightDate = flightDate;
      }

      if (type === 'CHILD') {
        spyOn(dayjs.prototype, 'date').and.returnValue(2);
      }

      const monthDays = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

      (component as any).setAvailableDaysForChild([...monthDays], 5);

      expectLength(component.availableDays.length);
      expect(component.dayChanged).toBeTrue();
    });
  });
});

  it('should return true for isLastAvailableMonthForInfant if month and year match', () => {
    component.month = '2';
    component.year = '2020';
    component.availableYears = ['2020'];
    const result = (component as any).isLastAvailableMonthForInfant(2);
    expect(result).toBeTrue();
  });

  it('should return true for isFirstAvailableMonth if month < firstAvailableMonthIndex and year matches last available', () => {
    component.month = '1';
    component.year = '2020';
    component.availableYears = ['2019', '2020'];
    const result = (component as any).isFirstAvailableMonth(2);
    expect(result).toBeTrue();
  });  

describe('monthsSelected', () => {
  let component: IbBookingPassengerBirthDateComponent;

  beforeEach(() => {
    component = new IbBookingPassengerBirthDateComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    component.flightDate = '2025-07-07';
    component.availableYears = ['2025', '2024'];
    component.monthTranslate = [
      { index: 1, name: 'Jan' },
      { index: 2, name: 'Feb' },
      { index: 3, name: 'Mar' },
      { index: 4, name: 'Apr' },
      { index: 5, name: 'May' },
      { index: 6, name: 'Jun' },
      { index: 7, name: 'Jul' },
      { index: 8, name: 'Aug' },
      { index: 9, name: 'Sep' },
      { index: 10, name: 'Oct' },
      { index: 11, name: 'Nov' },
      { index: 12, name: 'Dec' }
    ];
  });

  const setupTest = (config: {
    type: string;
    month: string;
    year: string;
    day: string;
    actualDay: string,
    monthDays: string[];
    returnDay: number;
    returnMonth: number;
    firstAvailableMonthIndex: number;
    lastAvailableMonthIndex: number;
  }) => {
    component.type = config.type;
    component.month = config.month;
    component.year = config.year;
    component.day = config.day;

    spyOn(component, 'getDaysOfMonth').and.returnValue(config.monthDays);
    spyOn(component, 'firstAvailableMonthIndex').and.returnValue(config.firstAvailableMonthIndex);
    spyOn(component, 'lastAvailableMonthIndex').and.returnValue(config.lastAvailableMonthIndex);
    spyOn((component as any), 'handleDayChanged');
  };

  const verifyMonthsSelected = (expectedDays: string[], dayChanged: boolean) => {
    expect(component.availableDays).toEqual(expectedDays);
    expect(component.dayChanged).toBe(dayChanged);
    expect((component as any).handleDayChanged).toHaveBeenCalled();
  };

  it('should handle last available month for CHILD and set availableDays', () => {
    setupTest({
      type: 'CHILD',
      month: '7',
      year: '2025',
      day: '10',
      actualDay:'10',
      monthDays: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      returnDay: 7,
      returnMonth: 7,
      firstAvailableMonthIndex: 1,
      lastAvailableMonthIndex: 7
    });

    component.monthsSelected(false);

    verifyMonthsSelected(['01', '02', '03', '04', '05', '06', '07'], true);
  });

  it('should handle last available month for INFANT and set availableDays', () => {
    setupTest({
      type: 'INFANT',
      month: '7',
      year: '2025',
      day: '10',
      actualDay:'10',
      monthDays: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      returnDay: 7,
      returnMonth: 7,
      firstAvailableMonthIndex: 1,
      lastAvailableMonthIndex: 7
    });
    spyOn(dayjs.prototype, 'date').and.returnValue(8);
    component.monthsSelected(false);

    verifyMonthsSelected(['01', '02', '03', '04', '05', '06', '07'], true);
  });

  it('should handle first available month and set dayChanged for CHILD', () => {
    setupTest({
      type: 'CHILD',
      month: '1',
      year: '2024',
      day: '07',
      actualDay:'07',
      monthDays: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      returnDay: 7,
      returnMonth: 7,
      firstAvailableMonthIndex: 1,
      lastAvailableMonthIndex: 7
    });

    component.monthsSelected(false);

    verifyMonthsSelected(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'], true);
  });

  it('should restore day if type is INFANT and day > returnDay in first available month branch', () => {
    setupTest({
      type: 'INFANT',
      month: '1',
      year: '2024',
      day: '11',
      actualDay:'11',
      monthDays: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      returnDay: 7,
      returnMonth: 7,
      firstAvailableMonthIndex: 1,
      lastAvailableMonthIndex: 7
    });


    component.monthsSelected(false);

    expect(component.day).toBe('11');
    expect((component as any).handleDayChanged).toHaveBeenCalled();
  });
});


  it('should handle yearsSelected for different branches', () => {
    component.year = component.availableYears[0];
    spyOn(component as any, 'handleFirstAvailableYear');
    spyOn(component as any, 'monthsSelected');
    component.yearsSelected();
    expect((component as any).handleFirstAvailableYear).toHaveBeenCalled();
    expect((component as any).monthsSelected).toHaveBeenCalled();
  });

  it('should call handleLastAvailableYear if year matches the last available year', () => {
    component.year = '2023';
    component.availableYears = ['2025', '2024', '2023'];
    component.flightDate = '2025-12-10';
    spyOn(component, 'getDaysOfMonth').and.returnValue(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    spyOn(component as any, 'handleLastAvailableYear');
    spyOn(component as any, 'monthsSelected');

    (component as any).yearsSelected();

    expect((component as any).handleLastAvailableYear).toHaveBeenCalled();
    expect(component.monthsSelected).toHaveBeenCalledWith(false);
  });

  it('should set availableMonths if year does not match first or last available year', () => {
    component.year = '2024';
    component.availableYears = ['2025', '2024', '2023'];
    component.flightDate = '2025-12-10';
    component.monthTranslate = [
      { index: 1, name: 'Jan' },
      { index: 2, name: 'Feb' },
      { index: 3, name: 'Mar' }
    ];
    spyOn(component as any, 'monthsSelected');

    (component as any).yearsSelected();

    expect(component.availableMonths).toEqual(['Jan', 'Feb', 'Mar']);
    expect(component.monthsSelected).toHaveBeenCalledWith(false);
  });

  it('should set availableMonths and dayChanged if month > maxMonth in handleFirstAvailableYear', () => {
    component.type = 'ADULT';
    component.month = '12';
    spyOn(component, 'getAvailableMonthsByType').and.returnValue(['Jan', 'Feb', 'Mar']);
    spyOn(component as any, 'lastAvailableMonthIndex').and.returnValue(11);

    (component as any).handleFirstAvailableYear(10, 11);

    expect(component.availableMonths).toEqual(['Jan', 'Feb', 'Mar']);
    expect(component.dayChanged).toBeTrue();
  });

  it('should set dayChanged if month > lastAvailableMonthIndex in handleFirstAvailableYear', () => {
    component.type = 'ADULT';
    component.month = '12';
    spyOn(component, 'getAvailableMonthsByType').and.returnValue(['Jan', 'Feb', 'Mar']);
    spyOn(component as any, 'lastAvailableMonthIndex').and.returnValue(11);

    (component as any).handleFirstAvailableYear(12, 12);

    expect(component.availableMonths).toEqual(['Jan', 'Feb', 'Mar']);
    expect(component.dayChanged).toBeTrue();
  });

  it('should set dayChanged true if month > lastAvailableMonthIndex in handleFirstAvailableYear', () => {
    component.type = 'ADULT';
    component.month = '12'; 
    spyOn(component, 'getAvailableMonthsByType').and.returnValue(['Jan', 'Feb', 'Mar']);
    spyOn(component as any, 'lastAvailableMonthIndex').and.returnValue(11);

    (component as any).handleFirstAvailableYear(10, 11);

    expect(component.availableMonths).toEqual(['Jan', 'Feb', 'Mar']);
    expect(component.dayChanged).toBeTrue();
  });

  it('should not set dayChanged if month <= maxMonth and month <= lastAvailableMonthIndex in handleFirstAvailableYear', () => {
    component.type = 'ADULT';
    component.month = '10';
    spyOn(component, 'getAvailableMonthsByType').and.returnValue(['Jan', 'Feb', 'Mar']);
    spyOn(component as any, 'lastAvailableMonthIndex').and.returnValue(11);

    (component as any).handleFirstAvailableYear(10, 11);

    expect(component.availableMonths).toEqual(['Jan', 'Feb', 'Mar']);
    expect(component.dayChanged).toBeFalse();
  });

  it('should set availableMonths and dayChanged if isLastDay is true and month < firstAvailableMonthIndex in handleLastAvailableYear', () => {
    component.monthTranslate = mockTranslate;
    component.month = '1';
    spyOn(component as any, 'firstAvailableMonthIndex').and.returnValue(2);

    (component as any).handleLastAvailableYear(true, 2);

    expect(component.availableMonths).toEqual(['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    expect(component.dayChanged).toBeTrue();
  });

  it('should set availableMonths using startIndex and endIndex', () => {
    component.monthTranslate = mockTranslate;
    component.month = '3';
    const returnMonth = 4;

    (component as any).handleLastAvailableYear(false, returnMonth);

    expect(component.availableMonths).toEqual(['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  });



  it('should handle enablePassengerWarning', () => {
    component.enablePassengerWarning();
    expect(component.dateChange).toBeTrue();
  });

  




  describe ('getFormatDate', () => {
    const langs = [
      { code: 'es', dateFormat: { short: 'dd/MM/yyyy' }, expected: BookingAppConstants.DATE_FORMAT.DEFAULT },
      { code: 'ca', dateFormat: { short: 'yyyy-MM-dd' }, expected: BookingAppConstants.DATE_FORMAT.YEARS_FIRST },
      { code: 'fr', dateFormat: { short: 'dd/MM/yyyy' }, expected: BookingAppConstants.DATE_FORMAT.DEFAULT },
      { code: 'fr', dateFormat: { short: 'dd.MM.yyyy' }, expected: BookingAppConstants.DATE_FORMAT.DEFAULT },
      { code: 'de', dateFormat: { short: 'dd.MM.yyyy' }, expected: BookingAppConstants.DATE_FORMAT.DEFAULT },
      { code: 'zh', dateFormat: { short: 'yyyy-MM-dd' }, expected: BookingAppConstants.DATE_FORMAT.YEARS_FIRST },
      { code: 'ru', dateFormat: { short: 'dd.MM.yyyy' }, expected: BookingAppConstants.DATE_FORMAT.DEFAULT },
      { code: 'en', dateFormat: { short: 'MM/dd/yyyy' }, expected: BookingAppConstants.DATE_FORMAT.MONTH_FIRST }
    ];
    beforeEach(() => {
      component['$rootScope'].appLang = 'es';
      component['CommonSessionStorageService'] = new StorageServiceMock() as unknown as CommonsSessionStorageService;
      component['CommonSessionStorageService'].set('commercialData', { languages: langs });
    });
    langs.forEach(lang => {
      it('should apply correct format for ' + lang.code, () => {
        component['$rootScope'].appLang = lang.code;
        const result = component.getFormatDate();
        expect(result).toEqual(lang.expected);
      });
      
    });
  });



  it('should filterDays, filterMonths, filterYears', () => {
    component.availableDays = ['01', '02', '03'];
    component.availableMonths = ['Jan', 'Feb', 'Mar'];
    component.availableYears = ['2020', '2021', '2022'];
    component.filterDays({ query: '01' });
    expect(component.filteredDays).toContain('01');
    component.filterMonths({ query: 'Jan' });
    expect(component.filteredMonths).toContain('Jan');
    component.filterYears({ query: '2020' });
    expect(component.filteredYears).toContain('2020');
  });

  it('should call onFocus, onShow, onHide', () => {
    component.dayAutoComplete = { show: jasmine.createSpy() } as any;
    component.monthAutoComplete = { show: jasmine.createSpy() } as any;
    component.yearAutoComplete = { show: jasmine.createSpy() } as any;
    component.dayDropdownIcon = { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() } } as any;
    component.monthDropdownIcon = { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() } } as any;
    component.yearDropdownIcon = { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() } } as any;
    component.onFocus('day');
    component.onFocus('month');
    component.onFocus('year');
    component.onShow('day');
    component.onShow('month');
    component.onShow('year');
    component.onHide('day');
    component.onHide('month');
    component.onHide('year');

    expect(component.monthAutoComplete.show).toHaveBeenCalledTimes(1);
    expect(component.yearAutoComplete.show).toHaveBeenCalledTimes(1);

    expect(component.dayDropdownIcon.classList.add).toHaveBeenCalledWith('rotate');
    expect(component.monthDropdownIcon.classList.add).toHaveBeenCalledWith('rotate');
    expect(component.yearDropdownIcon.classList.add).toHaveBeenCalledWith('rotate');

    expect(component.dayDropdownIcon.classList.remove).toHaveBeenCalledWith('rotate');
    expect(component.monthDropdownIcon.classList.remove).toHaveBeenCalledWith('rotate');
    expect(component.yearDropdownIcon.classList.remove).toHaveBeenCalledWith('rotate');
  });

  it('should call onDaySelected, onMonthSelected, onYearSelected', () => {
    spyOn(component.dayChange, 'emit');
    spyOn(component.monthChange, 'emit');
    spyOn(component.yearChange, 'emit');
    spyOn(component, 'daysSelected');
    spyOn(component, 'monthsSelected');
    spyOn(component, 'yearsSelected');
    component.onDaySelected('01');
    expect(component.dayChange.emit).toHaveBeenCalledWith('01');
    expect(component.daysSelected).toHaveBeenCalled();
    component.monthTranslate = [{ index: 1, name: 'Jan' }];
    component.onMonthSelected('Jan');
    expect(component.monthChange.emit).toHaveBeenCalled();
    expect(component.monthsSelected).toHaveBeenCalled();
    component.onYearSelected('2020');
    expect(component.yearChange.emit).toHaveBeenCalledWith('2020');
    expect(component.yearsSelected).toHaveBeenCalled();
  });

  it('should call onBlur and restore previous value if empty', () => {
    component.previousDay = '01';
    component.birthDateForm.get('day')?.setValue('');
    component.onBlur('day');
    expect(component.birthDateForm.get('day')?.value).toBe('01');
  });

  it('should restore previous value if day is empty on blur', () => {
    component.previousDay = '01';
    component.birthDateForm.get('day')?.setValue('');
    component.onBlur('day');
    expect(component.birthDateForm.get('day')?.value).toBe('01');
  });

 it('should update previousDay if day is not empty on blur', () => {
    component.previousDay = '01';
    component.birthDateForm.get('day')?.setValue('05');
    component.onBlur('day');
    expect(component.previousDay).toBe('05');
 });

 it('should restore previous value if month is empty on blur', () => {
    component.previousMonth = '02';
    component.birthDateForm.get('month')?.setValue('');
    component.onBlur('month');
    expect(component.birthDateForm.get('month')?.value).toBe('02');
 });

 it('should update previousMonth if month is not empty on blur', () => {
    component.previousMonth = '02';
    component.birthDateForm.get('month')?.setValue('03');
    component.onBlur('month');
    expect(component.previousMonth).toBe('03');
 });

 it('should restore previous value if year is empty on blur', () => {
    component.previousYear = '2000';
    component.birthDateForm.get('year')?.setValue('');
    component.onBlur('year');
    expect(component.birthDateForm.get('year')?.value).toBe('2000');
 });

 it('should update previousYear if year is not empty on blur', () => {
   component.previousYear = '2000';
   component.birthDateForm.get('year')?.setValue('2020');
   component.onBlur('year');
   expect(component.previousYear).toBe('2020');
 });

 it('should call convertMonthNumberToName and patch form', () => {
    component.month = '1';
    component.monthTranslate = [{ index: 1, name: 'Jan' }];
    spyOn(component.birthDateForm, 'patchValue');
    spyOn(component.monthChange, 'emit');
    component.convertMonthNumberToName();
    expect(component.birthDateForm.patchValue).toHaveBeenCalled();
    expect(component.monthChange.emit).toHaveBeenCalled();
 });

  it('should getMonthNameFromNumber', () => {
    component.monthTranslate = [{ index: 1, name: 'Jan' }];
    expect(component.getMonthNameFromNumber(1)).toBe('Jan');
    expect(component.getMonthNameFromNumber('1')).toBe('Jan');
    expect(component.getMonthNameFromNumber(2)).toBe('');
  });

  const setupAvailableMonthsTest = (type: string, startIndex: number, endIndex: number, expectedResult: string[]) => { 
    component.type = type;
    component.monthTranslate = [
      { index: 1, name: 'Jan' },
      { index: 2, name: 'Feb' },
      { index: 3, name: 'Mar' }
    ];

    const result = component.getAvailableMonthsByType(startIndex, endIndex);
    expect(result).toEqual(expectedResult);
  };

  it('should return available months by type INFANT', () => {
    setupAvailableMonthsTest('INFANT', 2, 3, ['Jan', 'Feb']);
  });

  it('should return available months by type not INFANT', () => {
    setupAvailableMonthsTest('ADULT', 2, 2, ['Jan', 'Feb']);
  });

  it('should return firstAvailableMonthIndex', () => {
    component.monthTranslate = [
        { index: 1, name: 'Jan' },
        { index: 2, name: 'Feb' },
        { index: 3, name: 'Mar' }
    ];
    component.availableMonths = ['Feb', 'Mar'];
    expect(component.firstAvailableMonthIndex()).toBe(2);
  });

  it('should return undefined for firstAvailableMonthIndex if not found', () => {
    component.monthTranslate = [
    { index: 1, name: 'Jan' }
    ];
    component.availableMonths = ['NonExisting'];
    expect(component.firstAvailableMonthIndex()).toBeUndefined();
  });

  it('should return lastAvailableMonthIndex', () => {
    component.monthTranslate = [
        { index: 1, name: 'Jan' },
        { index: 2, name: 'Feb' },
        { index: 3, name: 'Mar' }
    ];
    component.availableMonths = ['Feb', 'Mar'];
    expect(component.lastAvailableMonthIndex()).toBe(3);
  });

  it('should return undefined for lastAvailableMonthIndex if not found', () => {
      component.monthTranslate = [
          { index: 1, name: 'Jan' }
      ];
      component.availableMonths = ['NonExisting'];
      expect(component.lastAvailableMonthIndex()).toBeUndefined();
  });
  
});
