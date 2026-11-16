@Service(
    'ib-MmB-bookings-list-module',
    ['GetCitiesImagesProxy', 'MmBAppConstants'],
    []
)
export class GetCitiesImagesService {
    constructor (
        private GetCitiesImagesProxy: any,
        private MmBAppConstants: any
    ) {}

    getCitiesImages = () => {      
        return new Promise((resolve, reject) => {
            const getCitiesImagesSuccess = (data: any) => {
                resolve(data);
            };

            const getCitiesImagesError = (error: any) => {
                resolve([]);
            };
            this.GetCitiesImagesProxy.getCitiesimages(this.MmBAppConstants.imagesRoute + this.MmBAppConstants.citiesJsonRoute).then(getCitiesImagesSuccess, getCitiesImagesError)['catch'](getCitiesImagesError);
        });
    };
}