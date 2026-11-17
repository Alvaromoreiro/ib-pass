/* eslint-disable no-console */
import { Inject, Component, ElementRef, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { AJSRootScope } from 'ib-web-commons/utils';
import { ComponentProps, createElement, ElementType, startTransition } from 'react';
import { createRoot, Root } from 'react-dom/client';

@Component({
    selector: 'ng-react',
    template: ''
})
export class NgReactComponent<Comp extends ElementType> implements OnChanges, OnDestroy {
    @Input() component: Comp;
    @Input() props: ComponentProps<Comp>;
    private root: Root;

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) {
        const elementRef = inject(ElementRef);
        this.root = createRoot(elementRef.nativeElement);
    }

    ngOnChanges () {
        if (this.props && !('lang' in this.props)) {
            this.props.lang = this.$rootScope.appLang || 'en';
        }

        startTransition(() => {
            this.root.render(createElement(this.component, this.props));
        });
    }

    ngOnDestroy () {
        this.root.unmount();
    }
}
