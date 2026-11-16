import { CallAvailabilityflexibleService } from '@src/components/services/ib-call-availability-flexible-service';
import { RebookService } from '@src/components/services/ib-rebook-service';

@Service(
    'ib-flexibilization-module',
    [ 'localStorageService', 'IbFlexibilizationTransformer', 'RebookService', 'CallAvailabilityflexibleService'],
    []
)
export class IbFlexibilizationService {
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private IbFlexibilizationTransformer,
        private RebookService: RebookService,
        private CallAvailabilityflexibleService: CallAvailabilityflexibleService) {}

    rebook = (flowId, slidesSelected, allSlices) => {
        return new Promise((resolve, reject) => {
            var request, confirmationData;
            this.localStorageService.set('RechargeBookingInfo', true);
    
            request = this.IbFlexibilizationTransformer.prepareRequestRebook(flowId, slidesSelected);
            this.RebookService.rebook(request).then((bookingInfo) => {
                confirmationData = this.IbFlexibilizationTransformer.transformRebookResponse(bookingInfo, slidesSelected, allSlices);
                resolve(confirmationData);
            }, (error) => {
                reject(error);
            });
        });
    };

    callGetAvailability = (request) => {
        return new Promise((resolve, reject) => {
            this.CallAvailabilityflexibleService.getAvailabilityFlexible(request).then((response) => resolve(response), (error) => reject(error));
        });
    };

    processRebookResponse = (newBookingInfo) => {
        this.localStorageService.set('bookingInfo', newBookingInfo);
    };

}
