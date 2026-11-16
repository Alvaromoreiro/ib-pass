import { Availability } from '../ib-availability-strategies';
import { AvailabilityUnifiedService } from './ib-availability-unified-service';

@Service('ib-availability-service', ['AvailabilityDisruptionService', 'AvailabilityUnifiedService', 'AvailabilityVoluntaryService', 'AvailabilityClass'])
class AvailabilityOrchestrator {
    constructor (private AvailabilityDisruptionService: AvailabilityDisruptionService, private AvailabilityUnifiedService:AvailabilityUnifiedService, private AvailabilityVoluntaryService:AvailabilityVoluntaryService, private AvailabilityClass: Availability.AvailabilityClass) {
    }

    /**
    * Strategy orquestator, provides the service requiered
    * @param {Availability.Service} serviceType
    * @returns {void}
    */
    availability = (serviceType:unknown, request:AvailabilityData.availabilityRequest, update?:boolean) :angular.IPromise<unknown>=> {
        return this.resolveType(serviceType).availability(request, update);
    };

    getAvailabilityRequest = (serviceType: unknown, flights, flowId, showSister, sisterCityModel, flightType?:string) => {
        return this.resolveType(serviceType).generateRequest(flights, flowId, showSister ? sisterCityModel : null, flightType);
    };

    getModalObject = (serviceType: unknown, availability:AvailabilityData.CompleteAvailability):unknown => {
        return this.resolveType(serviceType).generateModalObject(availability);
    };

    callModalService = (serviceType: unknown, modalObject:unknown):angular.IPromise<unknown> => {
        return this.resolveType(serviceType).callModalService(modalObject);
    };
    
    private resolveType = (serviceType:unknown):IAvailabilityServiceStrat => {
        let returnFunction;
        switch (serviceType) {
                case this.AvailabilityClass.Service.UNIFIED_TYPE:
                    returnFunction = this.AvailabilityUnifiedService;
                    break;
                case this.AvailabilityClass.Service.DISRUPTION_TYPE:
                    returnFunction = this.AvailabilityDisruptionService;
                    break;
                case this.AvailabilityClass.Service.VOLUNTARY_CHANGE:
                    returnFunction = this.AvailabilityVoluntaryService;
        }
        return returnFunction;
    };
}