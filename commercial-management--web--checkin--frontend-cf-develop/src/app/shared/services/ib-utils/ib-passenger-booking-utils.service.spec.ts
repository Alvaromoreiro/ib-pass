import { IbPassengerBookingUtilsService } from './ib-passenger-booking-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

interface SegmentFixture {
    id: number;
    originCode: string;
    originDescription: string;
    destinationCode: string;
    destinationDescription: string;
}

describe('IbPassengerBookingUtilsService', () => {
    let service: IbPassengerBookingUtilsService;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;

    const createPassenger = (
        id: number,
        requiredInformation: string[] = [],
        optionalInformation: string[] = []
    ): CkiBookingInfo.Passenger => ({
        id,
        requiredInformation,
        optionalInformation
    } as CkiBookingInfo.Passenger);

    const createSegment = (segment: SegmentFixture): CkiBookingInfo.Segment => ({
        id: segment.id,
        departure: {
            airport: {
                code: segment.originCode,
                description: segment.originDescription
            }
        },
        arrival: {
            airport: {
                code: segment.destinationCode,
                description: segment.destinationDescription
            }
        }
    } as unknown as CkiBookingInfo.Segment);

    const createBookingInfo = (
        outwardSegments: CkiBookingInfo.Segment[] = [],
        returnSegments: CkiBookingInfo.Segment[] = [],
        airShuttleSegments: CkiBookingInfo.Segment[] = [],
        passengers: CkiBookingInfo.Passenger[] = [],
    ): CkiBookingInfo.BookingInfo =>
        ({
            outwardSegments,
            returnSegments,
            airShuttleSegments,
            passengers
        }) as unknown as CkiBookingInfo.BookingInfo;

    beforeEach(() => {
        sessionStorageService = jasmine.createSpyObj<CommonsSessionStorageService>('CommonsSessionStorageService', ['get', 'set']);

        service = new IbPassengerBookingUtilsService(sessionStorageService);
    });

    describe('getSegmentsInfo', () => {
        it('should return an empty array when booking info does not exist', () => {
            sessionStorageService.get.and.returnValue(null);

            const result = service.getSegmentsInfo();

            expect(result).toEqual([]);
            expect(sessionStorageService.get).toHaveBeenCalledWith('bookingInfo');
            expect(sessionStorageService.set).not.toHaveBeenCalled();
        });

        it('should map regular and valid air shuttle segments in the expected order', () => {
            const outwardSegment = createSegment({
                id: 1,
                originCode: 'MAD',
                originDescription: 'Madrid',
                destinationCode: 'LHR',
                destinationDescription: 'London Heathrow'
            });
            const returnSegment = createSegment({
                id: 2,
                originCode: 'LHR',
                originDescription: 'London Heathrow',
                destinationCode: 'MAD',
                destinationDescription: 'Madrid'
            });
            const airShuttleSegment = createSegment({
                id: 3,
                originCode: 'MAD',
                originDescription: 'Madrid',
                destinationCode: 'BCN',
                destinationDescription: 'Barcelona'
            });

            sessionStorageService.get.and.returnValue(
                createBookingInfo([outwardSegment], [returnSegment], [airShuttleSegment]),
            );

            const result = service.getSegmentsInfo();

            expect(result).toEqual([
                {
                    id: '1',
                    origin: {
                        code: 'MAD',
                        description: 'Madrid'
                    },
                    destination: {
                        code: 'LHR',
                        description: 'London Heathrow'
                    }
                },
                {
                    id: '2',
                    origin: {
                        code: 'LHR',
                        description: 'London Heathrow'
                    },
                    destination: {
                        code: 'MAD',
                        description: 'Madrid'
                    }
                },
                {
                    id: '3',
                    origin: {
                        code: 'MAD',
                        description: 'Madrid'
                    },
                    destination: {
                        code: 'BCN',
                        description: 'Barcelona'
                    }
                }
            ]);

            expect(sessionStorageService.set).toHaveBeenCalledWith('segmentsInfo', result);
        });

        it('should ignore invalid air shuttle segments', () => {
            const validAirShuttleSegment = createSegment({
                id: 3,
                originCode: 'MAD',
                originDescription: 'Madrid',
                destinationCode: 'VLC',
                destinationDescription: 'Valencia'
            });

            sessionStorageService.get.and.returnValue(
                createBookingInfo(
                    [],
                    [],
                    [
                        null,
                        undefined,
                        'invalid segment',
                        {},
                        { id: 4 },
                        {
                            id: 5,
                            departure: {
                                airport: {
                                    code: 'MAD',
                                    description: 'Madrid',
                                    country: 'ES'
                                }
                            },
                            arrival: {
                                airport: {
                                    code: '',
                                    description: 'Barcelona',
                                    country: 'ES'
                                }
                            }
                        },
                        validAirShuttleSegment
                    ] as unknown as CkiBookingInfo.Segment[],
                ),
            );

            const result = service.getSegmentsInfo();

            expect(result).toEqual([
                {
                    id: '3',
                    origin: {
                        code: 'MAD',
                        description: 'Madrid'
                    },
                    destination: {
                        code: 'VLC',
                        description: 'Valencia'
                    }
                }
            ]);
        });

        it('should save an empty array when booking info has no segments', () => {
            sessionStorageService.get.and.returnValue(createBookingInfo());

            const result = service.getSegmentsInfo();

            expect(result).toEqual([]);
            expect(sessionStorageService.set).toHaveBeenCalledWith('segmentsInfo', []);
        });
    });

    describe('updateSelectedSegments', () => {
        it('should read selected segment and booking info, then store checkable passenger ids', () => {
            const selectedSegment = {
                departureDateTime: '2026-10-26T10:00:00',
                arrivalDateTime: '2026-10-26T12:00:00'
            };
            const bookingInfo = createBookingInfo([], [], [{
                id: 8,
                departure: { date: selectedSegment.departureDateTime },
                arrival: { date: selectedSegment.arrivalDateTime },
                passengers: [
                    { id: 1, status: { code: 'CHECKED' } },
                    { id: 2, status: { code: 'UNCHECKABLE' } },
                    { id: 3, status: { code: 'CHECKABLE' } }
                ]
            } as unknown as CkiBookingInfo.Segment]);
            sessionStorageService.get.withArgs('newSelectedSegment').and.returnValue(selectedSegment);
            sessionStorageService.get.withArgs('bookingInfo').and.returnValue(bookingInfo);

            const result = service.updateSelectedSegments();

            expect(result).toEqual({
                isAllowed: true,
                newSegmentsId: [8],
                checkablePassengers: [1, 3]
            });
            expect(sessionStorageService.get).toHaveBeenCalledWith('newSelectedSegment');
            expect(sessionStorageService.get).toHaveBeenCalledWith('bookingInfo');
            expect(sessionStorageService.set).toHaveBeenCalledWith('passengersSelected', [1, 3]);
        });
    });

    describe('updateCachedInfo', () => {
        it('should save booking info and return no uncheckable segments for null input', () => {
            const bookingInfo = createBookingInfo();
            sessionStorageService.get.and.returnValue(bookingInfo);

            const result = service.updateCachedInfo(null);

            expect(result).toEqual([]);
            expect(sessionStorageService.set).toHaveBeenCalledWith('bookingInfo', bookingInfo);
        });

        it('should update cached passenger details and return unique uncheckable segment ids', () => {
            const cachedPassengerOne = { id: 1, seat: null, status: { code: 'CHECKABLE' } };
            const cachedPassengerTwo = { id: 2, seat: null, status: { code: 'CHECKABLE' } };
            const cachedSegment = {
                id: 8,
                cabinClass: { type: 'ECONOMY' },
                passengers: [cachedPassengerOne, cachedPassengerTwo]
            };
            const bookingInfo = createBookingInfo([cachedSegment as unknown as CkiBookingInfo.Segment]);
            const acceptedSegments = [{
                id: 8,
                cabinClass: { type: 'BUSINESS' },
                passengers: [
                    { id: 1, seat: '1A', status: 'UNCHECKABLE' },
                    { id: 2, seat: '1B', status: 'UNCHECKABLE' }
                ]
            }];
            sessionStorageService.get.and.returnValue(bookingInfo);

            const result = service.updateCachedInfo(acceptedSegments);

            expect(result).toEqual([8]);
            expect(cachedSegment.cabinClass).toEqual({ type: 'BUSINESS' });
            expect(cachedPassengerOne).toEqual({ id: 1, seat: '1A', status: { code: 'UNCHECKABLE' } });
            expect(cachedPassengerTwo).toEqual({ id: 2, seat: '1B', status: { code: 'UNCHECKABLE' } });
            expect(sessionStorageService.set).toHaveBeenCalledWith('bookingInfo', bookingInfo);
        });
    });

    describe('setAircraftDatalayer', () => {
        it('should return the aircraft from the last outward segment', () => {
            const bookingInfo = createBookingInfo([
                { aircraft: 'A320' } as unknown as CkiBookingInfo.Segment,
                { aircraft: 'A350' } as unknown as CkiBookingInfo.Segment
            ]);
            sessionStorageService.get.and.returnValue(bookingInfo);

            expect(service.setAircraftDatalayer()).toBe('A350');
            expect(sessionStorageService.get).toHaveBeenCalledWith('bookingInfo');
        });
    });

    describe('filterAdditionalInfo', () => {
        it('should keep allowed fields and remove fields not requested for the passenger', () => {
            const bookingInfo = createBookingInfo([], [], [], [
                createPassenger(1, ['GENDER'], ['CONTACT_DATA'])
            ]);
            const passengerInfo = {
                id: 1,
                gender: 'FEMALE',
                disruptionContact: { language: 'en', email: 'passenger@example.com' },
                frequentFlyer: { iataCompanyCode: 'IB', number: 'IB123' }
            };

            const result = service.filterAdditionalInfo(bookingInfo, [passengerInfo]);

            expect(result).toEqual({
                additionalInfo: [{
                    id: 1,
                    gender: 'FEMALE',
                    disruptionContact: { language: 'en', email: 'passenger@example.com' }
                }],
                needsUpdate: false
            });
            expect(passengerInfo.frequentFlyer).toBeUndefined();
        });

        it('should set needsUpdate when a selected passenger is missing required information', () => {
            sessionStorageService.get.and.returnValue([1]);
            const bookingInfo = createBookingInfo([], [], [], [
                createPassenger(1, ['CONTACT_DATA']),
                createPassenger(2, ['GENDER'])
            ]);

            const result = service.filterAdditionalInfo(bookingInfo, []);

            expect(result).toEqual({ additionalInfo: [], needsUpdate: true });
            expect(sessionStorageService.get).toHaveBeenCalledWith('passengersSelected');
        });

        it('should not require an update for an unselected passenger with missing required information', () => {
            const bookingInfo = createBookingInfo([], [], [], [
                createPassenger(1, ['CONTACT_DATA'])
            ]);

            const result = service.filterAdditionalInfo(bookingInfo);

            expect(result).toEqual({ additionalInfo: [], needsUpdate: false });
        });

        it('should preserve the original short-circuit after a required field is missing', () => {
            sessionStorageService.get.and.returnValue([1]);
            const bookingInfo = createBookingInfo([], [], [], [
                createPassenger(1, ['CONTACT_DATA']),
                createPassenger(2)
            ]);
            const passengerInfo = {
                id: 2,
                frequentFlyer: { iataCompanyCode: 'IB', number: 'IB123' }
            };

            const result = service.filterAdditionalInfo(bookingInfo, [passengerInfo]);

            expect(result).toEqual({
                additionalInfo: [{
                    id: 2,
                    frequentFlyer: { iataCompanyCode: 'IB', number: 'IB123' }
                }],
                needsUpdate: true
            });
            expect(passengerInfo.frequentFlyer).toBeDefined();
        });
    });

    describe('updateLanguageAdditionalInfo', () => {
        it('should update existing disruption contact languages and return the same array', () => {
            sessionStorageService.get.and.returnValue({ Language: 'es' });
            const additionalInfo = [
                { id: 1, disruptionContact: { language: 'en' } },
                { id: 2, disruptionContact: {} }
            ];

            const result = service.updateLanguageAdditionalInfo(additionalInfo);

            expect(result).toBe(additionalInfo);
            expect(additionalInfo[0].disruptionContact.language).toBe('es');
            expect(additionalInfo[1].disruptionContact.language).toBeUndefined();
            expect(sessionStorageService.get).toHaveBeenCalledWith('confirmationDigitalInfo');
        });

        it('should return non-array values unchanged without reading confirmation data', () => {
            const additionalInfo = { id: 1, disruptionContact: { language: 'en' } };

            const result = service.updateLanguageAdditionalInfo(additionalInfo);

            expect(result).toBe(additionalInfo);
            expect(sessionStorageService.get).not.toHaveBeenCalled();
        });
    });
});
