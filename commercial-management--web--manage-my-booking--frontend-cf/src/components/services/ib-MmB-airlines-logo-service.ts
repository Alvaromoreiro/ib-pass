@Service(
    'ib-MmB-services-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'localStorageService', 'CommonsNewHttpUtilsErrorService'],
    []
)
export class MmBAirlinesLogoService {

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getAirlinesLogos = () => {
        return new Promise((resolve, reject) => {
            const airlinesLogo = this.localStorageService.get('airlinesLogoList');
            const getAirlinesLogoSuccess = (data: any) => {
                this.localStorageService.set('airlinesLogoList', data.data);
                resolve(data.data);
            };
    
            const getAirlinesLogoError = (error: any) => {
                this.localStorageService.set('airlinesLogoList', []);
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
    
            if (airlinesLogo === null) {
                this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.iconsRoute + this.MmBAppConstants.airlinesLogoJsonRoute).then(
                    getAirlinesLogoSuccess, getAirlinesLogoError)['catch'](getAirlinesLogoError);
            } else {
                resolve(airlinesLogo);
            }
        });        
    };
}