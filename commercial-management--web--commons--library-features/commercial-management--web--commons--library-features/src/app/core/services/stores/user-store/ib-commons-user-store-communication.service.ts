import { Injectable } from "@angular/core";
import { tap, map, switchMap, of, NEVER } from "rxjs";
import {
  IbCUserUtilsService,
  IbCBroadcastService,
  CommonsSessionStorageService,
  CommonsBrowserStorageService,
} from "ib-web-commons/utils";
import {
  MemberPlusResponse,
  PersonalDataZeroResponse,
  ContactDetailsZeroResponse,
  IberiaWebUser,
} from "ib-web-commons/models";
import { IbCUserStoreTransformerService } from "./ib-commons-user-store-transformer.service";
import { IbCUserHttpManagementService } from "./ib-commons-user-http-management.service";
import { IbAnonymousInitialValue } from "./ib-commons-user-store.constants";
import { IbCUserStoreService } from "./ib-commons-user-store.service";

declare global {
  interface Window {
    // eslint-disable-next-line
    structuredClone(value: unknown): any;
  }
}

@Injectable({
  providedIn: "root",
})
export class IbCUserStoreCommunicationService {
  private readonly STORAGE_STORE_KEY = "APP_USER_INFO";
  private readonly IBPLUS_LOGIN_KEY = "IBPLUS_LOGIN";
  private readonly IBZERO_LOGIN_KEY = "IBZERO_LOGIN";
  private readonly LOGOUT_KEY = "LOGOUT";

  constructor(
    private broadcastService: IbCBroadcastService,
    private ibCUserStoreService: IbCUserStoreService,
    private userUtilsService: IbCUserUtilsService,
    private sessionStorageService: CommonsSessionStorageService,
    private localStorageService: CommonsBrowserStorageService,
    private transformerUserService: IbCUserStoreTransformerService,
    private ibCUserHttpManagementService: IbCUserHttpManagementService,
  ) {}

  syncStateListeners() {
    this.listenIbPlusLogin();
    this.listenIbZeroLogin();
    this.listenLogout();
    this.listenPermanentChange();
  }

  /**
   * @description Listen to login of Iberia Plus from wcs in another tabs
   * @private
   */
  private listenIbPlusLogin() {
    this.broadcastService
      .getMessage<{ members: MemberPlusResponse }>(this.IBPLUS_LOGIN_KEY)
      .pipe(
        map((res) => res?.members),
        switchMap((res) => {
          if (!res) {
            this.ibCUserHttpManagementService.updateUserInfoFromServer();
            return NEVER;
          }
          return of(res);
        }),
        map((res) => this.transformerUserService.transformIbPlusMembers(res)),
        tap((user) => {
          this.userUtilsService.removeSoftUser();
          this.ibCUserStoreService.setUser(user);
          this.sessionStorageService.set(
            "FFUser",
            user.appUserInfo.frequentFlyer,
          );
        }),
      )
      .subscribe();
  }

  /**
   * @description Listen to login of Iberia Zero from wcs in another tabs
   * @private
   */
  private listenIbZeroLogin() {
    this.broadcastService
      .getMessage<{
        personalData: PersonalDataZeroResponse;
        contactDetails: ContactDetailsZeroResponse;
      }>(this.IBZERO_LOGIN_KEY)
      .pipe(
        map((res) => {
          if (!res) return null;
          return [res.personalData, res.contactDetails] as [
            PersonalDataZeroResponse,
            ContactDetailsZeroResponse,
          ];
        }),
        switchMap((res) => {
          if (!res) {
            this.ibCUserHttpManagementService.updateUserInfoFromServer();
            return NEVER;
          }
          return of(res);
        }),
        tap((res) => {
          this.userUtilsService.removeSoftUser();
          const user =
            this.transformerUserService.transformIbZeroPersonalData(res);
          this.ibCUserStoreService.setUser(user);
        }),
      )
      .subscribe();
  }

  /**
   * @description Listen to logout from wcs in another tabs
   * @private
   */
  private listenLogout() {
    this.broadcastService
      .getMessage(this.LOGOUT_KEY)
      .pipe(
        tap(() => {
          this.sessionStorageService.remove(this.STORAGE_STORE_KEY, {
            withPrefix: false,
          });
          this.userUtilsService.logout();
          this.ibCUserStoreService.setUser(IbAnonymousInitialValue);
        }),
      )
      .subscribe();
  }

  /**
   * @description Listen to user change to permanent user and updates the state information when changes.
   * @private
   */
  private listenPermanentChange() {
    this.localStorageService
      .getAsObservable<boolean>(
        this.userUtilsService.LOCAL_STORAGE_SOFT_USER_KEY,
      )
      .pipe(
        tap((res) => {
          if (res.oldValue !== res.newValue && res.newValue !== null) {
            // eslint-disable-next-line
            const userInfo: IberiaWebUser = window.structuredClone(
              this.ibCUserStoreService.getActualUser(),
            );
            if (
              userInfo.appUserInfo.userType === "IB_PLUS" ||
              userInfo.appUserInfo.userType === "IB_ZERO"
            ) {
              userInfo.appUserInfo.permanentUser = true;
              this.ibCUserStoreService.setUser(userInfo);
            }
          }
        }),
      )
      .subscribe();
  }

  /**
   * Emits the broadcast event logout to all other tab open. To synchronize the state of the user.
   */
  emitLogOut(): void {
    this.broadcastService.postMessage({
      type: this.LOGOUT_KEY,
      payload: null,
    });
  }
}
