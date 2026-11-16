@Component(
    'ib-Mmb-flights-info-module',
    'ibMmbFlightsInfo',
    {
        controllerAs: 'flightsInfoCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-Mmb-flights-info-view.html';
        }],
        bindings: { 
            model: '=',
            statuscollapse: '<'
        }
    },
    [],
[])
export class ibMmbFlightsInfo {
    
    model;
    statuscollapse;
    
    constructor() {}

    $onInit = (): void => {}
};