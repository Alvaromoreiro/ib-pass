
import angular from 'angular';
import { AvailabilityVoluntaryServiceMock } from '@test/mocks/class/Availability'

describe('test for SimulatorAvailabilityOrchestratorService', () => {
    let SimulatorAvailabilityOrchestrator, fakeSimulatorAvailabilityService;

    let fakeSimulatorAvailabilityClass = {
        Service: {
            VOLUNTARY_CHANGE: 'VOLUNTARY_CHANGE'
        }
    }

    let types = ['VOLUNTARY_CHANGE'];
    let typesExpected = {'VOLUNTARY_CHANGE': 'testAvailabilityVoluntaryService'};

    beforeEach(() => {
        fakeSimulatorAvailabilityService = new AvailabilityVoluntaryServiceMock();

        angular.mock.module('ib-simulator-availability-service', ($provide) => {
            $provide.value('SimulatorAvailabilityService', fakeSimulatorAvailabilityService);
            $provide.value('AvailabilityClass', fakeSimulatorAvailabilityClass);
        });

        inject((_SimulatorAvailabilityOrchestrator_, _$q_, _$rootScope_) => {
            SimulatorAvailabilityOrchestrator  = _SimulatorAvailabilityOrchestrator_;
        });
    });

    describe('test for availability ()', () => {
        types.forEach((type)=>{
            it('should be ' + type, (done) => {
                let result = SimulatorAvailabilityOrchestrator.availability(type, {}, false);
                expect(result).toEqual(typesExpected[type]);
                done();
            });
        })
    });

    describe('test for getAvailabilityRequest()', () => {
        it('should be With showSister', (done) => {
            let result = SimulatorAvailabilityOrchestrator.getAvailabilityRequest('VOLUNTARY_CHANGE', [], '1234', true, {}, '1234');
            expect(result).toEqual('testAvailabilityVoluntaryService');
            done();
        });
        it('should be Without showSister', (done) => {
            let result = SimulatorAvailabilityOrchestrator.getAvailabilityRequest('VOLUNTARY_CHANGE', [], '1234', false, {}, '1234');
            expect(result).toEqual('testAvailabilityVoluntaryService');
            done();
        });
    });

    describe('test for getModalObject()', () => {
        it('should be defined', () => {
            let result = SimulatorAvailabilityOrchestrator.getModalObject('VOLUNTARY_CHANGE', {});
            expect(result).toEqual('testAvailabilityVoluntaryService');
        });
    });

    describe('test for callModalService()', () => {
        it('should be defined', (done) => {
            let result = SimulatorAvailabilityOrchestrator.callModalService('VOLUNTARY_CHANGE', {});
            expect(result).toEqual('testAvailabilityVoluntaryService');
            done();
        });
    });

    
});
