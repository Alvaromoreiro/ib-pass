import { MmBModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service';
import { CallBookingsListService } from './ib-call-bookings-list-service';
import { GetCitiesImagesService } from './ib-get-cities-images-service';
import { IbCUserUtilsService } from "ib-web-commons/utils";
import { LoadingSpinnerService } from '@src/app/shared/components/loading-spinner/loading-spinner.service';

@Service(
    'ib-MmB-bookings-list-module',
    ['BookingsListTransformer', 'CallBookingsListService', 'localStorageService', 'MmBModalService', 'GetCitiesImagesService', 'CommonsUserUtilsService', 'LoadingSpinnerService'],
    []
)
export class BookingsListService {
    constructor (
        private BookingsListTransformer,
        private CallBookingsListService: CallBookingsListService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBModalService: MmBModalService,
        private GetCitiesImagesService: GetCitiesImagesService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private LoadingSpinnerService: LoadingSpinnerService,
    ) {}

    ////////////////
    /**
     * Gets the current user logged bookings list information. if there is a list in session storage, it avoids to make the http call.
     * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
     *  When the promise rejects, it returns an object with the error data to show in the view
     */
    getBookingsList = () => {
        return new Promise((resolve, reject) => {
            const getCitiesImagesComplete = (imagesList, resolve, reject) => {
                const getBookingsListSuccess = (bookingsListService, resolve, reject) => {
                    this.localStorageService.set('bookingsList', bookingsListService);
                    resolve(this.BookingsListTransformer.transformBookingsListInfo(bookingsListService.data, imagesList));
                };
                this.localStorageService.set('citiesImagesList', imagesList);
                const bookingsList:any = this.localStorageService.get('bookingsList');
                if (!bookingsList) {
                    if (this.CommonsUserUtilsService.isIbZero()) {
                        getBookingsListSuccess([], resolve, reject)
                    } else {
                        this.LoadingSpinnerService.show();
                        this.CallBookingsListService.getBookingsList().then((data) => getBookingsListSuccess(data, resolve, reject), (error) => getBookingsListSuccess([], resolve, reject));
                    }
                } else {
                    resolve(this.BookingsListTransformer.transformBookingsListInfo(bookingsList.data, imagesList));
                }
            };

            var cities = this.localStorageService.get('citiesImagesList');
            if (cities === null) {
                this.LoadingSpinnerService.show();
                this.GetCitiesImagesService.getCitiesImages().then((data) => getCitiesImagesComplete(data, resolve, reject), (data) => getCitiesImagesComplete(data, resolve, reject));
            } else {
                getCitiesImagesComplete(cities, resolve, reject);
            }
        });
    };

}
