import { Injectable } from "@angular/core";
import {
  Observable,
  tap,
  map,
  EMPTY,
  finalize,
  forkJoin,
  catchError,
  timeout,
} from "rxjs";
import {
  IbCUserUtilsService,
  CommonsSessionStorageService,
  IbCTokenUtilsService,
  CommonsCookiesService,
} from "ib-web-commons/utils";
import {
  IbCAuthService,
  IbCContactDetailsZeroService,
  IbCMembersDataPlusService,
  IbCPersonalDataZeroService,
  IbCNewPaymentAvailiabilityService,
} from "ib-web-commons/http-services";
import { CommonsConstants } from "ib-web-commons/constants";
import {
  MemberPlusResponse,
  IberiaWebUser,
  IberiaPlusUser,
} from "ib-web-commons/models";
import { IbCUserStoreTransformerService } from "./ib-commons-user-store-transformer.service";
import { IbCUserStoreService } from "./ib-commons-user-store.service";

@Injectable({
  providedIn: "root",
})
export class IbCUserHttpManagementService {
  private readonly TIMEOUT_LOGOUT = 2000;
  private isUpdatingInfo = false;

  constructor(
    private ibCUserStoreService: IbCUserStoreService,
    private transformerUserService: IbCUserStoreTransformerService,
    private tokenUtilsService: IbCTokenUtilsService,
    private commonsCookiesService: CommonsCookiesService,
    private userUtilsService: IbCUserUtilsService,
    private sessionStorageService: CommonsSessionStorageService,
    private memberServiceIbPlus: IbCMembersDataPlusService,
    private personalDataServiceIbZero: IbCPersonalDataZeroService,
    private contactDetailsServiceIbZero: IbCContactDetailsZeroService,
    private ibCAuthService: IbCAuthService,
    private newPaymentAvailiabilityService: IbCNewPaymentAvailiabilityService,
  ) {}

  /**
   * @description Forces the updating of the store info from server data
   */
  updateUserInfoFromServer() {
    if (!this.isUpdatingInfo) {
      this.isUpdatingInfo = true;
      this.ibCUserStoreService.setLoading(true);
      this.serviceCall()
        .pipe(
          tap((res) => {
            this.ibCUserStoreService.setUser(res);
          }),
          finalize(() => {
            this.isUpdatingInfo = false;
            this.ibCUserStoreService.setLoading(false);
          }),
          catchError(() => {
            this.sessionStorageService.remove("reloadCustomerComplete");
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  revokeToken() {
    this.ibCUserStoreService.setLoading(true);
    this.ibCAuthService
      .revokeNecessaryToken()
      .pipe(
        timeout(this.TIMEOUT_LOGOUT),
        finalize(() => {
          this.ibCUserStoreService.setLoading(false);
        }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }

  /**
   * @description Get Ibera Plus personal infromation from server and updates all server response caches
   */
  private getIbPlusServerInformation() {
    return this.memberServiceIbPlus.getPersonalData().pipe(
      tap((res) => {
        /** OLD ANGULARJS STATE **/
        this.sessionStorageService.set("memeberDetails", {
          code: 200,
          data: res,
        });
        this.sessionStorageService.remove("reloadCustomerComplete");
        /** WCS CACHE **/
        this.sessionStorageService.set(
          CommonsConstants.WCS_CUSTOMERDATA_STORAGES.IBPLUS,
          res,
          { withPrefix: false },
        );
      }),
    );
  }

  /**
   * @description Get Ibera Zero personal infromation from server and updates all server response caches
   */
  private getIbZeroServerInformation() {
    return forkJoin([
      this.personalDataServiceIbZero.getPersonalData(),
      this.contactDetailsServiceIbZero.getContactDetails(),
    ]).pipe(
      tap((res) => {
        /** OLD ANGULARJS STATE **/
        this.sessionStorageService.set("memeberDetails", [
          { code: 200, data: res[0] },
          { code: 200, data: res[1] },
        ]);
        this.sessionStorageService.remove("reloadCustomerComplete");
        /** WCS CACHE **/
        this.sessionStorageService.set(
          CommonsConstants.WCS_CUSTOMERDATA_STORAGES.IBZERO,
          res,
          { withPrefix: false },
        );
      }),
    );
  }

  /**
   * Internal function to map what service has to be call depending on user
   */
  private serviceCall = (): Observable<IberiaWebUser> => {
    const userLoggedNotONB = Boolean(
      this.tokenUtilsService.getSFRefreshToken(),
    );
    const userLoggedONB = Boolean(this.tokenUtilsService.getONBRefreshToken());
    const isIberiaPlus =
      this.userUtilsService.isIbPlus() ??
      this.tokenUtilsService.getUserTypeFromToken() ===
        CommonsConstants.ROLE_IBERIA_PLUS ??
      this.commonsCookiesService.get(CommonsConstants.COOKIES.WCS_USER_TYPE) ===
        "IBPLUS";

    if (userLoggedNotONB) {
      if (isIberiaPlus) {
        return this.getIbPlusServerInformation().pipe(
          map(
            (res: MemberPlusResponse): IberiaPlusUser =>
              this.transformerUserService.transformIbPlusMembers(
                res,
                this.userUtilsService.isSoftUser(),
              ),
          ),
        );
      }
      return this.getIbZeroServerInformation().pipe(
        map((res) =>
          this.transformerUserService.transformIbZeroPersonalData(
            res,
            this.userUtilsService.isSoftUser(),
          ),
        ),
      );
    }
    if (userLoggedONB) {
      // @todo Update information to ONB from server could be implemented in future
      return EMPTY;
    }
    return EMPTY;
  };
}
