import { NgModule } from "@angular/core";
import { IbCFocusinDirective } from "./ib-commons-focusin.directive";
import { IbCIfRoleDirective } from "./ib-commons-if-role.directive";
import { IbCOnlyNumbersDirective } from "./ib-commons-only-numbers.directive";

@NgModule({
  imports: [],
  declarations: [
    IbCIfRoleDirective,
    IbCOnlyNumbersDirective,
    IbCFocusinDirective,
  ],
  exports: [IbCIfRoleDirective, IbCOnlyNumbersDirective, IbCFocusinDirective],
  providers: [],
})
export class IbCDirectivesModule {}
