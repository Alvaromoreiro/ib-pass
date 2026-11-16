@Controller(
  "ib-commons-modal-service-module",
  [
    "$scope",
    "$uibModalInstance",
    "object",
    "CurrencyService",
    "DatalayerUtilsService",
  ],
  [],
)
class FiltersModalController implements ng.IController {
  public model: any;

  constructor(
    private $scope: ScopeDigest,
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
    private object: object,
    private CurrencyService: any,
    private DatalayerUtilsService: any,
  ) {
    this.model = this.object;
  }
  ////////////////

  $onInit() {
    this.$scope.$$postDigest(() => {
      this.$scope.$broadcast("rzSliderForceRender");
    });
    this.activate();
  }

  activate = (): void => {
    this.model.filterOptions.cabin = !this.model.filterOptions.cabin
      ? this.model.filterOptions.cabinType.anyCabin
      : this.model.filterOptions.cabin;
    this.DatalayerUtilsService.sendDatalayerModalEvent(this.model);
    this.$uibModalInstance.result.then(
      () => {
        this.DatalayerUtilsService.removeDatalayerModalAttrs();
      },
      () => {
        this.DatalayerUtilsService.removeDatalayerModalAttrs();
      },
    );
  };

  ////////////////
  /**
   * Closes the modal dismissing its instance
   */
  close = (): void => {
    this.$uibModalInstance.dismiss();
  };

  /**
   * Closes the modal calling close method of its instance
   */
  accept = (): void => {
    this.$uibModalInstance.close(this.applyFilters());
  };

  /**
   * Update the prices of the range slider when user changes cabin and set cabin type.
   */
  updateRangePrices = (cabinType: string) => {
    if (
      (!cabinType || cabinType === "anyCabin") &&
      this.model.filterOptions.price
    ) {
      if (this.model.filterOptions.price)
        this.model.filterOptions.price = angular.copy(
          this.model.initialFilterOptions.price,
        );
    } else {
      this.model.filterOptions.cabin.type = cabinType;
      if (this.model.filterOptions.price)
        this.model.filterOptions.price = angular.copy(
          this.model.filterOptions.pricesByCabin[cabinType],
        );
    }
  };

  formatPrice = (price: number) => {
    return this.CurrencyService.formatPrice(
      this.model.currency,
      price,
      false,
      true,
    );
  };

  /**
   * Push filters to filters array to show in the view
   */
  applyFilters = () => {
    const filters: CommonsModalsModels.FilterData = {
      cabinType: {
        description:
          "Cabina" +
          " " +
          (angular.isDefined(this.model.filterOptions.cabin)
            ? this.model.filterOptions.cabin.cabinDescription
            : ""),
        value: angular.isDefined(this.model.filterOptions.cabin)
          ? this.model.filterOptions.cabin.type
          : "",
        enable:
          angular.isDefined(this.model.filterOptions.cabin) &&
          this.model.filterOptions.cabin.cabinAvailable,
      },
    };
    if (this.model.filterOptions.stopsNumber1)
      filters.stopsNumber1 = this.model.filterOptions.stopsNumber1;
    if (this.model.filterOptions.stopsNumber2)
      filters.stopsNumber2 = this.model.filterOptions.stopsNumber2;
    if (this.model.filterOptions.stopsNumber3)
      filters.stopsNumber3 = this.model.filterOptions.stopsNumber3;

    if (angular.isDefined(this.model.filterOptions.avios)) {
      filters.avios = {
        value: this.model.filterOptions.avios,
        enable: this.model.filterOptions.avios,
      };
    }
    if (this.model.filterOptions.price) {
      filters.price = {
        initFormatValue: this.formatPrice(
          this.model.filterOptions.price.minValue,
        ),
        endFormatValue: this.formatPrice(
          this.model.filterOptions.price.maxValue,
        ),
        value: [
          this.model.filterOptions.price.minValue,
          this.model.filterOptions.price.maxValue,
        ],
        enable:
          this.model.filterOptions.cabin &&
          this.model.filterOptions.cabin.type &&
          this.model.filterOptions.cabin.cabinAvailable
            ? !angular.equals(
                this.model.filterOptions.price,
                this.model.filterOptions.pricesByCabin[
                  this.model.filterOptions.cabin.type
                ],
              )
            : !angular.equals(
                this.model.filterOptions.price,
                this.model.initialFilterOptions.price,
              ),
      };
    }
    filters.departureHours = {
      description: {
        min:
          this.model.filterOptions.departureHours.minValue / 60 < 10
            ? "0" +
              Math.floor(
                this.model.filterOptions.departureHours.minValue / 60,
              ) +
              ((this.model.filterOptions.departureHours.minValue / 60) % 1 === 0
                ? ":00"
                : ":30")
            : Math.floor(
                this.model.filterOptions.departureHours.minValue / 60,
              ) +
              ((this.model.filterOptions.departureHours.minValue / 60) % 1 === 0
                ? ":00"
                : ":30"),
        max:
          this.model.filterOptions.departureHours.maxValue / 60 < 10
            ? "0" +
              Math.floor(
                this.model.filterOptions.departureHours.maxValue / 60,
              ) +
              ((this.model.filterOptions.departureHours.maxValue / 60) % 1 === 0
                ? ":00"
                : ":30")
            : Math.floor(
                this.model.filterOptions.departureHours.maxValue / 60,
              ) +
              ((this.model.filterOptions.departureHours.maxValue / 60) % 1 === 0
                ? ":00"
                : ":30"),
      },
      value: [
        this.model.filterOptions.departureHours.minValue,
        this.model.filterOptions.departureHours.maxValue,
      ],
      enable: !angular.equals(
        this.model.filterOptions.departureHours,
        this.model.initialFilterOptions.departureHours,
      ),
    };
    filters.arrivalHours = {
      description: {
        min:
          this.model.filterOptions.arrivalHours.minValue / 60 < 10
            ? "0" +
              Math.floor(this.model.filterOptions.arrivalHours.minValue / 60) +
              ((this.model.filterOptions.arrivalHours.minValue / 60) % 1 === 0
                ? ":00"
                : ":30")
            : Math.floor(this.model.filterOptions.arrivalHours.minValue / 60) +
              ((this.model.filterOptions.arrivalHours.minValue / 60) % 1 === 0
                ? ":00"
                : ":30"),
        max:
          this.model.filterOptions.arrivalHours.maxValue / 60 < 10
            ? "0" +
              Math.floor(this.model.filterOptions.arrivalHours.maxValue / 60) +
              ((this.model.filterOptions.arrivalHours.maxValue / 60) % 1 === 0
                ? ":00"
                : ":30")
            : Math.floor(this.model.filterOptions.arrivalHours.maxValue / 60) +
              ((this.model.filterOptions.arrivalHours.maxValue / 60) % 1 === 0
                ? ":00"
                : ":30"),
      },
      value: [
        this.model.filterOptions.arrivalHours.minValue,
        this.model.filterOptions.arrivalHours.maxValue,
      ],
      enable: !angular.equals(
        this.model.filterOptions.arrivalHours,
        this.model.initialFilterOptions.arrivalHours,
      ),
    };
    return filters;
  };
}
