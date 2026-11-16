import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
    selector: '[ibBookingCalculatePosition]'
})
export class IbBookingCalculatePositionDirective implements OnInit {

    constructor (
        private elementRef: ElementRef
    ) {}

    ngOnInit () {
        this.showAndPosition();
    }

    @HostListener('window:resize')
    onResize () {
        this.showAndPosition();
    }

    private showAndPosition () {
        const eWindow = document.defaultView;
        const element = this.elementRef.nativeElement;
        const container = document.querySelector('.container');
        let positionTop;
        let positionRight;
        const header:HTMLElement = document.querySelector('#ib-header-component');

        positionTop = header.offsetHeight + 24;
        element.style.top = `${positionTop}px`;

        if (eWindow.innerWidth >= 1024) {
            positionRight = (eWindow.innerWidth - container.clientWidth + 32) / 2;
        } else {
            positionRight = eWindow.innerWidth >= 768 ? (eWindow.innerWidth - container.clientWidth + 16) / 2 : 16;
        }

        if (eWindow.innerWidth <= 320) {
            element.style.top = `${header.offsetHeight + 4}px`;
        }

        element.setAttribute('data-rightpos', positionRight.toString());
        element.style.right = `${positionRight}px`;
    }

}
