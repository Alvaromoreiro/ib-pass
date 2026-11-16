import { NgModule } from "@angular/core";
import { IbCCapitalizePipe } from "./ib-capital-letter.pipe";
import { IbCLinkPipe } from "./ib-links.pipe";
import { IbCNormalizePipe } from "./ib-normalize.pipe";
import { IbIntlDateFormatPipe } from "./ib-intl-date-format.pipe";
import { IbCUserSuffixPipe } from "./ib-user-suffix.pipe";
import { IbCIntlNumberFormatPipe } from "./ib-intl-number-format.pipe";
import { IbCAviosFormatPipe } from "./ib-commons-avios-format.pipe";
import { IbWordNumberFormatPipe } from "./ib-word-number-format.pipe";

@NgModule({
  imports: [],
  declarations: [
    IbCCapitalizePipe,
    IbCLinkPipe,
    IbCNormalizePipe,
    IbIntlDateFormatPipe,
    IbCUserSuffixPipe,
    IbCIntlNumberFormatPipe,
    IbCAviosFormatPipe,
    IbWordNumberFormatPipe,
  ],
  exports: [
    IbCCapitalizePipe,
    IbCLinkPipe,
    IbCNormalizePipe,
    IbIntlDateFormatPipe,
    IbCUserSuffixPipe,
    IbCIntlNumberFormatPipe,
    IbCAviosFormatPipe,
    IbWordNumberFormatPipe,
  ],
  providers: [
    IbCCapitalizePipe,
    IbCLinkPipe,
    IbCNormalizePipe,
    IbIntlDateFormatPipe,
    IbCUserSuffixPipe,
    IbCIntlNumberFormatPipe,
    IbCAviosFormatPipe,
    IbWordNumberFormatPipe,
  ],
})
export class IbCPipeModule {}
