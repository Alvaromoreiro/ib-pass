@Component('ib-box-module-link-module', 'ibBoxModuleLink', {
    controllerAs: 'boxModuleLinkCtrl',
    bindings: {
        colSize: '<',
        boxSize: '<',
        icon: '<',
        text: '<',
        linkId: '<',
        value: '<',
        flights: '<',
        isDigitalBoarding: '<'
    },
    templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
        return MmBAppConstants.templatesRoute + 'ib-box-module-link-view.html';
    }]
}, ['$scope', '$rootScope', 'BookingDashboardConstants'],
[])
export class ibBoxModuleLink {

    colSize;
    boxSize;
    icon;
    text;
    linkId;
    value;
    flights;
    isDigitalBoarding;

    constructor(
        private $scope, 
        private $rootScope, 
        private BookingDashboardConstants) {
            const updatePhoneFrontEvent = this.$rootScope.$on('updatePhoneFrontEvent', this.updateBoxModuleLinkFront);
            this.$scope.$on('$destroy', updatePhoneFrontEvent);
    }

    $onInit = () => {
    }
    
    updateBoxModuleLinkFront = () => {
        this.colSize = this.BookingDashboardConstants.BOX_COL_SIZES.FULL;
        this.boxSize = this.BookingDashboardConstants.BOX_LINK_SIZES.FULL;
    }

    redirectClick = () => {
        this.$rootScope.$emit('boxLinkClickEvent', this.linkId);
    }

    redirectToDigitalBoarding  = () => {
        this.$scope.$emit('changeTabEvent', this.BookingDashboardConstants.TABS.documents);
    }

    redirectTo = () => {
        (!this.isDigitalBoarding) ? this.redirectClick() : this.redirectToDigitalBoarding();
    }
}