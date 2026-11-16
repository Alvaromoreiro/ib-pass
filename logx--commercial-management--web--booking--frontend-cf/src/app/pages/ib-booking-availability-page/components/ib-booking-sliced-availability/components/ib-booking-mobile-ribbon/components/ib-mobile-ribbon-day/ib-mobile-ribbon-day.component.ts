import { Component, EventEmitter, Inject, Input, OnChanges, AfterViewInit, Output, ElementRef, OnDestroy } from '@angular/core';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
import { TranslateService } from '@ngx-translate/core';
import { BookingAvailabilityConstants } from '@src/app/core/constants/ib-booking-availability-constants';

@Component({
    selector: 'ib-mobile-ribbon-day',
    templateUrl: './ib-mobile-ribbon-day.component.html',
    styleUrls: ['./ib-mobile-ribbon-day.component.scss']
})
export class IbMobileRibbonDayComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() currentSelected: number;
    @Input() currentDay: AvailabilityTransformerModel.GenerateSliceInfo;
    @Input() dateState: string;
    @Output() changeDay = new EventEmitter<any>();
    @Output() dayLoadingVisible = new EventEmitter<number>();
    public selected: boolean = false;
    public availableFlights: boolean = true;
    public showLimit: boolean = false;
    public isLoading: boolean = false;
    public priceText: string;
    private intersectionObserver: IntersectionObserver;

    constructor (
        @Inject(AJSRootScope) private rootScope: CommonsRootScope,
        private TranslateService: TranslateService,
        public  ElementRef: ElementRef
    ) { }
    ngOnDestroy (): void {
        this.intersectionObserver?.disconnect();
    }

    ngAfterViewInit (): void {
        this.setScrollIntersectionObserver();    
    }

    ngOnChanges () {
        this.availableFlights = this.dateState === BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE;
        this.isLoading = this.dateState === BookingAvailabilityConstants.SLICK_STATUS.LOADING;
        this.selected = this.currentDay.slidePosition === this.currentSelected;
        this.showLimit = this.dateState === BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_WARN || this.dateState === BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_WARN;
        this.priceText = this.getCalculatePriceText();

    }

    private setScrollIntersectionObserver = () => {
        const options = {
            root: this.ElementRef.nativeElement.parentNode,
            rootMargin: '0px',
            threshold: 0
        };
          
        this.intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting ) {
                    if (this.currentDay.state !== BookingAvailabilityConstants.SLICK_STATUS.LOADING) {
                        this.intersectionObserver.disconnect();
                        this.intersectionObserver = null;  
                    } else{
                        this.dayLoadingVisible.emit(this.currentDay.slidePosition);
                    }
                }
            });
        }, options);
        if (this.currentDay.state === BookingAvailabilityConstants.SLICK_STATUS.LOADING) {
            this.intersectionObserver.observe(this.ElementRef.nativeElement);
        }
    };

    private getCalculatePriceText = () => {
        if (BookingAvailabilityConstants.SLICK_STATUS.LOADING === this.dateState) {
            return this.TranslateService.instant( 'AVAILABILITY_SLICK_LOADING' );
        }
        if (BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE !== this.dateState) {

            return this.TranslateService.instant( 'AVAILABILITY_SLICK_NOT_FLIGHTS' );
        }
        return this.currentDay.formattedPrice;
    };

    public onChangeDay = () => {
        const isNext = false;
        const eventData = {
            slide: this.currentDay,
            isNext
        };
        this.changeDay.emit( eventData );
    };
    public onOpenSeeker = ( calendar: string ) => {
        this.rootScope.$broadcast( 'openAdvancedSearchAndOpenCalendar', calendar );
    };
}
