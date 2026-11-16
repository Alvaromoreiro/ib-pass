import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ib-booking-mobile-ribbon',
    templateUrl: './ib-booking-mobile-ribbon.component.html',
    styleUrls: ['./ib-booking-mobile-ribbon.component.scss']
} )

export class IbBookingMobileRibbonComponent implements OnChanges, AfterViewInit, OnDestroy {

    public endCalendarIndex = 0;
    public initialCalendarIndex = 0;
    public ribbonDays: HTMLElement;
    public subscriptions: Subscription[] = [];
    public scrollLimitLeft: boolean = false;
    public scrollLimitRigth: boolean = false;
    @Input() public calendarData: AvailabilityTransformerModel.SlidesDataResponse;
    @Output() changeDay = new EventEmitter<any>();
    @Output()  nextDay = new EventEmitter<any>();
    public calendarSlides: AvailabilityTransformerModel.GenerateSliceInfo[] = [];
    constructor (
        private elementRef: ElementRef
    ) {

    }
    ngOnDestroy (): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    ngOnChanges (): void {
        if (this.calendarData?.selectedSlide != null) {
            this.calendarSlides = this.getInitialSlidesToRender(this.calendarData?.selectedSlide);
            if (this.ribbonDays?.querySelector('.selectedDay') != null) {
                window.setTimeout(() => { this.scrollToSelected(); });
            }
        }
    }
    ngAfterViewInit (): void {
        this.ribbonDays = this.elementRef.nativeElement.querySelector('.ribbon-days');
        this.scrollToSelected();
    }

    public onChangeDay = (eventData): void => {
        this.scrollToSelected();
        this.changeDay.emit( eventData );
    };
    
    @HostListener('window:resize', ['$event'])
    public onResize ( ): void {
        this.scrollToSelected();
    }
    private getInitialSlidesToRender = (selectedSliceIndex) :AvailabilityTransformerModel.GenerateSliceInfo[] => {
        this.initialCalendarIndex = Math.max(0, selectedSliceIndex - 6);
        this.endCalendarIndex = Math.min(this.calendarData.slides.length-1, selectedSliceIndex + 6);
        return this.getSlicesToRenderByRange(this.initialCalendarIndex, this.endCalendarIndex);
    };

    private getSlicesToRenderByRange = (initialIndex, endIndex) => {
        const excludeSet = new Set<string>(['UPPER_END_RIBBON_DISABLED', 'LOWER_END_RIBBON_DISABLED']);

        
        return this.calendarData.slides.filter((slide) => !excludeSet.has(slide.state));
    };
    public scrollHandler = ( isPrev: boolean ): void => {
        const averageWidth = this.ribbonDays.offsetWidth / 3;
        const scrollWidth = isPrev ? -averageWidth : averageWidth;
        this.ribbonDays.scrollBy( {
            left: scrollWidth,
            behavior: 'smooth'
        } );
    };

    public scrollToSelected = ():void => {
        const selected: HTMLElement = this.ribbonDays.querySelector( '.selectedDay' );
        const scrollToSelected = selected.offsetLeft - ( this.ribbonDays.offsetWidth / 2 ) + ( selected.offsetWidth / 2 );
        this.ribbonDays.scroll( {
            left: scrollToSelected,
            behavior: 'instant'
        } as any );
    };
    public onDayLoadingVisible = (slicePosition: number) => {
        this.nextDay.emit({ loadIndex: slicePosition, isLower: slicePosition < this.calendarData.selectedSlide  });
    };
}
