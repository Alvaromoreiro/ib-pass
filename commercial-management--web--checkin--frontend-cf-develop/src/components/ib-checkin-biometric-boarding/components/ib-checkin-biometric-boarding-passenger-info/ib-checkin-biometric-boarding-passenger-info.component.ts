@Component('ib-checkin-biometric-boarding-module', 'ibCheckinBiometricBoardingPassengerInfo', {
    bindings: {
        passengerInfo: '<'
    },
    controllerAs: 'ibCheckinBiometricBoardingPassengerInfoCtrl',
    templateUrl: ['CheckinAppConstants', (ckiConstants: CheckinAppConstants): string => ckiConstants.templatesRoute + 'ib-checkin-biometric-boarding-passenger-info.view.html']
}, ['$scope', 'ModalService', 'CommonsModalService'], [])
class IbCheckinBiometricBoardingPassengerInfoComponent {
    public passengerInfo: any;
    public countryList: any;

    constructor (private $scope: ng.IScope, private ModalService: any, private CommonsModalService: any) { }

    $onInit = (): void => {
        this.ModalService.closeAllCurrentModals();
        this.transformStatuses(this.passengerInfo);
    };

    openModalBiometricPassengerInfo = (passenger): void => {
        const buildDataModal = (data: object): object => {
            return { passenger: data };
        };

        this.CommonsModalService.openBuildGenericModal(buildDataModal(passenger), 'ib-checkin-biometric-boarding-form-view', 'ib-modals--right fade ib-modals--full-mobile', 'ibChekinBiometricBoardingFormController', true);
    };

    checkBiometricProfileLoading = (): void => {
    };

    transformStatuses = (passengerInfo) => {
        //possible status to show: COMPLETE, NOT_AVAILABLE, AVAILABLE
        if(passengerInfo.status.some((e:string) => e === 'AVAILABLE') || passengerInfo.status.some((e:string) => e === 'FAILED')) {
            passengerInfo.statusToShow = 'AVAILABLE';
        } else if(passengerInfo.status.every((e:string) => e === 'COMPLETE')) {
            passengerInfo.statusToShow = 'COMPLETE';
        } else if(passengerInfo.status.every((e:string) => e === 'NOT_AVAILABLE')) {
            passengerInfo.statusToShow = 'NOT_AVAILABLE';
        } else {
            passengerInfo.statusToShow = 'AVAILABLE';
        }
    };
}
