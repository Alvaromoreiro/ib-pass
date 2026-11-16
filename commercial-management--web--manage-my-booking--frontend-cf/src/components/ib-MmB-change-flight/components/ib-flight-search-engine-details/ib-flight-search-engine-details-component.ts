@Component(
    'ib-flight-search-engine-details-module',
    'ibFlightSearchEngineDetails',
    {
        controllerAs: 'flightSEDCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-flight-search-engine-details-view.html';
        }],
        bindings: {
            flightSearchDetailsModel: '=',
            timeZoneOptions: '<'
        },
    },
    [],
[])
export class ibFlightSearchEngineDetails {

    slideToggle;

    constructor() {}

    $onInit = () => {
        this.slideToggle = false;
    }
}