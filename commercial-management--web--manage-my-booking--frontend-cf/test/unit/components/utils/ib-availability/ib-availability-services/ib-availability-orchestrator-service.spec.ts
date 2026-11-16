
import angular from 'angular';
import { AvailabilityUnifiedServiceMock, AvailabilityDisruptionServiceMock, AvailabilityVoluntaryServiceMock } from '@test/mocks/class/Availability'

describe('test for AvailabilityOrchestratorService', () => {
    let AvailabilityOrchestrator, fakeAvailabilityUnifiedService, fakeAvailabilityDisruptionService, fakeAvailabilityVoluntaryService;

    let fakeAvailabilityClass = {
        Service: {
            UNIFIED_TYPE: 'UNIFIED_TYPE',
            DISRUPTION_TYPE: 'DISRUPTION_TYPE',
            VOLUNTARY_CHANGE: 'VOLUNTARY_CHANGE'
        }
    }

    let types = ['UNIFIED_TYPE', 'DISRUPTION_TYPE', 'VOLUNTARY_CHANGE'];
    let typesExpected = {'UNIFIED_TYPE': 'testAvailabilityUnifiedService', 'DISRUPTION_TYPE': 'testDisruptionService', 'VOLUNTARY_CHANGE': 'testAvailabilityVoluntaryService'};

    beforeEach(() => {
        fakeAvailabilityUnifiedService = new AvailabilityUnifiedServiceMock();
        fakeAvailabilityDisruptionService = new AvailabilityDisruptionServiceMock();
        fakeAvailabilityVoluntaryService = new AvailabilityVoluntaryServiceMock();

        angular.mock.module('ib-availability-service', ($provide) => {
            $provide.value('AvailabilityDisruptionService', fakeAvailabilityDisruptionService);
            $provide.value('AvailabilityUnifiedService', fakeAvailabilityUnifiedService);
            $provide.value('AvailabilityVoluntaryService', fakeAvailabilityVoluntaryService);
            $provide.value('AvailabilityClass', fakeAvailabilityClass);
        });

        inject((_AvailabilityOrchestrator_, _$q_, _$rootScope_) => {
            AvailabilityOrchestrator  = _AvailabilityOrchestrator_;
        });
    });

    describe('test for availability ()', () => {
        types.forEach((type)=>{
            it('should be ' + type, (done) => {
                let result = AvailabilityOrchestrator.availability(type, {}, false);
                expect(result).toEqual(typesExpected[type]);
                done();
            });
        })
    });

    describe('test for getAvailabilityRequest()', () => {
        it('should be With showSister', (done) => {
            let result = AvailabilityOrchestrator.getAvailabilityRequest('VOLUNTARY_CHANGE', [], '1234', true, {}, '1234');
            expect(result).toEqual('testAvailabilityVoluntaryService');
            done();
        });
        it('should be Without showSister', (done) => {
            let result = AvailabilityOrchestrator.getAvailabilityRequest('VOLUNTARY_CHANGE', [], '1234', false, {}, '1234');
            expect(result).toEqual('testAvailabilityVoluntaryService');
            done();
        });
    });

    describe('test for getModalObject()', () => {
        it('should be defined', () => {
            let result = AvailabilityOrchestrator.getModalObject('VOLUNTARY_CHANGE', {});
            expect(result).toEqual('testAvailabilityVoluntaryService');
        });
    });

    describe('test for callModalService()', () => {
        it('should be defined', (done) => {
            let result = AvailabilityOrchestrator.callModalService('VOLUNTARY_CHANGE', {});
            expect(result).toEqual('testAvailabilityVoluntaryService');
            done();
        });
    });
});
