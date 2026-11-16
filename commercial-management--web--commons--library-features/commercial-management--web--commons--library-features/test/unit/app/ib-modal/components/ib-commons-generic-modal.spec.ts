import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { NgbActiveModal, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { IbCGenericModalComponent } from "ib-web-commons/ib-modal";
import { Pipe, PipeTransform } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Pipe({
  name: "translate",
})
export class TranslatePipeMock implements PipeTransform {
  public name: string = "translate";

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

describe("IbCGenericModalComponent tests", () => {
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let component: IbCGenericModalComponent;
  let fixture: ComponentFixture<IbCGenericModalComponent>;

  beforeEach(() => {
    const mockNgbActiveModal = jasmine.createSpyObj("mockNgbActiveModal", [
      "close",
      "dismiss",
    ]);
    TestBed.configureTestingModule({
      declarations: [IbCGenericModalComponent, TranslatePipeMock],
      imports: [TranslateModule.forRoot(), NgbModalModule],
      providers: [{ provide: NgbActiveModal, useValue: mockNgbActiveModal }],
    }).compileComponents();
    fixture = TestBed.createComponent(IbCGenericModalComponent);
    component = fixture.componentInstance;
    activeModal = fixture.debugElement.injector.get(
      NgbActiveModal,
    ) as jasmine.SpyObj<NgbActiveModal>;
  });

  describe("should start with default values", () => {
    beforeEach(() => {
      component.model = {};
      component.ngOnInit();
      fixture.detectChanges();
    });
    it("and print the default title", () => {
      expect(component["dismissOnCancel"]).toBe(true);
      const titleElement = fixture.nativeElement.querySelector("h2");
      expect(titleElement.textContent).toBe("MODAL_ERROR_TITLE");
    });
    it("and accept button is clicked, should close the modal", fakeAsync(() => {
      activeModal.close.and.returnValue();
      const button = fixture.nativeElement.querySelector("footer button");
      button.click();
      tick();
      expect(activeModal.close).toHaveBeenCalled();
    }));
    it("and close button is clicked, should dismiss the modal", fakeAsync(() => {
      activeModal.dismiss.and.returnValue();
      const button = fixture.nativeElement.querySelector("header button");
      button.click();
      tick();
      expect(activeModal.dismiss).toHaveBeenCalled();
    }));
  });

  describe("when overriding default values", () => {
    beforeEach(() => {
      component.model = {
        showCloseButton: false,
        showCancelButton: true,
        showHeader: true,
        dismissOnCancel: false,
        titleTranslateParams: {},
        title: "TITLE",
        body: "BODY",
        onModalOpen: () => {},
        onCancelClick: () => {},
      };
      component.ngOnInit();
      fixture.detectChanges();
    });
    it("should print the correct info in screen", () => {
      expect(component["dismissOnCancel"]).toBe(false);
      const titleElement = fixture.nativeElement.querySelector("h2");
      expect(titleElement.textContent).toBe("TITLE");
      const closeButton = fixture.nativeElement.querySelector("h3 + button");
      expect(closeButton).toBe(null);
    });
    it("and cancel button is clicked, should close the modal", fakeAsync(() => {
      activeModal.close.and.returnValue();
      const button = fixture.nativeElement.querySelector("footer a");
      button.click();
      tick();
      expect(activeModal.close).toHaveBeenCalled();
    }));
  });
});
