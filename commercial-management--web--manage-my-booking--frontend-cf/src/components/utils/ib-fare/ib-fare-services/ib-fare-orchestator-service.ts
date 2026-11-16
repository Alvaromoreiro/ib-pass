import { FareReshopService } from '@src/components/services/ib-fare-reshop-service';
import { FareUnifiedService } from '@src/components/services/ib-fare-unified-service';

@Service('ib-fare-service', ['FareUnifiedService', 'FareReshopService', 'FareClass'])
class FareOrquestator {
    constructor (private FareUnifiedService: FareUnifiedService,
        private FareReshopService:FareReshopService,
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
                    caller = this.FareReshopService.getFareReshop;
                    break;
                default:
                    caller = this.FareReshopService.getFareReshop;
                    break;
        }
        return caller;
    };
}