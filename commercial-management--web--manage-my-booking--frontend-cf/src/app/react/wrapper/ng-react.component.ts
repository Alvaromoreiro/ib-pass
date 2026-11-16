import { Component, ElementRef, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { ComponentProps, createElement, ElementType } from 'react';
import { createRoot } from 'react-dom/client';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ng-react',
    template: ''
})
export class NgReactComponent<Comp extends ElementType> implements OnChanges, OnDestroy {
    @Input() component: Comp;
    @Input() props: ComponentProps<Comp>;
    private root = createRoot(inject(ElementRef).nativeElement);

    ngOnChanges () {
        this.root.render(createElement(this.component, this.props));
    }

    ngOnDestroy () {
        this.root.unmount();
    }
}
downgradeToAJSComponent('ngReact', { component: NgReactComponent, inputs: [] }, 'ib-ng-react-component-module');
