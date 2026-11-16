import dayjs from 'dayjs';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { interval, map, Observable, takeWhile } from 'rxjs';
import { IbCUserUtilsService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { CalculatedPoints, Counter, GeneralInfo, Passenger } from '@core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';

@Component({
    selector: 'ib-general-info-on-hold-conf',
    templateUrl: './ib-general-info-on-hold-conf.component.html',
    styleUrls: ['./ib-general-info-on-hold-conf.component.scss']
})
export class IbGeneralInfoOnHoldConfComponent implements OnInit, OnChanges {
    @Input() generalInfo: GeneralInfo;
    @Input() passengersInfo:Passenger[];
    @Input() showAncillariesButton:boolean;
    @Output() confirmOnHoldOrder = new EventEmitter<string | undefined>();
    @Output() cancelOnHoldOrder = new EventEmitter<boolean>();

    isIbZero:boolean;
    isOnb:boolean;
    isUserLogged:boolean;
    aviosToEarn:number;
    elitePointsToEarn:number;
    resident:boolean;
    maxTimeUnit:string;
    isMulticity:boolean = false;
    remainingTime$: Observable<Counter>;

    constructor (
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingRedirectionService: BookingRedirectionService
    ){}

    ngOnChanges (changes: SimpleChanges): void {
        if (changes?.generalInfo?.currentValue) {
            this.isMulticity = this.generalInfo?.flightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP;
        }
    }
    ngOnInit (): void {
        let bookingInfo:any = this.CommonsSessionStorageService.get(BkiStorageConstants.BKI_INFO);
        let endTime;
        if (bookingInfo?.onHoldInformation?.remainingTime && bookingInfo?.onHoldInformation?.paidDeposit) {
            endTime = bookingInfo?.onHoldInformation?.timeLimits ? dayjs(bookingInfo.onHoldInformation.timeLimits) : 0;
        }
        this.isIbZero = this.CommonsUserUtilsService.isIbZero();
        this.isOnb = this.CommonsUserUtilsService.isUserLoggedONB();
        this.isUserLogged = this.CommonsUserUtilsService.isUserLogged();
        this.remainingTime$ = this.countDownOnHold(endTime);
        this.updateAvios();
        setTimeout(this.updateAvios, 5000);
    }

    private countDownOnHold (endTime: number): Observable<Counter> {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;

        return interval(second).pipe(
            map(() => {
                const now = dayjs().valueOf();
                const difference = endTime - now;

                const timer: Counter = {hours: '', minutes: '', seconds: ''};

                timer.hours = this.formatTime(Math.floor(difference / hour));
                timer.minutes = this.formatTime(Math.floor((difference % hour) / minute));
                timer.seconds = this.formatTime(Math.floor((difference % minute) / second));

                return timer;
            }),
            takeWhile(() =>{
                const now = dayjs().valueOf();
                const difference = endTime - now;
                return difference > 0;
            })
        );
    }

    private formatTime (unit: number): string {
        return unit < 10 ? '0' + unit : unit.toString();
    }

    private updateAvios = (): void => {
        const pointsData = this.CommonsSessionStorageService.get<CalculatedPoints>(BkiStorageConstants.CALCULATED_POINTS);
        this.aviosToEarn = pointsData ? pointsData.Avios : 0;
        this.elitePointsToEarn = pointsData ? pointsData.Elite : 0;
        this.resident = pointsData ? pointsData.resident : false;
    };

    confirmOrder = (): void => {
        this.confirmOnHoldOrder.emit();
    };

    cancelOrder = (): void => {
        this.cancelOnHoldOrder.emit(true);
    };

    redirectToAncillaries = () =>{
        this.confirmOnHoldOrder.emit('/ibcmtv');
    };
}
