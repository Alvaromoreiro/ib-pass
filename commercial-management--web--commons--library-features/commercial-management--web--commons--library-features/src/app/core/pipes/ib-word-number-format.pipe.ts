import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "ibWordNumberFormat",
})
export class IbWordNumberFormatPipe implements PipeTransform {
  transform(type: string, number: number): string {
    return number > 1 ? `SOME_${type}` : type;
  }
}
