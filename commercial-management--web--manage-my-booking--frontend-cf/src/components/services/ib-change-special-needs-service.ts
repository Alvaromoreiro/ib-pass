import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import { MmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';
import { MMBDatalayerConstants } from './ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
@Service('ib-MmB-services-module', [
    '$rootScope',
    'CommonsGenericProxy',
    'MmBAppConstants',
    'localStorageService',
    'CommonsNewHttpUtilsErrorService',
    'MmBDatalayerUtilsService',
    'CommonsUtilService'
], [])
export class ChangePassengerSpecialNeedsService {
    URL_SERVICE: any = '/special-needs';

    constructor (
        private $rootScope: any,
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private CommonsUtilService: CommonsUtilService
    ) {}

    changePassengerSpecialNeedsServiceInfo = (requestData: any, orderId: any) => {
        return new Promise((resolve, reject) => {
            const changePassengerSpecialNeedsServiceInfoSuccess = (data: any) => {
                let bookingInfo:any = this.localStorageService.get('bookingInfo');
                if (data?.data?.order?.orderItems) {
                    bookingInfo.order.orderItems = [];
                    bookingInfo.order.orderItems = data.data.order.orderItems;
                    bookingInfo.tickets = [];
                    bookingInfo.tickets = data.data.tickets;
                    this.localStorageService.set('bookingInfo',bookingInfo);
                    this.$rootScope.$broadcast('updateInfoSpecialNeedAccept', data.data.order.orderItems);
                }
                this.CommonsUtilService.setTitlePage('MMB_TITLE_CONFIRM_SPECIAL_NEEDS_ADD');
                this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCPMR, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCPMR, this.MmBAppConstants.QUADRIGAM.CONFIRM_SPECIAL_NEEDS_ADD);
                resolve(data);
            };

            const changePassengerSpecialNeedsServiceInfoError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.putGeneric(
                this.MmBAppConstants.changePassengerSpecialNeeds + '/' + orderId + this.URL_SERVICE,
                requestData
            ).then(
                changePassengerSpecialNeedsServiceInfoSuccess,
                changePassengerSpecialNeedsServiceInfoError
            );
        });
    };
}
