import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { DigitalDataViewCounterService } from '@shared/services/ib-datalayer/services/ib-digital-data-view-counter.service';
import { DigitalDataService } from '@shared/services/ib-datalayer/services/ib-digital-data.service';

describe('DigitalDataViewCounterService', () => {
    let service: DigitalDataViewCounterService;
    let mockStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let mockDigitalDataService: jasmine.SpyObj<DigitalDataService>;
    let originalHistoryState: any;
    let originalLocation: string;

    beforeEach(() => {
        originalHistoryState = window.history.state;
        originalLocation = window.location.href;
        
        mockStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['set', 'get', 'remove']);
        mockDigitalDataService = jasmine.createSpyObj('DigitalDataService', ['getDigitalData', 'addDigitalDataInfo']);
        
        TestBed.configureTestingModule({
            providers: [
                DigitalDataViewCounterService,
                { provide: CommonsSessionStorageService, useValue: mockStorageService }
            ]
        });

        service = TestBed.inject(DigitalDataViewCounterService);
    });

    afterEach(() => {
        window.history.replaceState(originalHistoryState, '');
    });

    describe('increment method', () => {
        interface IncrementTestCase {
            description: string;
            quadrigram: string;
            setupCount?: number;
            expectedResult: number;
            expectedFinalCount: number;
        }

        const incrementTestCases: IncrementTestCase[] = [
            { description: 'should increment from 0 to 1 for new quadrigram', quadrigram: 'test', expectedResult: 1, expectedFinalCount: 1 },
            { description: 'should increment existing quadrigram', quadrigram: 'existing', setupCount: 1, expectedResult: 2, expectedFinalCount: 2 },
            { description: 'should normalize slashes', quadrigram: '/test/', expectedResult: 1, expectedFinalCount: 1 },
            { description: 'should handle empty string', quadrigram: '', expectedResult: 1, expectedFinalCount: 1 },
            { description: 'should trim whitespace', quadrigram: '  test  ', expectedResult: 1, expectedFinalCount: 1 }
        ];

        incrementTestCases.forEach(testCase => {
            it(testCase.description, () => {
                // Arrange
                if (testCase.setupCount) {
                    for (let i = 0; i < testCase.setupCount; i++) {
                        service.increment(testCase.quadrigram);
                    }
                    mockStorageService.set.calls.reset();
                }

                // Act
                const result = service.increment(testCase.quadrigram);

                // Assert
                expect(result).toBe(testCase.expectedResult);
                expect(service.get(testCase.quadrigram)).toBe(testCase.expectedFinalCount);
                expect(mockStorageService.set).toHaveBeenCalled();
            });
        });
    });

    describe('get method', () => {
        interface GetTestCase {
            description: string;
            quadrigram: any;
            setupCount: number;
            expectedResult: number;
        }

        const getTestCases: GetTestCase[] = [
            { description: 'should return 0 for non-existent quadrigram', quadrigram: 'nonexistent', setupCount: 0, expectedResult: 0 },
            { description: 'should return correct count for existing quadrigram', quadrigram: 'existing', setupCount: 3, expectedResult: 3 },
            { description: 'should handle null gracefully', quadrigram: null, setupCount: 0, expectedResult: 0 },
            { description: 'should handle undefined gracefully', quadrigram: undefined, setupCount: 0, expectedResult: 0 },
            { description: 'should normalize quadrigram before getting', quadrigram: '/test/', setupCount: 1, expectedResult: 1 }
        ];

        getTestCases.forEach(testCase => {
            it(testCase.description, () => {
                // Arrange
                if (testCase.setupCount > 0 && testCase.quadrigram) {
                    for (let i = 0; i < testCase.setupCount; i++) {
                        service.increment(testCase.quadrigram);
                    }
                }

                // Act & Assert
                expect(service.get(testCase.quadrigram)).toBe(testCase.expectedResult);
            });
        });
    });

    describe('reset method', () => {
        interface ResetTestCase {
            description: string;
            setupData: { quadrigram: string; count: number }[];
            resetQuadrigram?: string;
            verifyResults: { quadrigram: string; expectedCount: number }[];
        }

        const resetTestCases: ResetTestCase[] = [
            {
                description: 'should reset specific quadrigram only',
                setupData: [{ quadrigram: 'test1', count: 2 }, { quadrigram: 'test2', count: 1 }],
                resetQuadrigram: 'test1',
                verifyResults: [{ quadrigram: 'test1', expectedCount: 0 }, { quadrigram: 'test2', expectedCount: 1 }]
            },
            {
                description: 'should reset all quadrigrams when no parameter provided',
                setupData: [{ quadrigram: 'test1', count: 1 }, { quadrigram: 'test2', count: 1 }],
                resetQuadrigram: undefined,
                verifyResults: [{ quadrigram: 'test1', expectedCount: 0 }, { quadrigram: 'test2', expectedCount: 0 }]
            },
            {
                description: 'should handle reset of non-existent quadrigram gracefully',
                setupData: [{ quadrigram: 'existing', count: 1 }],
                resetQuadrigram: 'nonexistent',
                verifyResults: [{ quadrigram: 'existing', expectedCount: 1 }, { quadrigram: 'nonexistent', expectedCount: 0 }]
            },
            {
                description: 'should normalize quadrigram before reset',
                setupData: [{ quadrigram: '/test/', count: 1 }],
                resetQuadrigram: 'test',
                verifyResults: [{ quadrigram: 'test', expectedCount: 0 }, { quadrigram: '/test/', expectedCount: 0 }]
            }
        ];

        resetTestCases.forEach(testCase => {
            it(testCase.description, () => {
                // Arrange
                testCase.setupData.forEach(setup => {
                    for (let i = 0; i < setup.count; i++) {
                        service.increment(setup.quadrigram);
                    }
                });
                mockStorageService.set.calls.reset();

                // Act
                service.reset(testCase.resetQuadrigram);

                // Assert
                testCase.verifyResults.forEach(check => {
                    expect(service.get(check.quadrigram)).toBe(check.expectedCount);
                });
                expect(mockStorageService.set).toHaveBeenCalled();
            });
        });
    });

    describe('restartUnderConditions method', () => {
        let performanceSpy: jasmine.Spy;
        
        beforeEach(() => {
            performanceSpy = spyOn(window.performance, 'getEntriesByType').and.returnValue([{ type: 'navigate' }] as any);
        });

        it('should NOT reset when navigation type is reload', () => {
            performanceSpy.and.returnValue([{ type: 'reload' }] as any);
            const resetSpy = spyOn(service, 'reset');

            service.restartUnderConditions();

            expect(resetSpy).not.toHaveBeenCalled();
        });

        it('should reset when navigationId is not present in history.state', () => {
            window.history.replaceState({}, '');
            const resetSpy = spyOn(service, 'reset');

            service.restartUnderConditions();

            expect(resetSpy).toHaveBeenCalledWith();
        });

        it('should reset when navigationId is 1 (first navigation)', () => {
            window.history.replaceState({ navigationId: 1 }, '');
            const resetSpy = spyOn(service, 'reset');

            service.restartUnderConditions();

            expect(resetSpy).toHaveBeenCalledWith();
        });

        it('should NOT reset when navigationId > 1 and not on-hold condition', () => {
            window.history.replaceState({ navigationId: 5 }, '');
            const resetSpy = spyOn(service, 'reset');

            service.restartUnderConditions();

            expect(resetSpy).not.toHaveBeenCalled();
        });

        it('should reset when URL contains /ohmtdt and ON_HOLD_CONF count is 0', () => {
            const originalPath = window.location.pathname + window.location.hash;
            window.history.replaceState({ navigationId: 5 }, '', '/ohmtdt');
            const resetSpy = spyOn(service, 'reset');
            const getSpy = spyOn(service, 'get').and.returnValue(0);

            service.restartUnderConditions();

            expect(getSpy).toHaveBeenCalledWith(BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF);
            expect(resetSpy).toHaveBeenCalledWith();
            
            // Restore original path
            window.history.replaceState({}, '', originalPath || '/');
        });

    });

    describe('private normalize method', () => {
        interface NormalizeTestCase {
            description: string;
            input: any;
            expected: string;
        }

        const normalizeTestCases: NormalizeTestCase[] = [
            { description: 'should remove slashes and trim whitespace', input: '/test/', expected: 'test' },
            { description: 'should trim whitespace', input: '  test  ', expected: 'test' },
            { description: 'should handle combo of slashes and whitespace', input: '  /test/abc/  ', expected: 'testabc' },
            { description: 'should handle empty string', input: '', expected: '' },
            { description: 'should handle only slashes', input: '///', expected: '' },
            { description: 'should handle only whitespace', input: '   ', expected: '' },
            { description: 'should handle null gracefully', input: null, expected: '' },
            { description: 'should handle undefined gracefully', input: undefined, expected: '' }
        ];

        normalizeTestCases.forEach(testCase => {
            it(testCase.description, () => {
                const result = (service as any).normalize(testCase.input);
                expect(result).toBe(testCase.expected);
            });
        });
    });
    describe('session persistence', () => {
        it('should persist data when incrementing', () => {
            service.increment('test');
            expect(mockStorageService.set).toHaveBeenCalled();
        });

        it('should persist data when resetting', () => {
            service.increment('test');
            mockStorageService.set.calls.reset();
            
            service.reset();
            
            expect(mockStorageService.set).toHaveBeenCalled();
        });

        it('should handle corrupted session data gracefully on init', () => {
            spyOn(sessionStorage, 'getItem').and.returnValue('invalid-json');
            
            expect(() => {
                TestBed.resetTestingModule();
                TestBed.configureTestingModule({
                    providers: [
                        DigitalDataViewCounterService,
                        { provide: CommonsSessionStorageService, useValue: mockStorageService },
                        { provide: DigitalDataService, useValue: mockDigitalDataService }
                    ]
                });
                TestBed.inject(DigitalDataViewCounterService);
            }).not.toThrow();
        });

        it('should restore data from session on init', () => {
            const mockData = JSON.stringify({
                'test1': { NView: 5 },
                'test2': { NView: 3 }
            });
            spyOn(sessionStorage, 'getItem').and.returnValue(mockData);
            
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    DigitalDataViewCounterService,
                    { provide: CommonsSessionStorageService, useValue: mockStorageService },
                    { provide: DigitalDataService, useValue: mockDigitalDataService }
                ]
            });
            const newService = TestBed.inject(DigitalDataViewCounterService);
            
            expect(newService.get('test1')).toBe(5);
            expect(newService.get('test2')).toBe(3);
        });
    });
});
