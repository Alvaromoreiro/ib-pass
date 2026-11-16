import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BookingTranslateFactoryService, AJStranslatetoken } from '@core/services/ib-booking-translate-factory.service';
import * as angular from 'angular';

describe('BookingTranslateFactoryService', () => {
    let service: BookingTranslateFactoryService;
    let translateServiceMock: jasmine.SpyObj<TranslateService>;
    let $translateMock: jasmine.SpyObj<angular.translate.ITranslateService>;

    beforeEach(() => {
        translateServiceMock = jasmine.createSpyObj('TranslateService', ['use']);
        // Add the missing properties that the constructor expects
        translateServiceMock.currentLang = 'en';
        (translateServiceMock as any).store = {
            translations: {
                'en': {}
            }
        };
        
        $translateMock = jasmine.createSpyObj('$translate', ['onReady', 'use']);

        TestBed.configureTestingModule({
            providers: [
                BookingTranslateFactoryService,
                { provide: TranslateService, useValue: translateServiceMock },
                { provide: AJStranslatetoken, useValue: $translateMock }
            ]
        });

        service = TestBed.inject(BookingTranslateFactoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set language and initialize AngularJS translation', async () => {
        const language = 'es';  // Different language to trigger the full flow
        translateServiceMock.use.and.returnValue(of({}));
        $translateMock.onReady.and.returnValue(Promise.resolve());

        // Mock the store translations for the new language
        (translateServiceMock as any).store.translations[language] = {};

        await service.setLanguage(language);

        expect(translateServiceMock.use).toHaveBeenCalledWith(language);
        expect($translateMock.use).toHaveBeenCalledWith(language);
        expect(service.isReady.value).toBe(true);
    });

    it('should not call translateService.use when language is the same', async () => {
        const currentLang = 'en';  // Same as the initial language
        translateServiceMock.currentLang = currentLang;

        await service.setLanguage(currentLang);

        expect(translateServiceMock.use).not.toHaveBeenCalled();
        expect(service.isReady.value).toBe(true);
    });

});
