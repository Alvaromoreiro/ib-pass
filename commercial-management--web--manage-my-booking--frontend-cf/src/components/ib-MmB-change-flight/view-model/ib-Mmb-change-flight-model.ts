@Service(
    'ib-Mmb-change-flight-module',[],[])
export class ChangeFlightModel {

    selectedSegmentInfo = null;
    availabilityInfo = null;
    hasAvailability = null;
    searchEngineModel = null;

    constructor (){}

    initializeModel = () => {
        this.selectedSegmentInfo = null;
        this.availabilityInfo = {};
        this.hasAvailability = false;
        this.searchEngineModel = {};
    }


};

