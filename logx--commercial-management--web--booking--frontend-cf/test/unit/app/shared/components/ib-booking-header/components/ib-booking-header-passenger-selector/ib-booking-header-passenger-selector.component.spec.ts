import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingHeaderPassengerSelectorComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-passenger-selector/ib-booking-header-passenger-selector.component';
import { SeekerPassengerModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { TranslateModule } from '@ngx-translate/core';

describe('IbBookingHeaderPassengerSelectorComponent', () => {
  let component: IbBookingHeaderPassengerSelectorComponent;
  let fixture: ComponentFixture<IbBookingHeaderPassengerSelectorComponent>;

  const makePassenger = (
    overrides: Partial<SeekerPassengerModel> & {
      passengerType: string;
      count: number;
    }
  ): SeekerPassengerModel =>
    ({
      passengerType: overrides.passengerType,
      count: overrides.count,
      minPassenger: overrides.minPassenger ?? 0,
      maxPassengers: overrides.maxPassengers ?? 9,
      isActive: overrides.isActive ?? true,
      isHidden: overrides.isHidden ?? false,
      showMessage: overrides.showMessage ?? false,
      infoAge: '',
    } as any);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [IbBookingHeaderPassengerSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IbBookingHeaderPassengerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    describe('Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });


    describe('Toggle and ariaText', () => {
        it('toggle() should open/close and update collapsed', () => {
            expect(component.isOpen).toBeFalse();
            expect(component.isCollapsed).toBeTrue();

            component.toggle();
            expect(component.isOpen).toBeTrue();
            expect(component.isCollapsed).toBeFalse();

            component.toggle();
            expect(component.isOpen).toBeFalse();
            expect(component.isCollapsed).toBeTrue();
        });

        it('ariaText should reflect isOpen state', () => {
            component.isOpen = false;
            expect(component.ariaText).toBe('HEADER_ADVANCED_SEARCH_PASSENGERS_CLOSED');

            component.isOpen = true;
            expect(component.ariaText).toBe('HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED');
        });
    });

    describe('Keyboard and document events', () => {
        it('should close on Escape key', () => {
            component.isOpen = true;
            component.controlCollapse(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(component.isOpen).toBeFalse();

            component.isOpen = true;
            component.onDocumentKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(component.isOpen).toBeFalse();
        });

        it('should close when clicking outside selector', () => {
            component.isOpen = true;
            const outside = document.createElement('div');
            component.onDocumentClick({ target: outside } as any);
            expect(component.isOpen).toBeFalse();
        });

        it('should NOT close when clicking inside selector', () => {
            component.isOpen = true;

            const container = document.createElement('div');
            container.classList.add('ib-passenger--selector');
            const inside = document.createElement('span');
            container.appendChild(inside);

            component.onDocumentClick({ target: inside } as any);
            expect(component.isOpen).toBeTrue();
        });
    });


    describe('Passenger recalculation', () => {
        it('should recalculate totals on ngOnChanges', () => {
            component.passengersTypes = [
                makePassenger({ passengerType: 'ADULT', count: 1, minPassenger: 1 }),
                makePassenger({ passengerType: 'CHILD', count: 1 }),
                makePassenger({ passengerType: 'INFANT', count: 1 }),
                makePassenger({ passengerType: 'YOUNG', count: 0 }),
            ];

            component.ngOnChanges({
                passengersTypes: {
                currentValue: component.passengersTypes,
                previousValue: [],
                firstChange: true,
                isFirstChange: () => true,
                },
            } as any);

            expect(component.totalPassengers).toBe(3);
            expect(component.passengersCount).toBe(2);
        });

        [
        {
            description: 'enforces INFANT <= ADULT',
            passengers: [
            makePassenger({ passengerType: 'ADULT', count: 1, minPassenger: 1 }),
            makePassenger({ passengerType: 'INFANT', count: 3 }),
            ],
            expectedInfants: 1,
        },
        {
            description: 'sets onlyTeenager when only YOUNG passengers exist',
            passengers: [
            makePassenger({ passengerType: 'ADULT', count: 0, minPassenger: 1 }),
            makePassenger({ passengerType: 'YOUNG', count: 1 }),
            ],
            onlyTeenager: true,
        },].forEach(({ description, passengers, expectedInfants, onlyTeenager }) => {
        it(description, () => {
            component.passengersTypes = passengers;
            (component as any).recalculatePassengersState();

            if (expectedInfants !== undefined) {
            const infant = component.passengersTypes.find(
                p => p.passengerType === 'INFANT'
            )!;
            expect(infant.count).toBe(expectedInfants);
            }

            if (onlyTeenager !== undefined) {
            expect(component.onlyTeenager).toBe(onlyTeenager);
            }
        });
      });
    });

    describe('addPassenger()', () => {[
        {
            description: 'increments and emits when under maxPassengers',
            passenger: makePassenger({ passengerType: 'ADULT', count: 1, minPassenger: 1 }),
            expectedCount: 2,
            shouldEmit: true,
        },
        {
            description: 'does not increment or emit when reaching maxPassengers',
            passenger: makePassenger({
            passengerType: 'ADULT',
            count: 9,
            minPassenger: 1,
            maxPassengers: 9,
            }),
            expectedCount: 9,
            shouldEmit: false,
        },
        ].forEach(({ description, passenger, expectedCount, shouldEmit }) => {
            it(description, () => {
                spyOn(component.passengersChange, 'emit');
                component.passengersTypes = [passenger];

                component.addPassenger(passenger);

                expect(passenger.count).toBe(expectedCount);

                if (shouldEmit) {
                expect(component.passengersChange.emit).toHaveBeenCalled();
                } else {
                expect(component.passengersChange.emit).not.toHaveBeenCalled();
                }
            });
        });
    });

    describe('removePassenger()', () => {
        [
        {
            description: 'does not decrement below minPassenger',
            passenger: makePassenger({ passengerType: 'ADULT', count: 1, minPassenger: 1 }),
            expectedCount: 1,
            shouldEmit: false,
        },
        {
            description: 'decrements and emits when above minPassenger',
            passenger: makePassenger({ passengerType: 'ADULT', count: 2, minPassenger: 1 }),
            expectedCount: 1,
            shouldEmit: true,
        },
        ].forEach(({ description, passenger, expectedCount, shouldEmit }) => {
            it(description, () => {
                spyOn(component.passengersChange, 'emit');
                component.passengersTypes = [passenger];

                component.removePassenger(passenger);

                expect(passenger.count).toBe(expectedCount);

                if (shouldEmit) {
                expect(component.passengersChange.emit).toHaveBeenCalled();
                } else {
                expect(component.passengersChange.emit).not.toHaveBeenCalled();
                }
            });
        });
    });


    describe('Getters', () => {
        it('maxChilds returns value from passengerCondition', () => {
            (component as any).passengerCondition.maxChilds = 4;
            expect(component.maxChilds).toBe(4);
        });

        it('maxInfants returns totalAdults from passengerCondition', () => {
            (component as any).passengerCondition.totalAdults = 2;
            expect(component.maxInfants).toBe(2);
        });

        [
        {
            description: 'returns maxPassengers when ADULT exists',
            passengers: [makePassenger({ passengerType: 'ADULT', count: 1, maxPassengers: 6 })],
            expected: 6,
        },
        {
            description: 'returns default 9 when ADULT does not exist',
            passengers: [makePassenger({ passengerType: 'CHILD', count: 1 })],
            expected: 9,
        },
        ].forEach(({ description, passengers, expected }) => {
            it(description, () => {
                component.passengersTypes = passengers;
                expect(component.maxTotalPassengers).toBe(expected);
            });
        });
    });


    describe('Reset and empty passengers', () => {
        [
        {
        description: 'resetPassengerCondition resets state',
        action: () => {
            (component as any).resetPassengerCondition();
        }
        },
        {
        description: 'recalculatePassengersState resets and exits when empty',
        action: () => {
            component.passengersTypes = [];
            (component as any).recalculatePassengersState();
        }
        }
        ].forEach(({ description, action }) => {
            it(description, () => {
                (component as any).passengerCondition = {
                    passengersCount: 5,
                    passengersWithInfants: 5,
                    totalAdults: 2,
                    maxChilds: 4
                };
                (component as any)._onlyTeenager = true;

                action();


                expect((component as any).passengerCondition).toEqual({
                    passengersCount: 0,
                    passengersWithInfants: 0,
                    totalAdults: 0,
                    maxChilds: 0
                });
                expect(component.onlyTeenager).toBeFalse();
            });
        });
    });

});