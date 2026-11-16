import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { UrlUtilsService } from './ib-booking-url-utils.service';

@Injectable({providedIn: 'root'})
export class StepsNavigationService {
    private redemption: boolean = false;
    private activationFlag: boolean = false;
    private isOnbusinessUser: boolean = false;
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private UrlUtilsService: UrlUtilsService
    ) { }
    
    public checkButtonsActivation = (): boolean => {
        this.redemption = this.checkRedemptions();
        this.activationFlag = this.checkStorageKey() || false;
        this.isOnbusinessUser = this.checkOnBusinessUser();

        return !this.redemption && !this.isOnbusinessUser && this.activationFlag;
    };

    private checkOnBusinessUser = (): boolean => {
        const userLogged = this.CommonsSessionStorageService.get('userLogged');
        return ( userLogged === BookingAppConstants.LOGIN_ONB ) ;
    };
    
    private checkRedemptions = (): boolean => {
        const redemption = this.UrlUtilsService.getURLFirstParameterByName( BookingAppConstants.BOOKING_PARAMS_NAMES.AVIOS_PAY ) === 'true';
        const onb = this.UrlUtilsService.getURLFirstParameterByName( BookingAppConstants.BOOKING_PARAMS_NAMES.POINTS_PAY ) === 'true';
        return redemption || onb;
    };
    
    private checkStorageKey = (): boolean => {
        return this.CommonsSessionStorageService.get( BkiStorageConstants.STEPS_BUTTONS_ACTIVATION );
    };
}
downgradeToAJSService('StepsNavigationService', StepsNavigationService, 'ib-booking-services-module', []);