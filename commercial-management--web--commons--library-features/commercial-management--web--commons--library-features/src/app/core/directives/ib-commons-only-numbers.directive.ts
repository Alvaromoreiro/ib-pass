import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "input[onlyNumbers]",
})
export class IbCOnlyNumbersDirective {
  constructor(private element: ElementRef<HTMLInputElement>) {}

  @HostListener("input", ["$event"]) onInputChange(event: Event) {
    const initalValue: string = this.element.nativeElement.value;
    this.element.nativeElement.value = initalValue.replace(/[^0-9]*/g, "");
    if (initalValue !== this.element.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
