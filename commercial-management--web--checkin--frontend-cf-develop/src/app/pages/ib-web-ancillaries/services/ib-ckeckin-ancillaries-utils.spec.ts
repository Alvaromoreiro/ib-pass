import * as angular from 'angular';
import { CkiAncillariesUtilsService } from './ib-ckeckin-ancillaries-utils';

interface ILocalStorageMock {
    get: jasmine.Spy<(key: string) => unknown>;
    set: jasmine.Spy<(key: string, value: unknown) => void>;
    remove: jasmine.Spy<(key: string) => void>;
}

interface IAuthTokenServiceMock {
    refreshUserLoggedToken: jasmine.Spy<() => Promise<void>>;
    getAnonymousToken: jasmine.Spy<() => Promise<void>>;
}

interface ICurrencyServiceMock {
    formatPrice: jasmine.Spy<(currency: string, price: number, includeCurrency: boolean) => string>;
}

type DateFormatFilter = (date: string) => { formatedDate?: string } | null;

describe('CkiAncillariesUtilsService', () => {
    let service: CkiAncillariesUtilsService;
    let storage: Record<string, unknown>;
    let localStorageService: ILocalStorageMock;
    let constants: CheckinAncillariesConstants;
    let authTokenService: IAuthTokenServiceMock;
    let currencyService: ICurrencyServiceMock;
    let location: { path: jasmine.Spy };
    let windowService: { innerWidth: number; ontouchstart?: unknown };
    let filter: jasmine.Spy<(name: string) => DateFormatFilter>;

    beforeEach(() => {
        storage = {};
        localStorageService = {
            get: jasmine.createSpy('get') as jasmine.Spy<(key: string) => unknown>,
            set: jasmine.createSpy('set') as jasmine.Spy<(key: string, value: unknown) => void>,
            remove: jasmine.createSpy('remove') as jasmine.Spy<(key: string) => void>
        };
        localStorageService.get.and.callFake((key: string) => storage[key]);
        localStorageService.set.and.callFake((key: string, value: unknown) => { storage[key] = value; });
        localStorageService.remove.and.callFake((key: string) => { delete storage[key]; });
        constants = {
            PAGES_ROUTES: { SEARCH_LOGGED_BOOKING: '/ibcose2', SEARCH_BOOKING: '/ibcose' },
            SeatTypes: { seat: 'SEAT' },
            TYPE_ANCILLARIE: { SEAT: 'SEAT', SPECIAL_MEALS: 'SPECIAL_MEALS' },
            FLIGHT_PASSENGERS_STATUS_LIST: { NOT_AVAILABLE: ['UNCHECKABLE'] },
            ROUTES: { icons: '/icons/', creditCardLogoBaseRoute: 'cards/', defaultCreditCardLogo: 'default.svg' },
            CURRENCIES_TYPE_LONG: ['JPY', 'KRW']
        } as unknown as CheckinAncillariesConstants;
        authTokenService = {
            refreshUserLoggedToken: jasmine.createSpy('refreshUserLoggedToken').and.resolveTo(),
            getAnonymousToken: jasmine.createSpy('getAnonymousToken').and.resolveTo()
        };
        currencyService = {
            formatPrice: jasmine.createSpy('formatPrice').and.returnValue('EUR 10')
        };
        location = { path: jasmine.createSpy('path') };
        windowService = { innerWidth: 1024 };
        filter = jasmine.createSpy('$filter').and.callFake(() => () => ({ formatedDate: '01/02/2026' }));

        const q = {
            defer: () => {
                let resolvePromise = () => undefined;
                const promise = new Promise<void>(resolve => { resolvePromise = resolve; });
                return { promise, resolve: resolvePromise };
            }
        };
        service = new CkiAncillariesUtilsService(
            q as unknown as ng.IQService,
            {} as unknown as CommonsRootScope,
            localStorageService as unknown as angular.local.storage.ILocalStorageService,
            constants,
            windowService as unknown as ng.IWindowService,
            authTokenService,
            {} as unknown,
            currencyService as unknown as CurrencyService,
            location as unknown as ng.ILocationService,
            filter as unknown as ng.IFilterService
        );
    });

    it('refreshes the token for logged-in and anonymous users', async () => {
        storage['userLogged'] = true;
        await service.refreshToken();
        expect(authTokenService.refreshUserLoggedToken).toHaveBeenCalled();

        storage['userLogged'] = false;
        await service.refreshToken();
        expect(authTokenService.getAnonymousToken).toHaveBeenCalled();
    });

    it('returns configured endpoints and leaves missing endpoints undefined', () => {
        storage['endpoints'] = { ancillary: '/api/ancillary' };

        expect(service.getEndpoint('ancillary')).toBe('/api/ancillary');
        expect(service.getEndpoint('missing')).toBeUndefined();
    });

    it('calculates baggage and special equipment prices across quantity ranges', () => {
        const passengers = [{ trips: [{
            totalPrice: 99,
            pieces: [{
                quantySelected: 3,
                availablePriceRanges: [
                    { from: 1, to: 2, amount: 10 },
                    { from: 3, to: 4, amount: 15 }
                ]
            }]
        }] }];

        service.calculatePiecesBaggageTrip(passengers);
        expect(passengers[0].trips[0].totalPrice).toBe(35);

        service.calculatePiecesSpeqsTrip(passengers);
        expect(passengers[0].trips[0].totalPrice).toBe(35);
    });

    it('creates seat updates using the selected segment and clears absent seats', () => {
        storage['seatMapSegment'] = { segmentId: 'segment-1' };

        expect(service.generateUpdateSeatsMap([
            { id: 'passenger-1', seat: { row: 12, column: 'A' } },
            { id: 'passenger-2', seat: null }
        ])).toEqual([{
            type: 'SEAT',
            segments: [{
                id: 'segment-1',
                passengers: [
                    { id: 'passenger-1', seat: { row: 12, column: 'A' } },
                    { id: 'passenger-2', seat: null }
                ]
            }]
        }]);
    });

    it('updates cached seat coordinates only for the matching passenger and segment', () => {
        const bookingInfo = {
            order: {
                orderItems: [
                    { type: 'SEAT', segmentId: 'segment-1', passengerId: 'passenger-1', row: 4, column: 'A' },
                    { type: 'SEAT', segmentId: 'segment-2', passengerId: 'passenger-1', row: 8, column: 'B' },
                    { type: 'BAGGAGE', segmentId: 'segment-1', passengerId: 'passenger-1' }
                ]
            }
        };
        storage['bookingInfo'] = bookingInfo;

        service.updateSeatCachedInformation([{
            segments: [{ passengers: [{ id: 'passenger-1', seat: { row: 12, column: 'C' } }] }]
        }], 'segment-1');

        expect(bookingInfo.order.orderItems).toEqual([
            { type: 'SEAT', segmentId: 'segment-1', passengerId: 'passenger-1', row: 12, column: 'C' },
            { type: 'SEAT', segmentId: 'segment-2', passengerId: 'passenger-1', row: 8, column: 'B' },
            { type: 'BAGGAGE', segmentId: 'segment-1', passengerId: 'passenger-1' }
        ]);
        expect(localStorageService.set).toHaveBeenCalledWith('bookingInfo', bookingInfo);
    });

    it('updates seats in outward, return, and air-shuttle booking segments', () => {
        const bookingInfo = {
            outwardSegments: [{ id: 1, passengers: [{ id: 'p1', seat: null }] }],
            returnSegments: [{ id: 2, passengers: [{ id: 'p2', seat: null }] }],
            airShuttleSegments: [{ id: 3, passengers: [{ id: 'p3', seat: null }] }]
        };
        storage['bookingInfo'] = bookingInfo;

        service.updateCachedCheckinInformation([{ segments: [{ passengers: [{ id: 'p1', seat: { row: 10, column: 'A' } }] }] }], '1');
        service.updateCachedCheckinInformation([{ segments: [{ passengers: [{ id: 'p2', seat: { row: 11, column: 'B' } }] }] }], '2');
        service.updateCachedCheckinInformation([{ segments: [{ passengers: [{ id: 'p3', seat: { row: 12, column: 'C' } }] }] }], '3');

        expect(bookingInfo.outwardSegments[0].passengers[0].seat).toEqual({ row: 10, column: 'A' });
        expect(bookingInfo.returnSegments[0].passengers[0].seat).toEqual({ row: 11, column: 'B' });
        expect(bookingInfo.airShuttleSegments[0].passengers[0].seat).toEqual({ row: 12, column: 'C' });
    });

    it('reports whether a passenger is in the selected passenger list', () => {
        storage['passengersSelected'] = ['passenger-1', 'passenger-2'];

        expect(service.isPassengerSelected('passenger-1')).toBe(true);
        expect(service.isPassengerSelected('passenger-3')).toBe(false);
    });

    it('routes to the matching search page when a confirmation PNR exists', () => {
        storage['confirmationPNR'] = 'ABC123';
        storage['userLogged'] = true;

        expect(service.checkConfirmationPNR()).toBe('ABC123');
        expect(location.path).toHaveBeenCalledWith('/ibcose2');

        storage['userLogged'] = false;
        service.checkConfirmationPNR();
        expect(location.path).toHaveBeenCalledWith('/ibcose');

        storage['confirmationPNR'] = null;
        location.path.calls.reset();
        expect(service.checkConfirmationPNR()).toBeNull();
        expect(location.path).not.toHaveBeenCalled();
    });

    it('detects touch devices and the mobile width boundary', () => {
        windowService.ontouchstart = true;
        expect(service.isTouchDevice()).toBe(true);

        windowService.innerWidth = 767;
        expect(service.isResolutionToMobile()).toBe(true);
        windowService.innerWidth = 768;
        expect(service.isResolutionToMobile()).toBe(false);
    });

    it('stores, retrieves, and removes seat confirmation information', () => {
        const segmentInfo = { segmentId: 'segment-1', pasId: 'passenger-1' };
        const confirmation = { confirmed: true };

        service.setSegmentInfo(segmentInfo);
        storage['seatInfoConfirmation'] = confirmation;
        expect(service.getSegmentInfo()).toEqual(segmentInfo);
        expect(service.getSeatInfoConfirmation()).toBe(confirmation);

        service.removeSeatInfoConfirmation();
        expect(storage['seatInfoConfirmation']).toBeUndefined();
        expect(localStorageService.remove).toHaveBeenCalledWith('seatInfoConfirmation');
    });

    it('calculates pending seats for selected flight passengers in the early flow', () => {
        const bookingInfo = {
            checkinSegmentsInGroup: [2],
            outwardSegments: [{
                id: 2,
                typeOfTransport: 'FLIGHT',
                passengers: [{ id: 1, seat: null, status: { code: 'CHECKABLE' } }]
            }],
            returnSegments: []
        };
        storage['bookingInfo'] = bookingInfo;
        storage['isFirstEarlyMap'] = null;

        const isEarly = service.checkEarlySegments([1], [{ id: 2, isSelected: true }]);

        expect(isEarly).toBe(true);
        expect(storage['pendingSegmentSeats']).toEqual([{
            segmentId: 2, pasId: 1, isCompleted: false, isLast: false
        }]);
        expect(storage['isFirstEarlyMap']).toBe(true);
        expect(storage['earlyCheckinCode']).toBe(true);
    });

    it('does not create pending seats for trains or unavailable passengers', () => {
        const createBookingInfo = (typeOfTransport: string, status: string) => ({
            checkinSegmentsInGroup: [2],
            outwardSegments: [{
                id: 2, typeOfTransport,
                passengers: [{ id: 1, seat: null, status: { code: status } }]
            }],
            returnSegments: []
        });

        storage['bookingInfo'] = createBookingInfo('TRAIN', 'CHECKABLE');
        expect(service.checkEarlySegments([1], [{ id: 2, isSelected: true }])).toBe(false);

        storage['bookingInfo'] = createBookingInfo('FLIGHT', 'UNCHECKABLE');
        expect(service.checkEarlySegments([1], [{ id: 2, isSelected: true }])).toBe(false);
        expect(storage['pendingSegmentSeats']).toEqual([]);
    });

    it('returns the first pending segment and marks it last when appropriate', () => {
        storage['pendingSegmentSeats'] = [
            { segmentId: 2, pasId: 1, isCompleted: true, isLast: false },
            { segmentId: 4, pasId: 1, isCompleted: false, isLast: false }
        ];

        expect(service.getSegmentSeatsPending()).toEqual({
            segmentId: 4, pasId: 1, isCompleted: false, isLast: true
        });
    });

    it('formats cabin labels and falls back to tourist for unknown types', () => {
        expect(service.getCabinClassName('BUSINESS_PLUS')).toBe('CABIN_BUSINESS');
        expect(service.getCabinClassName('PREMIUMTOURIST')).toBe('CABIN_PREMIUM_TOURIST');
        expect(service.getCabinClassName('UNKNOWN')).toBe('CABIN_TOURIST');
    });

    it('returns the requested credit card icon or the default icon', () => {
        expect(service.getCreditCardIcon('VISA', [
            { cardTypeId: 'VISA', name: 'visa.svg' },
            { cardTypeId: 'MC', name: 'mastercard.svg' }
        ])).toBe('/icons/cards/visa.svg');
        expect(service.getCreditCardIcon('UNKNOWN', [])).toBe('/icons/cards/default.svg');
    });

    it('updates matching early-checking seats without duplicating passengers', () => {
        const passengers = [{ code: 'MADLHRPassenger', row: 1, column: 'A' }];
        const seatMapInfo = {
            segmentInfo: { departure: { code: 'MAD' }, arrival: { code: 'LHR' } },
            passengersInfo: [
                { name: 'Passenger', initialSeat: { row: 12, column: 'C' } },
                { name: 'Second Person', initialSeat: { row: 14, column: 'D' } }
            ]
        };

        expect(service.addEarlyChecking(seatMapInfo, passengers)).toEqual([
            { code: 'MADLHRPassenger', row: 12, column: 'C' },
            { code: 'MADLHRSecondPerson', row: 14, column: 'D' }
        ]);
    });

    it('formats dates from the configured filter and falls back to dayjs', () => {
        expect(service.formatDate('2026-02-01')).toBe('01/02/2026');
        filter.and.returnValue(() => null);
        expect(service.formatDate('2026-02-01')).toBe('01/02/2026');
    });
});