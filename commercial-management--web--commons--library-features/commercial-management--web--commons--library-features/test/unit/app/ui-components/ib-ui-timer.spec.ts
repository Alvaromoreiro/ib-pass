import {
  IbUiTimerComponent,
  IbUiTimerTemplateType,
} from "ib-web-commons/ui-components";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

describe("IbUiTimerComponent", () => {
  const today = new Date();
  const endtimeInputMock = `${today.getFullYear()}-${today.getMonth()}-${
    today.getDay() + 1
  } 12:30:00`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IbUiTimerComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  it("should create", () => {
    const fixture = TestBed.createComponent(IbUiTimerComponent);
    const component = fixture.componentInstance;
    component.endTime = endtimeInputMock;
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  describe("When ngOnInit", () => {
    it("should update dateExpiration and subscribe", fakeAsync(() => {
      const fixture = TestBed.createComponent(IbUiTimerComponent);
      const component = fixture.componentInstance;
      component.endTime = endtimeInputMock;
      component.type = IbUiTimerTemplateType.hourAndMinutes;
      fixture.detectChanges();
      const secondsToLast = component.secondsToExpiration;
      expect(component).toBeDefined();
      tick(1000);
      fixture.detectChanges();
      expect(component.secondsToExpiration).toEqual(secondsToLast - 1);
      tick(1000);
      fixture.detectChanges();
      expect(component.secondsToExpiration).toEqual(secondsToLast - 2);
      component.ngOnDestroy();
    }));

    describe("and type is undefined", () => {
      xit("and daysToExpiration is greater than 2, should change type", () => {
        const fixture = TestBed.createComponent(IbUiTimerComponent);
        const component = fixture.componentInstance;
        component.endTime = `${today.getFullYear()}-${today.getMonth() + 1}-${
          today.getDay() + 20
        } 12:30:00`;
        fixture.detectChanges();
        expect(component.type).toEqual(IbUiTimerTemplateType.fullDate);
      });

      it("and daysToExpiration is less than 2, should change type", () => {
        const fixture = TestBed.createComponent(IbUiTimerComponent);
        const component = fixture.componentInstance;
        component.endTime = endtimeInputMock;
        fixture.detectChanges();
        expect(component).toBeDefined();
        expect(component.type).toEqual(IbUiTimerTemplateType.clockType);
      });
    });
  });
});
