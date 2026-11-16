import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbBookingSlicedAvailabilityTripComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-sliced-availability-trip/ib-booking-sliced-availability-trip.component';
import { AJSMonetateUtilsService } from '@shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { AJSRootScope } from 'ib-web-commons/utils';
import { MonetateUtilsServiceMock, rootScopeMock } from './mocks/ib-booking-availability-trip-mocks';
import { TranslateModule } from '@ngx-translate/core';

describe('IbBookingSlicedAvailabilityTripComponent', () => {
  let component: IbBookingSlicedAvailabilityTripComponent;
  let fixture: ComponentFixture<IbBookingSlicedAvailabilityTripComponent>;

  beforeEach(async () => {

    MonetateUtilsServiceMock.addTrackProductDetail.calls.reset();
    rootScopeMock.$broadcast.calls.reset();

    await TestBed.configureTestingModule({
      declarations: [IbBookingSlicedAvailabilityTripComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
          TranslateModule.forRoot()
        ],
      providers: [
        { provide: AJSMonetateUtilsService, useValue: MonetateUtilsServiceMock },
        { provide: AJSRootScope, useValue: rootScopeMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IbBookingSlicedAvailabilityTripComponent);
    component = fixture.componentInstance;
  });

 afterEach(() => {
    try {
      flush();
    } catch {}
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT call Monetate when calendarSlides are empty', fakeAsync(() => {
    component.tripModel = {
      calendarSlides: { slides: [] }
    } as any;

    component.ngOnInit();
    tick();

    expect(MonetateUtilsServiceMock.addTrackProductDetail).not.toHaveBeenCalled();
  }));

  it('should call Monetate and broadcast when calendarSlides have slides', fakeAsync(() => {
    component.tripModel = {
      origin: 'MAD',
      destination: 'BCN',
      calendarSlides: {
        slides: [{ serviceDate: '2026-04-01' }],
        selectedSlide: 0
      }
    } as any;

    component.ngOnInit();
    tick();

    expect(MonetateUtilsServiceMock.addTrackProductDetail).toHaveBeenCalled();
    expect(rootScopeMock.$broadcast).toHaveBeenCalledWith('updateDigitalData');
    expect(rootScopeMock.$broadcast).toHaveBeenCalledWith('sendUpdateToMonetate');
  }));

  it('should fallback to slide index 0 when selectedSlide and currentInitialSlide are undefined', fakeAsync(() => {
    component.tripModel = {
      origin: 'MAD',
      destination: 'BCN',
      calendarSlides: {
        slides: [
          { serviceDate: '2026-04-01' },
          { serviceDate: '2026-04-02' }
        ]
      }
    } as any;

    fixture.detectChanges(); 
    tick(0); 

    expect(MonetateUtilsServiceMock.addTrackProductDetail).toHaveBeenCalledTimes(1);
    const arg = MonetateUtilsServiceMock.addTrackProductDetail.calls.mostRecent().args[0];
    expect(arg[0].date).toBe('2026-04-01');
  }));

  it('should fallback origin to empty string when origin is undefined', fakeAsync(() => {
    component.tripModel = {
      calendarSlides: {
        slides: [{ serviceDate: '2026-04-01' }],
        selectedSlide: 0
      }
    } as any;

    component.ngOnInit();
    tick(0);

    expect(MonetateUtilsServiceMock.addTrackProductDetail).toHaveBeenCalledTimes(1);

    const payload = MonetateUtilsServiceMock.addTrackProductDetail.calls.mostRecent().args[0];
    expect(payload[0].origin).toBe('');
    expect(payload[0].destination).toBe('');
    expect(payload[0].date).toBe('2026-04-01');
  }));

  it('should return correct originDestinationIndex', () => {
    component.currentOriginDestinationIndex = 0;
    expect(component.originDestinationIndex).toBe(1);

    component.currentOriginDestinationIndex = 2;
    expect(component.originDestinationIndex).toBe(3);
  });

  it('should render SPECIAL_DISCOUNTS heading when relatedContent has SPECIAL_DISCOUNTS', () => {
    component.relatedContent = {
      SPECIAL_DISCOUNTS: 'Descuento especial'
    };

  fixture.detectChanges();

  const h2: HTMLElement | null =
    fixture.nativeElement.querySelector('.ib-heading--subtitle');

  expect(h2).not.toBeNull();
  expect(h2?.textContent).toContain('Descuento especial');
});



it('should render pets subtitle', () => {
  component.isPetsFlow = true;

  fixture.detectChanges();

  const subtitle =
    fixture.nativeElement.querySelector('.ib-subtitle-pets-flow');

  expect(subtitle).not.toBeNull();
});

});
