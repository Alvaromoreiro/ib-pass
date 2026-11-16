import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingMetaTagsService } from '@core/services/ib-booking-meta-tags.service';
import { BookingMetaTags } from '@core/constants/ib-booking-meta-tags.constants';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';

class MetaMock {
    addTag = jasmine.createSpy('addTag');
}

describe('IbBookingMetaTagsService', () => {
    let service: IbBookingMetaTagsService;
    let meta: MetaMock;
    let translateService: TranslateServiceMock;


    beforeEach(() => {
        translateService = new TranslateServiceMock();
        meta = new MetaMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: Meta, useValue: meta },
                { provide: TranslateService, useValue: translateService }
            ]
        });

        service = TestBed.inject(IbBookingMetaTagsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize meta tags', () => {
        service.initMetaTags();
        BookingMetaTags.forEach(tag => {
            expect(meta.addTag).toHaveBeenCalledWith({ name: tag.name, property: tag.value });
        });
    });
});
