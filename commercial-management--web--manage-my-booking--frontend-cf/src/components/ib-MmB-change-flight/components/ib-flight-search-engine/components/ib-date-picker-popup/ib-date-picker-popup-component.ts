@Component(
    'ib-flight-search-engine-module',
    'ibDatePickerPopupComponent',
    {
        controllerAs: 'datePickerCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-flight-search-engine-datepicker-view.html';
        }],
    },
    ['$filter'],
[])
export class ibDatePickerPopupComponent {

    today

    constructor(
        private $filter) {}

    $onInit = () => {
        this.today = this.$filter('date')(new Date(), 'dd \'de\' MMM, yyyy');
    }
}