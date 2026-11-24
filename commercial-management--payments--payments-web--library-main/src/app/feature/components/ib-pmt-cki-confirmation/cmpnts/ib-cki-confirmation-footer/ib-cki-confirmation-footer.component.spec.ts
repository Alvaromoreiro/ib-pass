import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';

import { CommonsSessionStorageService } from 'ib-web-commons/utils';

import { IbCkiConfirmationFooterComponent } from './ib-cki-confirmation-footer.component';
import { IIBCheckInDisruptionContactApis } from 'src/app/core/models/ib-check-in-disruption-contact.model';

@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = 'translate';

    public transform (query: string, ...args: any[]): any {
        return query;
    }
}

const CommonsSessionStorageServiceMock = {
    get: jasmine.createSpy('get')
};

describe('IbCkiConfirmationFooterComponent', () => {
    let component: IbCkiConfirmationFooterComponent;
    let fixture: ComponentFixture<IbCkiConfirmationFooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbCkiConfirmationFooterComponent, TranslatePipeMock],
            providers: [
                { provide: CommonsSessionStorageService, useValue: CommonsSessionStorageServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbCkiConfirmationFooterComponent);
        component = fixture.componentInstance;

        component.props = {
            checkCompany: true,
            cabinClassTypeLabel: 'Economy',
            segment: {
                seatList: '12A',
                passengers: []
            } as CheckinConfirmationModel.BoardingCards,
            showInhibitPassengers: false,
            isCC: false,
            inhibitStorage: false,
            showBiometricActive: false,
            isBpSubscriptionMode: false
        };

        fixture.detectChanges();
    });

    it('should create', () => {
        const banner = fixture.nativeElement.querySelector('.ib-ticket-flights__seats');

        expect(component).toBeTruthy();
        expect(banner).toBeTruthy();
    });

    describe('checkSeatList', () => {

        const setup = (value?: string) => {
            component.props.segment = {
                seatList: value
            } as CheckinConfirmationModel.BoardingCards;

            return component.checkSeatList();
        };

        it('should return seatList if exists', () => {
            const result = setup('12A');

            expect(result).toBe('12A');
        });

        it('should return undefined if seatList does not exist', () => {
            const result = setup(undefined);

            expect(result).toBe('');
        });

        it('should return undefined if seatList does not exist', () => {
            component.props.segment = undefined;

            const result = component.checkSeatList();

            expect(result).toBe('');
        });
    });

    describe('showSeatInhibit', () => {
        const setup = (passengerOverrides: Partial<CheckinConfirmationModel.TBoardingCardsPassengers> = {}) => {
            const passenger = {
                seat: {
                    row: '12',
                    column: 'A'
                },
                ...passengerOverrides
            } as CheckinConfirmationModel.TBoardingCardsPassengers;

            return component.showSeatInhibit(passenger);
        };

        it('should return true when seat row and column exist', () => {
            expect(setup()).toBeTrue();
        });

        it('should return false when row is empty', () => {
            expect(
                setup({
                    seat: { row: '', column: 'A' }
                })
            ).toBeFalse();
        });

        it('should return false when column is empty', () => {
            expect(
                setup({
                    seat: { row: '12', column: '' }
                })
            ).toBeFalse();
        });

        it('should return false when seat is undefined', () => {
            expect(
                setup({
                    seat: undefined
                })
            ).toBeFalse();
        });

        it('should return false when passenger is undefined', () => {
            expect(
                component.showSeatInhibit(undefined)
            ).toBeFalse();
        });
    });

    describe('OnInit', () => {
        const setup = ({ disruptionContact = true, passengerSeat = true }: { disruptionContact?: boolean, passengerSeat?: boolean }) => {
            const expectedValues: Record<string, CheckinConfirmationModel.IFooterValues> = {
                '1': {
                    passengerName: 'federico garcia',
                    passengerSeat: passengerSeat ? 'Turista 12A' : ' ',
                    mail: disruptionContact ? 'test@test.com' : ''
                }
            };

            disruptionContact && CommonsSessionStorageServiceMock.get.and.returnValue([
                {
                    id: 1,
                    disruptionContact: {
                        email: 'test@test.com'
                    }
                } as IIBCheckInDisruptionContactApis
            ]);

            component.props.segment.passengers = [
                {
                    id: '1',
                    name: 'Federico',
                    surname: 'Garcia',
                    cabinClass: passengerSeat ? {
                        code: 'Turista',
                        description: 'Turista',
                        type: 'Turista'
                    } : undefined,
                    seat: passengerSeat ? {
                        row: '12',
                        column: 'A'
                    } : undefined
                } as CheckinConfirmationModel.TBoardingCardsPassengers
            ];
            fixture.detectChanges();

            component.ngOnInit();

            return { expectedValues };
        };

        beforeEach(() => {
            CommonsSessionStorageServiceMock.get.and.stub();
        });

        it('should set component values when initialized', () => {
            const { expectedValues } = setup({});

            expect(component.values).toEqual(expectedValues);
        });

        it('should set empty string in mail when disruption contact is not available', () => {
            const { expectedValues } = setup({ disruptionContact: false });

            expect(component.values).toEqual(expectedValues);
        });

        it('should set empty string in passenger seat when passenger seat is not available', () => {
            const { expectedValues } = setup({ passengerSeat: false });

            expect(component.values).toEqual(expectedValues);
        });
    });
});
