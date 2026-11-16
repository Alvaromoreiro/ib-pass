import { IbCFocusinDirective } from "ib-web-commons/directives";
import { Component } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

@Component({
  template: `<a focusin>LINK</a>`,
})
class HostComponent {}

@Component({
  template: `<div focusin="a"><a href="javascript:void(0)">LINK</a></div>`,
})
class HostComponentChildren {}

@Component({
  template: `<div focusin="span"><a href="javascript:void(0)">LINK</a></div>`,
})
class HostComponentFailQueryChildren {}

describe("IbCFocusinDirective test", () => {
  let fixture: ComponentFixture<HostComponent>;
  let fixtureWithChildren: ComponentFixture<HostComponentChildren>;
  let fixtureWithFailChildren: ComponentFixture<HostComponentFailQueryChildren>;
  let link: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IbCFocusinDirective,
        HostComponent,
        HostComponentChildren,
        HostComponentFailQueryChildren,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    fixtureWithChildren = TestBed.createComponent(HostComponentChildren);
    fixtureWithChildren.detectChanges();
    fixtureWithFailChildren = TestBed.createComponent(
      HostComponentFailQueryChildren,
    );
    fixtureWithFailChildren.detectChanges();
    link = fixture.debugElement.nativeElement.querySelector("a");
  });

  it("when clicked, should remove class focus", fakeAsync(() => {
    expect(link.classList.contains("focus")).toBe(false);
    link.dispatchEvent(new FocusEvent("mousedown"));
    tick();
    fixture.detectChanges();
    expect(link.classList.contains("focus")).toBe(false);
  }));

  it("when focused with keyboard, should add class focus", fakeAsync(() => {
    expect(link.classList.contains("focus")).toBe(false);
    link.focus();
    link.dispatchEvent(new KeyboardEvent("keyup", { code: "Tab" }));
    tick();
    fixture.detectChanges();
    expect(link.classList.contains("focus")).toBe(true);
  }));

  it("when focus out, should remove class focus", fakeAsync(() => {
    link.classList.add("focus");
    fixture.detectChanges();
    expect(link.classList.contains("focus")).toBe(true);
    link.dispatchEvent(new FocusEvent("blur"));
    tick();
    fixture.detectChanges();
    expect(link.classList.contains("focus")).toBe(false);
  }));

  describe("and have correct query selector", () => {
    beforeEach(() => {
      link = fixtureWithChildren.debugElement.nativeElement.querySelector("a");
    });

    it("when focused with keyboard, should not add class focus", fakeAsync(() => {
      expect(link.classList.contains("focus")).toBe(false);
      link.focus();
      link.dispatchEvent(
        new KeyboardEvent("keyup", { code: "Tab", bubbles: true }),
      );
      tick();
      fixture.detectChanges();
      expect(link.classList.contains("focus")).toBe(true);
    }));

    it("when focus out, should remove class focus", fakeAsync(() => {
      link.classList.add("focus");
      fixture.detectChanges();
      expect(link.classList.contains("focus")).toBe(true);
      link.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      tick();
      fixture.detectChanges();
      expect(link.classList.contains("focus")).toBe(false);
    }));

    it("when clicked, should remove class focus", fakeAsync(() => {
      expect(link.classList.contains("focus")).toBe(false);
      link.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      tick();
      fixture.detectChanges();
      expect(link.classList.contains("focus")).toBe(false);
    }));
  });

  describe("and have incorrect query selector", () => {
    beforeEach(() => {
      link =
        fixtureWithFailChildren.debugElement.nativeElement.querySelector("a");
    });

    it("when focused with keyboard, should add class focus", fakeAsync(() => {
      link.dispatchEvent(
        new KeyboardEvent("keyup", { code: "Tab", bubbles: true }),
      );
      tick();
      fixture.detectChanges();
      expect(link.classList.contains("focus")).toBe(false);
    }));

    it("when clicked, should remove class focus", fakeAsync(() => {
      expect(link.classList.contains("focus")).toBe(false);
      link.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      tick();
      fixture.detectChanges();
      expect(link.classList.contains("focus")).toBe(false);
    }));
  });
});
