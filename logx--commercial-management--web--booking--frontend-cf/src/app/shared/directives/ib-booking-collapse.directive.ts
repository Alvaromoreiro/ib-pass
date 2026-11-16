import { Directive, ElementRef, Renderer2, HostListener, Input, ChangeDetectorRef, Inject, AfterViewInit } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';

@Directive({
    selector: '[ibBookingCollapse]'
})
export class IbBookingCollapseDirective implements AfterViewInit {
    public container: HTMLElement;
    public button: HTMLElement;
    public innerWidth: number;
    @Input() collapseContainer;
    @Input() collapseTrigger;
    @Input() collapsed:boolean;
    @Input() blockScrollMobile:boolean;
    @Input() avoidClickOutside:boolean;

    constructor (
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private ChangeDetectorRef: ChangeDetectorRef,
        @Inject( WINDOW_TOKEN ) private window: Window
    ) {
        this.blockScrollMobile = Boolean( this.blockScrollMobile );
    }
    @HostListener( 'window:resize', [ '$event' ] ) onResize = ( event: Event ) => {
        if ( !this.collapsed && ( this.innerWidth !== this.window.innerWidth ) ) {
            this.collapseClose();
        }
    };

    @HostListener( 'document:click', [ '$event.target' ] )
    onClick ( target: HTMLElement ) {
        const clickedInside = this.elementRef.nativeElement.contains( target );
        const checkCollapseToggle = ( clickedInside: boolean ): boolean => !clickedInside && !this.collapsed && !this.avoidClickOutside;
        if ( target.closest( `[${ this.collapseTrigger }]` ) ) {
            this.collapseToggle();
        } else if ( checkCollapseToggle( clickedInside  ) ) {
            this.collapseToggle();
        }
    }
    @HostListener('document:keyup.escape')
    onKeyUp () {
        if ( !this.collapsed ) {
            this.collapseToggle();
        }
    }

    ngAfterViewInit (): void {
        this.innerWidth = this.window.innerWidth;
        this.button = this.elementRef.nativeElement.querySelector( `[${ this.collapseTrigger }]` );
        this.container = this.elementRef.nativeElement.querySelector( `[${ this.collapseContainer }]` );
        this.collapseActions();
    }
    
    public collapseToggle (): void {
        this.collapsed = !this.collapsed;
        this.collapseActions();
        this.ChangeDetectorRef.detectChanges();
    }
    
    private setCollapseState = (isOpen: boolean): void => {
        this.toggleClasses(isOpen);
        this.setAriaAttributes(isOpen);
        this.toggleInertAttribute(isOpen);
        this.toggleBodyScroll(isOpen);
    };

    private toggleClasses = (isOpen: boolean): void => {
        const addClass = isOpen ? 'collapse-open' : 'collapse-closed';
        const removeClass = isOpen ? 'collapse-closed' : 'collapse-open';

        this.renderer.removeClass(this.container, removeClass);
        this.renderer.removeClass(this.button, removeClass);
        this.renderer.addClass(this.container, addClass);
        this.renderer.addClass(this.button, addClass);
    };

    private setAriaAttributes = (isOpen: boolean): void => {
        this.renderer.setAttribute(this.button, 'aria-expanded', isOpen ? 'true' : 'false');
        this.renderer.setAttribute(this.container, 'aria-hidden', isOpen ? 'false' : 'true');
    };

    private toggleInertAttribute = (isOpen: boolean): void => {
        if (isOpen) {
            this.renderer.removeAttribute(this.container, 'inert');
        } else {
            this.renderer.setAttribute(this.container, 'inert', '');
        }
    };

    private toggleBodyScroll = (isOpen: boolean): void => {
        if (this.blockScrollMobile && this.window.innerWidth < 768) {
            if (isOpen) {
                this.renderer.addClass(document.body, 'modal-open');
            } else {
                this.renderer.removeClass(document.body, 'modal-open');
            }
        }
    };

    public collapseOpen (): void {
        this.setCollapseState(true);
    }

    public collapseClose (): void {
        this.setCollapseState(false);
    }


    public collapseActions (): void {
        if ( this.collapsed ) {
            this.collapseClose();
        } else {
            this.collapseOpen();
        }
    }
}
