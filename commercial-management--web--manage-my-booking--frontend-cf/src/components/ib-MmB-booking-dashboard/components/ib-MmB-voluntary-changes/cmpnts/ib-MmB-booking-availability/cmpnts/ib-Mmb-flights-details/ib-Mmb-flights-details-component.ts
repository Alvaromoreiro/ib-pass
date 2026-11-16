@Component(
    'ib-Mmb-flights-details-module',
    'ibMmbFlightsDetails',
    {
        controllerAs: 'flightsDetailsCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-Mmb-flights-details-view.html';
        }],
        bindings: {
            model: '=',
            index: '=',
            last: '='
        }
    },
    [],
[])
export class ibMmbFlightsDetails {

    model;
    index;
    last;

    constructor() {}

    $onInit = (): void => {}
};