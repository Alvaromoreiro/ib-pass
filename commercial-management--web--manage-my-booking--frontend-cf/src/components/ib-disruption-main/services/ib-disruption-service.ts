import { CallAvailabilityflexibleService } from '@src/components/services/ib-call-availability-flexible-service';

@Service(
    'ib-disruption-main-module',
    [ 'CallAvailabilityflexibleService'],
    []
)
export class IbDisruptionService {
    constructor (
        private CallAvailabilityflexibleService: CallAvailabilityflexibleService
    ) {}

    /**
     * This function call to getAvailabilityFlexible and return promise with all data.
     * @param {Object} request All data to send availability flex service.
     * @returns {Promise} return a promise with all response of service.
     *  */
    callGetAvailability = (request) => {
        return new Promise((resolve, reject) => {
            this.CallAvailabilityflexibleService.getAvailabilityFlexible(request).then((response) => resolve(response), (error) => reject(error));
        });
    };
}
