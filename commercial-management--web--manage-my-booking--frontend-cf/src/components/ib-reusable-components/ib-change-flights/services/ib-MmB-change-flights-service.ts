import { DisruptionPeriodsService } from '@src/components/services/ib-disruption-periods-service';

@Service(
    'ib-MmB-change-flights-service',
    ['DisruptionPeriodsService', 'ChangeFlightsTransformer'],
    []
)    
export class ChangleFlightsService {
    constructor (
        private DisruptionPeriodsService: DisruptionPeriodsService,
        private ChangeFlightsTransformer) {}

    getDisruptionPeriods = () => {
        return new Promise((resolve, reject) => {
            const getDisruptionPeriodsSuccess = (response) => {
                resolve(this.ChangeFlightsTransformer.transformBlackOutPeriods(response));
            };
    
            const getDisruptionPeriodsError = (error) => {
                resolve(this.ChangeFlightsTransformer.transformBlackOutPeriods());
            };
            this.DisruptionPeriodsService.getDisruptionPeriods().then(getDisruptionPeriodsSuccess, getDisruptionPeriodsError);
        });
    };

}