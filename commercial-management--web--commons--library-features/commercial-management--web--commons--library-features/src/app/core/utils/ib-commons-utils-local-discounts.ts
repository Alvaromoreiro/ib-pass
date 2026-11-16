import * as angular from "angular";
import { CommonsConstantsType } from "../constants/ib-commons-constants";
import { CommonsCommercialSellingDataUtils } from "./ib-commons-commercial-selling-data-utils";

@Service("ib-commons-utils-module", [
  "CommonsConstants",
  "CommonsCommercialSellingDataUtils",
])
export class CommonLocalDiscountsService {
  constructor(
    private CommonsConstants: CommonsConstantsType,
    private CommonsCommercialSellingDataUtils: CommonsCommercialSellingDataUtils,
  ) {}

  getResidentsDiscountsForRoute = (
    origin: string = "",
    destination: string = "",
  ): Array<string> => {
    const result: Array<string> = [];
    const discountsData =
      this.CommonsCommercialSellingDataUtils.getLocalDiscountsInfo();
    const availableCitiesConfig: any = {};

    discountsData.forEach((discount) => {
      if (discount.cities && discount.cities[0]) {
        availableCitiesConfig[discount.code] = discount.cities;
      }
    });

    if (
      availableCitiesConfig.CEUTA &&
      availableCitiesConfig.CEUTA.some(
        (city) => city.code === origin || city.code === destination,
      )
    ) {
      result.push(
        this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT.items[6].value,
      );
    }
    if (
      availableCitiesConfig.MELILLA &&
      availableCitiesConfig.MELILLA.some(
        (city) => city.code === origin || city.code === destination,
      )
    ) {
      result.push(
        this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT.items[5].value,
      );
    }
    if (
      availableCitiesConfig.BALEARES &&
      availableCitiesConfig.BALEARES.some((city) => city.code === origin) &&
      availableCitiesConfig.BALEARES.some((city) => city.code === destination)
    ) {
      result.push(
        this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT.items[4].value,
      );
    } else if (
      availableCitiesConfig.BALEARES &&
      availableCitiesConfig.BALEARES.some(
        (city) => city.code === origin || city.code === destination,
      )
    ) {
      result.push(
        this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT.items[3].value,
      );
    }
    if (
      availableCitiesConfig.CANARIAS &&
      availableCitiesConfig.CANARIAS.some((city) => city.code === origin) &&
      availableCitiesConfig.CANARIAS.some((city) => city.code === destination)
    ) {
      result.push(
        this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT.items[2].value,
      );
    } else if (
      availableCitiesConfig.CANARIAS &&
      availableCitiesConfig.CANARIAS.some(
        (city) => city.code === origin || city.code === destination,
      )
    ) {
      result.push(
        this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT.items[1].value,
      );
    }

    return result;
  };

  isResidentAvailable = (
    origin: string = "",
    destination: string = "",
  ): boolean =>
    this.getResidentsDiscountsForRoute(origin, destination).length > 0;

  getDiscountsConfig = () => {
    return angular.copy({
      resident: this.CommonsConstants.DISCOUNT_SEARCH_RESIDENT,
      largeFamily: this.CommonsConstants.DISCOUNT_SEARCH_FAMILY,
    });
  };
}
