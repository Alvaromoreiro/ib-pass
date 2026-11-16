@Directives("ib-commons-directives-module", [], [])
class ibValidatorCleaner implements ng.IDirective {
  constructor() {}

  require = "ngModel";

  link = (scope: any, element: any, attrs: any, modelCtrl: any): void => {
    const validateCleaner = (inputValue: string): string => {
      if (attrs.ibValidatorCleaner) {
        const transformedInput = inputValue.replace(
          new RegExp(attrs.ibValidatorCleaner, "gi"),
          "",
        );

        if (transformedInput !== inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return transformedInput;
      }
      return inputValue;
    };

    element.on("input", () => {
      const inputValue: string = element.val().trim();
      validateCleaner(inputValue);
    });
  };
}
