import { DateFormatPipe, DateFormatResult } from '@src/app/shared/pipes/date-format.pipe';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbAncillariesPaymentUtilsService } from './ib-ancillaries-payment-utils.service';
import { IbPassengerBookingUtilsService } from './ib-passenger-booking-utils.service';
import type {
    AncillaryItem,
    BobOrder,
    CancelData,
    FareFamily,
    HeaderSegmentInfo,
    PassengerHeaderCounters,
    SegmentInfo,
    UpgradeOfferSegment,
    UpgradingAncillary,
    UpgradingTrip
} from '../../../core/models/ib-utils.model';

interface AirportFixture {
    code: string;
    description: string;
    country?: string;
}

interface SegmentFixture {
    id?: number;
    origin: AirportFixture;
    destination: AirportFixture;
    departureDate?: string;
    type?: string;
}

interface PassengerFixture {
    type: string;
    infant?: CkiBookingInfo.Infant | null;
    pendingPayment?: boolean;
}

interface BookingSegmentFixture {
    id: number;
    type?: string;
    departure: { airport: CkiBookingInfo.Airport; date: string };
    arrival: { airport: CkiBookingInfo.Airport };
}

const mockData = {
    openAirShuttleSegment: {
        type: CheckinAppConstants.SHUTTLE_SEGMENTS_TYPES.OPEN,
        origin: {
            code: 'MAD',
            description: 'Madrid'
        },
        destination: {
            code: 'BCN',
            description: 'Barcelona'
        }
    },
    scheduledAirShuttleSegment: {
        type: 'SCHEDULED',
        origin: {
            code: 'BCN',
            description: 'Barcelona'
        },
        destination: {
            code: 'PMI',
            description: 'Palma'
        }
    },
    outwardTripSegment: {
        origin: {
            code: 'PMI',
            description: 'Palma'
        },
        destination: {
            code: 'LHR',
            description: 'London Heathrow'
        }
    },
    returnTripSegment: {
        origin: {
            code: 'LHR',
            description: 'London Heathrow'
        },
        destination: {
            code: 'MAD',
            description: 'Madrid'
        }
    }
};

describe('IbAncillariesPaymentUtilsService', () => {
    let service: IbAncillariesPaymentUtilsService;
    let CommonsSessionStorageService: jasmine.SpyObj<Pick<CommonsSessionStorageService, 'get' | 'set'>>;
    let IbPassengerBookingUtilsService: jasmine.SpyObj<IbPassengerBookingUtilsService>;
    let DateFormatPipe: jasmine.SpyObj<DateFormatPipe>;
    let CurrencyService: jasmine.SpyObj<CurrencyService>;

    const dateFormatResult: DateFormatResult = {
        weekDay: 'WEEKDAY_MONDAY',
        monthDay: 3,
        monthNumber: 2,
        month: 'MONTH_FEBRUARY',
        year: 2025,
        dateTime: ''
    };

    const createAirport = (airport: AirportFixture): CkiBookingInfo.Airport => ({
        code: airport.code,
        description: airport.description,
        country: airport.country ?? 'ES'
    });

    const createSegment = (segment: SegmentFixture): BookingSegmentFixture => ({
        id: segment.id ?? 1,
        type: segment.type,
        departure: {
            airport: createAirport(segment.origin),
            date: segment.departureDate ?? '2025-02-03T10:00:00'
        },
        arrival: {
            airport: createAirport(segment.destination)
        }
    });

    const createPassenger = (passenger: PassengerFixture): CkiBookingInfo.Passenger => ({
        id: 1,
        name: 'Test',
        surname: 'Passenger',
        type: passenger.type,
        resident: false,
        requiredInformation: [],
        optionalInformation: [],
        status: { code: 'OK' },
        pendingPayment: passenger.pendingPayment ?? false,
        ...(passenger.infant !== undefined ? { infant: passenger.infant } : {})
    } as unknown as CkiBookingInfo.Passenger);

    const createBookingInfo = (
        config: {
            passengers?: CkiBookingInfo.Passenger[];
            outwardSegments?: BookingSegmentFixture[];
            returnSegments?: BookingSegmentFixture[];
            airShuttleSegments?: BookingSegmentFixture[];
        } = {},
    ): CkiBookingInfo.BookingInfo =>
        ({
            passengers: config.passengers ?? [],
            outwardSegments: config.outwardSegments ?? [],
            returnSegments: config.returnSegments ?? [],
            airShuttleSegments: config.airShuttleSegments ?? []
        }) as unknown as CkiBookingInfo.BookingInfo;

    const createAncillaryItem = (
        config: {
            type?: string;
            orderId?: string;
            status?: string;
            bookingCode?: string;
            total?: number;
            bags?: number;
        } = {},
    ): AncillaryItem => ({
        type: config.type,
        orderId: config.orderId ?? 'ORDER-1',
        status: config.status ?? 'CONFIRMED',
        bookingCode: config.bookingCode ?? 'ABC123',
        total: config.total ?? 25,
        bags: config.bags ?? 1
    });

    const createUpgradeOfferSegment = (segmentId: number): UpgradeOfferSegment => ({
        segmentId,
        cabinClass: {
            description: 'Business'
        }
    });

    const expectedUpgradingTrips: UpgradingTrip[] = [
        {
            segmentId: 10,
            cabin: 'Business',
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
            segmentId: 20,
            cabin: 'Business',
            origin: {
                code: 'LHR',
                description: 'London Heathrow'
            },
            destination: {
                code: 'JFK',
                description: 'New York'
            }
        }
    ];

    const expectedHeaderTrips = [
        {
            originCode: 'BCN',
            destinyCode: 'PMI',
            dateFlight: '03/02/2025'
        },
        {
            originCode: 'PMI',
            destinyCode: 'LHR',
            dateFlight: '03/02/2025'
        },
        {
            originCode: 'LHR',
            destinyCode: 'MAD',
            dateFlight: '03/02/2025'
        }
    ];

    const getFailedPaymentsCancelData = (): CancelData => ({
        failedToDelete: [
            {
                type: CheckinAppConstants.ANCILLARIES_TYPES.SEAT,
                segments: [
                    {
                        error: {
                            description: 'Seat error. '
                        }
                    }
                ]
            },
            {
                type: CheckinAppConstants.ANCILLARIES_TYPES.BAGGAGE,
                pasengers: [
                    {
                        error: {
                            description: 'Baggage error. '
                        }
                    }
                ]
            },
            {
                type: CheckinAppConstants.ANCILLARIES_TYPES.UPGRADING,
                error: {
                    description: 'Upgrade error.'
                }
            },
            {
                type: 'UNKNOWN',
                error: {
                    description: 'Ignored error.'
                }
            }
        ]
    });

    const getUpgradingSegmentsInfo = (): SegmentInfo[] => [
        {
            id: '10',
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
            id: '20',
            origin: {
                code: 'LHR',
                description: 'London Heathrow'
            },
            destination: {
                code: 'JFK',
                description: 'New York'
            }
        }
    ];

    const getUpgradingAncillary = (): UpgradingAncillary => ({
        type: CheckinAppConstants.ANCILLARIES_TYPES.UPGRADING,
        total: 50,
        upgrading: {
            offerSegmentsClass: [createUpgradeOfferSegment(10), createUpgradeOfferSegment(20)]
        }
    });

    const getHeaderSegments = (): CkiBookingInfo.Segment[] => ([
        {
            departure: {
                airportCode: 'MAD',
                airportDescription: 'Madrid',
                cityCode: 'MAD',
                originalDate: '2025-02-03T10:00:00',
                date: {
                    year: 2025,
                    monthNumber: 2,
                    monthDay: 3
                }
            },
            arrival: {
                airportCode: 'LHR',
                airportDescription: 'London Heathrow',
                cityCode: 'LHR',
                originalDate: '2025-02-03T12:00:00'
            }
        }
    ] as unknown as CkiBookingInfo.Segment[]);

    const getHeaderPassengers = (): CkiBookingInfo.Passenger[] => [
        createPassenger({
            type: CheckinAppConstants.PASSENGER_TYPE.ADULT,
            infant: null
        }),
        createPassenger({
            type: CheckinAppConstants.PASSENGER_TYPE.SENIOR,
            infant: null
        }),
        createPassenger({
            type: CheckinAppConstants.PASSENGER_TYPE.CHILD,
            infant: null
        }),
        createPassenger({
            type: CheckinAppConstants.PASSENGER_TYPE.INFANT,
            infant: { name: 'Infant', surname: 'Passenger' }
        }),
        createPassenger({
            type: CheckinAppConstants.PASSENGER_TYPE.YOUTH,
            infant: null
        })
    ];

    const getModel = (mockData) => {
        const { openAirShuttleSegment, scheduledAirShuttleSegment, outwardTripSegment, returnTripSegment } = mockData;
        return {
            openAirShuttleSegment: createSegment(openAirShuttleSegment),
            scheduledAirShuttleSegment: createSegment(scheduledAirShuttleSegment),
            outwardTripSegment: createSegment(outwardTripSegment),
            returnTripSegment: createSegment(returnTripSegment)
        };
    };
    const getConfig = () => {
        const { openAirShuttleSegment, scheduledAirShuttleSegment, outwardTripSegment, returnTripSegment } =
            getModel(mockData);
        return {
            airShuttleSegments: [openAirShuttleSegment, scheduledAirShuttleSegment],
            outwardSegments: [outwardTripSegment],
            returnSegments: [returnTripSegment]
        };
    };

    const getHeaderTripsBookingInfo = (): CkiBookingInfo.BookingInfo => createBookingInfo(getConfig());

    const configureUpgradingDependencies = (): void => {
        IbPassengerBookingUtilsService.getSegmentsInfo.and.returnValue(getUpgradingSegmentsInfo());

        CommonsSessionStorageService.get.and.returnValue({
            currency: {
                code: 'EUR'
            }
        });
    };

    const expectBobOrder = (): void => {
        const order = CommonsSessionStorageService.set.calls.mostRecent().args[1] as BobOrder;

        expect(order.id).toBe('BOB-1');
        expect(order.status).toBe('CONFIRMED');
        expect(order.bookingCode).toBe('ABC123');

        expect(order.summary[0]).toEqual(
            jasmine.objectContaining({
                status: 'CONFIRMED',
                amount: 35,
                email: 'CUSTOMER@EMAIL.COM'
            }),
        );

        expect(order.summary[0].products).toEqual([
            {
                type: 'checkin',
                quantity: 2,
                price: 35,
                tax: 0
            }
        ]);
    };

    const expectHeaderRoute = (headerInfo: HeaderSegmentInfo): void => {
        expect(headerInfo.originCity.code).toBe('MAD');
        expect(headerInfo.destinationCity.code).toBe('LHR');

        expect(headerInfo.dates).toEqual({
            outboundFlight: '2025-02-03',
            formatedOutboundFlight: '2025-02-03T00:00:00.000Z',
            returnFlight: '',
            formatedReturnFlight: ''
        });
    };

    const expectPassengerCounters = (headerInfo: PassengerHeaderCounters): void => {
        expect(headerInfo).toEqual(
            jasmine.objectContaining({
                passengers: 5,
                numAdults: 1,
                numSeniors: 1,
                numYoung: 1,
                numTeenager: 0,
                numInfant: 1,
                numChilds: 1,
                numberPassengrsWithoutInfant: 4
            }),
        );
    };

    beforeEach(() => {
        CommonsSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get', 'set']);
        IbPassengerBookingUtilsService = jasmine.createSpyObj('IbPassengerBookingUtilsService', ['getSegmentsInfo']);
        DateFormatPipe = jasmine.createSpyObj('DateFormatPipe', ['transform']);
        CurrencyService = jasmine.createSpyObj('CurrencyService', ['getCurrencyObject', 'formatPrice']);

        DateFormatPipe.transform.and.returnValue(dateFormatResult);
        CurrencyService.getCurrencyObject.and.callFake((currency: unknown) => currency as CommonsCurrencyModel.CurrencyObject);
        CurrencyService.formatPrice.and.returnValue('€50.00');

        service = new IbAncillariesPaymentUtilsService(
            CommonsSessionStorageService as unknown as CommonsSessionStorageService,
            IbPassengerBookingUtilsService,
            DateFormatPipe,
            CurrencyService,
        );
    });

    describe('checkPendingPayments', () => {
        it('should return false when booking information is missing', () => {
            expect(service.checkPendingPayments()).toBeFalse();
        });

        it('should return true when a passenger has a pending payment', () => {
            const bookingInfo = createBookingInfo({
                passengers: [
                    createPassenger({
                        type: CheckinAppConstants.PASSENGER_TYPE.ADULT
                    }),
                    createPassenger({
                        type: CheckinAppConstants.PASSENGER_TYPE.CHILD,
                        pendingPayment: true
                    })
                ]
            });

            expect(service.checkPendingPayments(bookingInfo)).toBeTrue();
        });
    });

    describe('checkFailedPendingPayments', () => {
        it('should concatenate the descriptions of supported failed items', () => {
            const result = service.checkFailedPendingPayments(getFailedPaymentsCancelData());

            expect(result).toBe('Seat error. Baggage error. Upgrade error.');
        });

        it('should return an empty string when no failed items exist', () => {
            expect(service.checkFailedPendingPayments()).toBe('');
        });
    });

    describe('setFareFamilyConditions', () => {
        it('should add only fare families that do not already exist', () => {
            const basicFareFamily = {
                commercialCode: 'BASIC',
                name: 'Basic'
            };
            const flexFareFamily = {
                commercialCode: 'FLEX',
                name: 'Flexible'
            };

            CommonsSessionStorageService.get.and.returnValue({
                BASIC: basicFareFamily
            });

            const fareFamilies: FareFamily[] = [basicFareFamily, flexFareFamily];
            const result = service.setFareFamilyConditions(fareFamilies);

            expect(result).toEqual({
                BASIC: basicFareFamily,
                FLEX: flexFareFamily
            });
            expect(CommonsSessionStorageService.set).toHaveBeenCalledWith('fareFamilyConditions', result);
        });
    });

    describe('setAncillariesCurrency', () => {
        it('should store the currency matching the booking issue currency', () => {
            const currencies = [
                {
                    code: 'EUR'
                },
                {
                    code: 'USD'
                }
            ];

            service.setAncillariesCurrency(
                currencies as unknown as Parameters<IbAncillariesPaymentUtilsService['setAncillariesCurrency']>[0],
                'EUR'
            );

            expect(CurrencyService.getCurrencyObject).toHaveBeenCalledWith(currencies[0]);
            expect(CommonsSessionStorageService.set).toHaveBeenCalledWith('currency', currencies[0]);
        });

        it('should not store a currency when the issue currency does not exist', () => {
            const currencies = [{ code: 'EUR' }] as unknown as Parameters<IbAncillariesPaymentUtilsService['setAncillariesCurrency']>[0];
            service.setAncillariesCurrency(currencies, 'GBP');

            expect(CurrencyService.getCurrencyObject).not.toHaveBeenCalled();
            expect(CommonsSessionStorageService.set).not.toHaveBeenCalled();
        });
    });

    describe('setAncillariesBob', () => {
        it('should store the integrated Buy on Board order', () => {
            const integratedBobItem = createAncillaryItem({
                type: CheckinAppConstants.ANCILLARIES_TYPES.INTEGRATED_BOB,
                orderId: 'BOB-1',
                total: 35,
                bags: 2
            });

            CommonsSessionStorageService.get.and.returnValue([
                {
                    disruptionContact: {
                        email: 'customer@email.com'
                    }
                }
            ]);

            service.setAncillariesBob([integratedBobItem]);

            expect(CommonsSessionStorageService.set).toHaveBeenCalledWith('bobOrder', jasmine.any(Object));
            expectBobOrder();
        });

        it('should not store an order when no integrated item exists', () => {
            service.setAncillariesBob([
                createAncillaryItem({
                    type: 'OTHER'
                })
            ]);

            expect(CommonsSessionStorageService.set).not.toHaveBeenCalled();
        });
    });

    describe('getHeaderUpgradingInfo', () => {
        it('should create the trips and format the total upgrading amount', () => {
            configureUpgradingDependencies();

            const result = service.getHeaderUpgradingInfo([getUpgradingAncillary()]);

            expect(result.upgradingTrips).toEqual(expectedUpgradingTrips);
            expect(result.total).toBe(50);
            expect(result.totalFormatted).toBe('€50.00');
        });

        it('should return an empty result when upgrading ancillaries do not exist', () => {
            IbPassengerBookingUtilsService.getSegmentsInfo.and.returnValue([]);

            expect(service.getHeaderUpgradingInfo([])).toEqual({
                upgradingTrips: [],
                total: null,
                totalFormatted: null
            });
        });
    });

    describe('getInfoHeader', () => {
        it('should create flight and passenger information for every segment', () => {
            const result = service.getInfoHeader(getHeaderSegments(), getHeaderPassengers());
            expect(result).toHaveSize(1);
            expectHeaderRoute(result[0]);
            expectPassengerCounters(result[0]);
        });
    });

    describe('generateHeaderTripsInfo', () => {
        it('should return an empty array when booking information does not exist', () => {
            CommonsSessionStorageService.get.and.returnValue(null);

            expect(service.generateHeaderTripsInfo()).toEqual([]);
        });

        it('should ignore open air shuttle segments and format the other routes', () => {
            CommonsSessionStorageService.get.and.returnValue(getHeaderTripsBookingInfo());

            const result = service.generateHeaderTripsInfo();

            expect(result).toEqual(expectedHeaderTrips);
            expect(DateFormatPipe.transform).toHaveBeenCalledTimes(3);
        });
    });
});
