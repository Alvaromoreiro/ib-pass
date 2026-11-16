import { AttendanceVoucher } from "@src/app/core/models/attendance-voucher-model/attendance-voucher-model";
import ng from "angular";
import { CommonsModalService } from "ib-web-commons/dist/app/core/ib-modal/services/ib-modal-service";

@Component(
  'ib-MmB-manage-assistance-voucher-info-module',
  'ibMmbManageAssistanceVoucherInfo',
  {
    controllerAs: 'ibMmbManageAssistanceVoucherInfoCtrl',
    bindings: {
      attendanceVouchers: '='
    },
    templateUrl: [
      'MmBAppConstants',
      (MmBAppConstants: MmBAppConstants): string =>
        MmBAppConstants.templatesRoute +
        'ib-MmB-manage-assistance-voucher-info.view.html',
    ],
  },
  ['$scope', 'CommonsModalService'],
  []
)
class ibMmbManageAssistanceVoucherInfoComponent implements ng.IController {
  public attendanceVouchers: AttendanceVoucher[];
  constructor(
    private $scope: ng.IScope,
    private commonsModalService: CommonsModalService
    ) {

  }

  $onInit() {
    this.$scope.$on('sendAttendanceVoucherByEmail', () => this.openModal());
  }

  openModal() {
    const modelObject = {};
    this.commonsModalService.showGenericDynamicModal(
      false,
      'ib-modal-assistance-voucher-email-view.html',
      modelObject,
      'ibModalAssistanceVoucherEmailController',
      'ib-modals ib-modals--right fade'
    );
  }
}
