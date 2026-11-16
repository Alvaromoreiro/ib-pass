import { CallAvailabilityflexibleService } from '@src/components/services/ib-call-availability-flexible-service';
import { CallRibbonflexibleService } from '@src/components/services/ib-call-ribbon-flexible-service';

@Service(
    'ib-flexibilization-availability-module',
    ['CallAvailabilityflexibleService', 'IbFlexAvailabilityTransformer', 'localStorageService', 'CallRibbonflexibleService'],
    []
)
export class IbFlexAvailabilityService {
    constructor (
        private CallAvailabilityflexibleService: CallAvailabilityflexibleService,
        private IbFlexAvailabilityTransformer,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CallRibbonflexibleService: CallRibbonflexibleService){}

    availabilityInit = (availabilityData, sisterCitisModel) => {
        var availabilityTransformedData;
        availabilityTransformedData = this.IbFlexAvailabilityTransformer.getTransformedAvailabilityData(availabilityData, sisterCitisModel);
        this.localStorageService.set('availabilityFlexData', availabilityTransformedData);
        return availabilityTransformedData;
    };

    callAvailabilityNewDate = (flowId, selectedDate, sisterCityModel) => {
        return new Promise((resolve, reject) => {
            let request;
            request = this.IbFlexAvailabilityTransformer.getAvailabilityRequest(flowId, selectedDate, sisterCityModel);
            this.CallAvailabilityflexibleService.getAvailabilityFlexible(request).then((response) => resolve(response), (error) => reject(error));
        });
    };

    /**
     * This functions call to proxy to get new days.
     * @param {String} flowId of flow. 
     * @param {Object} selectedDate All data neccesary to generate request
     * @returns {promise} return a primise with response data.
     *  */
    callRibbonMoreDates = (flowId, selectedDate, sisterCityModel) => {
        return new Promise((resolve, reject) => {
            let request;
            request = this.IbFlexAvailabilityTransformer.getAvailabilityRequest(flowId, selectedDate, sisterCityModel);
            this.CallRibbonflexibleService.getRibbonFlexible(request).then((response) => resolve(response), (error) => reject(error));
        });
    };

}