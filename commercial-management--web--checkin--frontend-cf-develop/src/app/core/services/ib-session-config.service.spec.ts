import { DatalayerUniqueKeysService } from 'ib-web-commons/ib-datalayer';
import { CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';

import {
    BookingStorageKey,
    CHECKIN_STORAGE_KEYS_TO_REMOVE,
    CheckinFlowStorageKey,
    OTHER_APP_STORAGE_PATTERN,
    UserStorageKey
} from '../constants/ib-storage-keys.constants';
import { EndpointData, IbSessionConfigService } from './ib-session-config.service';

describe('IbSessionConfigService', () => {
    let service: IbSessionConfigService;
    let sessionStorage: jasmine.SpyObj<CommonsSessionStorageService>;
    let datalayerKeys: jasmine.SpyObj<DatalayerUniqueKeysService>;
    let userUtils: jasmine.SpyObj<IbCUserUtilsService>;
    let storageValues: Map<string, unknown>;

    beforeEach(() => {
        storageValues = new Map<string, unknown>();

        sessionStorage = jasmine.createSpyObj<CommonsSessionStorageService>('CommonsSessionStorageService', [
            'clearAll',
            'remove',
            'set',
            'get'
        ]);

        datalayerKeys = jasmine.createSpyObj<DatalayerUniqueKeysService>('DatalayerUniqueKeysService', ['clear']);

        userUtils = jasmine.createSpyObj<IbCUserUtilsService>('IbCUserUtilsService', [
            'isUserLogged',
            'isSoftUser',
            'setUserLogged'
        ]);

        sessionStorage.get.and.callFake(<T = unknown>(key: string): T => {
            return storageValues.get(key) as T;
        });

        service = new IbSessionConfigService(sessionStorage, datalayerKeys, userUtils);
    });

    describe('initStorage', () => {
        it('should clear external storage, check-in data and datalayer keys for a guest user', () => {
            setUserState(false, false);

            service.initStorage();

            expect(sessionStorage.clearAll).toHaveBeenCalledWith(OTHER_APP_STORAGE_PATTERN, { withPrefix: false });
            expect(datalayerKeys.clear).toHaveBeenCalled();
            expectRemovedKeys(CHECKIN_STORAGE_KEYS_TO_REMOVE);
            expect(sessionStorage.remove).toHaveBeenCalledWith(UserStorageKey.customerData);
        });

        it('should preserve protected user keys for a logged user', () => {
            setUserState(true, false);

            service.initStorage();

            const removableKeys = CHECKIN_STORAGE_KEYS_TO_REMOVE.filter(
                (key) => key !== UserStorageKey.customerData && key !== UserStorageKey.userLogged
            );

            expectRemovedKeys(removableKeys);
            expect(sessionStorage.remove).not.toHaveBeenCalledWith(UserStorageKey.customerData);
            expect(sessionStorage.remove).not.toHaveBeenCalledWith(UserStorageKey.userLogged);
        });
    });

    describe('isUserLogged', () => {
        [
            {
                isLogged: true,
                isSoft: false,
                expected: true,
                message: 'should return true for a logged non-soft user'
            },
            {
                isLogged: true,
                isSoft: true,
                expected: false,
                message: 'should return false for a soft user'
            },
            {
                isLogged: false,
                isSoft: false,
                expected: false,
                message: 'should return false for a guest user'
            }
        ].forEach(({ isLogged, isSoft, expected, message }) => {
            it(message, () => {
                setUserState(isLogged, isSoft);

                const result = service.isUserLogged();

                expect(result).toBe(expected);
                expect(userUtils.setUserLogged).toHaveBeenCalledWith(expected);
            });
        });
    });

    describe('buildEndpointUrl', () => {
        it('should build an endpoint URL with a normalized base path', () => {
            const result = service.buildEndpointUrl(' https://api.example.com/// ', ' /v1/checkin ');

            expect(result).toBe('https://api.example.com/v1/checkin');
        });

        it('should return the normalized host when the base path is empty', () => {
            const result = service.buildEndpointUrl('https://api.example.com///');

            expect(result).toBe('https://api.example.com');
        });
    });

    describe('saveEndpoints', () => {
        it('should store only valid normalized endpoints', () => {
            const endpoints: EndpointData[] = [
                {
                    key: 'booking',
                    host: 'https://booking.example.com/',
                    basePath: '/api'
                },
                {
                    key: 'checkin',
                    host: 'https://checkin.example.com'
                },
                {
                    key: '',
                    host: 'https://invalid.example.com'
                },
                {
                    key: 'missing-host',
                    host: ''
                }
            ];

            service.saveEndpoints(endpoints);

            expect(sessionStorage.set).toHaveBeenCalledWith('endpoints', {
                booking: 'https://booking.example.com/api',
                checkin: 'https://checkin.example.com'
            });
        });

        it('should store an empty object when endpoint data is null', () => {
            service.saveEndpoints(null);

            expect(sessionStorage.set).toHaveBeenCalledWith('endpoints', {});
        });

        it('should store an empty object when endpoint data is undefined', () => {
            service.saveEndpoints(undefined);

            expect(sessionStorage.set).toHaveBeenCalledWith('endpoints', {});
        });
    });

    describe('getEndpoint', () => {
        it('should return the stored endpoint for the requested key', () => {
            setStorageValue('endpoints', {
                booking: 'https://booking.example.com'
            });

            expect(service.getEndpoint('booking')).toBe('https://booking.example.com');
        });

        it('should return undefined when the endpoint key does not exist', () => {
            setStorageValue('endpoints', {
                booking: 'https://booking.example.com'
            });

            expect(service.getEndpoint('checkin')).toBeUndefined();
        });

        it('should return undefined when stored endpoints are invalid', () => {
            setStorageValue('endpoints', {
                booking: 123
            });

            expect(service.getEndpoint('booking')).toBeUndefined();
        });

        it('should return undefined when stored endpoints are an array', () => {
            setStorageValue('endpoints', ['https://booking.example.com']);

            expect(service.getEndpoint('booking')).toBeUndefined();
        });
    });

    describe('cleanDataSoftUser', () => {
        it('should return an empty string for empty values', () => {
            expect(service.cleanDataSoftUser()).toBe('');
            expect(service.cleanDataSoftUser(null)).toBe('');
            expect(service.cleanDataSoftUser('')).toBe('');
        });

        it('should hide masked values for soft users', () => {
            userUtils.isSoftUser.and.returnValue(true);

            expect(service.cleanDataSoftUser('Jo*** Doe')).toBe('');
        });

        it('should keep unmasked values for soft users', () => {
            userUtils.isSoftUser.and.returnValue(true);

            expect(service.cleanDataSoftUser('John Doe')).toBe('John Doe');
        });

        it('should keep masked values for non-soft users', () => {
            userUtils.isSoftUser.and.returnValue(false);

            expect(service.cleanDataSoftUser('Jo*** Doe')).toBe('Jo*** Doe');
        });
    });

    describe('getFlowId', () => {
        it('should return the stored flow ID when available', () => {
            setStorageValue(CheckinFlowStorageKey.flowId, 'flow-123');

            const result = service.getFlowId();

            expect(result).toBe('flow-123');
            expect(sessionStorage.set).not.toHaveBeenCalled();
        });

        it('should retrieve and store the check-in ID from booking information', () => {
            setStorageValue(BookingStorageKey.bookingInfo, {
                checkinId: 'checkin-456'
            });

            const result = service.getFlowId();

            expect(result).toBe('checkin-456');
            expect(sessionStorage.set).toHaveBeenCalledWith(CheckinFlowStorageKey.flowId, 'checkin-456');
        });

        it('should return undefined when no flow ID or booking check-in ID exists', () => {
            setStorageValue(BookingStorageKey.bookingInfo, {});

            expect(service.getFlowId()).toBeUndefined();
            expect(sessionStorage.set).not.toHaveBeenCalled();
        });
    });

    describe('setPNR', () => {
        it('should trim and store the PNR', () => {
            service.setPNR(' ABC123 ');

            expect(sessionStorage.set).toHaveBeenCalledWith(CheckinFlowStorageKey.pnr, 'ABC123');
        });

        it('should use the booking locator for PNR values longer than six characters', () => {
            setStorageValue(BookingStorageKey.bookingInfo, {
                gdsLocator: 'BOOKING-LOCATOR'
            });

            service.setPNR(' LONG-PNR ');

            expect(sessionStorage.set).toHaveBeenCalledWith(CheckinFlowStorageKey.pnr, 'BOOKING-LOCATOR');
        });

        it('should not store an empty PNR', () => {
            service.setPNR();

            expect(sessionStorage.set).not.toHaveBeenCalled();
        });
    });

    function setUserState (isLogged: boolean, isSoft: boolean): void {
        userUtils.isUserLogged.and.returnValue(isLogged);
        userUtils.isSoftUser.and.returnValue(isSoft);
    }

    function setStorageValue (key: string, value: unknown): void {
        storageValues.set(key, value);
    }

    function expectRemovedKeys (keys: readonly string[]): void {
        keys.forEach((key) => {
            expect(sessionStorage.remove).toHaveBeenCalledWith(key);
        });
    }
});
