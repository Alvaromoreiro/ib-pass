import { Pipe, PipeTransform } from "@angular/core";

/**
 * @description Removes characters with accents and dicritics from a string.
 */
@Pipe({ name: "normalize" })
export class IbCNormalizePipe implements PipeTransform {
  /**
   * @description This is a pipe which removes characters with accents and dicritics from a string.
   * @param {string} text The string to be transformed.
   * @return An `string` no accents or diacritics
   * @author Alvaro Moreiro
   */
  transform(text: string): string {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return text;
  }
}
