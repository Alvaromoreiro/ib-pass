import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[ibBookingLoadItemImage]'
})
export class IbBookingLoadItemImageDirective implements OnChanges{

    @Input() ibLoadItemImage: string;
    @Input() defaultImage: string;

    constructor (private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges (changes: SimpleChanges): void {
        if (changes.ibLoadItemImage.currentValue || changes.defaultImage.currentValue) {
            this.loadImage();
        }
    }

    private loadImage (): void {
        const image = new Image();
        image.src = this.ibLoadItemImage || this.defaultImage;

        image.onload = () => {
            this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${this.ibLoadItemImage})`);
        };

        image.onerror = () => {
            this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${this.defaultImage})`);
        };
    }

}
