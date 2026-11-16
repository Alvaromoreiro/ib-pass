import { Pipe, PipeTransform } from "@angular/core";

/**
 * @description this is a pipe which returns the given input with the first letter capitalized.
 * @param {string} input The string to be transformed.
 * @return An `string` with the first letter capitalized.
 * @author Alvaro Moreiro
 */
@Pipe({ name: "capitalize" })
export class IbCCapitalizePipe implements PipeTransform {
  transform(input: string): string {
    if (input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
    return input;
  }
}
