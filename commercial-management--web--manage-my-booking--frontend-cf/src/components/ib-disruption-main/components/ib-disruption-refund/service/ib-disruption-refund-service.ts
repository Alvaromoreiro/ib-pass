import { BookingSearchService } from '@src/components/services/ib-booking-search-service';
import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';

@Service(
    'ib-disruption-refund-module',
    ['CommonsGetWcsPhonesService', 'CurrencyService', 'MmBAppConstants', 'localStorageService', 'MmBUtilService', 'BookingSearchService', 'IbFlagsTransformer'],
    []
)
export class DisruptionRefundService {
    constructor (
        private CommonsGetWcsPhonesService: CommonsGetWcsPhonesService,
        private CurrencyService: CurrencyService,
        private MmBAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBUtilService: MmBUtilService,
        private BookingSearchService: BookingSearchService,
        private IbFlagsTransformer) {}

    getWCSPhones = () => {
        return new Promise((resolve, reject) => {
            this.CommonsGetWcsPhonesService.getPhoneByCode(this.MmBAppConstants.WCS.PHONE_TYPES.SALES).then(() => {
                resolve(this.localStorageService.get('phonesList'));
            });
        });
    };

    initializeRefundDisruptionPage = () => {
        return new Promise((resolve, reject) => {
            const obtainVoucherInfo = (bookingInfo) => {
                var currency, commercialInfo: any = this.localStorageService.get('commercialInfo'), formattedVoucherInfo = {
                    'price': 0,
                    'formattedPrice': '',
                    'priceWOPercentage': 0,
                    'priceWOPercentageFormatted': '',
                    'percentagePrice': 0,
                    'percentagePriceFormatted': 0,
                    'percentage': ''
                };
    
                if (bookingInfo.contextMetadata.currencies[0]) {
                    currency = this.CurrencyService.getCurrencyObject(bookingInfo.contextMetadata.currencies[0]);
                } else {
                    this.localStorageService.get('currency') ? currency = this.CurrencyService.getCurrencyObject(this.localStorageService.get('currency')) : currency = commercialInfo.currency;
                }
    
                this.localStorageService.set('orderCurrency', currency);
    
                var model = {
                    'summaryModel': this.MmBUtilService.generateVoucherSummaryModel(bookingInfo.order.orderItems, bookingInfo.order.slices, currency),
                    'contactData': bookingInfo.order.primaryContactInfo,
                    'voucherPriceInfo': {},
                    'cashAvailable': false
                };
                model.contactData.lowerCaseEmail = bookingInfo.order.primaryContactInfo.refundEmail.toLowerCase();
                model.cashAvailable = this.IbFlagsTransformer.generateFlagsMenu(bookingInfo);
            };

            let bookingInfo = this.localStorageService.get('bookingInfo');
            if (bookingInfo)
                obtainVoucherInfo(bookingInfo);
            else {
                this.BookingSearchService.searchFlightsPassengers(this.localStorageService.get('checkinSurname'), this.localStorageService.get('PNR')).then((bookingData) => {
                    this.localStorageService.set('bookingInfo', bookingData);
                    bookingInfo = bookingData;
                    obtainVoucherInfo(bookingInfo);
                }, (error) => {
                    reject(error);
                });
            }
        });
    };
}