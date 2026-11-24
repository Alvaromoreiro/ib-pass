@Component('ib-pmt-summary-speqs-module', 'ibPmtSummarySpeqs', {
    bindings: {
        model : '='
    },
    controllerAs : 'speqsSummaryCtrl',
    templateUrl: ['$rootScope',
        ( $rootScope: CommonsRootScope ): string => $rootScope.routes.templates+'ib-pmt-summary-speqs.html']
}, ['$rootScope'], [])
class ibPmtSummarySpeqs implements ng.IController {
    constructor (private $rootScope:CommonsRootScope ) {
    }
}
