import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbCPipeModule } from 'ib-web-commons/pipes';

import { FlightInfo } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';
import { IbBookingFareFamilyConditionsComponent } from '@src/app/pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-flight-info-on-hold-conf/components/ib-booking-fare-family-conditions/ib-booking-fare-family-conditions.component';
import { IbFlightInfoOnHoldConfComponent } from '@src/app/pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-flight-info-on-hold-conf/ib-flight-info-on-hold-conf.component';


class IbCModalServiceMock {
    showGenericComponentModal = jasmine
        .createSpy('showGenericComponentModal')
        .and.returnValue({
            result: Promise.resolve(),
            componentInstance: { model: {} }
        });
}

const mockFlightInfo: FlightInfo = {
    'outbound': {
        departureCity: {
            code: 'MAD',
            name: 'Adolfo Suárez Madrid-Barajas',
            terminal: 'T4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrivalCity: {
            code: 'BCN',
            name: 'Barcelona-El Prat',
            terminal: 'T1',
            city: {
                code: 'BCN',
                description: 'Barcelona',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        segments: [{
            departureCity: {
                code: 'MAD',
                name: 'Adolfo Suárez Madrid-Barajas',
                terminal: 'T4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrivalCity: {
                code: 'BCN',
                name: 'Barcelona-El Prat',
                terminal: 'T1',
                city: {
                    code: 'BCN',
                    description: 'Barcelona',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            departureDateParsed: {
                dateTime: '2024-01-01T10:00:00',
                weekDay: 'Lunes',
                day: 1,
                monthNumber: 1,
                month: 'Enero',
                year: 2024,
                originalDate: '2024-01-01',
                formatedDate: '01/01/2024'
            },
            companyURL: {
                logo: 'iberia.com',
                logoMin: null
            },
            overnight: false,
            departureDateTimeParsed: '2024-01-01T10:00:00',
            arrivalDateTimeParsed: '2024-01-01T12:00:00',
            departure: {
                code: 'MAD',
                name: 'Adolfo Suárez Madrid-Barajas',
                terminal: 'T4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrival: {
                code: 'BCN',
                name: 'Barcelona-El Prat',
                terminal: 'T1',
                city: {
                    code: 'BCN',
                    description: 'Barcelona',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            flight: {
                marketingCarrier: {
                    code: 'IB',
                    name: 'IBERIA'
                },
                operationalCarrier: {
                    code: 'IB',
                    name: 'IBERIA'
                },
                marketingFlightNumber: 'IB1234',
                operationalFlightNumber: 'IB1234',
                operationalDisclosure: 'Operado por Iberia',
                aircraft: {
                    code: '320',
                    description: 'Airbus A320'
                }
            },
            durationParsed: '2h 00m',
            arrive: true,
            cabin: {
                rbd: 'Y',
                description: 'Economy',
                remainingSeats: 9,
                fareFamily: 'BASIC',
                code: 'Y',
                type: 'ECONOMY',
                brandCode: 'BASIC',
                bookingClass: 'Y'
            },
            fareFamilyConditions: [{
                cabin: 'ECONOMY',
                cabinType: 'Y',
                code: 'BASIC',
                name: 'Básica',
                title: 'Tarifa Básica',
                message: 'Sin equipaje facturado',
                units: null
            }]
        }],
        departureDateParsed: {
            dateTime: '2024-01-01T10:00:00',
            weekDay: 'Lunes',
            day: 1,
            monthNumber: 1,
            month: 'Enero',
            year: 2024,
            originalDate: '2024-01-01',
            formatedDate: '01/01/2024'
        },
        arrive: true
    },
    'inbound': {
        departureCity: {
            code: 'MAD',
            name: 'Adolfo Suárez Madrid-Barajas',
            terminal: 'T4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrivalCity: {
            code: 'BCN',
            name: 'Barcelona-El Prat',
            terminal: 'T1',
            city: {
                code: 'BCN',
                description: 'Barcelona',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        segments: [{
            departureCity: {
                code: 'MAD',
                name: 'Adolfo Suárez Madrid-Barajas',
                terminal: 'T4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrivalCity: {
                code: 'BCN',
                name: 'Barcelona-El Prat',
                terminal: 'T1',
                city: {
                    code: 'BCN',
                    description: 'Barcelona',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            departureDateParsed: {
                dateTime: '2024-01-01T10:00:00',
                weekDay: 'Lunes',
                day: 1,
                monthNumber: 1,
                month: 'Enero',
                year: 2024,
                originalDate: '2024-01-08',
                formatedDate: '01/01/2024'
            },
            companyURL: {
                logo: 'iberia.com',
                logoMin: null
            },
            overnight: false,
            departureDateTimeParsed: '2024-01-01T10:00:00',
            arrivalDateTimeParsed: '2024-01-01T12:00:00',
            departure: {
                code: 'MAD',
                name: 'Adolfo Suárez Madrid-Barajas',
                terminal: 'T4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            arrival: {
                code: 'BCN',
                name: 'Barcelona-El Prat',
                terminal: 'T1',
                city: {
                    code: 'BCN',
                    description: 'Barcelona',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'España'
                    }
                }
            },
            flight: {
                marketingCarrier: {
                    code: 'IB',
                    name: 'IBERIA'
                },
                operationalCarrier: {
                    code: 'IB',
                    name: 'IBERIA'
                },
                marketingFlightNumber: 'IB1234',
                operationalFlightNumber: 'IB1234',
                operationalDisclosure: 'Operado por Iberia',
                aircraft: {
                    code: '320',
                    description: 'Airbus A320'
                }
            },
            durationParsed: '2h 00m',
            arrive: true,
            cabin: {
                rbd: 'Y',
                description: 'Economy',
                remainingSeats: 9,
                fareFamily: 'BASIC',
                code: 'Y',
                type: 'ECONOMY',
                brandCode: 'BASIC',
                bookingClass: 'Y'
            },
            fareFamilyConditions: [{
                cabin: 'ECONOMY',
                cabinType: 'Y',
                code: 'BASIC',
                name: 'Básica',
                title: 'Tarifa Básica',
                message: 'Sin equipaje facturado',
                units: null
            }]
        }],
        departureDateParsed: {
            dateTime: '2024-01-01T10:00:00',
            weekDay: 'Lunes',
            day: 1,
            monthNumber: 1,
            month: 'Enero',
            year: 2024,
            originalDate: '2024-01-09',
            formatedDate: '01/01/2024'
        },
        arrive: true
    }
};

describe('IbFlightInfoOnHoldConfComponent', () => {
    let component: IbFlightInfoOnHoldConfComponent;
    let fixture: ComponentFixture<IbFlightInfoOnHoldConfComponent>;

    const fakeIbCModalService = new IbCModalServiceMock();



    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbFlightInfoOnHoldConfComponent,
                IbBookingFareFamilyConditionsComponent

            ],
            providers: [
                { provide: IbCModalService, useValue: fakeIbCModalService }
            ],
            imports: [TranslateModule.forRoot(), IbBookingSharedModule, IbCPipeModule]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IbFlightInfoOnHoldConfComponent);
        component = fixture.componentInstance;
        component.flightInfo = mockFlightInfo;
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize iconsPath with BookingAppConstants.iconsRoute', () => {
        expect(component.iconsPath).toBe(BookingAppConstants.iconsRoute);
    });

    it('should set flightInfo input property', () => {
        component.flightInfo = mockFlightInfo;
        fixture.detectChanges();
        expect(component.flightInfo).toEqual(mockFlightInfo);
    });

    it('should render without errors when flightInfo is provided', () => {
        component.flightInfo = mockFlightInfo;
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled).toBeTruthy();
    });
});
