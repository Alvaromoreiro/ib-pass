@Service("ib-commons-utils-module", ["$window"])
export class CommonsDocumentsValidatorService {
  private DNI_REGEX: RegExp = /^(\d{8})([A-Z])$/;
  private CIF_REGEX: RegExp = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
  private NIE_REGEX: RegExp = /^[XYZ]\d{7,8}[A-Z]$/;

  constructor(private $window: ng.IWindowService) {}

  validate = (str: string) => {
    // If no valid value passed
    if (!str) {
      str = "";
    }
    // Ensure upcase and remove whitespace
    str = str.toUpperCase().replace(/\s/, "");

    let valid = false;
    const type = this.idType(str);

    switch (type) {
      case "dni":
        valid = this.validateDNI(str);
        break;

      case "nie":
        valid = this.validateNIE(str);
        break;

      case "cif":
        valid = this.validateCIF(str);
        break;
    }

    return {
      type: type,
      valid: valid,
    };
  };

  idType = (str: string) => {
    if (str.match(this.DNI_REGEX)) {
      return "dni";
    } else if (str.match(this.CIF_REGEX)) {
      return "cif";
    } else if (str.match(this.NIE_REGEX)) {
      return "nie";
    } else {
      return "";
    }
  };

  validateDNI = (dni) => {
    const dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letter = dni_letters.charAt(parseInt(dni, 10) % 23);

    return letter === dni.charAt(8);
  };

  validateNIE = (nie) => {
    // Change the initial letter for the corresponding number and validate as DNI
    let nie_prefix = nie.charAt(0);

    switch (nie_prefix) {
      case "X":
        nie_prefix = 0;
        break;

      case "Y":
        nie_prefix = 1;
        break;

      case "Z":
        nie_prefix = 2;
        break;
    }
    return this.validateDNI(nie_prefix + nie.substr(1));
  };

  validateCIF = (cif) => {
    const match = cif.match(this.CIF_REGEX);
    const letter = match[1],
      number = match[2],
      control = match[3];

    let even_sum: any = 0;
    let odd_sum: any = 0;
    let numberCIF: number;
    let i: number;
    let control_digit: any = 0;
    let control_letter: any = 0;

    for (i = 0; i < number.length; i++) {
      numberCIF = parseInt(number[i], 10);

      // Odd positions (Even index equals to odd position. i=0 equals first position)
      if (i % 2 === 0) {
        // Odd positions are multiplied first.
        numberCIF *= 2;

        // If the multiplication is bigger than 10 we need to adjust
        odd_sum += numberCIF < 10 ? numberCIF : numberCIF - 9;

        // Even positions
        // Just sum them
      } else {
        even_sum += numberCIF;
      }
    }

    control_digit = 10 - (even_sum + odd_sum).toString().substr(-1);
    control_letter = "JABCDEFGHI".substr(control_digit, 1);

    // Control must be a digit
    if (letter.match(/[ABEH]/)) {
      return control === control_digit;

      // Control must be a letter
    } else if (letter.match(/[KPQS]/)) {
      return control === control_letter;

      // Can be either
    } else {
      return control === control_digit || control === control_letter;
    }
  };
}
