@Service(
    'ib-MmB-communication-lost-module',
    ['MmBCommunicationLostTransformer', 'localStorageService'],
    []
)
export class MmBCommunicationLostService {
    constructor (
        private MmBCommunicationLostTransformer,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    /**
     * initialize the communication lost model calling to transformer
     */
    getCommunicationLostInfo = () => {
        return this.MmBCommunicationLostTransformer.generateCommunicationLostInfo(this.localStorageService.get('issueOrderInfo'), this.localStorageService.get('creditCardTypes'));
    };
}
