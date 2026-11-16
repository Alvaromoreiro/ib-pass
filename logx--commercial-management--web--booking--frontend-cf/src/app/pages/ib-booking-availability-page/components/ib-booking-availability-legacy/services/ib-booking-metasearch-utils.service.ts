import { Inject, Injectable } from '@angular/core';
import { downgradeToAJSService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';

interface RedirectFlightInfo {
    scope?: angular.IScope;
}

@Injectable ({ providedIn: 'root' })
export class IbBookingMetasearchUtilsService {
    constructor (
        private  CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(WINDOW_TOKEN) private window: Window
    ) {

    }

    public redirectFlightSelection =  (currentScope: angular.IScope): void => {
        const actions = [
            this.redirectOpenJawsToMulticity.bind(this),
            this.redirectToSlicedAvailability.bind(this) // Must be the last action
        ];
        for (const action of actions) {
            if (action({ scope: currentScope })) {
                break;
            }
        }
    };

    private redirectOpenJawsToMulticity = ({}: RedirectFlightInfo): boolean  => {
        if(this.CommonsSessionStorageService.get(BkiStorageConstants.OPEN_JAW) === true) {
            const searchParams = new URLSearchParams(this.window.location.search);
            searchParams.set('TripType', 'MultiCity');
            this.window.location.search = searchParams.toString();
            return true;
        }
        return false;
    };

    private redirectToSlicedAvailability  = ({scope}:RedirectFlightInfo): boolean =>  {
        scope.$emit('forceSlicedAvailability');
        return true;
    };


    
}
downgradeToAJSService('IbBookingMetasearchUtilsService', IbBookingMetasearchUtilsService, 'ib-booking-availability-module', []);
