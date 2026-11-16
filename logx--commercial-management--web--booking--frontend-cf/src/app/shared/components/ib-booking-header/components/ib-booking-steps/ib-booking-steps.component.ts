import { Component, HostListener, Inject, Input, OnInit, ElementRef, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { HeaderStep } from '@src/app/core/models/ib-booking-availability/header-model';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
@Component({
    selector: 'ib-booking-steps',
    templateUrl: './ib-booking-steps.component.html',
    styleUrls: ['./ib-booking-steps.component.scss']
})
export class IbBookingStepsComponent implements OnInit, OnDestroy {
    @Input() public currentStep: HeaderStep;
    @Input() public steps?: HeaderStep[];
    public isMobile : boolean  = true;
    public selectedStep: HeaderStep;
    public mobileDrawerOpen: boolean = false;
    private focusTrapElementEnd: HTMLElement;
    public mobileEnabled: boolean = false;
    @ViewChild('closeButton') private closeButton: ElementRef;
    @ViewChild('openButton') private openButton: ElementRef;
    @ViewChild('stepsMobileMenu') private stepsMobileMenu: ElementRef;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private ngZone: NgZone
    ) { }

    @HostListener('window:resize', ['$event'])
    public onResize ( ): void {
        this.isMobile = this.rootScope.isMobile.general;
        if(!this.isMobile) {
            document.body.classList.remove('modal-open');
            this.mobileDrawerOpen = false;
            this.destroyMenuAccessibility();
        }
    }
 
    ngOnInit (): void {
        this.isMobile = this.rootScope?.isMobile?.general;
    }
    
    ngOnDestroy (): void {
        this.destroyMenuAccessibility();
    }

    private initMenuAccessibility  = () =>  {
        const focusTrapElements = this.stepsMobileMenu.nativeElement.querySelectorAll('.steps-nav, .steps-nav-btn:enabled');
        this.focusTrapElementEnd = focusTrapElements[focusTrapElements.length -1];
        this.focusTrapElementEnd?.addEventListener('focusout', this.onTrapFocusOut);
        document.addEventListener('click', this.managedClickOutside);
        document.addEventListener('keydown', this.onKeyDown);
    };

    private destroyMenuAccessibility = () => {
        this.focusTrapElementEnd?.removeEventListener('focusout', this.onTrapFocusOut);
        document.removeEventListener('click', this.managedClickOutside);
        document.removeEventListener('keydown', this.onKeyDown);
        this.focusTrapElementEnd = null;
    };

    private onKeyDown = ( event: KeyboardEvent ) => {
        this.ngZone.runOutsideAngular(()=>{
            if (event.key !== 'Escape') {
                return;
            }
            this.closeMobileDrawer();
        });
    };

    private managedClickOutside = ( event: MouseEvent ) => {
        this.ngZone.runOutsideAngular(()=>{
            const isInside = this.stepsMobileMenu.nativeElement.contains( event.target );
            const isOpenButton = this.openButton.nativeElement.contains( event.target );
            const exception =  (isInside || isOpenButton);
            if (exception) {
                return;
            }
            this.closeMobileDrawer();
        });
    };

    private onTrapFocusOut = ()=> {
        this.ngZone.runOutsideAngular(()=>{
            this.closeButton.nativeElement.focus();
        });
    };

    private focusOpenButton = ()=> {
        this.ngZone.runOutsideAngular(()=>{
            this.openButton.nativeElement.focus();
        });
    };

    public toggleMobileDrawer = ()=> {
        if (this.mobileDrawerOpen) {
            this.closeMobileDrawer();
            return;
        }

        this.mobileDrawerOpen = !this.mobileDrawerOpen;
        this.focusTrapElementEnd?.focus();
        document.body.classList.add('modal-open');
        this.initMenuAccessibility();
            
        this.ngZone.runOutsideAngular(()=>{
            setTimeout(() => {
                this.stepsMobileMenu.nativeElement.querySelector('.steps-nav')?.focus();
            });
        });
    };

    public onStepClicked = () => {
        if (this.isMobile) {
            this.closeMobileDrawer();
        }
    };

    public closeMobileDrawer = ()=> {
        document.body.classList.remove('modal-open');
        this.mobileDrawerOpen = false;
        this.focusOpenButton();
        this.destroyMenuAccessibility();
    };

    public onEnableMobileDrawer = ( active: boolean ) => {
        this.mobileEnabled = active;
    };

}
