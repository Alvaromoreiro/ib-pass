import { Component, ElementRef, Input, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { ComponentProps, createElement, ElementType } from 'react';
import { createRoot } from 'react-dom/client';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ng-react',
    template: ''
})
export class NgReactComponent<Comp extends ElementType> implements OnChanges, OnDestroy{
    @Input() component: Comp;
    @Input() props: ComponentProps<Comp>;
    private root: ReturnType<typeof createRoot>;

    constructor (
        private ngZone: NgZone,
        private elementRef: ElementRef
    ) {
        this.root = createRoot(this.elementRef.nativeElement);
    }

    ngOnChanges () {
        this.ngZone.runOutsideAngular(()=> {
            this.root.render(createElement(this.component, this.props));
        });
    }

    ngOnDestroy () {
        this.ngZone.runOutsideAngular(()=> {
            this.root.unmount();
        });
    }
}
downgradeToAJSComponent('ngReact', { component: NgReactComponent, inputs: [] }, 'ib-ng-react-component-module');
