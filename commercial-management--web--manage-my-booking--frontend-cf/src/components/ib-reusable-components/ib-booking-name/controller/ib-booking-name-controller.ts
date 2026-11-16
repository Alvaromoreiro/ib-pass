import { ILocalStorageService } from "angular-local-storage";
import { BookingSearchService } from "@src/components/services/ib-booking-search-service";
@Controller('ib-booking-name',
    ['$scope','$uibModalInstance', 'localStorageService', 'GetBookingNameService', 'object','BookingSearchService'],
    [])
export class BookingNameModalController{

    formState:any;
    model:any = {name: ''};
    errorMessage:string | null = null;
    bookingName:string = 'bookingName';

    constructor(
        private $scope,
        private $uibModalInstance,
        private localStorageService: ILocalStorageService,
        private GetBookingNameService: GetBookingNameService,
        private object,
        private BookingSearchService: BookingSearchService,
    ){}
    accept = () => {
        this.$scope.modalCtrl.form.$submitted = true;
        if (this.$scope.modalCtrl.form.$valid) {
            this.GetBookingNameService.getBooking(this.model.name, this.object.surname, this.object.flowId).then((data:any) => {
                this.localStorageService.set('bookingInfo', data);
                this.localStorageService.set('flowId', data.flowId);
                this.BookingSearchService.retrieveOrderComplete(data, this.bookingName);
                this.close();
            }, (error) => {
                this.errorMessage = error.message;
            });
        }
    }

    /**
     * @function
     * @name close
     * @desc closes the modal
     */
    close = () => {
        this.$uibModalInstance.dismiss('cancel');
    }
};


