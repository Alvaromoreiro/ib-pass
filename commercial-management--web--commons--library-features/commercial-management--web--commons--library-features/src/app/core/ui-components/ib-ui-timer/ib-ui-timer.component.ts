// @ts-nocheck
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { IbUiTimerTemplateType } from './ib-ui-timer.model';
import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';

@Component({
    selector: "ib-ui-timer",
    templateUrl: "./ib-ui-timer.component.html",
    })
export class IbUiTimerComponent implements OnInit, OnDestroy {
    private subscription: Subscription;

    @Input() type: IbUiTimerTemplateType;
    @Input() generalClass: string;
    @Input() timerClass: string;
    @Input() endTime: string;
    public dateNow: Date;
    public dateExpiration: Date;
    public additionalStyle: string;

    public timeDifference: number;
    public secondsToExpiration: number;
    public minutesToExpiration: number;
    public hoursToExpiration: number;
    public daysToExpiration: number;

    milliSecondsInASecond = 1000;
    hoursInADay = 24;
    minutesInAnHour = 60;
    secondsInAMinute = 60;

    ngOnInit () {
        this.dateNow = new Date();
        const arr = this.endTime.split(/[- :]/);
        this.dateExpiration = new Date(
            Number.parseInt(arr[0]),
            Number.parseInt(arr[1]) - 1,
            Number.parseInt(arr[2]),
            Number.parseInt(arr[3]),
            Number.parseInt(arr[4]),
            0
        );
        this.getTimeDifference();
        this.subscription = interval(1000).subscribe(() => {
            this.getTimeDifference();
        });
        if (this.type === undefined) {
            if (this.daysToExpiration >= 2) {
                this.type = IbUiTimerTemplateType.fullDate;
                this.additionalStyle = 'ib-ui-banners__timer--long';
            } else {
                this.type = IbUiTimerTemplateType.clockType;
            }
        }
    }

    ngOnDestroy () {
        this.subscription.unsubscribe();
    }

    private getTimeDifference () {
        this.timeDifference = this.dateExpiration.getTime() - new Date().getTime();
        this.allocateTimeUnits(this.timeDifference);
    }

    private allocateTimeUnits (timeDifference) {
        this.secondsToExpiration =
      Math.floor(timeDifference / this.milliSecondsInASecond) %
      this.secondsInAMinute;
        this.minutesToExpiration =
      Math.floor(
          timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)
      ) % this.secondsInAMinute;
        this.hoursToExpiration =
      Math.floor(
          timeDifference /
          (this.milliSecondsInASecond *
            this.minutesInAnHour *
            this.secondsInAMinute)
      ) % this.hoursInADay;
        this.daysToExpiration = Math.floor(
            timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.secondsInAMinute *
          this.hoursInADay)
        );
    }
}
try {
    angular.module('ib-ui-timer-module').directive(
        'ibUiTimer',
        downgradeComponent({
            component: IbUiTimerComponent,
            inputs: ['type', 'generalClass', 'timerClass', 'endTime']
        }) as angular.IDirectiveFactory
    );
} catch {
    angular.module('ib-ui-timer-module', []).directive(
        'ibUiTimer',
        downgradeComponent({
            component: IbUiTimerComponent,
            inputs: ['type', 'generalClass', 'timerClass', 'endTime']
        }) as angular.IDirectiveFactory
    );
}
