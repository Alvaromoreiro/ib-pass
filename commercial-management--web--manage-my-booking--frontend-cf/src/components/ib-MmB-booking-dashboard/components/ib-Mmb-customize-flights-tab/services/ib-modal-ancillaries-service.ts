export class ModalServiceAncillaries {
    constructor (
        private $rootScope: CommonsRootScope,
        private $uibModal: ng.ui.bootstrap.IModalService,
    ) {}

    /**
     * Open baggages modal view
     */
    openBobModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-bob-modal-view.html',
            controller: 'IbBobModalController',
            controllerAs: 'bobModalCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };
}