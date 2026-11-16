import { NgModule } from '@angular/core';
import {SharedModule} from './app/shared/shared.module';
import {rootScopeProvider, AJSCurrencyServiceProvider} from 'ib-web-commons/utils';
import { DatalayerUtilsProvider } from 'ib-web-commons/ib-datalayer';
import { IbMainFooterModule } from './components/ib-main-footer/ib-main-footer.module';
import { IbAncillariesPetcBasketModule } from './components/ib-newMain-header/components/ib-header/components/ib-basket/components/ib-petc/ib-petc.module';
const importExport = [IbMainFooterModule, IbAncillariesPetcBasketModule];
@NgModule({
    declarations: [],
    exports: [...importExport],
    imports: [
        SharedModule,
        ...importExport
    ],
    providers: [
        rootScopeProvider,
        DatalayerUtilsProvider,
        AJSCurrencyServiceProvider
    ]
})
export class IbMenusAppModule {}
