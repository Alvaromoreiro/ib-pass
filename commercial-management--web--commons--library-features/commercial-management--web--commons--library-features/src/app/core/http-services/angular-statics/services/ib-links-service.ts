import { CommonsGenericProxy } from "../../../proxies/ib-commons-generic-proxy";
import { IbCLinksProxy } from "../proxy/ib-links-proxy";
import { CommonsConstantsType } from "../../../constants/ib-commons-constants";

@Service("ib-commons-utils-module", [
  "$q",
  "IbCLinksProxy",
  "localStorageService",
  "$rootScope",
  "CommonsGenericProxy",
  "CommonsConstants",
])
export class IbCLinksService {
  constructor(
    private $q: ng.IQService,
    private IbCLinksProxy: IbCLinksProxy,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsConstants: CommonsConstantsType,
  ) {}

  private DEFAULT_LINK_LANG = "en";

  ////////////////
  /**
   * Returns the applicaction static links, depending on current app lang. The route and the lang is getting from $rootScope.
   * In the future there will be a provider to configure this.
   * <ul>
   *  <li>
   *      First it will check if there is a link list in the localStorage field ('linksList')
   *  </li>
   *  <li>
   *      if not, it will call the static links url, and if it is ok, it will return the links list, saving it in the localStorage field ('linksList')
   *  </li>
   *  <li>
   *      If there were an error retrieven the links, it will try to get the DEFAULT_LINK_LANG links, and if there were and error whit those,
   *       then it will return and empty list
   *  </li>
   * </ul>
   * @param {Boolean} forceReload in case of true, it will call the HTTP static again, although the links were in localStorage.
   * @returns {Object.<Promise>} - returns a promise that will never be rejected. When the promise resolves, it returns received data or and empty list
   * in case of error.
   */

    getLinks = (forceReload: boolean, flowApp: string): angular.IPromise<any> =>{
        const linksList = this.localStorageService.get('linksList');
        const defer = this.$q.defer();
        const appLang: string = this.$rootScope.appLang ? this.$rootScope.appLang : this.localStorageService.get<any>('marketLang')?.language;

        const getLinksSuccess = (data) => {
            this.localStorageService.set('linksList', data.data);
            defer.resolve(data);
        };
        const getGeneralLinksSuccess = (data) => {
            this.localStorageService.set('generalLinksList', data.data);
        };
        const getLinksError = ():any => {
            this.CommonsGenericProxy.getGeneric(this.$rootScope.routes.links + '/' + this.DEFAULT_LINK_LANG + '.json').then(getLinksSuccess, getLinksSuccess);
        };
        const getGeneralLinksError = ():any => {
            this.CommonsGenericProxy.getGeneric(this.CommonsConstants.APP_GENERAL_ROUTE + '/' + this.DEFAULT_LINK_LANG + '.json').then(getGeneralLinksSuccess, getGeneralLinksSuccess);
        };
        if (forceReload || linksList === null) {
            try {
                this.CommonsGenericProxy.getGeneric(this.CommonsConstants.APP_ROUTES[flowApp] + '/' + appLang + '.json').then(getLinksSuccess, getLinksError);
            } catch (error) {
                this.CommonsGenericProxy.getGeneric(this.CommonsConstants.APP_GENERAL_ROUTE + '/' + appLang + '.json').then(getGeneralLinksSuccess, getGeneralLinksError);
            }
            this.CommonsGenericProxy.getGeneric(this.CommonsConstants.APP_GENERAL_ROUTE + '/' + appLang + '.json').then(getGeneralLinksSuccess, getGeneralLinksError);
        } else {
            defer.resolve(linksList);
        }
        return defer.promise;
    };

  /**
   * Returns the applicaction static links, depending on current app lang.
   * <ul>
   *  <li>
   *      First it will check if there is a link list in the localStorage field ('linksList')
   *  </li>
   *  <li>
   *      if not, it will call the static links url, and if it is ok, it will return the links list, saving it in the localStorage field ('linksList')
   *  </li>
   *  <li>
   *      If there were an error retrieven the links, it will try to get the DEFAULT_LINK_LANG links, and if there were and error whit those,
   *       then it will return and empty list
   *  </li>
   * </ul>
   * @param {Boolean} forceReload in case of true, it will call the HTTP static again, although the links were in localStorage.
   * @returns {Array} - returns an array with the links or an empty list if error.
   */
  getLinksSync = (forceReload: boolean): any[] => {
    let linksList = this.localStorageService.get("linksList") as any;
    if (forceReload || linksList === null) {
      linksList = this.IbCLinksProxy.getLinksSync(
        this.$rootScope.routes.links + "/" + this.$rootScope.appLang + ".json",
      );
      if (linksList && linksList.errorCode) {
        linksList = this.IbCLinksProxy.getLinksSync(
          this.$rootScope.routes.links + "/" + this.DEFAULT_LINK_LANG + ".json",
        );
        if (linksList.errorCode) {
          linksList = [];
        }
      }
      this.localStorageService.set("linksList", linksList || []);
    }
    return linksList || [];
  };
}
