@Directives("ib-commons-directives-module", [], [])
class ibDniValidator implements ng.IDirective {
  constructor() {}
  // Usage: <input ng-model="model" ib-dni-validator></input>
  //
  // Creates: adds a Spanish Dni validator to the input
  //

  restrict: "A";
  link = ($scope, $element, $attrs, $modelCtrl) => {
    const validRegex = /^[XYZ]?([0-9]{7,8})([A-Z])$/i;
    const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKET";
    $modelCtrl.$parsers.unshift((value) => {
      const originalValue = value;
      let valid = false,
        niePrefix;
      if (value && value.length === 9) {
        value = value.toUpperCase().replace(/\s/, "");
        niePrefix = value.charAt(0);
        switch (niePrefix) {
          case "X":
            niePrefix = 0;
            break;
          case "Y":
            niePrefix = 1;
            break;
          case "Z":
            niePrefix = 2;
            break;
        }
        value = niePrefix + value.substr(1);
        valid = false;
        if (validRegex.test(value)) {
          valid =
            value.charAt(8) === dniLetters.charAt(parseInt(value, 10) % 23);
        }
      }

      $modelCtrl.$setValidity("dni", valid);
      return valid ? originalValue : originalValue;
    });
  };
}
