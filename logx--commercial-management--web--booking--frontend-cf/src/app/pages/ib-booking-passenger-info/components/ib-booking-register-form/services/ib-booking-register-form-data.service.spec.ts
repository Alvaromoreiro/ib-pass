import { TestBed } from '@angular/core/testing';

import { IbBookingRegisterFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/services/ib-booking-register-form-data.service';

describe('IbBookingRegisterFormDataService', () => {
    let service: IbBookingRegisterFormDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IbBookingRegisterFormDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('setName and getName', () => {
        it('should set and get name value', () => {
            service.setName('Julio');
            expect(service.getName()).toBe('Julio');
        });
    });

    describe('setLastName and getLastName', () => {
        it('should set and get last name value', () => {
            service.setLastName('Gonzalez');
            expect(service.getLastName()).toBe('Gonzalez');
        });
    });

    describe('setEmail and getEmail', () => {
        it('should set and get email value', () => {
            service.setEmail('test@email.com');
            expect(service.getEmail()).toBe('test@email.com');
        });
    });

    describe('setPassword and getPassword', () => {
        it('should set and get password value', () => {
            service.setPassword('password123');
            expect(service.getPassword()).toBe('password123');
        });
    });

    describe('setCheck and getCheck', () => {
        it('should set and get check value', () => {
            service.setCheck(true);
            expect(service.getCheck()).toBe(true);
        });
    });

    describe('setMarketingCheck and getMarketingCheck', () => {
        it('should set and get marketing check value', () => {
            service.setMarketingCheck(true);
            expect(service.getMarketingCheck()).toBe(true);
        });

        it('should default marketing check to false', () => {
            expect(service.getMarketingCheck()).toBe(false);
        });
    });

    describe('Call resetData', () => {
        it('should reset all values including marketing check', () => {
            service.setName('Julio');
            service.setLastName('Gonzalez');
            service.setEmail('test@email.com');
            service.setPassword('password123');
            service.setCheck(true);
            service.setMarketingCheck(true);

            service.resetData();

            expect(service.getName()).toBe('');
            expect(service.getLastName()).toBe('');
            expect(service.getEmail()).toBe('');
            expect(service.getPassword()).toBe('');
            expect(service.getCheck()).toBe(false);
            expect(service.getMarketingCheck()).toBe(false);
        });
    });

    describe('Observable properties', () => {
        it('name$ should emit new values', done => {
            service.name$.subscribe(value => {
                if (value) {
                    expect(value).toBe('Julio');
                    done();
                }
            });
            service.setName('Julio');
        });

        it('lastName$ should emit new values', done => {
            service.lastName$.subscribe(value => {
                if (value) {
                    expect(value).toBe('Gonzalez');
                    done();
                }
            });
            service.setLastName('Gonzalez');
        });

        it('email$ should emit new values', done => {
            service.email$.subscribe(value => {
                if (value) {
                    expect(value).toBe('test@email.com');
                    done();
                }
            });
            service.setEmail('test@email.com');
        });

        it('password$ should emit new values', done => {
            service.password$.subscribe(value => {
                if (value) {
                    expect(value).toBe('password123');
                    done();
                }
            });
            service.setPassword('password123');
        });

        it('check$ should emit new values', done => {
            service.check$.subscribe(value => {
                if (value !== false) {
                    expect(value).toBe(true);
                    done();
                }
            });
            service.setCheck(true);
        });

        it('marketingCheck$ should emit new values', done => {
            service.marketingCheck$.subscribe(value => {
                if (value !== false) {
                    expect(value).toBe(true);
                    done();
                }
            });
            service.setMarketingCheck(true);
        });
    });
});