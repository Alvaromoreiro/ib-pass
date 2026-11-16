describe('test for SimulatorAvailabilityService', () => {
    let SimulatorAvailabilityService;
    let $rootScope;
    let $q;

    let fakeSimulatorVoluntaryChangesService = {
        getAvailability: jasmine.createSpy('getAvailability').and.returnValue('testGetAvailability'),
    };

    let fakeSimulatorAvailabilityTransformer = {
        searchFlights: jasmine.createSpy('searchFlights').and.returnValue('testTransformer'),
    };

    let fakeMmBModalService = {
        showVoluntaryChangeModal: jasmine.createSpy('getAvailability').and.callFake(()=> {
            return {
                'result': 'test'
            }
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-simulator-availability-service', ($provide) => {
            $provide.value('SimulatorVoluntaryChangesService', fakeSimulatorVoluntaryChangesService);
            $provide.value('SimulatorAvailabilityTransformer', fakeSimulatorAvailabilityTransformer);
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject((_SimulatorAvailabilityService_, _$q_, _$rootScope_) => {
            SimulatorAvailabilityService  = _SimulatorAvailabilityService_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        });
    });

    describe('test for SimulatorAvailabilityService', () => {
        it('should be defined', () => {
            expect(SimulatorAvailabilityService).toBeDefined();
        });
    });
    describe('test for availability ()', () => {
        it('should be defined', (done) => {
            let result = SimulatorAvailabilityService.availability({}, false);
            expect(result).toEqual('testGetAvailability');
            done();
        });
    });

    describe('test for generateModalObject()', () => {
        it('should be defined', () => {
            let result = SimulatorAvailabilityService.generateModalObject('testData');
            expect(result).toEqual({availabilityData: 'testData'});
        });
    });

    describe('test for callModalService()', () => {
        it('should be defined', (done) => {
            let result = SimulatorAvailabilityService.callModalService({});
            expect(result).toEqual('test');
            done();
        });
    });

    describe('test for generateRequest()', () => {
        it('should be defined', () => {
            let result = SimulatorAvailabilityService.generateRequest([], 'test', {}, 'typetest');
            expect(result).toEqual('testTransformer');
        });
    });
});
