import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCheckinSeatSummaryService } from './ib-checkin-seat-summary.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinSeatSummaryDigitalDataService } from './ib-checkin-seat-summary-digital-data.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { createAcceptResponse, createAncillariesInfo, createSegmentsInformationMock } from '../../../../../test/unit/app/pages/ib-checkin-seat-summary/mocks/seat-summary.mocks';
import { IAcceptData, IAcceptUpgrading } from '@src/app/core/models/storage/cki-accept-info-model';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

const mockBookingInfo = require('test/mocks/localStorage/booking-info.json');

interface ISessionStorageMock {
    get: jasmine.Spy
}

describe('IbCheckinSeatSummaryService', () => {
    let service: IbCheckinSeatSummaryService;
    let mockSessionStorage: ISessionStorageMock;
    let mockIbCheckinRedirectionUtilsService: jasmine.SpyObj<IbCheckinRedirectionUtilsService>;
    let mockIbUtilsService: Partial<IbUtilsService>;
    let mockIbCheckinSeatSummaryDigitalDataService: jasmine.SpyObj<IbCheckinSeatSummaryDigitalDataService>;

    beforeEach(() => {
        mockSessionStorage = {
            get: jasmine.createSpy('mockSessionStorage.get')
        }
        mockIbCheckinRedirectionUtilsService = jasmine.createSpyObj('IbCheckinRedirectionUtilsService', ['path']);
        mockIbUtilsService = {
            getAirlineLogos: jasmine.createSpy('mockIbUtilsService.getAirlineLogos').and.returnValue({
                "companyDisabledURL": "disabled",
                "companyURL": "url"
            })
        };
        mockIbCheckinSeatSummaryDigitalDataService = jasmine.createSpyObj('IbCheckinSeatSummaryDigitalDataService', ['handleEventsSeatSummary']);

        TestBed.configureTestingModule({
            providers: [
                IbCheckinSeatSummaryService,
                { provide: CommonsSessionStorageService, useValue: mockSessionStorage },
                { provide: IbCheckinRedirectionUtilsService, useValue: mockIbCheckinRedirectionUtilsService },
                { provide: IbCheckinSeatSummaryDigitalDataService, useValue: mockIbCheckinSeatSummaryDigitalDataService },
                { provide: IbUtilsService, useValue: mockIbUtilsService }
            ]
        });

        service = TestBed.inject(IbCheckinSeatSummaryService);

        mockSessionStorage.get.and.stub();
        mockSessionStorage.get.and.callFake((key: string) => {
            if (key === CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO) return mockBookingInfo;
            if (key === CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO) return createAcceptResponse();
            if (key === CheckinAppConstants.STORAGE_KEYS.ANCILLARIES_INFO) return createAncillariesInfo();

            return null;
        });
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('getSegmentsInformation', () => {
        it('should return the segments with the correct format', () => {
            const expectedData = createSegmentsInformationMock();

            const result = service.getSegmentsInformation();

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result).toEqual(expectedData);
        });

        it('should call getAirlineLogs from external dependencie and add it in operatingFlightNumber', () => {
            const result = service.getSegmentsInformation();

            expect(mockIbUtilsService.getAirlineLogos).toHaveBeenCalled();
            expect(result[0].operatingFlightNumber.brand).not.toBe(undefined);
            expect(result[0].operatingFlightNumber.brand).toEqual({
                "companyDisabledURL": "disabled",
                "companyURL": "url"
            });
        });

        describe('changeSeatAvailable', () => {
            it('should set changeSeatAvailable false if is an external company', () => {
                spyOn(service as unknown as { checkCompany: () => boolean }, 'checkCompany').and.returnValue(false);
                const result = service.getSegmentsInformation();

                expect(result[0].changeSeatAvailable).toBe(false);
            });

            it('should set changeSeatAvailable true if ancillariesInfo exists in storage and have seat available', () => {
                mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.ANCILLARIES_INFO).and.returnValue(createAncillariesInfo(true));

                const result = service.getSegmentsInformation();

                expect(result[0].changeSeatAvailable).toBe(true);
            });

            it('should set changeSeatAvailable false if ancillariesInfo exists in storage and don\'t have seat available', () => {
                const result = service.getSegmentsInformation();

                expect(result[0].changeSeatAvailable).toBe(false);
            });

            it('should set changeSeatAvailable false if ancillariesInfo exists in storage and don\'t have seat info', () => {
                mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.ANCILLARIES_INFO).and.returnValue([]);

                const result = service.getSegmentsInformation();

                expect(result[0].changeSeatAvailable).toBe(false);
            });

            it('should set changeSeatAvailable false if ancillariesInfo doesn\'t exists', () => {
                mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.ANCILLARIES_INFO).and.returnValue(undefined);

                const result = service.getSegmentsInformation();

                expect(result[0].changeSeatAvailable).toBe(false);
            });
        });
    });

    describe('checkRedirectionPage', () => {
        it('should redirect to originalPath if isEarly', () => {
            mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.IS_EARLY).and.returnValue(true);

            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ibecbp');
        });

        it('should redirect to originalPath if isPa', () => {
            const bookingInfoMock: CkiBookingInfo.BookingInfo = structuredClone(mockBookingInfo);
            bookingInfoMock.airShuttleSegments = [];
            mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO).and.returnValue(bookingInfoMock);

            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ckiacpt');
        });

        it('should redirect to originalPath if isCC', () => {
            const bookingInfoMock: CkiBookingInfo.BookingInfo = structuredClone(mockBookingInfo);
            bookingInfoMock.carrierConnectEnabled = true;
            mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO).and.returnValue(bookingInfoMock);

            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ibecbp');
        });

        it('should redirect to originalPath if is updgradingCase', () => {
            const acceptMock: IAcceptData = createAcceptResponse();
            acceptMock.upgrading = {} as IAcceptUpgrading;
            mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO).and.returnValue(acceptMock);

            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ibecbp');
        });

        it('should redirect to originalPath if is standBY', () => {
            const acceptMock: IAcceptData = createAcceptResponse();
            acceptMock.acceptedSegments[0].passengers[0].status = 'STANDBY';
            mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO).and.returnValue(acceptMock);

            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ibecbp');
        });

        it('should redirect to originalPath if is SA case and send to monetate KO', () => {
            const bookingInfoMock: CkiBookingInfo.BookingInfo = structuredClone(mockBookingInfo);
            bookingInfoMock.outwardSegments[0].passengers[0].farebasis = 'ID123';
            mockSessionStorage.get.withArgs(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO).and.returnValue(bookingInfoMock);

            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ibecbp');
            expect(mockIbCheckinSeatSummaryDigitalDataService.handleEventsSeatSummary).toHaveBeenCalledWith('Audiencia KO')
        });

        it('should redirect to seatSummary page (ckiacpt) if is not a KO case and send to monetate OK', () => {
            service.checkRedirectionPage('ibecbp');

            expect(mockIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ckiacpt');
            expect(mockIbCheckinSeatSummaryDigitalDataService.handleEventsSeatSummary).toHaveBeenCalledWith('Audiencia OK')
        });
    });

    describe('sendSeatSummaryEventToMonetate', () => {
        const cases = [
            { result: 'OK', state: true },
            { result: 'KO', state: false }
        ];

        cases.forEach(({ result, state }) => {
            it(`should call digital data service with ${result} state if param is ${state}`, () => {
                service.sendSeatSummaryEventToMonetate(state);

                expect(mockIbCheckinSeatSummaryDigitalDataService.handleEventsSeatSummary).toHaveBeenCalledWith(`Audiencia ${result}`);
            });
        });
    });
});