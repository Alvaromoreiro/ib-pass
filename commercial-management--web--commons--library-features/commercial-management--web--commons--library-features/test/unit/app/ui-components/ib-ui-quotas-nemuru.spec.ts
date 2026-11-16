import { SimpleChange } from "@angular/core";
import {
  async,
  fakeAsync,
  ComponentFixture,
  TestBed,
} from "@angular/core/testing";
import {
  IbUiQuotasNemuruComponent,
  IbUiQuotasNemuruService,
} from "ib-web-commons/ui-components";
import { TranslateModule } from "@ngx-translate/core";

describe("IbUiQuotasNemuruComponent", () => {
  let component: IbUiQuotasNemuruComponent;
  let fixture: ComponentFixture<IbUiQuotasNemuruComponent>;
  const selectedTermFirst = 3;
  const selectedTermAmountFirst = "20,90€";
  const selectedTermLast = 12;
  const selectedTermAmountLast = "5,60€";
  const dummyQuotas = [
    {
      term: selectedTermFirst,
      instalmentTotalAmount: {
        value: 20.9,
        string: selectedTermAmountFirst,
      },
    },
    {
      term: 6,
      instalmentTotalAmount: {
        value: 10.7,
        string: "10,70€",
      },
    },
    {
      term: 9,
      instalmentTotalAmount: {
        value: 7.3,
        string: "7,30€",
      },
    },
    {
      term: selectedTermLast,
      instalmentTotalAmount: {
        value: 5.6,
        string: selectedTermAmountLast,
      },
    },
  ];

  class IbUiQuotasNemuruServiceMock {
    public getQuotasData = async (amount: number): Promise<unknown> => {
      return dummyQuotas;
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IbUiQuotasNemuruComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: IbUiQuotasNemuruService,
          useClass: IbUiQuotasNemuruServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbUiQuotasNemuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  describe("execution passing quotas data", () => {
    it("show component", fakeAsync(async () => {
      expect(component.showComponent).toEqual(false);
      component.quotas = dummyQuotas;
      component.ngOnChanges({
        quotas: new SimpleChange(null, component.quotas, true),
      });
      await fixture.detectChanges();
      expect(component.showComponent).toEqual(true);
      expect(fixture.nativeElement.querySelectorAll("li").length).toEqual(
        dummyQuotas.length,
      );
    }));

    it("by default is selected last quota", fakeAsync(async () => {
      component.quotas = dummyQuotas;
      component.ngOnChanges({
        quotas: new SimpleChange(null, component.quotas, true),
      });
      await fixture.detectChanges();
      expect(component.indexSelectedTerm).toEqual(dummyQuotas.length - 1);
      expect(component.selectedTerm).toEqual(selectedTermLast);
      expect(component.selectedTermAmount).toEqual(selectedTermAmountLast);
    }));

    it("change quota to first option and show new data", fakeAsync(async () => {
      component.quotas = dummyQuotas;
      component.ngOnChanges({
        quotas: new SimpleChange(null, component.quotas, true),
      });
      await fixture.detectChanges();
      component.updateIndexSelectedTerm(0);
      await fixture.detectChanges();
      expect(component.indexSelectedTerm).toEqual(0);
      expect(component.selectedTerm).toEqual(selectedTermFirst);
      expect(component.selectedTermAmount).toEqual(selectedTermAmountFirst);
    }));
  });

  it("execution passing amount to get quotas from script", fakeAsync(async () => {
    component.amount = 200;
    component.ngOnChanges({
      amount: new SimpleChange(null, component.amount, true),
    });
    await fixture.detectChanges();
    expect(component.showComponent).toEqual(true);
    expect(component.indexSelectedTerm).toEqual(dummyQuotas.length - 1);
    expect(component.selectedTerm).toEqual(selectedTermLast);
    expect(component.selectedTermAmount).toEqual(selectedTermAmountLast);
  }));
});
