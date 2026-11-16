describe('test for AvailabilityDisruptionService', () => {
    let AvailabilityDisruptionService;

    let fakeIbDisruptionService = {
        callGetAvailability: jasmine.createSpy('callGetAvailability').and.returnValue('testCallGetAvailability'),
    };

    let fakeMmBUtilsSharedService = {
        generateRequestFlexibilization: jasmine.createSpy('generateRequestFlexibilization').and.returnValue('testUtilsService'),
    };

    let fakeMmBModalService = {
        showFullModal: jasmine.createSpy('showFullModal').and.callFake(()=> {
            return {
                'result': 'test'
            }
        })
    }

    beforeEach(() => {
        angular.mock.module('ib-availability-service', ($provide) => {
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('IbDisruptionService', fakeIbDisruptionService);
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject((_AvailabilityDisruptionService_, _$q_, _$rootScope_) => {
            AvailabilityDisruptionService  = _AvailabilityDisruptionService_;
        });
    });

    describe('test for availability ()', () => {
        it('should be defined', (done) => {
            let result = AvailabilityDisruptionService.availability({}, false);
            expect(result).toEqual('testCallGetAvailability');
            done();
        });
    });

    describe('test for generateModalObject()', () => {
        it('should be defined', () => {
            let result = AvailabilityDisruptionService.generateModalObject('testData');
            expect(result).toEqual({availabilityData: 'testData'});
        });
    });

    describe('test for callModalService()', () => {
        it('should be defined', (done) => {
            let result = AvailabilityDisruptionService.callModalService({});
            expect(result).toEqual('test');
            done();
        });
    });

    describe('test for generateRequest()', () => {
        it('should be defined', () => {
            let result = AvailabilityDisruptionService.generateRequest([], 'test', {});
            expect(result).toEqual('testUtilsService');
        });
    });
});
