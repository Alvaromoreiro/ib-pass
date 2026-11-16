import { TestBed } from '@angular/core/testing';
import { RootStore } from '@core/store/ib-booking-root.store';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IbBookingFlowDetectionService } from '@core/services/ib-booking-flow-detection.service';

describe('RootStore Test', () => {
    let service: RootStore;
    let ajsRootScopeMock: any;
    let flowDetectionServiceMock: any;

    beforeEach(() => {
        ajsRootScopeMock = {
            $new: jasmine.createSpy('$new'),
            $destroy: jasmine.createSpy('$destroy'),
            $apply: jasmine.createSpy('$apply'),
            someProperty: 'originalValue'
        };

        flowDetectionServiceMock = {
            detectFlow: jasmine.createSpy('detectFlow').and.returnValue({
                flow: 'BOOKING',
                isRedemption: false
            })
        };
        
        TestBed.configureTestingModule({
            providers: [
                RootStore,
                { provide: AJSRootScope, useValue: ajsRootScopeMock },
                { provide: IbBookingFlowDetectionService, useValue: flowDetectionServiceMock }
            ]
        });

        service = TestBed.inject(RootStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Basic Store Operations', () => {
        it('should get and set values correctly', () => {
            service.set('testKey', 'testValue');
            expect(service.get('testKey')).toBe('testValue');
        });

        it('should fallback to original rootScope for undefined keys', () => {
            expect(service.get('someProperty')).toBe('originalValue');
        });

        it('should sync non-rootScope methods to applicationData', () => {
            service.set('customProperty', 'customValue');
            expect(service.get('customProperty')).toBe('customValue');
            expect(ajsRootScopeMock.customProperty).toBe('customValue');
        });

        it('should emit and receive RxJS events', (done) => {
            service.onRx('testEvent').subscribe((data) => {
                expect(data).toEqual(['test', 'data']);
                done();
            });
            
            service.emitRx('testEvent', 'test', 'data');
        });

        it('should handle multiple event subscribers', () => {
            const subscriber1 = jasmine.createSpy('subscriber1');
            const subscriber2 = jasmine.createSpy('subscriber2');
            
            service.onRx('multiEvent').subscribe(subscriber1);
            service.onRx('multiEvent').subscribe(subscriber2);
            
            service.emitRx('multiEvent', 'testData');
            
            expect(subscriber1).toHaveBeenCalledWith(['testData']);
            expect(subscriber2).toHaveBeenCalledWith(['testData']);
        });
    });

    describe('RootScope Integration', () => {
        it('should return original rootScope', () => {
            const originalRootScope = service.getOriginalRootScope();
            expect(originalRootScope).toBe(ajsRootScopeMock);
        });
    });

});
