import { ShuttleAvailabilityService } from './ib-shuttle-availability-service';

@Service(
    'ib-Mmb-change-flight-module',
    ['ChangeFlightTransformer', 'ShuttleAvailabilityService'],
    []
)
export class ChangeFlightService {
    constructor (
        private ChangeFlightTransformer, 
        private ShuttleAvailabilityService: ShuttleAvailabilityService) {}

    ////////////////

    /**
     * Generates the initial model structure
     * @returns the model initializated
     */
    initializeModelInfo = () => {
        return this.ChangeFlightTransformer.generateInitialModel();
    };

    /**
     * Change timezone list if selcted day is same and the hour is more than 12:00
     * @param {Date} Day selected on datepicker
     */
    getTimeZoneList = (daySelected) => {
        return this.ChangeFlightTransformer.getTimeZoneList(daySelected);
    };

    /**
     * Calls availability rest service depending on current model state and return its data transformed for the view
     * @param {Object} changeFlightModel the current model state
     * @return {Object<Promise>} A promise that when it is resolved, returns the availability data transformed for the view. When it is rejected
     * return the error object to show in the view
     */
    getFlightAvailability (changeFlightModel) {
        return new Promise((resolve, reject) => {
            this.ShuttleAvailabilityService.getShuttleAvailability(this.ChangeFlightTransformer.generateAvailabilityRequest(changeFlightModel))
                .then((availabilityData) => {
                    resolve(this.ChangeFlightTransformer.transformAvailabilityView(availabilityData));
                }, reject);
        });
    }
}