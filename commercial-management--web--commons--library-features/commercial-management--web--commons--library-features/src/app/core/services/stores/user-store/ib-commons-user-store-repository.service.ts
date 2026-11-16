import { Injectable } from "@angular/core";
import {
  IbCUserUtilsService,
  downgradeToAJSService,
} from "ib-web-commons/utils";
import { IberiaWebUser } from "ib-web-commons/models";
import { IbAnonymousInitialValue } from "./ib-commons-user-store.constants";
import { IbCUserStoreService } from "./ib-commons-user-store.service";
import { IbCUserStoreCommunicationService } from "./ib-commons-user-store-communication.service";
import { IbCUserHttpManagementService } from "./ib-commons-user-http-management.service";
import { IbCUserStoreManagementService } from "./ib-commons-user-store-management.service";
import { tap, share } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IbCUserStoreRepositoryService {
  private firstSubscription = true;

  constructor(
    private userUtilsService: IbCUserUtilsService,
    private ibCUserStoreService: IbCUserStoreService,
    private ibCUserStoreCommunicationService: IbCUserStoreCommunicationService,
    private ibCUserHttpManagementService: IbCUserHttpManagementService,
    private ibCUserStoreManagementService: IbCUserStoreManagementService,
  ) {
    this.ibCUserStoreCommunicationService.syncStateListeners();
    this.ibCUserStoreManagementService.initializeStore();
  }

  /**
   * Method to log out the user from the store and communicate the interaction to all data in Iberia.
   */
  logoutUser(): void {
    this.ibCUserHttpManagementService.revokeToken();
    this.ibCUserStoreService.setUser(IbAnonymousInitialValue);
    this.userUtilsService.logout();
    this.ibCUserStoreCommunicationService.emitLogOut();
  }

  /**
   * Main method to get the state of an user inside an Iberia app. Returns the personal information.
   * CAREFUL: Unsubscribe this observable when destroying component.
   */
  getUserState() {
    if (this.firstSubscription) {
      this.ibCUserStoreManagementService.getActualInfo();
      this.firstSubscription = false;
    }
    return this.ibCUserStoreService.get().pipe(share());
  }

  /**
   * Subscribe to the user information stored in the app, a new message will be emit when it changes.
   * CAREFUL: Unsubscribe this observable when destroying component.
   */
  getUserInfo() {
    if (this.firstSubscription) {
      this.ibCUserStoreManagementService.getActualInfo();
      this.firstSubscription = false;
    }
    return this.ibCUserStoreService.getUser().pipe(share());
  }

  /**
   * Forces the updating of the store info from server data
   */
  updateFromServer() {
    this.ibCUserHttpManagementService.updateUserInfoFromServer();
  }

  /**
   * Changes the state of the user to be permanent user. The user has to be Iberia or Iberia Plus and has limitations.
   * @param permanentUser
   */
  updateToPermanentUser(permanentUser: boolean) {
    const actualUser = this.ibCUserStoreService.getActualUser();
    if (
      actualUser &&
      (actualUser.appUserInfo.userType === "IB_PLUS" ||
        actualUser.appUserInfo.userType === "IB_ZERO")
    ) {
      const newUser = {
        ...actualUser,
        appUserInfo: {
          ...actualUser.appUserInfo,
          permanentUser,
        },
      } as IberiaWebUser;
      this.ibCUserStoreService.setUser(newUser);
      this.userUtilsService.setSoftUser(permanentUser);
    }
  }
}

downgradeToAJSService(
  "IbCUserStoreRepositoryService",
  IbCUserStoreRepositoryService,
  "ib-commons-utils-module",
);
