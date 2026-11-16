@Service('ib-MmB-services-module', ['CommonsGenericSFProxy', 'CommonsNewHttpUtilsErrorService', 'MmBAppConstants'])
export class ibPlusContactDetailsService {
    constructor (
        private CommonsGenericSFProxy: CommonsGenericSFProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private BookingAppConstants: MmBAppConstants
    ) {}

    getContactData = (promise?: any): angular.IPromise<any> => {
        return new Promise((resolve, reject) => {
            const getContactDataSuccess = (contactData): void => {
                resolve(contactData);
            };
            const getContactDataError = (error): void => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            const endpoint = this.BookingAppConstants.SALESFORCE_ENDPOINTS.CONTACT_DETAILS_IBPLUS;
            this.CommonsGenericSFProxy.getGeneric(endpoint).then(getContactDataSuccess, getContactDataError);
        });
    };

    updateContactData = (updateContactData, promise?: any): angular.IPromise<any> => {
        return new Promise((resolve, reject) => {
            const updateContactDataSuccess = (contactData): void => {
                resolve(contactData);
            };
            const updateContactDataError = (error): void => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);            
            };
    
            const endpoint = this.BookingAppConstants.SALESFORCE_ENDPOINTS.CONTACT_DETAILS_IBPLUS;
            this.CommonsGenericSFProxy.putGeneric(endpoint, updateContactData).then(updateContactDataSuccess, updateContactDataError);    
        });
    };
}
