import * as angular from 'angular';
import { MmBCommunicationLostService } from './services/ib-MmB-communication-lost-service';

@Component('ib-MmB-communication-lost-module', 'ibMmbCommunicationLost', {
    controllerAs: 'mmbComLostCtrl',
    templateUrl: ['MmBAppConstants', ( MmBAppConstants: MmBAppConstants ): string => MmBAppConstants.templatesRoute + 'ib-MmB-communication-lost-view.html']
}, ['MmBCommunicationLostService', '$window'], [])
export class ibMmbCommunicationLostComponent implements ng.IController {
    model = {};

    constructor (
        private MmBCommunicationLostService: MmBCommunicationLostService,
        private $window: any
    ) { }

    $onInit = (): void => {
        this.model = this.MmBCommunicationLostService.getCommunicationLostInfo();
    }

    printSummary = (): void => {
        this.$window.print();
    }
}
