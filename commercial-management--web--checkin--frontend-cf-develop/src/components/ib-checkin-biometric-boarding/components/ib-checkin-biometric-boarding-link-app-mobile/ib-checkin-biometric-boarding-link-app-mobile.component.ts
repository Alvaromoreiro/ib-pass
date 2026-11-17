@Component('ib-checkin-biometric-boarding-module', 'ibCheckinBiometricBoardingLinkAppMobile', {
    bindings: {
        model: '='
    },
    controllerAs : 'ibCheckinBiometricBoardingLinkAppMobileCtrl',
    templateUrl: ['CheckinRouterConstants', (CheckinRouterConstants) => {
        return CheckinRouterConstants.templatesRoute + 'ib-checkin-biometric-boarding-link-app-mobile.view.html';
    }]
}, [], [])
class IbCheckinBiometricBoardingLinkAppMobileComponent {
    constructor () {}
}
