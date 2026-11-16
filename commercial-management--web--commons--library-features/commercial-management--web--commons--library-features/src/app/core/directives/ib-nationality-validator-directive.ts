@Directives("ib-commons-directives-module", [], [])
class ibNationalityValidator implements ng.IDirective {
  USE_SURNAME_NATIONALITY_PATTERN: string[] = ["ES"];
  TWO_SURNAMES_EXPRESSION: RegExp =
    /^(?!.*[0-9*¡!?¿<>\\ºª|/·@#$%&,;=?¿())_+{}\[\]"\^€$£])(.+ .+)/;

  restrict: string = "A";
  require = "ngModel";

  constructor() {}

  link = ($scope: any, $element: any, $attrs: any, $modelCtrl: any) => {
    const validateNationality = (surname: string): string => {
      $modelCtrl.$setValidity(
        "nationality",
        this.nationalityCheck(surname, $attrs.ibNationalityValidator),
      );
      return surname;
    };
    $modelCtrl.$parsers.push(validateNationality);
    $modelCtrl.$formatters.push(validateNationality);

    $attrs.$observe("ibNationalityValidator", (value: any): void => {
      validateNationality($modelCtrl.$modelValue);
    });
  };

  nationalityCheck = (surname: string, nation: string) => {
    return (
      this.USE_SURNAME_NATIONALITY_PATTERN.indexOf(nation) === -1 ||
      (surname && this.TWO_SURNAMES_EXPRESSION.test(surname))
    );
  };
}
