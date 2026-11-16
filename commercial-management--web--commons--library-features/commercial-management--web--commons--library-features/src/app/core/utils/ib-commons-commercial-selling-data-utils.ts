@Service(
  "ib-commons-utils-module",
  ["localStorageService", "$rootScope"],
  ["ib-commons-http-new-service-module"],
)
export class CommonsCommercialSellingDataUtils {
  constructor(
    private localStorageService: angular.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
  ) {}

  getCommercialsellingDataByMarket(commercialData) {
    let appMarketDescription = "";

    let i,
      j = 0,
      founded = false;
    let returnCommercialData: any = {};
    for (i = 0; i < commercialData.length; i++) {
      while (!founded && j < commercialData.length) {
        if (commercialData[j].market.code === this.$rootScope.appMarket) {
          returnCommercialData = commercialData[j];
          appMarketDescription = commercialData[j].market.description;
          this.localStorageService.set(
            "appMarketDescription",
            appMarketDescription,
          );
          founded = true;
        }
        j++;
      }
    }
    this.getLocalDiscountsInfo();
    return returnCommercialData;
  }

  getLocalDiscountsInfo() {
    const availableDiscounts = [];
    const commercialDataStoraged: any =
      this.localStorageService.get("commercialData");
    if (
      commercialDataStoraged &&
      commercialDataStoraged.discounts &&
      commercialDataStoraged.discounts.length > 0
    ) {
      commercialDataStoraged.discounts.forEach((discount) => {
        availableDiscounts.push(discount);
      });
    }
    return availableDiscounts;
  }
}
