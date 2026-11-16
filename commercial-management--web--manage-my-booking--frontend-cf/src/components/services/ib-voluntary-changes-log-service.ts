@Service('ib-MmB-services-module', [
    'localStorageService',
    'CommonsNewHttpUtilsErrorService',
    'CommonsGenericProxy',
    'MmBModalService',
    'MmBAppConstants'
], [])
export class VoluntaryChangesLogService {
    requestAvailability: any = {};

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBModalService: any,
        private MmBAppConstants: any
    ) { }

    getVoluntaryChangesLog = () => {
        const flowId = this.localStorageService.get('flowId');
        const replacedURI = this.MmBAppConstants.voluntaryChangesLogURI.replace('{flowId}', flowId);
        this.MmBModalService.showWaitingModal();
        return new Promise((resolve, reject) => {
            const getVoluntaryChangesLogSuccess = (data: any) => {
                resolve(data.data);
            };
        
            const getVoluntaryChangesLogError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                this.MmBModalService.finishWaiting();
            };

            this.CommonsGenericProxy.getGeneric(replacedURI).then(getVoluntaryChangesLogSuccess, getVoluntaryChangesLogError);
        });
    };

    
}
