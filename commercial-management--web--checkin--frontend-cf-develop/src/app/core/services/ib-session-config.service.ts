import { Injectable } from '@angular/core';
import { DatalayerUniqueKeysService } from 'ib-web-commons/ib-datalayer';
import { CommonsSessionStorageService, downgradeToAJSService, IbCUserUtilsService } from 'ib-web-commons/utils';

import {
    BookingStorageKey,
    CHECKIN_STORAGE_KEYS_TO_REMOVE,
    CheckinFlowStorageKey,
    OTHER_APP_STORAGE_PATTERN,
    UserStorageKey
} from '../constants/ib-storage-keys.constants';

export interface EndpointData {
    key: string;
    host: string;
    basePath?: string;
}

export type Endpoints = Record<string, string>;

@Injectable({
    providedIn: 'root'
})
export class IbSessionConfigService {
    private static readonly ENDPOINTS_STORAGE_KEY = 'endpoints';

    private readonly protectedKeysForLoggedUsers: ReadonlySet<string> = new Set([
        UserStorageKey.customerData,
        UserStorageKey.userLogged
    ]);

    constructor (
        private readonly commonsSessionStorageService: CommonsSessionStorageService,
        private readonly datalayerUniqueKeysService: DatalayerUniqueKeysService,
        private readonly commonsUserUtilsService: IbCUserUtilsService
    ) { }

    /**
     * Clears check-in session data and resets datalayer keys.
     */
    initStorage = (): void => {
        const isLoggedUser = this.isUserLogged();

        this.clearOtherApplicationsStorage();
        this.removeCheckinStorageData(isLoggedUser);
        this.clearDatalayerKeys();
        this.removeCustomerDataForGuest(isLoggedUser);
    };

    /**
     * Checks whether the current user is logged in and is not a soft user.
     *
     * @returns `true` when the current user is a logged non-soft user.
     */
    isUserLogged = (): boolean => {
        const isLoggedUser = this.commonsUserUtilsService.isUserLogged();
        const isSoftUser = this.commonsUserUtilsService.isSoftUser();
        const userIsLogged = isLoggedUser && !isSoftUser;

        this.commonsUserUtilsService.setUserLogged(userIsLogged);

        return userIsLogged;
    };

    /**
     * Builds a normalized endpoint URL from a host and an optional base path.
     *
     * @param host Endpoint host.
     * @param basePath Optional endpoint base path.
     * @returns Normalized endpoint URL.
     */
    buildEndpointUrl (host: string, basePath = ''): string {
        const normalizedHost = host.trim().replace(/\/+$/, '');
        const normalizedBasePath = basePath.trim().replace(/^\/+/, '');

        return normalizedBasePath ? `${normalizedHost}/${normalizedBasePath}` : normalizedHost;
    }

    /**
     * Stores valid endpoint definitions in session storage.
     *
     * @param endpointsData Endpoint definitions to store.
     */
    saveEndpoints (endpointsData: EndpointData[] | null | undefined): void {
        const endpoints = this.createEndpoints(endpointsData);

        this.commonsSessionStorageService.set(IbSessionConfigService.ENDPOINTS_STORAGE_KEY, endpoints);
    }

    /**
     * Gets a stored endpoint by its key.
     *
     * @param key Endpoint identifier.
     * @returns Stored endpoint URL, if available.
     */
    getEndpoint (key: string): string | undefined {
        return this.readEndpoints()[key];
    }

    /**
     * Removes masked values for soft users.
     *
     * @param value Value that may contain masked data.
     * @returns An empty string for hidden data, otherwise the original value.
     */
    cleanDataSoftUser (value?: string | null): string {
        if (!value || this.isMaskedValueForSoftUser(value)) {
            return '';
        }

        return value;
    }

    /**
     * Clears storage data belonging to other applications.
     */
    private clearOtherApplicationsStorage (): void {
        this.commonsSessionStorageService.clearAll(OTHER_APP_STORAGE_PATTERN, { withPrefix: false });
    }

    /**
     * Removes check-in storage keys while preserving user data for logged users.
     *
     * @param isLoggedUser Indicates whether the current user is logged in.
     */
    private removeCheckinStorageData (isLoggedUser: boolean): void {
        CHECKIN_STORAGE_KEYS_TO_REMOVE.filter((key) => this.shouldRemoveStorageKey(key, isLoggedUser)).forEach((key) =>
            this.commonsSessionStorageService.remove(key)
        );
    }

    /**
     * Removes customer data when the current user is not logged in.
     *
     * @param isLoggedUser Indicates whether the current user is logged in.
     */
    private removeCustomerDataForGuest (isLoggedUser: boolean): void {
        if (!isLoggedUser) {
            this.commonsSessionStorageService.remove(UserStorageKey.customerData);
        }
    }

    /**
     * Clears all unique keys registered in the datalayer.
     */
    private clearDatalayerKeys (): void {
        this.datalayerUniqueKeysService.clear();
    }

    /**
     * Creates an endpoint map using only valid endpoint definitions.
     *
     * @param endpointsData Endpoint definitions received from configuration.
     * @returns Normalized endpoint map.
     */
    private createEndpoints (endpointsData: EndpointData[] | null | undefined): Endpoints {
        if (!Array.isArray(endpointsData)) {
            return {};
        }

        return endpointsData.reduce<Endpoints>((endpoints, endpoint) => this.addEndpoint(endpoints, endpoint), {});
    }

    /**
     * Adds a valid endpoint definition to the endpoint map.
     *
     * @param endpoints Current endpoint map.
     * @param endpoint Endpoint definition to validate and add.
     * @returns Updated endpoint map.
     */
    private addEndpoint (endpoints: Endpoints, endpoint: EndpointData | null | undefined): Endpoints {
        if (!endpoint?.key || !endpoint.host) {
            return endpoints;
        }

        return {
            ...endpoints,
            [endpoint.key]: this.buildEndpointUrl(endpoint.host, endpoint.basePath)
        };
    }

    /**
     * Reads and validates endpoints stored in session storage.
     *
     * @returns Valid endpoint map or an empty object.
     */
    private readEndpoints (): Endpoints {
        const endpoints = this.commonsSessionStorageService.get<Endpoints>(IbSessionConfigService.ENDPOINTS_STORAGE_KEY);
    
        return this.isEndpoints(endpoints) ? endpoints : {};
    }

    /**
     * Checks whether a storage key can be removed for the current user state.
     *
     * @param key Storage key to evaluate.
     * @param isLoggedUser Indicates whether the current user is logged in.
     * @returns `true` when the key should be removed.
     */
    private shouldRemoveStorageKey (key: string, isLoggedUser: boolean): boolean {
        return !isLoggedUser || !this.protectedKeysForLoggedUsers.has(key);
    }

    /**
     * Checks whether a value must be hidden from a soft user.
     *
     * @param value Value to evaluate.
     * @returns `true` when the value is masked and the user is soft.
     */
    private isMaskedValueForSoftUser (value: string): boolean {
        return this.commonsUserUtilsService.isSoftUser() && value.includes('*');
    }

    /**
     * Checks whether a value is a valid endpoint map.
     *
     * @param value Value to validate.
     * @returns `true` when every endpoint value is a string.
     */
    private isEndpoints (value: unknown): value is Endpoints {
        return (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            Object.values(value).every((endpoint) => typeof endpoint === 'string')
        );
    }

    getFlowId (): string | undefined {
        const flowId = this.commonsSessionStorageService.get(CheckinFlowStorageKey.flowId) as string || undefined;

        if (flowId) {
            return flowId;
        }
        
        const bookingInfo = this.commonsSessionStorageService.get(BookingStorageKey.bookingInfo) as CkiBookingInfo.BookingInfo;

        if (bookingInfo?.checkinId) {
            this.commonsSessionStorageService.set(CheckinFlowStorageKey.flowId, bookingInfo.checkinId);
            return bookingInfo.checkinId;
        }

        return undefined;
    }

    setPNR (pnr: string = ''): void {
        const cleanedPnr = pnr.trim();
        const bookingInfo = this.commonsSessionStorageService.get('bookingInfo') as CkiBookingInfo.BookingInfo;
        const bookingLocator = (bookingInfo?.gdsLocator || bookingInfo?.resiberLocator || '').trim();
        const locator = cleanedPnr.length > 6 || bookingLocator
            ? bookingLocator
            : cleanedPnr;

        if (!locator) {
            return;
        }

        this.commonsSessionStorageService.set(CheckinFlowStorageKey.pnr, locator);
    }
}

downgradeToAJSService('IbSessionConfigService', IbSessionConfigService, 'ib-check-in-app');
