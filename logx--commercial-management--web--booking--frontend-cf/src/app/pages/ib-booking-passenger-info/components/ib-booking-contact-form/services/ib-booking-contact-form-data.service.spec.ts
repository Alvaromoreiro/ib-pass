import { TestBed } from '@angular/core/testing';

import { IbBookingContactFormDataService } from '@pages/ib-booking-passenger-info/components/ib-booking-contact-form/services/ib-booking-contact-form-data.service';
import { isEqual } from 'lodash-es';

describe('IbBookingContactFormDataService', () => {
    let service: IbBookingContactFormDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IbBookingContactFormDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('setEmail and getEmail', () => {
        it('should set and get Email value', () => {
            service.setEmail('test@test.com');
            expect(service.getEmail()).toBe('test@test.com');
        });
    });

    describe('setPrefix and getPrefix', () => {
        it('should set and get prefix value', () => {
            service.setPrefix({code:'34', countryCode:'ES', description:'España'});
            expect(service.getPrefix()).toEqual({code:'34', countryCode:'ES', description:'España'});
        });
    });

    describe('setPhone and getPhone', () => {
        it('should set and get phone value', () => {
            service.setPhone('655996622');
            expect(service.getPhone()).toBe('655996622');
        });
    });

    describe('setDenyNews and getDenyNews', () => {
        it('should set and get denyNews value', () => {
            service.setDenyNews(true);
            expect(service.getDenyNews()).toBe(true);
        });
    });

    describe('Call resetData', () => {
        beforeEach(() => {

        });
        it('should reset all values', () => {
            service.setEmail('test@test.com');
            service.setPrefix({code:'34', countryCode:'ES', description:'España'});
            service.setPhone('655996622');
            service.setDenyNews(true);

            service.resetData();

            expect(service.getEmail()).toBe('');
            expect(service.getPrefix()).toEqual({code:'', countryCode:'', description: ''});
            expect(service.getPhone()).toBe('');
            expect(service.getDenyNews()).toBe(false);
        });
    });

    describe('Observable properties', () => {
        it('email$ should emit new values', done => {
            service.email$.subscribe(value => {
                if (value) {
                    expect(value).toBe('test@test.com');
                    done();
                }
            });
            service.setEmail('test@test.com');
        });

        it('prefix$ should emit new values', done => {
            service.prefix$.subscribe(value => {
                if (!isEqual(value, {code:'', countryCode:'', description: ''})) {
                    expect(value).toEqual({code:'34', countryCode:'ES', description:'España'});
                    done();
                }
            });
            service.setPrefix({code:'34', countryCode:'ES', description:'España'});
        });

        it('phone$ should emit new values', done => {
            service.phone$.subscribe(value => {
                if (value) {
                    expect(value).toBe('655996622');
                    done();
                }
            });
            service.setPhone('655996622');
        });

        it('denyNews$ should emit new values', done => {
            service.denyNews$.subscribe(value => {
                if (value !== false) {
                    expect(value).toBe(true);
                    done();
                }
            });
            service.setDenyNews(true);
        });
    });
});
