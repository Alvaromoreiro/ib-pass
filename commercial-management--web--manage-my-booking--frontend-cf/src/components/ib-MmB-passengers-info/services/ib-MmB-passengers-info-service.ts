import { ChangeOrderContactInfoService } from '@src/components/services/ib-change-order-contact-info-service';

@Service(
    'ib-MmB-passengers-info-module',
    ['localStorageService', 'PassengersInfoTransformer', 'ChangeOrderContactInfoService'],
    []
)
export class PassengersInfoService {

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private PassengersInfoTransformer,
        private ChangeOrderContactInfoService: ChangeOrderContactInfoService){}

    /**
     * Update the information passenger for Order
     * @param {Object} passengerData Information of passenger inserted in the passenger form
     */
    updateDataPassenger = (passengerData) => {
        return new Promise((resolve, reject) => {
            const bookingInfo: any = this.localStorageService.get('bookingInfo');
            var passengerInfo = this.PassengersInfoTransformer.transformUpdatePassengerInfoData(passengerData);
            var orderId = bookingInfo.order.orderId;
            this.ChangeOrderContactInfoService.changeOrderContactInfo(passengerInfo, orderId).then(resolve, reject);
        });
    };

    /**
     * Update the data contact info of order
     * @param {Object} contactInfo 
     * @param {Object} originalInfo 
     */
    updateDataContactInfo = (contactInfo, originalInfo) => {
        return new Promise((resolve, reject) => {
            const bookingInfo: any = this.localStorageService.get('bookingInfo');
            var dataContactInfo = this.PassengersInfoTransformer.transformUpdateDataContactData(contactInfo, originalInfo);
            var orderId = bookingInfo.order.orderId;
            this.ChangeOrderContactInfoService.changeOrderContactInfo(dataContactInfo, orderId).then(resolve, reject);
        });
    };

    /**
     * Send data to transformer for test input and output
     */
    generatePassengerData = () => {
        return this.PassengersInfoTransformer.transformPassengerInfoData();
    };

    /**
     * Updates the current passenger information in session storage
     * @param {Object} passengersData the current passenger information
     */
    updateLocalPassengers = (passengersData) => {
        this.PassengersInfoTransformer.updatePassengerData(passengersData);
    };

}