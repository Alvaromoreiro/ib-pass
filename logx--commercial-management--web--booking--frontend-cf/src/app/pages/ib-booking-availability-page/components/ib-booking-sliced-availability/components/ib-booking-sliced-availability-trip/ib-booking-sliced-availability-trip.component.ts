import { Component, Input, OnInit, ChangeDetectionStrategy, Inject, NgZone } from '@angular/core';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { AJSRootScope } from 'ib-web-commons/utils';
import { AJSMonetateUtilsService } from '@shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';

@Component({
    selector: 'ib-booking-sliced-availability-trip',
    templateUrl: './ib-booking-sliced-availability-trip.component.html',
    styleUrls: ['./ib-booking-sliced-availability-trip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbBookingSlicedAvailabilityTripComponent implements OnInit {
    @Input() tripModel!: AvailabilityTransformerModel.OriginDestination;
    @Input() showAdaptativeMobileFlow?: boolean;
    @Input() currencies!: AvailabilityTransformerModel.CurrenciesObject;
    @Input() originDestinationTitle?: string;
    @Input() currentOriginDestinationIndex!: number;
    @Input() selectedSlicesLength!: number;
    @Input() animationRun?: boolean;
    @Input() showBanner?: boolean;
    @Input() relatedContent?: any;
    @Input() selectedSliceInfoFamily?: AvailabilityTransformerModel.FareFamilyCondition;
    @Input() isPetsFlow = false;
    readonly LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
    public getMarketOBPoints: any = null;

    constructor (
        @Inject(AJSMonetateUtilsService) private MonetateUtilsService: MonetateUtilsService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private ngZone: NgZone
    ) {}

    ngOnInit (): void {
        this.activate();
    }

    private activate (): void {
        if (!this.hasValidCalendarSlides()) {
            return;
        }

        const productDetail = this.buildMonetateProductDetail();
        this.trackMonetateProductDetail(productDetail);
    }


    private hasValidCalendarSlides (): boolean {
        const slides = this.tripModel?.calendarSlides?.slides;
        return Array.isArray(slides) && slides.length > 0;
    }


    private buildMonetateProductDetail (): {
        origin: string;
        destination: string;
        date?: string;
    } {
        const calendar = this.tripModel!.calendarSlides!;
        const slideIndex =
        calendar.selectedSlide ??
        calendar.currentInitialSlide ??
        0;

        return {
            origin: this.tripModel?.origin ?? '',
            destination: this.tripModel?.destination ?? '',
            date: calendar.slides?.[slideIndex]?.serviceDate
        };
    }

    private trackMonetateProductDetail (productDetail: {
        origin: string;
        destination: string;
        date?: string;
    }): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.MonetateUtilsService.addTrackProductDetail([productDetail]);
                this.broadcastTrackingUpdates();
            }, 0);
        });
    }

    private broadcastTrackingUpdates (): void {
        this.$rootScope?.$broadcast?.('updateDigitalData');
        this.$rootScope?.$broadcast?.('sendUpdateToMonetate');
    }

    get originDestinationIndex (): number {
        return (this.currentOriginDestinationIndex ?? 0) + 1;
    }
}