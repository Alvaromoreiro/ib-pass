import ng from 'angular';
import { AttendanceVoucher } from './model/model';

@Component(
    'ib-pmt-assistance-voucher-info-module',
    'ibPmtAssistanceVoucherInfo',
    {
        controllerAs: 'assistanceVoucherCtrl',
        bindings: {
            attendanceVouchers: '='
        },
        templateUrl: ['$rootScope', function ($rootScope) {
            return $rootScope.routes.templates + 'ib-pmt-assistance-voucher-info-view.html';
        }]
    },
    ['$scope', 'PmtModalService'],
    ['ib-modal-module']
)

export class ibPmtAssistanceVoucherInfo implements ng.IController{
    public attendanceVouchers: AttendanceVoucher[];
    constructor (
        private $scope: ng.IScope,
        private PmtModalService: any
    ) {
    }

    $onInit () {
        this.$scope.$on('sendAttendanceVoucherByEmail', () => this.openModal());
    }

    openModal () {
        const modelObject = {};
        this.PmtModalService.showGenericDynamicModal(
            false,
            'ib-modal-assistance-voucher-email-view.html',
            modelObject,
            'ibModalAssistanceVoucherEmailController',
            'ib-modals ib-modals--right fade'
        );
    }
}