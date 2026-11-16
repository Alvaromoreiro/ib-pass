import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import {  debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

enum DisplayTypesEnum {
    MOSAIC,
    CAROUSEL,
    LIST
}
@Component({
    selector: 'ib-booking-fare-container',
    templateUrl: './ib-booking-fare-container.component.html',
    styleUrls: ['./ib-booking-fare-container.component.scss']
})
export class IbBookingFareContainerComponent implements OnInit, OnDestroy, AfterViewInit { 
    @Input() public itemIdBase: string;
    @Input() public newFare: boolean;                              
    @Input() public isSelected?: boolean;
    @Input() public selectedSliceIndex;
    @Input() public selectedSegmentIndex?;
    @Input() public originDestinationId;
    @Input() public currencies;
    @Input() public selectedFare;
    @Input() public selectedCabin;
    @Input() public metaSearchInfo;
    @Input() public recommendedOfferId;
    @Input() public rateHighlighted;
    @Input() public multiCity;
    @Input() public redemption;
    @Input() public expensivePriceShown;
    @Input() public fareFamilies: AvailabilityTransformerModel.FareFamilyCondition[];
    @Input() public legacyAnimationRun?: boolean;
    @Input() public flightRatio: string;
    @Input() public marketingCarrier: boolean;
    @HostListener('window:resize', ['$event']) onResize = () => this.onResizeAction();
    public displayTypesEnum = DisplayTypesEnum;
    public displayType?: DisplayTypesEnum = this.displayTypesEnum.MOSAIC;
    public unsubscribe: Subject<void> = new Subject<void>();
    private fareContainer: HTMLElement;
    public scrollLimitLeft: boolean = true;
    public scrollLimitRight: boolean = true;

    constructor (
        private elementRef: ElementRef,
        private ChangeDetectorRef: ChangeDetectorRef
    ) {}
    ngAfterViewInit (): void {
        this.fareContainer = this.elementRef.nativeElement.querySelector('.fares-container');
        this.onScrollAction();
        this.initCarouselScrollSub();
        this.ChangeDetectorRef.detectChanges();
    }

    ngOnDestroy (): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    ngOnInit (): void {
        this.setDisplayType();
    }

    private onResizeAction = () => {
        this.onScrollAction();
        (this.fareContainer.querySelector('input[type="radio"]:checked') as HTMLInputElement)?.focus();

    };

    private setDisplayType = () => {
        const listRendered = this.redemption || this.multiCity || this.metaSearchInfo;
        if (listRendered){
            this.displayType = this.displayTypesEnum.LIST;
            return;
        } 

        this.displayType = this.fareFamilies?.length > 3? this.displayTypesEnum.CAROUSEL :this.displayTypesEnum.MOSAIC;
    };

    private initCarouselScrollSub = () => {
        if (this.displayType === this.displayTypesEnum.CAROUSEL) {
            fromEvent(this.fareContainer, 'scroll', {passive: true}).pipe(takeUntil(this.unsubscribe), debounceTime(50)).subscribe(
                (next: Event)=> {
                    next.preventDefault();
                    this.onScrollAction();
                }
            );
        }
    };
    
    private onScrollAction = (): void => {
        this.scrollLimitLeft = this.fareContainer.scrollLeft === 0;
        this.scrollLimitRight = ( this.fareContainer.scrollWidth - this.fareContainer.offsetWidth -16) < this.fareContainer.scrollLeft;
    };

    public arrowScroll = (direction: 'left' | 'right') => {
        const fareChild:HTMLElement = this.fareContainer?.querySelector(':first-child') as HTMLElement;
        const directionValue = direction === 'left'? -1: 1;
        if(fareChild){
            const scrollWidth = (fareChild.offsetWidth + 16) * directionValue;
            this.fareContainer.scrollBy( {
                left: scrollWidth,
                behavior: 'smooth'
            } );

        }
    };



}
downgradeToAJSComponent(
    'ibBookingFareContainerComponentLegacy',
    {
        component: IbBookingFareContainerComponent,
        inputs: [],
        outputs: []
    },
    'ib-booking-availability-module'
);
