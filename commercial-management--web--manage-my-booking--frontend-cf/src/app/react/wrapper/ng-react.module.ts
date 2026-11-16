import { NgModule} from '@angular/core';
import { NgReactComponent } from './ng-react.component';

@NgModule({
    declarations: [
        NgReactComponent
    ],
    exports: [
        NgReactComponent
    ],
    providers: []
})

export class NgReactModule { }
