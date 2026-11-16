import { Directive, ElementRef, Renderer2, HostListener, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';


@Directive({
    selector: '[ibMmbCollapse]'
})
export class IbMmbCollapseDirective implements OnInit {
    public container: HTMLElement;
    public button: HTMLElement;
    @Input() collapseContainer;
    @Input() collapseTrigger;
    @Input() collapsed: boolean;
    @Input() closeOnResize: boolean = true;

    @Output() collapseClosedEvent = new EventEmitter<boolean>();

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private ChangeDetectorRef: ChangeDetectorRef
    ) {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        if (!this.collapsed && this.closeOnResize) {
            this.collapseClose();
        }
    };

    @HostListener('document:click', ['$event.target'])
    onClick(target: HTMLElement) {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (target.closest(`[${this.collapseTrigger}]`)) {
            this.collapseToggle();
        } else if (!clickedInside && !this.collapsed) {
            this.collapseToggle();
        }
    }
    @HostListener('document:keyup.escape')
    onKeyUp() {
        if (!this.collapsed) {
            this.collapseToggle();
        }
    }

    ngOnInit(): void {
        this.button = this.elementRef.nativeElement.querySelector(`[${this.collapseTrigger}]`);
        this.container = this.elementRef.nativeElement.querySelector(`[${this.collapseContainer}]`);
        this.collapseActions();
    }

    public collapseToggle(): void {
        this.collapsed = !this.collapsed;
        this.collapseActions();
        this.ChangeDetectorRef.detectChanges();
    }

    public collapseOpen(): void {
        this.renderer.addClass(this.container, 'collapse-open');
        this.renderer.addClass(this.button, 'collapse-open');
        this.renderer.removeClass(this.container, 'collapse-closed');
        this.renderer.removeClass(this.button, 'collapse-closed');
        this.renderer.setAttribute(this.container, 'aria-expanded', 'true');
    }

    public collapseClose(): void {
        this.renderer.removeClass(this.container, 'collapse-open');
        this.renderer.removeClass(this.button, 'collapse-open');
        this.renderer.addClass(this.container, 'collapse-closed');
        this.renderer.addClass(this.button, 'collapse-closed');
        this.renderer.setAttribute(this.container, 'aria-expanded', 'false');
        this.collapseClosedEvent.emit(true);
    }

    public collapseActions(): void {
        if (this.collapsed) {
            this.collapseClose();
        } else {
            this.collapseOpen();
        }
    }
}
