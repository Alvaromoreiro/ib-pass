import { Directive, ElementRef, HostListener, Input } from "@angular/core";

/**
 * Directive to add the accessibility outline to iberia tags, this directive add the focus class when the user navigates
 * with keyboard only, and not with mouse click as usually works the :focus. This is an accessibility specification, and only
 * necessary until :focus-visible is fully supported in all browsers.
 * @see https://git.corp.iberia.es/ib-web/wiki/-/blob/master/docs/accessibility/index.md
 * @example
 * <a focusin href="LINK">LINK</a>
 * <div focusin role="region" tabindex="0">Selectable section</div>
 */
@Directive({
  selector: "[focusin]",
})
export class IbCFocusinDirective {
  /**
   * Accessibility focus interaction that add styles, if an argument is passed it will be used as internal query selector
   * to add that element the styles.
   */
  @Input("focusin") querySelector: string | undefined;

  constructor(private elementHost: ElementRef<HTMLElement>) {}

  @HostListener("mousedown")
  setInputFocusClick(): void {
    if (this.querySelector) {
      this.elementHost.nativeElement
        .querySelector(this.querySelector)
        ?.classList.remove("focus");
    } else {
      this.elementHost.nativeElement.classList.remove("focus");
    }
  }

  @HostListener("keyup")
  setInputFocusKeyboard(): void {
    if (this.querySelector) {
      const internalElement = this.elementHost.nativeElement.querySelector(
        this.querySelector,
      );
      internalElement?.classList.add("focus");
      internalElement?.setAttribute("focusin", "");
    } else {
      this.elementHost.nativeElement.classList.add("focus");
    }
  }

  /**
   * When the focusable element is inside the element with attribute, then query selector has been used and has to
   * removes style.
   * @param event
   */
  @HostListener("focusout", ["$event"])
  setInputFocusOut(event: FocusEvent): void {
    if (
      this.querySelector &&
      event.target ===
        this.elementHost.nativeElement.querySelector(this.querySelector)
    ) {
      this.elementHost.nativeElement
        .querySelector(this.querySelector)
        ?.classList.remove("focus");
    }
  }

  /**
   * Normally, when the user loses focus of the interactable component, has to lose styles.
   */
  @HostListener("blur")
  setInputFocusBlur(): void {
    this.elementHost.nativeElement.classList.remove("focus");
  }
}
