import { SimulatorFareReshopService } from '@src/components/services/ib-simulator-fare-reshop-service';
import { FareUnifiedService } from '@src/components/services/ib-fare-unified-service';

@Service('ib-fare-service', ['FareUnifiedService', 'SimulatorFareReshopService', 'FareClass'])
class SimulatorFareOrquestator {
    constructor (private FareUnifiedService: FareUnifiedService,
        private SimulatorFareReshopService:SimulatorFareReshopService,
        private FareClass:Fare.FareClass) {
    }

    /**
    * Strategy orquestator, provides the service requiered
    * @param {Fare.Service} serviceType
    * @returns {void}
    */
    callFare = (serviceType: unknown) : (req: any) => angular.IPromise<any> => {
        let caller:(req: any) => angular.IPromise<any>;
        switch (serviceType) {
                case this.FareClass.Service.UNIFIED_TYPE:
                    caller = this.FareUnifiedService.getFareUnified;
                    break;
                case this.FareClass.Service.RESHOP_TYPE:
                    caller = this.SimulatorFareReshopService.getFareReshop;
                    break;
                default:
                    caller = this.SimulatorFareReshopService.getFareReshop;
                    break;
        }
        return caller;
    };
}
