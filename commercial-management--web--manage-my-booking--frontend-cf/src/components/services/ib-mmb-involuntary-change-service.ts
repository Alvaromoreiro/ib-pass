@Service('ib-MmB-services-module', [
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'CommonsGenericProxy'
], [])
export class MmbInvoluntaryChangeService {
    constructor (
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    hasInvoluntaryChange = (status: any) => {
        if (status === 'ACCEPT_CHANGES_PENDING' || status === 'UNCONFIRMED_CHANGES' || status === 'CANCELATION_CHANGES' || status === 'WAITLIST_CONFIRMED_CHANGES' || status === 'ACCEPT_CHANGES_PENDING_DISRUPTION' || status === 'ACCEPT_CHANGES_PENDING_TK' || status === 'ACCEPT_CHANGES_PENDING_MIXED' || status === 'UNCONFIRMED_CHANGES_MIXED' || status === 'DISRUPTION_CHANGES_MIXED') {
            return true;
        }

        return false;
    };

    flightHasInvoluntaryChange = (flight: any) => {
        let result = false;
        let segment = null, segmentIndex = 0;

        for (segmentIndex = 0; segmentIndex < flight.segments.length; segmentIndex++) {
            segment = flight.segments[segmentIndex];

            if (segment.status.code === 'HX' || segment.status.code === 'TK' || segment.status.code === 'TL' || segment.status.code === 'UN' || segment.status.code === 'KL' || segment.status.code === 'UC') {
                result = true;
            }
        }

        return result;
    };

    flightIsChange = (flight: any) => {
        let result = false;
        let segment = null, segmentIndex = 0;

        for (segmentIndex = 0; segmentIndex < flight.segments.length; segmentIndex++) {
            segment = flight.segments[segmentIndex];

            if (segment.status.code === 'TL' || segment.status.code === 'TK') {
                result = true;
            }
        }

        return result;
    };

    flightIsCancel = (flight: any) => {
        let result = false;
        let segment = null, segmentIndex = 0;

        for (segmentIndex = 0; segmentIndex < flight.segments.length; segmentIndex++) {
            segment = flight.segments[segmentIndex];

            if (segment.status.code === 'UC' || segment.status.code === 'HX' || segment.status.code === 'UN') {
                result = true;
            }
        }

        return result;
    };

    submitChangesAccepted = (flowId: any) => {
        return new Promise((resolve, reject) => {
            const submitChangesAcceptedSuccess = (bookingData: any) => {
                resolve(bookingData.data);
            };

            const submitChangesAcceptedError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);

            };
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.acceptChangesURI + flowId + '/accept-changes').then(submitChangesAcceptedSuccess, submitChangesAcceptedError);

        });
    };
}
