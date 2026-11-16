import { IbUiBannerComponent } from "ib-web-commons/ui-components";
import { fakeAsync, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

describe("IbUiBannerComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IbUiBannerComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  it("should create", () => {
    const fixture = TestBed.createComponent(IbUiBannerComponent);
    const component = fixture.componentInstance;
    component.type = "type-2";
    component.image = {
      title: "Image",
      url: "https://preb.iberia.es/wcs/imagenes/destinos/city_mad.jpg",
    };
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  describe("When component execute action", () => {
    it("ngOnInit execution", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiBannerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.returnDateRange).toBeDefined();
    }));

    it("returnDateRange and daterangeDepartureReturn exists", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiBannerComponent);
      const component = fixture.componentInstance;
      component.daterangeDeparture = "28/06/2022";
      component.daterangeDepartureTo = "30/06/2022";
      component.daterangeDepartureReturn = "31/06/2022";
      fixture.detectChanges();
      expect(component).toBeDefined();
      component.returnDateRange();
      expect(component.daterangeDeparture).toEqual(
        "28/06/2022 - 31/06/2022 - 31/06/2022",
      );
    }));

    it("returnDateRange and daterangeDepartureReturn doesnt exists", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiBannerComponent);
      const component = fixture.componentInstance;
      component.daterangeDeparture = "28/06/2022";
      component.daterangeDepartureTo = "30/06/2022";
      fixture.detectChanges();
      expect(component).toBeDefined();
      component.returnDateRange();
      expect(component.daterangeDeparture).toEqual(
        "28/06/2022 - 30/06/2022 - 30/06/2022",
      );
    }));

    it("selectDestination", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiBannerComponent);
      const component = fixture.componentInstance;
      component.type = "type-2";
      component.action = (offer: any, constants): string => {
        return offer.title;
      };
      component.image = {
        title: "Image",
        url: "https://preb.iberia.es/wcs/imagenes/destinos/city_mad.jpg",
      };
      fixture.detectChanges();
      expect(component).toBeDefined();
      component.selectDestination({ id: "ID2" });
      expect(component.action).toBeDefined();
    }));

    it("returnBannerImage ", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiBannerComponent);
      const component = fixture.componentInstance;
      component.type = "type-2";
      component.image = {
        title: "Image",
        url: "https://preb.iberia.es/wcs/imagenes/destinos/city_mad.jpg",
      };
      fixture.detectChanges();
      expect(component).toBeDefined();
      component.returnBannerImage(event, true);
      expect(component.returnBannerImage).toBeDefined();
    }));
  });
});
