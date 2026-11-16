import { CurrencyService } from "../../utils/ib-commons-currency-service";

@Service("ib-commons-http-service-module", ["CurrencyService", "$filter"])
export class IbCCheckBonusTransformer {
  constructor(
    private CurrencyService: CurrencyService,
    private $filter: angular.IFilterService,
  ) {}

  transformResponse = (
    response: IbCheckBonusModel.BonusResponse,
  ): IbCheckBonusModel.BonusTransformerResponse => {
    const currency = this.CurrencyService.getCurrencyObject(response.currency);
    let companies = "";
    if (response?.journey?.companies) {
      response.journey.companies.forEach((company) => {
        companies = companies ? `${companies}, ` : "";
        companies = `${companies}${company.description}`;
      });
    } else {
      companies = this.$filter("translate")(
        "MY_BONUS_CHECK_BONUS_TABLE_ALL_COMPANIES",
      );
    }

    let remainingUses = "";
    if (
      response.maxUsages !== 0 &&
      (response.type === "GIFT_CARD" || response.maxUsages === 1000000)
    ) {
      remainingUses = this.$filter("translate")(
        "MY_BONUS_CHECK_BONUS_TABLE_REMAINING_USE_UNLIMITED",
      );
    } else if (response.maxUsages > 1) {
      // si tenemos booking reference hacemos la resta
      remainingUses = response.maxUsages.toString();
    } else if (response.maxUsages === 1) {
      remainingUses = this.$filter("translate")(
        "MY_BONUS_CHECK_BONUS_TABLE_REMAINING_USES_ONE_USE",
      );
    } else {
      remainingUses = this.$filter("translate")(
        "MY_BONUS_CHECK_BONUS_TABLE_REMAINING_USES_USED",
      );
    }
    let expireDate = this.$filter("translate")(
      "MY_BONUS_CHECK_BONUS_TABLE_UNLIMITED",
    );
    if (response?.expiryDate?.to) {
      expireDate = this.$filter<any>("mDateFormatterByLanguage")(
        response.expiryDate.to,
        "large",
      );
    }
    let returnLimitDate = this.$filter("translate")(
      "MY_BONUS_CHECK_BONUS_TABLE_UNLIMITED",
    );
    if (response?.journey?.arrival?.allowed?.to) {
      returnLimitDate = this.$filter<any>("mDateFormatterByLanguage")(
        response.journey.arrival.allowed.to,
        "large",
      );
    }
    const bookingReferences = [];
    if (response.bookingReferences.length > 0) {
      response.bookingReferences.forEach((reference) => {
        const item = `${reference.reference}, ${this.$filter<any>(
          "mDateFormatterByLanguage",
        )(reference.date, "large")}, ${this.CurrencyService.formatPrice(
          currency,
          reference.amount,
          true,
          false,
        )}`;
        bookingReferences.push(item);
      });
    }
    return {
      voucherId: response.commercialCode,
      amount: this.CurrencyService.formatPrice(
        currency,
        response.amount,
        true,
        false,
      ),
      expireDate: expireDate,
      companies: companies,
      returnLimitDate: returnLimitDate,
      uses: bookingReferences,
      remainingUses: remainingUses,
      percentage: response.percentage,
      status: response.status,
    };
  };
}
