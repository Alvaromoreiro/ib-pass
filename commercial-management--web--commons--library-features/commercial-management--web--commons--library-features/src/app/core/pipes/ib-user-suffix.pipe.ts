import { Pipe, PipeTransform } from "@angular/core";
import { IbCUserUtilsService } from "ib-web-commons/utils";

/**
 * @description Return the key whith the corresponding suffix depends on user type.
 */
@Pipe({
  name: "userSuffix",
  pure: false,
})
export class IbCUserSuffixPipe implements PipeTransform {
  constructor(private commonsUserUtilsService: IbCUserUtilsService) {}

  /**
   * @description Return the key whith the corresponding suffix depends on user type.
   * @param {string} textKey The key to add corresponding suffix.
   * @return An `string` with the user type suffix
   * @author Alvaro Moreiro
   */
  transform(textKey: string): string {
    if (this.commonsUserUtilsService.isIbPlus()) {
      textKey = `${textKey}_IB_PLUS`;
    } else if (this.commonsUserUtilsService.isIbZero()) {
      textKey = `${textKey}_IB_ZERO`;
    }
    return textKey;
  }
}
