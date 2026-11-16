import { Injectable } from "@angular/core";
import { tap, filter } from "rxjs";
import {
  IbCUserUtilsService,
  CommonsSessionStorageService,
  IbCTokenUtilsService,
} from "ib-web-commons/utils";
import { CommonsConstants } from "ib-web-commons/constants";
import {
  CustomerDataInfoStorage,
  MemberPlusResponse,
  PersonalDataZeroResponse,
  ContactDetailsZeroResponse,
  IbOnBusinessMembershipResponse,
  IberiaWebUser,
  IberiaPlusUser,
  CustomerDataONBStorage,
  IberiaZeroUser,
} from "ib-web-commons/models";
import { IbCUserStoreTransformerService } from "./ib-commons-user-store-transformer.service";
import { IbCDatalayerUtilsService } from "ib-web-commons/ib-datalayer";
import { IbAnonymousInitialValue } from "./ib-commons-user-store.constants";
import { IbCUserStoreService } from "./ib-commons-user-store.service";
import { IbCUserHttpManagementService } from "./ib-commons-user-http-management.service";

@Injectable({
  providedIn: "root",
})
export class IbCUserStoreManagementService {
  constructor(
    private userUtilsService: IbCUserUtilsService,
    private tokenUtilsService: IbCTokenUtilsService,
    private sessionStorageService: CommonsSessionStorageService,
    private transformerUserService: IbCUserStoreTransformerService,
    private datalayerService: IbCDatalayerUtilsService,
    private ibCUserStoreService: IbCUserStoreService,
    private ibCUserHttpManagementService: IbCUserHttpManagementService,
  ) {}

  initializeStore() {
    this.ibPlusEffect();
    this.ibZeroEffect();
  }

  private ibPlusEffect() {
    this.ibCUserStoreService
      .getUser()
      .pipe(
        filter((stored): stored is IberiaWebUser => Boolean(stored)),
        filter(
          (stored): stored is IberiaPlusUser =>
            stored.appUserInfo.userType === "IB_PLUS",
        ),
        tap((res) => {
          this.userUtilsService.setUserLogged(true);
          this.userUtilsService.setIbPlus();
          this.sessionStorageService.set(
            "tierLevel",
            res.appUserInfo.tierLevel,
          );
          const customerData =
            this.transformerUserService.transformIberiaPlusInfoToCustomerData(
              res.serviceResponse,
            );
          this.updateCustomerData(customerData);
        }),
      )
      .subscribe();
  }

  private ibZeroEffect() {
    this.ibCUserStoreService
      .getUser()
      .pipe(
        filter((stored): stored is IberiaWebUser => Boolean(stored)),
        filter(
          (stored): stored is IberiaZeroUser =>
            stored.appUserInfo.userType === "IB_ZERO",
        ),
        tap((res) => {
          this.userUtilsService.setUserLogged(true);
          this.userUtilsService.setIbZero();
          const customerData =
            this.transformerUserService.transformIberiaZeroInfoToCustomerData(
              res.serviceResponse,
            );
          this.updateCustomerData(customerData);
        }),
      )
      .subscribe();
  }

  /**
   * @description Get stored user info in storage
   */
  private getStoredInfo(): IberiaWebUser | null {
    const userLoggedNotONB = Boolean(
      this.tokenUtilsService.getSFRefreshToken(),
    );
    const userLoggedONB = Boolean(this.tokenUtilsService.getONBRefreshToken());
    const isIberiaPlus =
      this.userUtilsService.isIbPlus() ??
      this.tokenUtilsService.getUserTypeFromToken() ===
        CommonsConstants.ROLE_IBERIA_PLUS;
    const storedMembersInfo =
      this.sessionStorageService.get<MemberPlusResponse>(
        CommonsConstants.WCS_CUSTOMERDATA_STORAGES.IBPLUS,
        { withPrefix: false },
      );
    const storedIberiaInfo = this.sessionStorageService.get<
      [PersonalDataZeroResponse, ContactDetailsZeroResponse]
    >(CommonsConstants.WCS_CUSTOMERDATA_STORAGES.IBZERO, { withPrefix: false });
    const softUser = this.userUtilsService.isSoftUser();

    /** Returns user logged IB or IB+ cached info */
    if (userLoggedNotONB) {
      if (storedMembersInfo && isIberiaPlus) {
        return this.transformerUserService.transformIbPlusMembers(
          storedMembersInfo,
          softUser,
        );
      } else if (storedIberiaInfo && !isIberiaPlus) {
        return this.transformerUserService.transformIbZeroPersonalData(
          storedIberiaInfo,
          softUser,
        );
      }
    }

    /** Returns user logged ONB cached info */
    if (userLoggedONB) {
      const onbCached = this.sessionStorageService.get<CustomerDataONBStorage>(
        "customerDataOB",
        { withPrefix: false },
      );
      const membershipCached =
        this.sessionStorageService.get<IbOnBusinessMembershipResponse>(
          "membershipData",
        );
      if (membershipCached) {
        return this.transformerUserService.transformONBMembershipToStore(
          membershipCached,
        );
      }
      if (onbCached) {
        return this.transformerUserService.transformONBCustomerDataToStore(
          onbCached,
        );
      }
    }
    /** Returns anonymous user info */
    if (!userLoggedNotONB && !userLoggedONB) {
      return IbAnonymousInitialValue;
    }

    return null;
  }

  /**
   * Returns the actual information stored from the user, call to update to service if not available.
   */
  getActualInfo() {
    const storedInfo = this.getStoredInfo();
    if (storedInfo) {
      this.ibCUserStoreService.setUser(storedInfo);
    } else {
      this.ibCUserHttpManagementService.updateUserInfoFromServer();
    }
  }

  /**
   * Update customer data information and datalayer information when user logged information changes
   * @param customerData
   * @private
   */
  private updateCustomerData(customerData: CustomerDataInfoStorage) {
    this.sessionStorageService.set("customerData", customerData);
    const email = customerData.personalInfo.contactEmail;
    if (email) {
      this.transformerUserService
        .generateHashEID(email)
        .then((id) => {
          customerData.generalInfo.hashEID = id;
          this.sessionStorageService.set("customerData", customerData);
          this.datalayerService.updateUserInfo({
            avios: customerData.generalInfo.avios,
            email: customerData.personalInfo.contactEmail,
            category: customerData.generalInfo.category,
            hashEID: id,
          });
        })
        .catch(() => {});
    } else {
      this.datalayerService.updateUserInfo({
        avios: customerData.generalInfo.avios,
        email: customerData.personalInfo.contactEmail,
        category: customerData.generalInfo.category,
      });
    }
  }
}
