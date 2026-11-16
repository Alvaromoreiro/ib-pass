@Service('ib-simulator-availability-service', ['SimulatorVoluntaryChangesService', 'SimulatorAvailabilityTransformer', 'MmBModalService'])
class SimulatorAvailabilityService implements IAvailabilityServiceStrat {
    constructor (private SimulatorVoluntaryChangesService, private SimulatorAvailabilityTransformer, private MmBModalService) {
    }
    /**
    * Calls simulator availability service
    * @param {availabilityRequest} request
    * @returns {data}
    */
    availability = (request: AvailabilityData.availabilityRequest, update:boolean) : angular.IPromise<AvailabilityData.CompleteAvailability> => {
        return this.SimulatorVoluntaryChangesService.getAvailability(request, update);
    };

    generateModalObject = (data:AvailabilityData.CompleteAvailability) : unknown =>{
        let modalData:modalAvailabilityData;
        modalData = {availabilityData:null};
        modalData.availabilityData = data;
        return modalData;
    };

    callModalService = (modalObject) : angular.IPromise<unknown> => {
        return this.MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-simulator-availability-view.html', modalObject).result;
    };

    /**
     * Generates request for availability
     * @returns {AvailabilityData.availabilityRequest}
     */
    generateRequest = (flights:any[], flowId:string, sisterCityModel, flightType?:string): AvailabilityData.availabilityRequest => {
        return this.SimulatorAvailabilityTransformer.searchFlights(flights, flightType);
    };
}
