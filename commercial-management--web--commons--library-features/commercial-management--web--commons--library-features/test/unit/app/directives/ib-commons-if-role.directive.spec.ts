import { IbCIfRoleDirective } from "ib-web-commons/directives";
import { Component } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { IbCUserStoreRepositoryService } from "ib-web-commons/services";
import { of } from "rxjs";

@Component({
  template: `<a *ifRole="['IB_PLUS', 'IB_ZERO_SOFT']">LINK</a>`,
})
class HostComponent {}

@Component({
  template: `<a *ifRole="'ONB'">LINK</a>`,
})
class HostComponentString {}

const fakeIbCUserStoreRepositoryService =
  jasmine.createSpyObj<IbCUserStoreRepositoryService>(
    "IbCUserStoreRepositoryService",
    ["getUserInfo"],
  );

describe("IbCIfRoleDirective test", () => {
  let fixtureWithArray: ComponentFixture<HostComponent>;
  let fixtureWithString: ComponentFixture<HostComponentString>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IbCIfRoleDirective, HostComponent, HostComponentString],
      providers: [
        {
          provide: IbCUserStoreRepositoryService,
          useValue: fakeIbCUserStoreRepositoryService,
        },
      ],
    }).compileComponents();

    fixtureWithArray = TestBed.createComponent(HostComponent);
    fixtureWithString = TestBed.createComponent(HostComponentString);
  });

  describe("when role passed is array", () => {
    it("user is Ib+ and soft user, should show link", fakeAsync(() => {
      fakeIbCUserStoreRepositoryService.getUserInfo.and.returnValue(
        of({
          appUserInfo: {
            logged: true,
            userType: "IB_PLUS",
            permanentUser: true,
            tierLevel: "CLASICA",
          } as any,
        }),
      );
      fixtureWithArray.detectChanges();
      tick();
      const link =
        fixtureWithArray.debugElement.nativeElement.querySelector("a");
      expect(link).toBeDefined();
    }));

    it("user is Iberia zero, should hide link", fakeAsync(() => {
      fakeIbCUserStoreRepositoryService.getUserInfo.and.returnValue(
        of({
          appUserInfo: {
            logged: true,
            userType: "IB_ZERO",
            permanentUser: false,
          } as any,
        }),
      );
      fixtureWithArray.detectChanges();
      tick();
      const link =
        fixtureWithArray.debugElement.nativeElement.querySelector("a");
      expect(link).toBeFalsy();
    }));
  });

  describe("when role passed is string", () => {
    it("user is ONB, should show link", fakeAsync(() => {
      fakeIbCUserStoreRepositoryService.getUserInfo.and.returnValue(
        of({
          appUserInfo: {
            logged: true,
            userType: "ONB",
          } as any,
        }),
      );
      fixtureWithArray.detectChanges();
      tick();
      const link =
        fixtureWithArray.debugElement.nativeElement.querySelector("a");
      expect(link).toBeDefined();
    }));

    it("user is ANONYMOUS, should hide link", fakeAsync(() => {
      fakeIbCUserStoreRepositoryService.getUserInfo.and.returnValue(
        of({
          appUserInfo: {
            logged: false,
            userType: "ANONYMOUS",
          },
        }),
      );
      fixtureWithArray.detectChanges();
      tick();
      const link =
        fixtureWithArray.debugElement.nativeElement.querySelector("a");
      expect(link).toBeFalsy();
    }));
  });
});
