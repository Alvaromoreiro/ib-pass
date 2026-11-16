import angular from 'angular';
import { FareUnifiedServiceMock, SimulatorFareReshopServiceMock } from '@test/mocks/class/Fare';

describe('test for SimulatorFareOrquestatorService', () => {
    let SimulatorFareOrquestator, fakeFareUnifiedService, fakeSimulatorFareReshopService;

    let fakeFareClass = {
        Service: {
            UNIFIED_TYPE: 'UNIFIED_TYPE',
            RESHOP_TYPE: 'RESHOP_TYPE',
        }
    }

    beforeEach(() => {
        fakeFareUnifiedService = new FareUnifiedServiceMock();
        fakeSimulatorFareReshopService = new SimulatorFareReshopServiceMock();

        angular.mock.module('ib-fare-service', ($provide) => {
            $provide.value('FareUnifiedService', fakeFareUnifiedService);
            $provide.value('SimulatorFareReshopService', fakeSimulatorFareReshopService);
            $provide.value('FareClass', fakeFareClass);
        });

        inject((_SimulatorFareOrquestator_, _$q_, _$rootScope_) => {
            SimulatorFareOrquestator = _SimulatorFareOrquestator_;
        });
    });

    describe('test for callFare ()', () => {
        it('should be UNIFIED_TYPE', (done) => {
            let result = SimulatorFareOrquestator.callFare('UNIFIED_TYPE');
            expect(result).toEqual(fakeFareUnifiedService.getFareUnified);
            done();
        });
        it('should be RESHOP_TYPE', (done) => {
            let result = SimulatorFareOrquestator.callFare('RESHOP_TYPE');
            expect(result).toEqual(fakeSimulatorFareReshopService.getFareReshop);
            done();
        });
        it('should be OTHER', (done) => {
            let result = SimulatorFareOrquestator.callFare('OTHER');
            expect(result).toEqual(fakeSimulatorFareReshopService.getFareReshop);
            done();
        });
    });
});
