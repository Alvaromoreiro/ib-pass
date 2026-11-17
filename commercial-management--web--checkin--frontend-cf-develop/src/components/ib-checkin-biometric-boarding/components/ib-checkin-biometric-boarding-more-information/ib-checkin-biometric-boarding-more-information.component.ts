@Component('ib-checkin-biometric-boarding-module', 'ibCheckinBiometricBoardingMoreInformation', {
    bindings: {
        model: '='
    },
    controllerAs : 'ibCheckinBiometricBoardingMoreInformationCtrl',
    templateUrl: ['CheckinAppConstants', (ckiConstants: CheckinAppConstants ): string => ckiConstants.templatesRoute + 'ib-checkin-biometric-boarding-more-information.view.html']
}, ['$filter'], [])
class IbCheckinBiometricBoardingMoreInformationComponent implements ng.IController  {

    public labelHideMoreInformation: string;
    public labelShowMoreInformation: string;

    constructor (private $filter) {
    }

    $ngOnInit = (): void => {
        this.labelHideMoreInformation = this.$filter('translate')('BIOMETRIC_BOARDING_LINK_MORE_INFO_HIDE');
        this.labelShowMoreInformation = this.$filter('translate')('BIOMETRIC_BOARDING_LINK_MORE_INFO');
    };

}
