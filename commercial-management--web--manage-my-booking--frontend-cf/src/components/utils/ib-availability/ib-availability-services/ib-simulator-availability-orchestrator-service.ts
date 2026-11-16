import { Availability } from '../ib-availability-strategies';

@Service('ib-simulator-availability-service', ['SimulatorAvailabilityService', 'AvailabilityClass'])
class SimulatorAvailabilityOrchestrator {
    constructor (private SimulatorAvailabilityService:SimulatorAvailabilityService, private SimulatorAvailabilityClass: Availability.AvailabilityClass) {
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
                case this.SimulatorAvailabilityClass.Service.VOLUNTARY_CHANGE:
                    returnFunction = this.SimulatorAvailabilityService;
        }
        return returnFunction;
    };
}
