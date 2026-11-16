@Component(
    'ib-MmB-vc-summary-module',
    'ibMmbVcSummaryBreakdown',
    {
        controllerAs: 'ibMmBVcSummaryBreakdownCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-vc-summary-breakdown-view.html';
        }],
        bindings: {
            breakdownModel: '<'
        }
    },
    [],
[])
export class ibMmbVcSummaryBreakdown {

    constructor() {}

    $onInit = (): void => {}
}