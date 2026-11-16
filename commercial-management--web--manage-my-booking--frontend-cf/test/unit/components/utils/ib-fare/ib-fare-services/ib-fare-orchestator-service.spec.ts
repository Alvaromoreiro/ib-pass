import angular from 'angular';
import { FareUnifiedServiceMock, FareReshopServiceMock } from '@test/mocks/class/Fare';

describe('test for FareOrquestatorService', () => {
    let FareOrquestator, fakeFareUnifiedService, fakeFareReshopService;

    let fakeFareClass = {
        Service: {
            UNIFIED_TYPE: 'UNIFIED_TYPE',
            RESHOP_TYPE: 'RESHOP_TYPE',
        }
    }

    beforeEach(() => {
        fakeFareUnifiedService = new FareUnifiedServiceMock();
        fakeFareReshopService = new FareReshopServiceMock();

        angular.mock.module('ib-fare-service', ($provide) => {
            $provide.value('FareUnifiedService', fakeFareUnifiedService);
            $provide.value('FareReshopService', fakeFareReshopService);
            $provide.value('FareClass', fakeFareClass);
        });

        inject((_FareOrquestator_) => {
            FareOrquestator = _FareOrquestator_;
        });
    });

    describe('test for callFare ()', () => {
        it('should be UNIFIED_TYPE', (done) => {
            FareOrquestator.callFare('UNIFIED_TYPE');
            expect(fakeFareUnifiedService).toEqual(fakeFareUnifiedService);
            done();
        });
        it('should be RESHOP_TYPE', (done) => {
            FareOrquestator.callFare('RESHOP_TYPE');
            expect(fakeFareReshopService).toEqual(fakeFareReshopService);
            done();
        });
        it('should be OTHER', (done) => {
            FareOrquestator.callFare('OTHER');
            expect(fakeFareReshopService).toEqual(fakeFareReshopService);
            done();
        });
    });
});
