import { Component, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { IbBookingAppContainerRefService } from './app/core/services/ib-booking-app-containerRef.service';
import { IbBookingMetaTagsService } from './app/core/services/ib-booking-meta-tags.service';
import { BookingTranslateFactoryService } from './app/core/services/ib-booking-translate-factory.service';
import { filter, Observable, takeWhile } from 'rxjs';
import { WINDOW_TOKEN } from './app/core/config/ib-booking-app-tokens';
import { BookingNavigationService } from '@shared/services/ib-utils/ib-booking-navigation.service';
import { AllowedPathsStep } from './app/core/constants/ib-booking-router-paths-constants';
import { NavigationManagerService } from '@core/services/navigation/ib-booking-navigation-manager.service';
import { EventDetectionService } from '@core/services/ib-booking-event-detection.service';
import { BookingUserActivityService } from '@core/services/ib-booking-user-activity.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
    public translationsReady: Observable<boolean>;
    constructor (
        @Inject(WINDOW_TOKEN) private window: Window,
        private ViewContainerRef: ViewContainerRef,
        private IbBookingAppContainerRefService: IbBookingAppContainerRefService,
        private IbBookingMetaTagsService: IbBookingMetaTagsService,
        private BookingTranslateFactoryService: BookingTranslateFactoryService,
        private BookingNavigationService: BookingNavigationService,
        private NavigationManagerService: NavigationManagerService,
        private EventDetectionService: EventDetectionService,
        private BookingUserActivityService: BookingUserActivityService

    ){
        this.IbBookingAppContainerRefService.appContainerRef = this.ViewContainerRef;
    }
    ngOnInit () {
        this.EventDetectionService.setupInterception();
        this.BookingUserActivityService.initActivityWorker();
        this.NavigationManagerService.init();
        this.translationsReady = this.BookingTranslateFactoryService.isReady.pipe( filter( ( isReady ) => isReady ), takeWhile((value) => !value, true ) );
        this.translationsReady.subscribe( () => {
            this.IbBookingMetaTagsService.initMetaTags();
        } );
        this.window.addEventListener('angularjs-navigate', (evt: Event) => {
            const { detail } = evt as CustomEvent<{ path: AllowedPathsStep }>;
            this.BookingNavigationService.navigateTo(detail.path);
        });
      
    }
}
