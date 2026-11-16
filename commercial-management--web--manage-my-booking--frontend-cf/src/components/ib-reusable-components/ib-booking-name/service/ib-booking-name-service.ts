import * as angular from 'angular';
import { MmBModalService } from "../../ib-MmB-modal/services/ib-MmB-modal-service";
@Service(
    'ib-booking-name',
    ['MmBModalService'],
    []
)
export class BookingNameService {

    constructor (
        private MmBModalService: MmBModalService
    ){}
        /**
         * @function
         * @name check
         * @desc opens a modal to ask the passenger
         */
    checkName = (surname, flowId) => {
        let passengerInfo={
            surname,
            flowId
        }
        this.MmBModalService.showBookingNameModal(passengerInfo).result.then(angular.noop, angular.noop);
    }
};
