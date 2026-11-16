import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { filter, map, Subject, takeUntil } from "rxjs";
import { IfRoleDirectiveRoles, IberiaWebUser } from "ib-web-commons/models";
import { IbCUserStoreRepositoryService } from "ib-web-commons/services";

/**
 * Reactively shows or hides a html element based on the user roles. Structural directive similar to ngIf but with roles
 * of the Iberia users. An array or string can be passed.
 * @example
 * <div *ifRole="'LOGGED'">This will be shown to all logged users only</div>
 * <div *ifRole="['IB_PLUS_SOFT', 'ONB']">This will be shown only to IB+ soft users and ONB</div>
 */
@Directive({
  selector: "[ifRole]",
})
export class IbCIfRoleDirective implements OnInit, OnDestroy {
  @Input() ifRole: IfRoleDirectiveRoles | IfRoleDirectiveRoles[] = [];
  private stop$ = new Subject();
  private isVisible = false;

  /**
   * @param {ViewContainerRef} viewContainerRef the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef the templateRef to be potentially rendered
   * @param {ibCUserStoreRepositoryService} IbCUserStoreRepositoryService will give us access to the roles a user has
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<unknown>,
    private ibCUserStoreRepositoryService: IbCUserStoreRepositoryService,
  ) {}

  ngOnInit() {
    this.userRoles$()
      .pipe(takeUntil(this.stop$))
      .subscribe((roles) => {
        if (!roles || !this.ifRole) {
          this.hideView();
        }
        const requiredRoles =
          typeof this.ifRole === "string" ? [this.ifRole] : [...this.ifRole];
        const hasRequiredRole = roles.some((userRole) =>
          requiredRoles.includes(userRole),
        );

        if (hasRequiredRole) {
          if (!this.isVisible) {
            this.showView();
          }
        } else {
          this.hideView();
        }
      });
  }

  private userRoles$() {
    return this.ibCUserStoreRepositoryService.getUserInfo().pipe(
      filter((state): state is IberiaWebUser => Boolean(state)),
      map((user: IberiaWebUser) => {
        const userRoles: IfRoleDirectiveRoles[] = [];
        if (user.appUserInfo.userType === "ANONYMOUS") {
          userRoles.push("ANONYMOUS");
        } else {
          userRoles.push("LOGGED");
          userRoles.push(user.appUserInfo.userType);
          if (
            user.appUserInfo.userType === "IB_PLUS" ||
            user.appUserInfo.userType === "IB_ZERO"
          ) {
            userRoles.push(
              user.appUserInfo.permanentUser ? "SOFT_LOGGED" : "FULL_LOGGED",
            );
            if (user.appUserInfo.permanentUser) {
              userRoles.push(`${user.appUserInfo.userType}_SOFT`);
            } else {
              userRoles.push(`${user.appUserInfo.userType}_FULL`);
            }
          }
          if (user.appUserInfo.userType === "IB_PLUS") {
            userRoles.push(user.appUserInfo.tierLevel ?? "CLASICA");
          }
        }
        return userRoles;
      }),
    );
  }

  private hideView() {
    this.isVisible = false;
    this.viewContainerRef.clear();
  }

  private showView() {
    this.isVisible = true;
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  ngOnDestroy() {
    this.stop$.next(true);
  }
}
