import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbMmbUmnrUtilsService } from '@src/components/ib-MmB-umnr-passengers/services/ib-Mmb-umnr-utils.service';

interface OrderItemSpec {
    serviceCode: string;
}

interface BookingInfoSpec {
    order?: {
        orderItems?: OrderItemSpec[];
    };
}

interface StorageDataSpec {
    [key: string]: boolean | BookingInfoSpec | undefined;
}

const BOOKING_INFO_STORAGE_KEY = 'bookingInfo';
const UMNR_SERVICE_CODE = 'UMNR';

class CommonsSessionStorageServiceMock {
    private storageData: StorageDataSpec = {};

    get = jasmine.createSpy('get').and.callFake((key: string): boolean | BookingInfoSpec | undefined => {
        return this.storageData[key];
    });

    setStorageData = (storageData: StorageDataSpec): void => {
        this.storageData = storageData;
    };
}

describe('Service: IbMmbUmnrUtilsService', () => {
    let service: IbMmbUmnrUtilsService;
    let fakeCommonsSessionStorageService: CommonsSessionStorageServiceMock;
    let originalIsActiveUmnr: boolean;

    const setUmnrToggle = (isActive: boolean): void => {
        MmBAppConstants.TOGGLE.isActiveUmnr = isActive;
    };

    const createBookingInfo = (serviceCodes: string[]): BookingInfoSpec => ({
        order: {
            orderItems: serviceCodes.map((serviceCode: string): OrderItemSpec => ({ serviceCode }))
        }
    });

    const setSessionStorageData = (storageData: StorageDataSpec): void => {
        fakeCommonsSessionStorageService.setStorageData(storageData);
    };

    const setBookingInfo = (bookingInfo: BookingInfoSpec | undefined): void => {
        setSessionStorageData({
            [BOOKING_INFO_STORAGE_KEY]: bookingInfo
        });
    };

    const setBookingInfoWithServiceCodes = (serviceCodes: string[]): void => {
        setBookingInfo(createBookingInfo(serviceCodes));
    };

    const expectBookingInfoToHaveBeenRequested = (): void => {
        expect(fakeCommonsSessionStorageService.get).toHaveBeenCalledWith(BOOKING_INFO_STORAGE_KEY);
    };

    const expectUmnrDataStatusToHaveBeenRequested = (): void => {
        expect(fakeCommonsSessionStorageService.get).toHaveBeenCalledWith(
            MmBAppConstants.UMNR_DATA.SESSION_STORAGE_KEY
        );
    };

    beforeEach(() => {
        originalIsActiveUmnr = MmBAppConstants.TOGGLE.isActiveUmnr;
        fakeCommonsSessionStorageService = new CommonsSessionStorageServiceMock();

        TestBed.configureTestingModule({
            providers: [
                IbMmbUmnrUtilsService,
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService }
            ]
        });

        service = TestBed.inject(IbMmbUmnrUtilsService);
    });

    afterEach(() => {
        MmBAppConstants.TOGGLE.isActiveUmnr = originalIsActiveUmnr;
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should return true when UMNR toggle is active and booking has UMNR order item', () => {
        setUmnrToggle(true);
        setBookingInfoWithServiceCodes(['BAG', UMNR_SERVICE_CODE]);

        expect(service.isActiveUMNR()).toBeTrue();
        expectBookingInfoToHaveBeenRequested();
    });

    it('should return false when UMNR toggle is inactive even if booking has UMNR order item', () => {
        setUmnrToggle(false);
        setBookingInfoWithServiceCodes([UMNR_SERVICE_CODE]);

        expect(service.isActiveUMNR()).toBeFalse();
    });

    it('should return false when UMNR toggle is active but booking does not have UMNR order item', () => {
        setUmnrToggle(true);
        setBookingInfoWithServiceCodes(['BAG', 'SEAT']);

        expect(service.isActiveUMNR()).toBeFalse();
        expectBookingInfoToHaveBeenRequested();
    });

    it('should not return true when bookingInfo does not exist', () => {
        setUmnrToggle(true);
        setBookingInfo(undefined);

        expect(service.isActiveUMNR()).not.toBeTrue();
        expectBookingInfoToHaveBeenRequested();
    });

    it('should not return true when bookingInfo does not have orderItems', () => {
        setUmnrToggle(true);
        setBookingInfo({
            order: {}
        });

        expect(service.isActiveUMNR()).not.toBeTrue();
        expectBookingInfoToHaveBeenRequested();
    });

    it('should return true when UMNR data is completed in session storage', () => {
        setSessionStorageData({
            [MmBAppConstants.UMNR_DATA.SESSION_STORAGE_KEY]: true
        });

        expect(service.isDataUmnrCompleted()).toBeTrue();
        expectUmnrDataStatusToHaveBeenRequested();
    });

    it('should return false when UMNR data is not completed in session storage', () => {
        setSessionStorageData({
            [MmBAppConstants.UMNR_DATA.SESSION_STORAGE_KEY]: false
        });

        expect(service.isDataUmnrCompleted()).toBeFalse();
        expectUmnrDataStatusToHaveBeenRequested();
    });
});