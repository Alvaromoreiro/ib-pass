import { ChangeOrderSliceService } from './ib-change-order-slice-service';

@Service(
    'ib-MmB-flight-confirmation-module',
    ['FlightConfirmationTransformer', 'ChangeOrderSliceService', 'localStorageService', 'CommonsKeepAliveService'],
    []
)
export class FlightConfirmationService {
    constructor (
        private FlightConfirmationTransformer,
        private ChangeOrderSliceService: ChangeOrderSliceService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsKeepAliveService: CommonsKeepAliveService){}

    ////////////////
    /**
     * Generates the flight confirmation view model info
     */
    getConfirmationInfo = () => {
        return new Promise((resolve, reject) => {
            var transformedView = this.FlightConfirmationTransformer.transformConfirmationView();
            resolve(transformedView);
        });
    };

    /**
     * changes the flight in the booking returning the service ChangeOrderSliceService promise
     */
    confirmChangeFlight = () => {
        return new Promise((resolve, reject) => {
            const bookingInfo: any = this.localStorageService.get('bookingInfo');
            const selectedSegment: any = this.localStorageService.get('selectedSegment');
            var orderId = bookingInfo.order.orderId;
            var sliceId = selectedSegment.sliceId;
            this.ChangeOrderSliceService.changeOrderSlice(orderId, sliceId, this.FlightConfirmationTransformer.generateChangeOrderRequest()).then((data) => {
                var segmentSaved: any = this.localStorageService.get('segmentSavedSuccess') || [];
                segmentSaved.push(selectedSegment.id);
                this.localStorageService.set('segmentSavedSuccess', segmentSaved);
                this.CommonsKeepAliveService.closeSession(this.localStorageService.get('flowId')).then(resolve(data), resolve);
            }, reject);
        });
    };
}