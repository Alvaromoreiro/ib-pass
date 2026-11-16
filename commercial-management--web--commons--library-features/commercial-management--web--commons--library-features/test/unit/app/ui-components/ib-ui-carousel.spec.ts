import { IbUiCarouselComponent } from "ib-web-commons/ui-components";
import { fakeAsync, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

describe("IbUiCarouselComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IbUiCarouselComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  it("should create", () => {
    const fixture = TestBed.createComponent(IbUiCarouselComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  describe("When ngOnInit", () => {
    it("set carousel setting variable", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiCarouselComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.settings).toBeDefined();
      expect(component.settings.autoplaySpeed).toEqual(10000);
      expect(component.settings.showNavigationArrows).toEqual(true);
      expect(component.settings.showNavigationIndicators).toEqual(false);
    }));
  });
});
