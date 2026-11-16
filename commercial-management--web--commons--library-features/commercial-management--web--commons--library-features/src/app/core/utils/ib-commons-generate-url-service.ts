import dayjs from "dayjs";
import { CommonsConstantsType } from "../constants/ib-commons-constants";

@Service("ib-commons-utils-module", [
  "localStorageService",
  "CommonsConstants",
  "$rootScope",
  "$window",
])
export class IbCommonsGenerateUrlService {
  constructor(
    private localStorageService: ng.local.storage.ILocalStorageService,
    private CommonsConstants: CommonsConstantsType,
    private $rootScope: CommonsRootScope,
    private $window: ng.IWindowService,
  ) {}

  generateBKIUrl = (
    advancedSearchData: CommonsGenerateUrlModel.URLRequestData,
    flow: string,
  ) => {
    let bookingUrlParams: CommonsGenerateUrlModel.BookingUrlParams =
      this.localStorageService.get("bookingUrlParams");
    let newAvailabilityRequestData: CommonsGenerateUrlModel.NewRequestData =
      this.localStorageService.get("availabilityRequestData");
    const createUrlParams = () => {
      bookingUrlParams.originDestinations = [];
      bookingUrlParams.originDestinations.push({
        origin: advancedSearchData.cityOrigin.code,
        destination: advancedSearchData.cityDestiny.code,
        date: dayjs(advancedSearchData.selectedOutbondDate).format(
          "YYYY-MM-DD",
        ),
      });
      if (
        advancedSearchData.tripOptionSelected.code ===
        this.CommonsConstants.TRIPS_OPTION_SELECTED.TWO
      ) {
        bookingUrlParams.originDestinations.push({
          origin: advancedSearchData.cityDestiny.code,
          destination: advancedSearchData.cityOrigin.code,
          date: dayjs(advancedSearchData.selectedReturnDate).format(
            "YYYY-MM-DD",
          ),
        });
      }
      bookingUrlParams.tripType = advancedSearchData.tripOptionSelected.code;
      bookingUrlParams.preferredCabin = advancedSearchData.cabinSelected.code;
      bookingUrlParams.flexDates = advancedSearchData.flexDates;
      bookingUrlParams.payWithAvios = advancedSearchData.payWithAvios;
      bookingUrlParams.payWithPoints = advancedSearchData.payWithPoints;
      bookingUrlParams.largeFamilyType =
        advancedSearchData.discountFamily.value;
      bookingUrlParams.resident = advancedSearchData.discountResident.value;
      bookingUrlParams.senior = 0;
      bookingUrlParams.young = 0;
      bookingUrlParams.teenager = 0;
      advancedSearchData.passengersSelected.forEach((passengger) => {
        switch (passengger.passengerType) {
          case this.CommonsConstants.PASSENGER_TYPES.SENIOR:
            bookingUrlParams.senior = passengger.count || 0;
            break;
          case this.CommonsConstants.PASSENGER_TYPES.ADULT:
            bookingUrlParams.adult = passengger.count || 0;
            break;
          case this.CommonsConstants.PASSENGER_TYPES.YOUTH:
            bookingUrlParams.young = passengger.count || 0;
            break;
          case this.CommonsConstants.PASSENGER_TYPES.YOUNG:
            bookingUrlParams.teenager = passengger.count || 0;
            break;
          case this.CommonsConstants.PASSENGER_TYPES.CHILD:
            bookingUrlParams.child = passengger.count || 0;
            break;
          case this.CommonsConstants.PASSENGER_TYPES.INFANT:
            bookingUrlParams.infant = passengger.count || 0;
            break;
        }
      });
      if (advancedSearchData.flashOffer) {
        bookingUrlParams.flashOffer = advancedSearchData.flashOffer;
        bookingUrlParams.flashOfferId = advancedSearchData.flashOfferId;
      }
      //reset passenger senior, youth and teenager to 0
      this.localStorageService.set("bookingUrlParams", bookingUrlParams);
    };
    const createAvailabilityRequest = () => {
      newAvailabilityRequestData.slices = bookingUrlParams.originDestinations;
      newAvailabilityRequestData.passengers =
        advancedSearchData.passengersSelected.filter((passengers) => {
          return passengers.count > 0;
        });
      newAvailabilityRequestData.preferredCabin =
        advancedSearchData.cabinSelected.cabinClass;
      this.localStorageService.set(
        "availabilityRequestData",
        newAvailabilityRequestData,
      );
    };
    const getMarketLocaleURLParams = () => {
      let result =
        "market=" +
        this.$rootScope.appMarket +
        "&language=" +
        this.$rootScope.appLang;
      if (advancedSearchData.payWithAvios) {
        const redemptionRedirecionMap = this.localStorageService.get(
          "newRedemptionMarketsRedirections",
        );
        if (
          typeof redemptionRedirecionMap === "object" &&
          typeof redemptionRedirecionMap[this.$rootScope.appMarket] ===
            "undefined" &&
          typeof redemptionRedirecionMap[this.$rootScope.appMarket]
            .marketRedirect === "string" &&
          redemptionRedirecionMap[this.$rootScope.appMarket].marketRedirect
            .length > 0
        ) {
          result =
            "market=" +
            redemptionRedirecionMap[this.$rootScope.appMarket].marketRedirect +
            "&fromMarket=" +
            this.$rootScope.appMarket;
          if (
            typeof redemptionRedirecionMap[this.$rootScope.appMarket]
              .localesRedirect === "object" &&
            typeof redemptionRedirecionMap[this.$rootScope.appMarket]
              .localesRedirect[this.$rootScope.appLang] === "string" &&
            redemptionRedirecionMap[this.$rootScope.appMarket].localesRedirect[
              this.$rootScope.appLang
            ].length > 0
          ) {
            result +=
              "&language=" +
              (redemptionRedirecionMap[this.$rootScope.appMarket]
                .localesRedirect[this.$rootScope.appLang] ||
                this.$rootScope.appLang) +
              "&fromLanguage=" +
              this.$rootScope.appLang;
          }
        }
      }
      return result;
    };
    const flowPathName = () => {
      let path = `${this.$window.location.origin}/`;
      switch (flow) {
        case "FLASH":
          path += this.CommonsConstants.BKI_URL_PATH_NAME.FLASH;
          break;
        default:
          path += this.$window.location.pathname;
          break;
      }
      return path;
    };
    if (!bookingUrlParams) {
      bookingUrlParams = this.CommonsConstants.BKI_URL_MODEL_EMPTY;
    }
    if (!newAvailabilityRequestData) {
      newAvailabilityRequestData =
        this.CommonsConstants.BKI_NEW_REQUEST_MODEL_EMPTY;
    }
    createUrlParams();
    createAvailabilityRequest();
    const dateOutbound = newAvailabilityRequestData.slices[0].date.split("-");
    let dateReturn = ["0", "0", "0"];
    if (newAvailabilityRequestData.slices[1]) {
      dateReturn = newAvailabilityRequestData.slices[1].date.split("-");
    }
    let url = `${flowPathName()}?${getMarketLocaleURLParams()}&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=${
      bookingUrlParams.flexDates
    }&TRIP_TYPE=${advancedSearchData.tripOptionSelected.code}&BEGIN_CITY_01=${
      advancedSearchData.cityOrigin.code
    }&END_CITY_01=${advancedSearchData.cityDestiny.code}&BEGIN_DAY_01=${
      dateOutbound[2]
    }&BEGIN_MONTH_01=${dateOutbound[0].concat(dateOutbound[1])}&BEGIN_YEAR_01=${
      dateOutbound[0]
    }&END_DAY_01=${dateReturn[2]}&END_MONTH_01=${dateReturn[0].concat(
      dateReturn[1],
    )}&END_YEAR_01=${dateReturn[0]}&FARE_TYPE=${
      advancedSearchData.cabinSelected.code
    }&quadrigam=IBHMPA&ADT=${bookingUrlParams.adult}&CHD=${
      bookingUrlParams.child
    }&INF=${bookingUrlParams.infant}&BNN=${bookingUrlParams.teenager}&YTH=${
      bookingUrlParams.young
    }&YCD=${bookingUrlParams.senior}&residentCode=${
      bookingUrlParams.resident
    }&familianumerosa=${bookingUrlParams.largeFamilyType}${
      bookingUrlParams.ibGroup ? "&IB_GROUP=" + bookingUrlParams.ibGroup : ""
    }${
      bookingUrlParams.codeTracking
        ? "&codeTracking=" + bookingUrlParams.codeTracking
        : ""
    }${
      bookingUrlParams.backToUrl
        ? "&backtourl=" + bookingUrlParams.backToUrl
        : ""
    }&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES`;
    if (advancedSearchData.payWithAvios) {
      url += "&pagoAvios=true";
    }
    if (advancedSearchData.payWithPoints) {
      url += "&pagoPuntos=true";
    }
    if (advancedSearchData.flashOffer) {
      url += `&flashOffer=true&flashOfferId=${bookingUrlParams.flashOfferId}`;
    }
    return url;
  };
}
