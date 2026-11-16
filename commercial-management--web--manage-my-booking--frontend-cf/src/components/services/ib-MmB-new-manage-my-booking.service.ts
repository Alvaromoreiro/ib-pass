import { Injectable } from "@angular/core";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { downgradeToAJSService } from "ib-web-commons/utils";
@Injectable({
    providedIn: 'root'
})
export class NewManageMyBookingService {
  private umdLoad$: Promise<any> | null = null;
  private readonly SEARCH_NEW_URL = `${MmBAppConstants.cloudDigitalWeb}/manage-my-booking/manage-my-booking--frontend.umd.js`;

  // use Local DEV
  // private readonly SEARCH_NEW_URL = `http://localhost:4173/manage-my-booking--frontend.umd.js`;
  

  constructor() {}

  importNewManageMyBookingComponent = async () => {
     if (!this.umdLoad$) {
      this.umdLoad$ = this.dynamicImporter(this.SEARCH_NEW_URL);
      return this.umdLoad$;
     };
     return this.umdLoad$;
  };

  /*
   * Dynamic Import webComponent.
   * Added  webpackIgnore: true to avoid launch webpack error.
   */
  private dynamicImporter = (url: string) =>
    import(/* webpackIgnore: true */ url);
}

downgradeToAJSService('NewManageMyBookingService', NewManageMyBookingService, 'ib-MmB-services-module');