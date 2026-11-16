import { Component, OnInit, OnDestroy, ElementRef, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LazyLoaderService } from './ib-MmB-js-lazy-loader.service';


@Component({
    selector: 'app-angular-js',
    template: ``
})
export class IbMmBJSComponent implements OnInit, OnDestroy {

    constructor (
        private lazyLoader: LazyLoaderService,
        private elRef: ElementRef
    ) {}

    ngOnInit () {
        this.lazyLoader.load(this.elRef.nativeElement as HTMLElement);
    }


    ngOnDestroy () {
        this.lazyLoader.destroy();
    }
}


@NgModule({
    declarations: [
        IbMmBJSComponent
    ],
    exports: [
        IbMmBJSComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IbMmBJSComponentModule {}
