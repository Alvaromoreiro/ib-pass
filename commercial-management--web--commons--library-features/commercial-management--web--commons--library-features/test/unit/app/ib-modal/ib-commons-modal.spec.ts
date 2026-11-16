import { TestBed, ComponentFixture } from "@angular/core/testing";
import {
  NgbModal,
  NgbModalModule,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import {
  IbCModalService,
  IbCGenericModalComponent,
} from "ib-web-commons/ib-modal";
import { DatalayerUtilsProvider } from "ib-web-commons/ib-datalayer";

// Mock class for NgbModalRef
export class MockNgbModalRef {
  componentInstance = {
    model: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe("IbCModalService tests", () => {
  let fixtureUnderTest: ComponentFixture<IbCGenericModalComponent>;
  let componentUnderTest: IbCGenericModalComponent;
  let ngbModal: NgbModal;
  let modalService: IbCModalService;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [NgbModalModule],
      providers: [IbCModalService],
    }).compileComponents();

    modalService = TestBed.inject(IbCModalService);
    ngbModal = TestBed.inject(NgbModal);
  });

  describe("When showGenericModal is called,", () => {
    it(" should show and return a modal", () => {
      spyOn(ngbModal, "open").and.callThrough();
      modalService.showGenericModal({ body: "TEST_BODY" });
      expect(ngbModal.open).toHaveBeenCalled();
    });
  });

  describe("When showGenericComponentModal is called,", () => {
    it(" should show and return a modal", () => {
      spyOn(ngbModal, "open").and.returnValue(mockModalRef as NgbModalRef);
      modalService.showGenericComponentModal(IbCGenericModalComponent);
      expect(ngbModal.open).toHaveBeenCalled();
    });
  });
});
