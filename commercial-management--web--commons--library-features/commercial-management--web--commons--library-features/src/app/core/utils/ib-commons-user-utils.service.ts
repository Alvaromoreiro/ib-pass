import { CommonsBrowserStorageService } from './storage-utils/ib-commons-browser-storage.service';
import { downgradeToAJSService } from './ib-commons-angularjs-utils';
import { Inject, Injectable } from '@angular/core';
import { CommonsSessionStorageService } from './storage-utils/ib-commons-session-storage.service';
import { CommonsConstants, CommonsHttpServicesConstants, CommonsLoginConstants } from 'ib-web-commons/constants';
import { CommonsCookiesService } from './storage-utils/ib-commons-cookies.service';
import { AJSRootScope, CommonsRootScope } from './ajs-upgrade/ib-commons-root-scope-bridge';
import { IbCTokenUtilsService } from './ib-commons-token-utils.service';

@Injectable({
    providedIn: 'root'
})
export class IbCUserUtilsService {

    private readonly SESSION_STORAGE_ROLE_KEY = 'IberiaUserType';
    private readonly SESSION_STORAGE_LOGGED_KEY = 'userLogged';
    public readonly LOCAL_STORAGE_SOFT_USER_KEY = 'IB_PERMANENT_LOGIN';

    constructor (
        protected sessionStorageService: CommonsSessionStorageService,
        protected browserStorageService: CommonsBrowserStorageService,
        protected commonsCookiesService: CommonsCookiesService,
        protected tokenUtils: IbCTokenUtilsService,
        @Inject(AJSRootScope) protected rootScope: CommonsRootScope
    ) {}

    setUserRole (role: string): void {
        this.sessionStorageService.set(this.SESSION_STORAGE_ROLE_KEY, role);
    }

    removeUserRole (): void {
        this.commonsCookiesService.remove(CommonsConstants.COOKIES.WCS_USER_TYPE);
        this.sessionStorageService.remove(this.SESSION_STORAGE_ROLE_KEY);
    }

    setIbZero (): void {
        this.setUserRole(CommonsConstants.ROLE_IBERIA);
    }

    setIbPlus (): void {
        this.setUserRole(CommonsConstants.ROLE_IBERIA_PLUS);
    }

    getUserRole (): string | null {
        return this.sessionStorageService.get(this.SESSION_STORAGE_ROLE_KEY);
    }

    isIbZero (): boolean {
        const role = this.getUserRole();
        return role === CommonsConstants.ROLE_IBERIA;
    }

    isIbPlus (): boolean {
        const role = this.getUserRole();
        return role === CommonsConstants.ROLE_IBERIA_PLUS;
    }

    setSoftUser ( set: boolean ): void {
        const splitted = window.location.hostname.split('.');
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.SESSION_INFO, { domain: `.${splitted.slice(splitted.length - 2).join('.')}` } );
        this.browserStorageService.set(this.LOCAL_STORAGE_SOFT_USER_KEY, set.toString());
    }

    isSoftUser (): boolean {
        const role = this.browserStorageService.get<boolean>(this.LOCAL_STORAGE_SOFT_USER_KEY);
        return role === true;
    }

    removeSoftUser (): void {
        this.browserStorageService.remove(this.LOCAL_STORAGE_SOFT_USER_KEY);
    }

    /**
     * Return if the an user is logged, it can be Iberia, Iberia Plus, On business and Soft User
     */
    isUserLogged (): boolean {
        const logged = this.sessionStorageService.get<boolean | 'ONB'>(this.SESSION_STORAGE_LOGGED_KEY);
        this.rootScope.isLogged = logged;
        return Boolean(logged);
    }

    isUserLoggedNotONB (): boolean {
        const logged = this.sessionStorageService.get<boolean | 'ONB'>(this.SESSION_STORAGE_LOGGED_KEY);
        this.rootScope.isLogged = logged;
        return logged === true;
    }

    isUserLoggedONB (): boolean {
        const logged = this.sessionStorageService.get<boolean | 'ONB'>(this.SESSION_STORAGE_LOGGED_KEY);
        this.rootScope.isLogged = logged;
        return logged === CommonsHttpServicesConstants.LOGIN_ONB;
    }

    setUserLogged (set: boolean): void {
        this.rootScope.isLogged = set;
        this.sessionStorageService.set(this.SESSION_STORAGE_LOGGED_KEY, set);
    }

    setUserLoggedONB (): void {
        this.rootScope.isLogged = CommonsHttpServicesConstants.LOGIN_ONB as 'ONB';
        this.sessionStorageService.set(this.SESSION_STORAGE_LOGGED_KEY, CommonsHttpServicesConstants.LOGIN_ONB);
    }

    /**
     * You probably should not be calling this directly an instead user IbCUserStoreRepository.
     * Deletes all information stored from the user.
     */
    logout (): void {
        this.tokenUtils.deleteLoggedTokens();
        this.setUserLogged(false);
        this.removeUserRole();
        this.removeSoftUser();

        /** Old Iberia State */
        this.rootScope.customerData = null;
        this.rootScope.isLogged = false;
        this.rootScope.$broadcast('updateCustomerInfo');

        const splitted = window.location.hostname.split('.');
        this.commonsCookiesService.remove(CommonsLoginConstants.SSO_COOKIES.SESSION_INFO, { domain: `.${splitted.slice(splitted.length - 2).join('.')}` } );
        this.sessionStorageService.remove('customerData');
        this.sessionStorageService.remove('memberData');
        this.sessionStorageService.remove('tierLevel');
        this.sessionStorageService.remove('benefits');
        this.sessionStorageService.remove('loggedToken');
        this.sessionStorageService.remove('refreshToken');
        this.sessionStorageService.remove('loginSF');
        this.sessionStorageService.remove('FFUser');

        /** DELETE CACHED WCS DATA **/
        this.sessionStorageService.remove(CommonsConstants.WCS_CUSTOMERDATA_STORAGES.IBPLUS, { withPrefix: false });
        this.sessionStorageService.remove(CommonsConstants.WCS_CUSTOMERDATA_STORAGES.IBZERO, { withPrefix: false });
        this.sessionStorageService.remove('customerData', { withPrefix: false });
        this.sessionStorageService.remove('customerDataZero', { withPrefix: false });
        localStorage.removeItem('ib-avatar-cache');
    }

    /**
     * Get the actual frquent flyer of the Iberia Plus user or NOT_FOUND if fails.
     * @returns
     */
    getFrequentFlyer (): (string & {}) | 'NOT_FOUND' {
        return this.tokenUtils.getFrequentFlyerFromToken()
            ?? this.sessionStorageService.get<string>('FFUser')
            ?? 'NOT_FOUND';
    }

}
type CommonsUserUtilsService = IbCUserUtilsService;
export type { CommonsUserUtilsService };
downgradeToAJSService('CommonsUserUtilsService', IbCUserUtilsService, 'ib-commons-utils-module');