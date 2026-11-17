import { DOCUMENT } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';

import { IbUtilsService } from './ib-utils.service';
import { AJSWindow } from '@src/app/core/config/ib-checkin-app-tokens';
import {
    BookingStorageKey,
    GenericStorageKey
} from '@src/app/core/constants/ib-storage-keys.constants';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';

describe('IbUtilsService', () => {
    let service: IbUtilsService;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let mockRootScope: { appMarket?: string; appLang?: string };
    let mockWindow: {
        innerWidth: number;
        document: {
            title: string;
        };
        location: {
            href: string;
            pathname: string;
            search: string;
        };
    };
    let mockDocument: Document;

    beforeEach(() => {
        mockDocument = document.implementation.createHTMLDocument('Test document');

        mockWindow = {
            innerWidth: 1024,
            document: {
                title: ''
            },
            location: {
                href: `https://checkin.test/checkin?${CheckinAppConstants.URL_PARAMS.PAYMENT_STATUS}=OK`,
                pathname: '/checkin',
                search: '?paymentStatus=OK'
            }
        };

        sessionStorageService = jasmine.createSpyObj<CommonsSessionStorageService>(
            'CommonsSessionStorageService',
            ['get', 'set']
        );

        translateService = jasmine.createSpyObj<TranslateService>(
            'TranslateService',
            ['instant']
        );

        mockRootScope = { appMarket: 'ES', appLang: 'es' };

        TestBed.configureTestingModule({
            providers: [
                IbUtilsService,
                { provide: DOCUMENT, useValue: mockDocument },
                { provide: AJSWindow, useValue: mockWindow },
                { provide: TranslateService, useValue: translateService },
                { provide: CommonsSessionStorageService, useValue: sessionStorageService },
                { provide: AJSRootScope, useValue: mockRootScope }
            ]
        });

        service = TestBed.inject(IbUtilsService);
    });

    describe('getParameterByName', () => {
        it('should return the decoded value from the current URL', () => {
            mockWindow.location.href = 'https://checkin.test/?name=John+Doe';

            expect(service.getParameterByName({ name: 'name' }))
                .toBe('John Doe');
        });

        it('should return the value from the current URL when no URL is provided', () => {
            expect(service.getParameterByName({
                name: CheckinAppConstants.URL_PARAMS.PAYMENT_STATUS
            })).toBe('OK');
        });

        it('should return null when the parameter is not present', () => {
            mockWindow.location.href = 'https://checkin.test/';

            expect(service.getParameterByName({ name: 'missing' })).toBeNull();
        });
    });

    describe('getTravelAgencies', () => {
        it('should return null when the parameter is absent', () => {
            expect(service.getTravelAgencies(CheckinAppConstants.URL_PARAMS.CKI_AAVV))
                .toBeNull();
        });

        it('should parse true and false values without case sensitivity', () => {
            const parameter = CheckinAppConstants.URL_PARAMS.CKI_AAVV;

            mockWindow.location.href = `https://checkin.test/?${parameter}=TRUE`;
            expect(service.getTravelAgencies(parameter)).toBeTrue();

            mockWindow.location.href = `https://checkin.test/?${parameter}=False`;
            expect(service.getTravelAgencies(parameter)).toBeFalse();
        });
    });

    describe('generatePassengersQueryString', () => {
        it('should generate one query parameter for each passenger ID', () => {
            expect(service.generatePassengersQueryString(['1', '4', '7']))
                .toBe('?passengerId=1&passengerId=4&passengerId=7');
        });

        it('should return an empty string when there are no passenger IDs', () => {
            expect(service.generatePassengersQueryString([])).toBe('');
            expect(service.generatePassengersQueryString()).toBe('');
            expect(service.generatePassengersQueryString(null)).toBe('');
        });
    });

    describe('removeParameterURL', () => {
        it('should remove the payment success parameter', () => {
            expect(service.removeParameterURL('https://checkin.test/?paymentStatus=OK'))
                .toBe('https://checkin.test/?');
        });

        it('should remove the payment failure parameter', () => {
            expect(service.removeParameterURL('https://checkin.test/?paymentStatus=KO'))
                .toBe('https://checkin.test/?');
        });
    });

    describe('filterMarket', () => {
        it('should return the first two alphabetic characters', () => {
            expect(service.filterMarket('ENGLAND')).toBe('EN');
            expect(service.filterMarket('es_ES')).toBe('es');
        });

        it('should preserve values whose first two characters are not alphabetic', () => {
            expect(service.filterMarket('1A')).toBe('1A');
            expect(service.filterMarket('A1')).toBe('A1');
            expect(service.filterMarket('E')).toBe('E');
            expect(service.filterMarket('')).toBe('');
        });
    });

    describe('setTitlePage', () => {
        it('should translate and set the page title after the provided delay', fakeAsync(() => {
            translateService.instant.and.returnValue('Translated title');

            service.setTitlePage('page.title', 500);

            expect(mockWindow.document.title).toBe('');

            tick(500);

            expect(translateService.instant).toHaveBeenCalledWith('page.title');
            expect(mockWindow.document.title).toBe('Translated title');
        }));

        it('should use zero as the default delay', fakeAsync(() => {
            translateService.instant.and.returnValue('Immediate title');

            service.setTitlePage('page.title');

            tick();

            expect(mockWindow.document.title).toBe('Immediate title');
        }));
    });

    describe('getPassengerType', () => {
        it('should return the type of the matching passenger', () => {
            sessionStorageService.get.and.returnValue({
                passengers: [
                    { id: 'passenger-1', type: 'CHILD' },
                    { id: 'passenger-2', type: 'ADULT' }
                ]
            });

            const result = service.getPassengerType('passenger-1');

            expect(sessionStorageService.get).toHaveBeenCalledWith(BookingStorageKey.bookingInfo);
            expect(result).toBe('CHILD');
        });

        it('should return ADULT when the passenger is not found', () => {
            sessionStorageService.get.and.returnValue({
                passengers: [{ id: 'passenger-1', type: 'CHILD' }]
            });

            const result = service.getPassengerType('unknown-passenger');

            expect(result).toBe(CheckinAppConstants.PASSENGERS_TYPES.ADULT);
        });
    });

    describe('isResolutionToMobile', () => {
        it('should return true when the width is lower than the limit', () => {
            mockWindow.innerWidth = 767;

            expect(service.isResolutionToMobile()).toBeTrue();
        });

        it('should return false when the width equals the limit', () => {
            mockWindow.innerWidth = 768;

            expect(service.isResolutionToMobile()).toBeFalse();
        });

        it('should support a custom width limit', () => {
            mockWindow.innerWidth = 500;

            expect(service.isResolutionToMobile(600)).toBeTrue();
            expect(service.isResolutionToMobile(400)).toBeFalse();
        });
    });

    describe('getMetaTagValueByName', () => {
        it('should return the content attribute of the meta tag', () => {
            const meta = mockDocument.createElement('meta');
            meta.setAttribute('name', 'buildNumber');
            meta.setAttribute('content', '1.2.3');

            mockDocument.head.appendChild(meta);

            expect(service.getMetaTagValueByName('buildNumber')).toBe('1.2.3');
        });

        it('should return an empty string when no meta tag name is provided', () => {
            expect(service.getMetaTagValueByName('')).toBe('');
        });

        it('should return an empty string when the meta tag does not exist', () => {
            expect(service.getMetaTagValueByName('not-found')).toBe('');
        });
    });

    describe('generateBuildNumberQueryString', () => {
        it('should generate a query string with the encoded build number', () => {
            const meta = mockDocument.createElement('meta');
            meta.setAttribute('name', GenericStorageKey.buildNumber);
            meta.setAttribute('content', '1.0.0 beta+1');

            mockDocument.head.appendChild(meta);

            expect(service.generateBuildNumberQueryString())
                .toBe('?buildNumber=1.0.0%20beta%2B1');
        });

        it('should return an empty string when the build number does not exist', () => {
            expect(service.generateBuildNumberQueryString()).toBe('');
        });
    });

    describe('getAirlineLogos', () => {
        [
            {
                expectation: 'should return generic logos when no airline code is provided',
                store: [],
                airlineCode: undefined,
                expected: {
                    companyURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_pos_generico.svg`,
                    companyDisabledURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_desact_generico.svg`
                }
            },
            {
                expectation: 'should return the airline logos for a specific airline code',
                store: [
                    { iataCompanyCode: 'IB', url: 'iberia.svg' }
                ],
                airlineCode: 'IB',
                expected: {
                    companyURL: `${CheckinAppConstants.aerolinesLogoUrl}iberia.svg`,
                    companyDisabledURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_desact_generico.svg`
                }
            },
            {
                expectation: 'should assign the disabled logo when airline status is dis',
                store: [
                    { iataCompanyCode: 'IB-dis', url: 'iberia-disabled.svg' }
                ],
                airlineCode: 'IB',
                expected: {
                    companyURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_pos_generico.svg`,
                    companyDisabledURL: `${CheckinAppConstants.aerolinesLogoUrl}iberia-disabled.svg`
                }
            },
            {
                expectation: 'should keep generic logos when the airline does not exist',
                store: [
                    { iataCompanyCode: 'IB', url: 'iberia.svg' }
                ],
                airlineCode: 'AA',
                expected: {
                    companyURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_pos_generico.svg`,
                    companyDisabledURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_desact_generico.svg`
                }
            }
        ].forEach(testCase => {
            it(testCase.expectation, () => {
                sessionStorageService.get.and.returnValue(testCase.store);

                const result = service.getAirlineLogos(testCase.airlineCode);

                expect(result).toEqual(testCase.expected);
            });
        });
    });

    describe('getPaymentsBackgroundUrl', () => {
        it('should return the 320 background for screens up to 480px', () => {
            mockWindow.innerWidth = 480;

            expect(service.getPaymentsBackgroundUrl())
                .toBe('/background/generico/disponibilidad_default_320.jpg');
        });

        it('should return the 768 background for screens between 481px and 1024px', () => {
            mockWindow.innerWidth = 768;

            expect(service.getPaymentsBackgroundUrl())
                .toBe('/background/generico/disponibilidad_default_768.jpg');
        });

        it('should return the 2000 background for screens wider than 1024px', () => {
            mockWindow.innerWidth = 1025;

            expect(service.getPaymentsBackgroundUrl())
                .toBe('/background/generico/disponibilidad_default_2000.jpg');
        });
    });

    describe('getDeviceType', () => {
        it('should return mobile when the channel is mobi regardless of width', () => {
            mockWindow.innerWidth = 1400;
            sessionStorageService.get.withArgs('channel').and.returnValue('mobi');

            expect(service.getDeviceType()).toBe('mobile');
        });

        it('should return desktop when width is greater than or equal to 1024px', () => {
            mockWindow.innerWidth = 1024;
            sessionStorageService.get.withArgs('channel').and.returnValue('web');

            expect(service.getDeviceType()).toBe('desktop');
        });

        it('should return tablet when width is between 481px and 1023px', () => {
            mockWindow.innerWidth = 768;
            sessionStorageService.get.withArgs('channel').and.returnValue('web');

            expect(service.getDeviceType()).toBe('tablet');
        });

        it('should return mobile when width is lower than or equal to 480px', () => {
            mockWindow.innerWidth = 480;
            sessionStorageService.get.withArgs('channel').and.returnValue('web');

            expect(service.getDeviceType()).toBe('mobile');
        });
    });

    describe('getAppMarket/Lang', () => {
        it('should return the app market from rootScope', () => {
            mockRootScope.appMarket = 'EN';
            expect(service.getAppMarket()).toBe('EN');
        });

        it('should return the app language from rootScope', () => {
            mockRootScope.appLang = 'en';
            expect(service.getAppLang()).toBe('en');
        });
    });

    describe('getBpSubscriptionMode', () => {
        it('should return the value from the storage if exists', () => {
            sessionStorageService.get.withArgs(BookingStorageKey.bookingInfo).and.returnValue({ subscriptionEnabled: true });

            const result = service.getBpSubscriptionMode();

            expect(result).toBe(true);
        });

        it('should return the default value (false) if not exists bookingInfo', () => {
            sessionStorageService.get.withArgs(BookingStorageKey.bookingInfo).and.returnValue({});
            service.getBpSubscriptionMode();

            const result = service.getBpSubscriptionMode();

            expect(result).toBe(false);
        });
    });

    describe('isCC', () => {
        it('should return carrierConnectEnabled from bookingInfo if exists', () => {
          sessionStorageService.get.withArgs(BookingStorageKey.bookingInfo).and.returnValue({ carrierConnectEnabled: true });

          const result = service.isCC();

          expect(result).toBe(true);
        });

        it('should return false if bookingInfo.carrierConnectEnabled not exists', () => {
          sessionStorageService.get.withArgs(BookingStorageKey.bookingInfo).and.returnValue({  });

          const result = service.isCC();

          expect(result).toBe(false);
        });
    });
});
