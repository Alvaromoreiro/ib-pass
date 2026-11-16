import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import {
    IbBookingFlowDetectionService,
    FlowDetectionResult, ProcessConst
} from './ib-booking-flow-detection.service';
import { UrlUtilsService } from '@shared/services/ib-utils/ib-booking-url-utils.service';
import { IbBookingPetsFlowService } from '@shared/services/ib-utils/ib-bookig-pets-flow.service';
import { RootStore } from '@core/store/ib-booking-root.store';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';

interface SessionStorageConfig {
    [BkiStorageConstants.REDEMPTION_FLOW]?: boolean;
    [BkiStorageConstants.USER_LOGGED]?: string;
    [BkiStorageConstants.SEARCH_FLIGHT_TYPE]?: string;
    [BkiStorageConstants.FLOW_APP]?: string;
    [BkiStorageConstants.HOLA_MADRID]?: boolean;
    [BkiStorageConstants.AVAILABILITY_TYPE]?: string;
    [key: string]: unknown;
}

interface RootStoreConfig {
    isRedemptionFlow?: boolean;
    [key: string]: boolean | string | null | undefined;
}

describe('IbBookingFlowDetectionService', () => {
    let service: IbBookingFlowDetectionService;
    let commonsSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let urlUtilsService: jasmine.SpyObj<UrlUtilsService>;
    let ibBookingPetsFlowService: jasmine.SpyObj<IbBookingPetsFlowService>;
    let rootStore: jasmine.SpyObj<RootStore>;

    beforeEach(() => {
        const commonsSessionStorageServiceSpy = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);
        const urlUtilsServiceSpy = jasmine.createSpyObj('UrlUtilsService', ['getURLFirstParameterByName']);
        const ibBookingPetsFlowServiceSpy = jasmine.createSpyObj('IbBookingPetsFlowService', [], {
            isPetsFlow: false
        });
        const rootStoreSpy = jasmine.createSpyObj('RootStore', ['get']);

        TestBed.configureTestingModule({
            providers: [
                IbBookingFlowDetectionService,
                { provide: CommonsSessionStorageService, useValue: commonsSessionStorageServiceSpy },
                { provide: UrlUtilsService, useValue: urlUtilsServiceSpy },
                { provide: IbBookingPetsFlowService, useValue: ibBookingPetsFlowServiceSpy },
                { provide: RootStore, useValue: rootStoreSpy }
            ]
        });

        service = TestBed.inject(IbBookingFlowDetectionService);
        commonsSessionStorageService = TestBed.inject(CommonsSessionStorageService) as jasmine.SpyObj<CommonsSessionStorageService>;
        urlUtilsService = TestBed.inject(UrlUtilsService) as jasmine.SpyObj<UrlUtilsService>;
        ibBookingPetsFlowService = TestBed.inject(IbBookingPetsFlowService) as jasmine.SpyObj<IbBookingPetsFlowService>;
        rootStore = TestBed.inject(RootStore) as jasmine.SpyObj<RootStore>;

        resetMocks();
    });

    function resetMocks (): void {
        commonsSessionStorageService.get.and.returnValue(null);
        urlUtilsService.getURLFirstParameterByName.and.returnValue(null);
        rootStore.get.and.returnValue(false);
    }

    function setupSessionStorage (config: SessionStorageConfig): void {
        //@ts-ignore
        commonsSessionStorageService.get.and.callFake((key: string) => {
            return config[key] ?? null;
        });
    }

    function setupRootStore (config: RootStoreConfig): void {
        rootStore.get.and.callFake((key: string) => {
            return config[key] ?? false;
        });
    }

    function testDetectFlow (
        expectedFlow: string, 
        expectedIsRedemption = false
    ): FlowDetectionResult {
        const result = service.detectFlow();
        expect(result.flow).toBe(expectedFlow);
        expect(result.isRedemption).toBe(expectedIsRedemption);
        return result;
    }

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('detectFlow', () => {
        it('should return shuttle redemption flow when both shuttle and redemption flags are true', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN,
                [BkiStorageConstants.REDEMPTION_FLOW]: true
            });

            testDetectFlow(ProcessConst.SHUTTLE_REDEMPTION, true);
        });

        it('should return shuttle flow when search flight type is PAOPEN', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN
            });

            testDetectFlow(ProcessConst.SHUTTLE);
        });

        it('should return pets flow when pets flow is detected', () => {
            Object.defineProperty(ibBookingPetsFlowService, 'isPetsFlow', {
                get: () => true
            });

            testDetectFlow(ProcessConst.PETS);
        });

        it('should return booking OB redemption flow for onboard user with redemption search', () => {
            setupSessionStorage({
                [BkiStorageConstants.USER_LOGGED]: BookingAppConstants.LOGIN_ONB,
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION
            });

            testDetectFlow(ProcessConst.BOOKING_OB_REDEMPTION, true);
        });

        it('should return on hold flow when flow app is BBKIOH', () => {
            setupSessionStorage({
                [BkiStorageConstants.FLOW_APP]: 'BBKIOH'
            });

            testDetectFlow(ProcessConst.ON_HOLD);
        });

        it('should return booking OB flow for onboard user without redemption', () => {
            setupSessionStorage({
                [BkiStorageConstants.USER_LOGGED]: BookingAppConstants.LOGIN_ONB
            });

            // Act & Assert
            testDetectFlow(ProcessConst.BOOKING_OB);
        });

        it('should return redemption flow when search flight type is redemption', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION
            });

            // Act & Assert
            testDetectFlow(ProcessConst.REDEMPTION, true);
        });

        it('should return metasearch flow when search flight type is metasearch', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH
            });

            // Act & Assert
            testDetectFlow(ProcessConst.METASEARCH);
        });

        it('should return HMAD stop over flow when multitrip and HMAD are true', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP,
                [BkiStorageConstants.HOLA_MADRID]: true
            });

            // Act & Assert
            testDetectFlow(ProcessConst.HMAD_STOP_OVER);
        });

        it('should return multi trip flow when search flight type is multitrip without HMAD', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP
            });

            // Act & Assert
            testDetectFlow(ProcessConst.MULTI_TRIP);
        });

        it('should return flash offers flow when flash offer parameter exists', () => {
            urlUtilsService.getURLFirstParameterByName.and.returnValue('some-flash-offer');

            const result = service.detectFlow();

            expect(result.flow).toBe(ProcessConst.FLASH_OFFERS);
            expect(urlUtilsService.getURLFirstParameterByName).toHaveBeenCalledWith(
                BookingAppConstants.BOOKING_PARAMS_NAMES.FLASH_OFFER
            );
        });

        it('should return default booking flow when no specific conditions are met', () => {
            testDetectFlow(ProcessConst.BOOKING);
        });

        it('should get values from rootStore when session storage returns null', () => {
            setupRootStore({ isRedemptionFlow: true });
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION
            });

            const result = testDetectFlow(ProcessConst.REDEMPTION, true);

            expect(rootStore.get).toHaveBeenCalledWith('isRedemptionFlow');
        });

        it('should prioritize session storage over rootStore values', () => {
            setupSessionStorage({ [BkiStorageConstants.REDEMPTION_FLOW]: false });
            setupRootStore({ isRedemptionFlow: true });

            testDetectFlow(ProcessConst.BOOKING);
        });
    });


    describe('handler priority', () => {
        it('should prioritize shuttle redemption over individual shuttle or redemption handlers', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN,
                [BkiStorageConstants.REDEMPTION_FLOW]: true
            });

            testDetectFlow(ProcessConst.SHUTTLE_REDEMPTION, true);
        });

        it('should prioritize booking OB redemption over general redemption handler', () => {
            setupSessionStorage({
                [BkiStorageConstants.USER_LOGGED]: BookingAppConstants.LOGIN_ONB,
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION
            });

            testDetectFlow(ProcessConst.BOOKING_OB_REDEMPTION, true);
        });

        it('should prioritize HMAD stop over above general multitrip handler', () => {
            setupSessionStorage({
                [BkiStorageConstants.SEARCH_FLIGHT_TYPE]: BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP,
                [BkiStorageConstants.HOLA_MADRID]: true
            });

            testDetectFlow(ProcessConst.HMAD_STOP_OVER);
        });
    });
});
