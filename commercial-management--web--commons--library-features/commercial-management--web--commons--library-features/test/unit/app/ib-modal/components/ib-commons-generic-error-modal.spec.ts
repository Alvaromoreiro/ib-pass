import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { NgbActiveModal, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { IbCGenericErrorModalComponent } from "ib-web-commons/ib-modal";
import { Pipe, PipeTransform } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AJSRootScope, RedirectionService } from "ib-web-commons/utils";
import { IbCDatalayerUtilsService } from "ib-web-commons/ib-datalayer";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { HttpErrorResponse } from "@angular/common/http";

@Pipe({
  name: "translate",
})
export class TranslatePipeMock implements PipeTransform {
  public name: string = "translate";

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}
describe("IbCGenericErrorModalComponent tests", () => {
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let datalayerUtils: jasmine.SpyObj<IbCDatalayerUtilsService>;
  let component: IbCGenericErrorModalComponent;
  let redirectionService: jasmine.SpyObj<RedirectionService>;
  let fixture: ComponentFixture<IbCGenericErrorModalComponent>;

  beforeEach(() => {
    const mockNgbActiveModal = jasmine.createSpyObj("mockNgbActiveModal", [
      "close",
      "dismiss",
    ]);
    const mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    const mockRedirectionService = jasmine.createSpyObj("RedirectionService", [
      "externalRedirect",
    ]);
    const mockDatalayerUtilsService = jasmine.createSpyObj(
      "DatalayerUtilsService",
      ["sendErrorEvent", "removeErrorEventInfo"],
    );

    TestBed.configureTestingModule({
      declarations: [IbCGenericErrorModalComponent, TranslatePipeMock],
      imports: [TranslateModule.forRoot(), NgbModalModule],
      providers: [
        IbCHttpErrorHandlerService,
        { provide: NgbActiveModal, useValue: mockNgbActiveModal },
        { provide: AJSRootScope, useValue: mockRootScope },
        {
          provide: IbCDatalayerUtilsService,
          useValue: mockDatalayerUtilsService,
        },
        { provide: RedirectionService, useValue: mockRedirectionService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(IbCGenericErrorModalComponent);
    component = fixture.componentInstance;
    activeModal = fixture.debugElement.injector.get(
      NgbActiveModal,
    ) as jasmine.SpyObj<NgbActiveModal>;
    datalayerUtils = fixture.debugElement.injector.get(
      IbCDatalayerUtilsService,
    ) as jasmine.SpyObj<IbCDatalayerUtilsService>;
    redirectionService = fixture.debugElement.injector.get(
      RedirectionService,
    ) as jasmine.SpyObj<RedirectionService>;
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

  describe("when passing an http error object, and overriding default values", () => {
    beforeEach(() => {
      component.model = {
        showCancelButton: true,
        dismissOnCancel: true,
        onAcceptClick: () => {},
        onClose: () => {},
      };
      component.error = new HttpErrorResponse({
        error: {
          errors: [
            {
              code: "TEST",
              reason: "property: try | error: TESTING_ERROR",
            },
          ],
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
    });
    it("should print the correct info in screen", () => {
      expect(component["dismissOnCancel"]).toBe(true);
      const titleElement = fixture.nativeElement.querySelector("h2");
      expect(titleElement.textContent).toBe("MODAL_ERROR_TITLE");
      const closeButton = fixture.nativeElement.querySelector("h3 + button");
      expect(closeButton).toBe(null);
      const messageBody = fixture.nativeElement.querySelector("section");
      expect(messageBody.textContent.trim()).toBe("TESTING_ERROR");
    });
    it("and cancel button is clicked, should close the modal", fakeAsync(() => {
      activeModal.dismiss.and.returnValue();
      const button = fixture.nativeElement.querySelector("footer a");
      button.click();
      tick();
      expect(activeModal.dismiss).toHaveBeenCalled();
    }));
    it("and accept button is clicked, should close the modal", fakeAsync(() => {
      activeModal.close.and.returnValue();
      datalayerUtils.removeErrorEventInfo.and.returnValue();
      const button = fixture.nativeElement.querySelector("footer button");
      button.click();
      tick();
      expect(datalayerUtils.removeErrorEventInfo).toHaveBeenCalled();
      expect(activeModal.close).toHaveBeenCalled();
    }));
    it("and close button is clicked, should dismiss the modal", fakeAsync(() => {
      activeModal.dismiss.and.returnValue();
      datalayerUtils.removeErrorEventInfo.and.returnValue();
      const button = fixture.nativeElement.querySelector("header button");
      button.click();
      tick();
      expect(datalayerUtils.removeErrorEventInfo).toHaveBeenCalled();
      expect(activeModal.dismiss).toHaveBeenCalled();
    }));
  });
  describe("when passing an http error object, and overriding default values", () => {
    beforeEach(() => {
      component.model = {
        showCancelButton: true,
        dismissOnCancel: true,
        onAcceptClick: () => {},
        onClose: () => {},
      };
      component.error = {
        errorCode: 400,
        data: {
          error: "SSE_ORM_9999",
          error_description: "TEST",
        },
      };
      component.ngOnInit();
      fixture.detectChanges();
    });
    it("should print the correct info in screen", () => {
      expect(component["dismissOnCancel"]).toBe(true);
      const titleElement = fixture.nativeElement.querySelector("h2");
      expect(titleElement.textContent).toBe("MODAL_ERROR_TITLE");
      const closeButton = fixture.nativeElement.querySelector("h3 + button");
      expect(closeButton).toBe(null);
    });
    it("and cancel button is clicked, should close the modal", fakeAsync(() => {
      activeModal.dismiss.and.returnValue();
      redirectionService.externalRedirect.and.returnValue();
      const button = fixture.nativeElement.querySelector("footer a");
      button.click();
      tick();
      expect(redirectionService.externalRedirect).toHaveBeenCalled();
      expect(activeModal.dismiss).toHaveBeenCalled();
    }));
    it("and accept button is clicked, should close the modal", fakeAsync(() => {
      activeModal.close.and.returnValue();
      datalayerUtils.removeErrorEventInfo.and.returnValue();
      redirectionService.externalRedirect.and.returnValue();
      const button = fixture.nativeElement.querySelector("footer button");
      button.click();
      tick();
      expect(redirectionService.externalRedirect).toHaveBeenCalled();
      expect(datalayerUtils.removeErrorEventInfo).toHaveBeenCalled();
      expect(activeModal.close).toHaveBeenCalled();
    }));
    it("and close button is clicked, should dismiss the modal", fakeAsync(() => {
      activeModal.dismiss.and.returnValue();
      datalayerUtils.removeErrorEventInfo.and.returnValue();
      redirectionService.externalRedirect.and.returnValue();
      const button = fixture.nativeElement.querySelector("header button");
      button.click();
      tick();
      expect(redirectionService.externalRedirect).toHaveBeenCalled();
      expect(datalayerUtils.removeErrorEventInfo).toHaveBeenCalled();
      expect(activeModal.dismiss).toHaveBeenCalled();
    }));
  });
});
