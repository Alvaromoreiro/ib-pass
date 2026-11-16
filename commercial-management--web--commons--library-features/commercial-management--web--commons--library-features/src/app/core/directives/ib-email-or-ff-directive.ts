@Directives("ib-commons-directives-module", [], [])
class ibEmailOrFf implements ng.IDirective {
  constructor() {}
  // Usage: <input ng-model="model" ib-dni-validator></input>
  //
  // Creates: adds a Spanish Dni validator to the input
  //

  restrict: "A";
  link = ($scope, $element, $attrs, $modelCtrl) => {
    const validateEmailOrFf = (emailOrFf) => {
      if (emailOrFf !== "") {
        $modelCtrl.$setValidity("patternEmailOrFF", checkEmailOrFf(emailOrFf));
      }
      return emailOrFf;
    };
    $modelCtrl.$parsers.push(validateEmailOrFf);

    function checkEmailOrFf(emailOrFf) {
      let check = false;
      const emailRedex =
        /^[A-Za-z0-9]+(?:[\.\-\_]?[A-Za-z0-9])+\@[a-zA-Z0-9][a-zA-Z0-9\-\_]{0,64}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{0,5})+$/;
      const ffRegex = /^\d{4,}$/;
      if (isNaN(emailOrFf)) {
        $modelCtrl.$setValidity("luhn", true);
        $modelCtrl.$setValidity("maxLengthFF", true);
        $modelCtrl.$setValidity("maxLengthEmail", emailOrFf.length < 61);
        check = emailRedex.test(emailOrFf);
      } else {
        $modelCtrl.$setValidity("maxLengthEmail", true);
        $modelCtrl.$setValidity("maxLengthFF", emailOrFf.length < 15);
        validateLuhnNumber(emailOrFf);
        check = ffRegex.test(emailOrFf);
      }
      return check;
      function validateLuhnNumber(number) {
        $modelCtrl.$setValidity("luhn", luhnCheck(number));
        return number;
      }
      function luhnCheck(number) {
        const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
        let len = number ? number.length : 0,
          bit = 1,
          sum = 0,
          val = 0;
        while (len) {
          val = parseInt(number.charAt(--len), 10);
          sum += (bit ^= 1) ? arr[val] : val;
        }
        return sum && sum % 10 === 0;
      }
    }
  };
}
