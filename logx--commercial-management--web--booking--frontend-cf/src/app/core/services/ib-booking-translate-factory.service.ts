import { Inject, Injectable, InjectionToken } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { TranslateService } from '@ngx-translate/core';
import * as angular from 'angular';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

import { BehaviorSubject, lastValueFrom } from 'rxjs';
export const AJStranslatetoken= new InjectionToken('$translate');
export const $translateProvider = new InjectionToken<angular.translate.ITranslateService>('$translateProvider');
export const AJStranslateProvider = upgradeAJSServiceProvider('$translate', AJStranslatetoken);


export let lang:string='';
export const IB_BOOKING_TRANSLATIONS = {};




@Injectable({
    providedIn: 'root'
})
export class BookingTranslateFactoryService {
    constructor (
        public translateService: TranslateService,
        @Inject(AJStranslatetoken) private $translate: 	angular.translate.ITranslateService
    ) {
        lang = this.translateService.currentLang;
        IB_BOOKING_TRANSLATIONS[lang] = this.translateService.store.translations[lang];
    }   
    public isReady : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private initAngularJS = (language: string) :  Promise<void> => {
        return new Promise((resolve) => {
            this.$translate.onReady().then(() => {
                resolve();
            });
            this.$translate.use(language);
        });
    };
    setLanguage = async (language:string) => {
        if( this.translateService.currentLang === language ) {
            this.isReady.next( true );
            return;
        }
        await lastValueFrom(this.translateService.use(language));
        IB_BOOKING_TRANSLATIONS[language] = this.translateService.store.translations[language];
      
        try {
            await this.initAngularJS(language);
        } catch(e) {
            // eslint-disable-next-line no-console
            console.error('Error initializing AngularJS translations', e);
        }
        this.isReady.next( true );
    };

}

try {
    angular
        .module('ib-booking-app')
        .service('BookingTranslateFactoryService', downgradeInjectable(BookingTranslateFactoryService));
} catch {
    angular
        .module('ib-booking-app', [])
        .service('BookingTranslateFactoryService', downgradeInjectable(BookingTranslateFactoryService));
}
