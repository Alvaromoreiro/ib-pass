@Service('ib-availability-service', ['VoluntaryChangesService', 'VoluntaryChangesTransformer', 'MmBModalService'])
class AvailabilityVoluntaryService implements IAvailabilityServiceStrat {
    constructor (private VoluntaryChangesService, private VoluntaryChangesTransformer, private MmBModalService) {
    }
    /**
    * Calls availability service
    * @param {availabilityRequ} request
    * @returns {data}
    */
    availability = (request: AvailabilityData.availabilityRequest, update:boolean) : angular.IPromise<AvailabilityData.CompleteAvailability> => {
        return this.VoluntaryChangesService.getAvailability(request, update);
    };

    generateModalObject = (data:AvailabilityData.CompleteAvailability) : unknown =>{
        let modalData:modalAvailabilityData;
        modalData = {availabilityData:null};
        modalData.availabilityData = data;
        return modalData;
    };

    callModalService = (modalObject) : angular.IPromise<unknown> => {
        return this.MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-voluntary-changes-view.html', modalObject).result;
    };

    /**
     * Generates request for availability
     * @returns {AvailabilityData.availabilityRequest}
     */
    generateRequest = (flights:any[], flowId:string, sisterCityModel, flightType?:string): AvailabilityData.availabilityRequest => {
        return this.VoluntaryChangesTransformer.searchFlights(flights, flightType);
    };
}