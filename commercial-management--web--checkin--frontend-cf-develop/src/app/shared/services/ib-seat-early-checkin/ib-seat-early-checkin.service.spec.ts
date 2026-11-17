import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbSeatEarlyCheckinService } from './ib-seat-early-checkin.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

describe('IbSeatEarlyCheckinService', () => {
    const bookingInfoKey = 'bookingInfo';
    const selectedSegmentsKey = 'segmentsSelected';
    const firstEarlyMapKey = 'isFirstEarlyMap';
    const pendingSegmentSeatsKey = 'pendingSegmentSeats';
    const isEarlyKey = 'isEarly';

    let service: IbSeatEarlyCheckinService;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let storageValues: Record<string, unknown>;

    beforeEach(() => {
        storageValues = {};

        sessionStorageService = jasmine.createSpyObj<CommonsSessionStorageService>('CommonsSessionStorageService', ['get', 'set']);

        sessionStorageService.get.and.callFake(<T>(key: string): T => (storageValues[key] ?? null) as T);

        service = new IbSeatEarlyCheckinService(sessionStorageService);
    });

    const createSelectableEntity = (id: number, isSelected: boolean): CkiBookingInfo.SelectableEntity => ({
        id,
        isSelected
    });

    const createPassenger = (
        id: number,
        options: {
            seat?: CkiBookingInfo.Seat | null;
            statusCode?: string;
        } = {},
    ): CkiBookingInfo.PassengerDetails =>
        ({
            id,
            seat: options.seat ?? null,
            status: {
                code: options.statusCode ?? 'AVAILABLE'
            }
        }) as CkiBookingInfo.PassengerDetails;

    const createSegment = (id: number, passengers: CkiBookingInfo.PassengerDetails[]): CkiBookingInfo.Segment =>
        ({
            id,
            passengers
        }) as CkiBookingInfo.Segment;

    const createBookingInfo = (
        checkinSegmentsInGroup: number[],
        outwardSegments: CkiBookingInfo.Segment[] = [],
        returnSegments: CkiBookingInfo.Segment[] = [],
    ): CkiBookingInfo.BookingInfo =>
        ({
            checkinSegmentsInGroup,
            outwardSegments,
            returnSegments
        }) as CkiBookingInfo.BookingInfo;

    const setBookingInfo = (bookingInfo: CkiBookingInfo.BookingInfo | null): void => {
        storageValues[bookingInfoKey] = bookingInfo;
    };

    const getSetCall = (key: string): unknown[] | undefined =>
        sessionStorageService.set.calls.allArgs().find(([storedKey]: unknown[]) => storedKey === key);

    describe('checkEarlySegments', () => {
        it('should save false and an empty pending seats list when booking info does not exist', () => {
            setBookingInfo(null);

            const result = service.checkEarlySegments([]);

            expect(result).toBeFalse();
            expect(sessionStorageService.set).toHaveBeenCalledWith(isEarlyKey, false);
            expect(sessionStorageService.set).toHaveBeenCalledWith(pendingSegmentSeatsKey, []);
            expect(sessionStorageService.get).not.toHaveBeenCalledWith(selectedSegmentsKey);
        });

        it('should save false when selected segments do not match the check-in group', () => {
            setBookingInfo(createBookingInfo([10, 20]));

            const passengers = [createSelectableEntity(1, true)];

            const selectedSegments = [createSelectableEntity(10, true)];

            const result = service.checkEarlySegments(passengers, selectedSegments);

            expect(result).toBeFalse();
            expect(sessionStorageService.set).toHaveBeenCalledWith(isEarlyKey, false);
            expect(sessionStorageService.set).toHaveBeenCalledWith(pendingSegmentSeatsKey, []);
            expect(sessionStorageService.get).not.toHaveBeenCalledWith(firstEarlyMapKey);
        });

        it('should consider different segment order as a non-early flow', () => {
            setBookingInfo(createBookingInfo([10, 20]));

            const passengers = [createSelectableEntity(1, true)];

            const selectedSegments = [createSelectableEntity(20, true), createSelectableEntity(10, true)];

            const result = service.checkEarlySegments(passengers, selectedSegments);

            expect(result).toBeFalse();
            expect(sessionStorageService.set).toHaveBeenCalledWith(pendingSegmentSeatsKey, []);
        });

        it('should use selected segments stored in session when they are not provided', () => {
            const bookingInfo = createBookingInfo([10]);

            setBookingInfo(bookingInfo);

            storageValues[selectedSegmentsKey] = [createSelectableEntity(10, true)];

            storageValues[firstEarlyMapKey] = true;

            const result = service.checkEarlySegments([]);

            expect(result).toBeTrue();
            expect(sessionStorageService.get).toHaveBeenCalledWith(selectedSegmentsKey);
            expect(sessionStorageService.set).toHaveBeenCalledWith(isEarlyKey, true);
            expect(sessionStorageService.set).toHaveBeenCalledWith(pendingSegmentSeatsKey, []);
        });

        it('should save pending seats for selected available passengers without seats', () => {
            const unavailableStatus = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.NOT_AVAILABLE[0];

            const outwardSegment = createSegment(10, [
                createPassenger(1),
                createPassenger(2, {
                    seat: {
                        row: '12',
                        column: 'A'
                    }
                }),
                createPassenger(3, {
                    statusCode: unavailableStatus
                }),
                createPassenger(4)
            ]);

            const returnSegment = createSegment(20, [createPassenger(1), createPassenger(5)]);

            const bookingInfo = createBookingInfo([20, 10], [outwardSegment], [returnSegment]);

            setBookingInfo(bookingInfo);
            storageValues[firstEarlyMapKey] = null;

            const passengers = [
                createSelectableEntity(1, true),
                createSelectableEntity(2, true),
                createSelectableEntity(3, true),
                createSelectableEntity(4, false),
                createSelectableEntity(5, false)
            ];

            const selectedSegments = [createSelectableEntity(20, true), createSelectableEntity(10, true)];

            const result = service.checkEarlySegments(passengers, selectedSegments);

            expect(result).toBeTrue();
            expect(sessionStorageService.set).toHaveBeenCalledWith(firstEarlyMapKey, true);
            expect(sessionStorageService.set).toHaveBeenCalledWith(isEarlyKey, true);
            expect(sessionStorageService.set).toHaveBeenCalledWith(pendingSegmentSeatsKey, [
                {
                    segmentId: 20,
                    pasId: 1,
                    isCompleted: false,
                    isLast: false
                },
                {
                    segmentId: 10,
                    pasId: 1,
                    isCompleted: false,
                    isLast: false
                }
            ]);
        });

        it('should not overwrite the first early map value when it already exists', () => {
            const bookingInfo = createBookingInfo([10], [createSegment(10, [])]);

            setBookingInfo(bookingInfo);
            storageValues[firstEarlyMapKey] = true;

            const result = service.checkEarlySegments([], [createSelectableEntity(10, true)]);

            expect(result).toBeTrue();
            expect(sessionStorageService.set).not.toHaveBeenCalledWith(firstEarlyMapKey, true);
        });

        it('should ignore segments that do not exist in booking information', () => {
            const bookingInfo = createBookingInfo([10, 99], [createSegment(10, [createPassenger(1)])]);

            setBookingInfo(bookingInfo);
            storageValues[firstEarlyMapKey] = true;

            const result = service.checkEarlySegments(
                [createSelectableEntity(1, true)],
                [createSelectableEntity(10, true), createSelectableEntity(99, true)],
            );

            expect(result).toBeTrue();
            expect(getSetCall(pendingSegmentSeatsKey)).toEqual([
                pendingSegmentSeatsKey,
                [
                    {
                        segmentId: 10,
                        pasId: 1,
                        isCompleted: false,
                        isLast: false
                    }
                ]
            ]);
        });

        it('should save an empty pending seats list when no passenger requires a seat', () => {
            const segment = createSegment(10, [
                createPassenger(1, {
                    seat: {
                        row: '8',
                        column: 'C'
                    }
                })
            ]);

            setBookingInfo(createBookingInfo([10], [segment]));
            storageValues[firstEarlyMapKey] = true;

            const result = service.checkEarlySegments([createSelectableEntity(1, true)], [createSelectableEntity(10, true)]);

            expect(result).toBeTrue();
            expect(sessionStorageService.set).toHaveBeenCalledWith(pendingSegmentSeatsKey, []);
        });
    });
});
