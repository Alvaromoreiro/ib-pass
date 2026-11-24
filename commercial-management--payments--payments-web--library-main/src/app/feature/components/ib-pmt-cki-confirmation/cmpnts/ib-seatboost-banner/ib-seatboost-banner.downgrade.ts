import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { IbSeatboostBannerComponent } from './ib-seatboost-banner.component';

angular.module('ib-check-in-confirmation-module')
    .directive('ibSeatboostBanner', 
        downgradeComponent({ 
            component: IbSeatboostBannerComponent,
            inputs: ['redirectionUrl']
        })
    );
