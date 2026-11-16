@Service(
    'ib-MmB-services-module',
    ['MmBAppConstants',
        'CommonsNewHttpUtilsErrorService',
        'CommonsGenericProxy'],
    []
)
export class SisterCitiesService {
    sisterCitiesURI: any;

    constructor (
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getSisterCities = (requestBody: any) => {
        return new Promise((resolve, reject) => {
            this.sisterCitiesURI = this.MmBAppConstants.sisterCitiesServiceURI;

            const getSisterCitiesSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const getSisterCitiesError = (error: any) => {
    
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(this.sisterCitiesURI, requestBody).then(getSisterCitiesSuccess, getSisterCitiesError);
        });
    };
}