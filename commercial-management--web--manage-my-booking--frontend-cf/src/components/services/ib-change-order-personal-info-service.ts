@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class ChangeOrderPersonalInfoService {
    URL_SERVICE: any = '';

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    changeOrderPersonalInfo = (requestData: any, orderId: any) => {
        return new Promise((resolve, reject) => {
            const changeOrderPersonalInfoSuccess = (data: any) => {

                resolve(data);
            };
            const changeOrderPersonalInfoError = (error: any) => {
                let errorResponse = {errorCode: '', message: '', needsTranslate: false, internalErrorCode: '', requestURL: ''};
                switch (error.errorCode) {
                    case 412:
                        const isPersonalInfoNameError412 = error.data.errors[0]?.code === this.MmBAppConstants.WARNING_MESSAGES.CORRECTION_NAME_NOT_PERMITED;
                        if (isPersonalInfoNameError412){
                            let hasMessage = error.data?.errors && error.data?.errors.length > 0;
                            errorResponse.errorCode = error.errorCode;
                            errorResponse.message = hasMessage ? error.data.errors[0].reason : 'REST_SERVICE_ERROR_GENERAL';
                            errorResponse.needsTranslate = !hasMessage;
                            errorResponse.internalErrorCode = hasMessage ? error.data.errors[0].code : '';
                            errorResponse.requestURL = error.requestURL;
                        }

                        reject(errorResponse);
                        break;
                    default:
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                        break;
            }

            };
            this.CommonsGenericProxy.putGeneric(
                this.MmBAppConstants.changeOrderPersonalInfoURI + '/' + orderId,
                requestData
            ).then(changeOrderPersonalInfoSuccess, changeOrderPersonalInfoError);
        });
    };
}
