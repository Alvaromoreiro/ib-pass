@Service('ib-availability-service', ['MmBUtilsSharedService', 'IbDisruptionService', 'MmBModalService'])
class AvailabilityDisruptionService implements IAvailabilityServiceStrat {
    constructor (private MmBUtilsSharedService, private IbDisruptionService, private MmBModalService) {
    }
    /**
    * Calls availability service
    * @param {availabilityRequ} request
    * @returns {data}
    */
    availability = (request: AvailabilityData.availabilityRequest) : angular.IPromise<AvailabilityData.CompleteAvailability> => {
        return this.IbDisruptionService.callGetAvailability(request);
    };

    generateModalObject = (data:AvailabilityData.CompleteAvailability) : unknown =>{
        const modalData:modalAvailabilityData = {availabilityData:data};
        return modalData;
    };

    callModalService = (modalObject) : angular.IPromise<unknown> => {
        return this.MmBModalService.showFullModal(false, 'ib-modal-flexibilization-involuntary.html', modalObject).result;
    };

    /**
     * Generates request for availability
     * @returns {AvailabilityData.availabilityRequest}
     */
    generateRequest = (flights:any[], flowId:string, sisterCityModel): AvailabilityData.availabilityRequest => {
        return this.MmBUtilsSharedService.generateRequestFlexibilization(flights, flowId, sisterCityModel);
    };
}