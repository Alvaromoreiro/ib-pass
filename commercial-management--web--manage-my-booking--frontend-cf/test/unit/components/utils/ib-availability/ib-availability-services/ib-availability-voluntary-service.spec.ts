describe('test for AvailabilityVoluntaryService', () => {
    let AvailabilityVoluntaryService;

    let fakeVoluntaryChangesService = {
        getAvailability: jasmine.createSpy('getAvailability').and.returnValue('testGetAvailability'),
    };

    let fakeVoluntaryChangesTransformer = {
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
        angular.mock.module('ib-availability-service', ($provide) => {
            $provide.value('VoluntaryChangesService', fakeVoluntaryChangesService);
            $provide.value('VoluntaryChangesTransformer', fakeVoluntaryChangesTransformer);
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject((_AvailabilityVoluntaryService_, _$q_, _$rootScope_) => {
            AvailabilityVoluntaryService  = _AvailabilityVoluntaryService_;
        });
    });

    describe('test for AvailabilityVoluntaryService', () => {
        it('should be defined', () => {
            expect(AvailabilityVoluntaryService).toBeDefined();
        });
    });
    describe('test for availability ()', () => {
        it('should be defined', (done) => {
            let result = AvailabilityVoluntaryService.availability({}, false);
            expect(result).toEqual('testGetAvailability');
            done();
        });
    });

    describe('test for generateModalObject()', () => {
        it('should be defined', () => {
            let result = AvailabilityVoluntaryService.generateModalObject('testData');
            expect(result).toEqual({availabilityData: 'testData'});
        });
    });

    describe('test for callModalService()', () => {
        it('should be defined', (done) => {
            let result = AvailabilityVoluntaryService.callModalService({});
            expect(result).toEqual('test');
            done();
        });
    });

    describe('test for generateRequest()', () => {
        it('should be defined', () => {
            let result = AvailabilityVoluntaryService.generateRequest([], 'test', {}, 'typetest');
            expect(result).toEqual('testTransformer');
        });
    });
});
