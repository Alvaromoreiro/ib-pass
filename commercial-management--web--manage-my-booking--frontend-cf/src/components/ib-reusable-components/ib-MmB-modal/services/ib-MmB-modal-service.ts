import * as angular from 'angular';

@Service(
    'ib-MmB-modal-module',
    ['MmBAppConstants', '$uibModal', '$uibModalStack', '$rootScope', '$route', '$timeout'],
    []
)
export class MmBModalService {

    private errorMessage;
    private errorCode;
    private error;
    private waitingModalInstance = null;
    private openning = false;
    private openningLoading = false;

    constructor (
        private MmBAppConstants,
        private $uibModal: ng.ui.bootstrap.IModalService,
        private $uibModalStack: ng.ui.bootstrap.IModalStackService,
        private $rootScope: any,
        private $route: angular.route.IRouteService,
        private $timeout: ng.ITimeoutService){
        this.$rootScope.$on('showGenericError', this.showModalError);
    }

    /**
     * Opens a generic error modal returning its instance
     * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
     * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @returns {Object} -the error modal instance opened
     */
    showGenericError = (errorObject, isModalBlocked, template) => {
        var modalErrorObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'ib-Mmb-generic-error-modal.html'),
            controller: 'MmBGenericErrorModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                errorObject: () => {
                    return errorObject;
                }
            }
        };

        if (isModalBlocked) {
            modalErrorObject['backdrop'] = 'static';
            modalErrorObject['keyboard'] = false;
        }
        return this.$uibModal.open(modalErrorObject);
    };

    ////////////////
    /**
     * Opens a generic error modal returning its instance
     * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
     * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @returns {Object} -the error modal instance opened
     */
    showLoginErrorModal = (errorObject, isModalBlocked, template) => {
        var modalErrorObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'ib-Mmb-generic-error-modal.html'),
            controller: 'MmBGenericErrorModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                errorObject: () => {
                    return errorObject;
                }
            }
        };

        if (isModalBlocked) {
            modalErrorObject['backdrop'] = 'static';
            modalErrorObject['keyboard'] = false;
        }
        return this.$uibModal.open(modalErrorObject);
    };

    showModalError = (evt, data) => {
        this.showGenericModal(data.isModalBlocked, data.template, data.modelObject, data.windowClass);
    };

    tryAgain = () => {
        alert();
        this.$route.reload();
    };


    ////////////////
    /**
     * Opens a generic  modal returning its instance
     * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
     * modalCtrl.model object in the generic controller
     * @returns {Object} -the  modal instance opened
     */
    showGenericModal = (isModalBlocked, template, modelObject, windowClass) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'generic-complete-modal.html'),
            controller: 'MmBGenericModalController',
            controllerAs: 'modalCtrl',
            windowClass: windowClass ? windowClass : 'ib-modals ib-modals--md',
            showCloseButton: modelObject.showCloseButton ?? true,
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };

        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };


    ////////////////
    /**
     * Opens a generic  modal returning its instance
     * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
     * modalCtrl.model object in the generic controller
     * @returns {Object} -the  modal instance opened
     */
    showGenericInfoModal = (modelObject, isModalBlocked, template) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template + '.html' : 'generic-info-modal.html'),
            controller: 'MmBGenericModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };
        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };


    showFlightReminderModal = (isModalBlocked, template, modelObject, windowClass) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'generic-complete-modal.html'),
            controller: 'MmBFlightReminderModalController',
            controllerAs: 'modalCtrl',
            windowClass: windowClass ? windowClass : 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };
        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };

    showWidgetModal = (template, modelObject, windowClass) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'ib-show-widget-modal.html'),
            controller: 'MmBWidgetModalController',
            controllerAs: 'modalCtrl',
            windowClass: windowClass ? windowClass : 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };

        return this.$uibModal.open(modalObject);
    };
    showBookingNameModal = (modelObject) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + 'ib-chktrp-modal-name.html',
            controller: 'BookingNameModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };

        return this.$uibModal.open(modalObject);
    };
    showTransferWidgetModal = (template, modelObject, windowClass) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'ib-show-transfer-widget-modal.html'),
            controller: 'MmBTransferWidgetModalController',
            controllerAs: 'modalCtrl',
            windowClass: windowClass ? windowClass : 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };

        return this.$uibModal.open(modalObject);
    };
    /**
     * Opens the waiting modal, saving its instance in the service as attribute
     */
    showWaitingModal = (template, classTpl, background, modelObject) => {
        var waitModalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + 'generic-wait-modal.html',
            size: 'loading',
            backdrop: 'static',
            controller: 'MmBGenericModalController',
            controllerAs: 'modalCtrl',
            keyboard: false,
            windowClass: 'ib-modals ib-modals--loading',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };
        this.openningLoading = true;
        this.waitingModalInstance = this.waitingModalInstance || this.$uibModal.open(waitModalObject);
        if (this.waitingModalInstance.opened) {
            this.waitingModalInstance.opened.then(() => {
                this.openningLoading = false;
            });
        }
    };

    /**
     * Closes the current waiting modal if it exists
     */
    finishWaiting = () => {
        if (this.waitingModalInstance && this.openningLoading) {
            this.$timeout(() => {
                if(this.waitingModalInstance){
                    this.waitingModalInstance.close();
                    this.waitingModalInstance = null;
                }
            });
        }

        if (this.waitingModalInstance && !this.openningLoading) {
            this.waitingModalInstance.close();
            this.waitingModalInstance = null;
        }
    };

    /**
     * Closes all the opened modals in the aplication
     */
    closeAllCurrentModals = () => {
        this.$uibModalStack.dismissAll();
    };

    /**
     * Closes all the opened modals in the aplication
     */
    closeModal = () => {
        if(true) {
            this.$rootScope.$broadcast('updateMonetateInfo');
        }
        this.$uibModalStack.dismiss(null);
    };

    ////////////////
    /**
     * Opens an especial filter  modal returning its instance
     * @param {string} template - the name of a custom template to be shown in the modal
     * @returns {Object} -the  modal instance opened
     */
    showLoginModal (template, modelObject, animationEnabled, clss) {
        var modalObject = {
            animation: animationEnabled,
            templateUrl: this.MmBAppConstants.templatesRoute + template + '.html',
            controller: 'MmBGenericModalController',
            controllerAs: 'modalCtrl',
            windowClass: clss ? clss : 'ib-modals',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };
        return this.$uibModal.open(modalObject);
    }

    /**
     * @function
     * @name isError
     * @desc Sets the variable error to true and opens the modal
     */
    isError = (modelObject, template, staticModal) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'ib-Mmb-generic-error-modal.html'),
            controller: 'MmBGenericModalController',
            controllerAs: 'modalCtrl',
            size: 'md',
            windowClass: 'ib-modals',
            resolve: {
                object: () => {
                    return modelObject || {};
                }
            }
        };
        if (staticModal || this.getErrorCode() === 'IB_00002') {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }
        this.error = true;
        return this.$uibModal.open(modalObject);
    };


    /**
     * @function
     * @name getErrorCode
     * @desc Returns the variable errorCode
     */
    getErrorCode = () => {
        return this.errorCode;
    };

    /**
         * @function
         * @name setErrorMessage
         * @desc Sets the param object, the object that contains the message error.
         */
    setErrorCode = (object) => {
        this.errorCode = object;
    };


    /**
         * @function
         * @name setErrorMessage
         * @desc Sets the param object, the object that contains the message error.
         */
    setErrorMessage = (object) => {
        this.errorMessage = object;
    };

    showPassengerModal = (isModalBlocked, template, modelObject, windowClass) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'generic-complete-modal.html'),
            controller: 'MmBPassengerModalController',
            controllerAs: 'modalCtrl',
            windowClass: windowClass ? windowClass : 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };
        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };

    showInvoiceRequestModal = (isModalBlocked, template, modelObject, windowClass) => {
        var modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'ib-MmB-modal-invoice-request.html'),
            controller: 'MmBModalInvoiceRequestController',
            controllerAs: 'modalCtrl',
            windowClass: windowClass ? windowClass : 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };
        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    }

    showEmptyBasketModal = () => {
        var modalObject = {
            animation: false,
            backdrop: 'static',
            templateUrl: this.MmBAppConstants.templatesRoute + 'ib-modal-empty-basket.html',
            controller: 'MmBDeleteBasketModalController',
            controllerAs: 'MmBDeleteBasketModalCtrl',
            windowClass: 'ib-modals ib-modals--md',
        };


        return this.$uibModal.open(modalObject);
    };
    showFullModal = (isModalBlocked, template, modelObject) => {
        var modalObject = {
            animation: isModalBlocked ? isModalBlocked : false,
            templateUrl: this.MmBAppConstants.templatesRoute + template,
            controller: 'MmBFullModalController',
            controllerAs: 'fullModalCtrl',
            windowClass: 'ib-modals-full',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };

        angular.element('body').css('overflow', 'hidden');

        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };

    showRefundContinueModal = (isModalBlocked, template, modelObject) => {
        var modalObject = {
            animation: isModalBlocked ? isModalBlocked : false,
            templateUrl: this.MmBAppConstants.templatesRoute + template,
            controller: 'MmbRefundContinueModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        };

        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };

    /**
     *
     * This functions is launched when user select change date of flight. This functions open a modal with the flow to select,
     * pay and confirm the flight change.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @returns {Object} -the  modal instance opened
     *  */
    showVoluntaryChangeModal = (isModalBlocked, template, modelObject, modalClass, component, ctrl) => {
        var modalObject = {
            animation: isModalBlocked ? isModalBlocked : false,
            component: component ? component : 'ibMmbVoluntaryChangesComponent',
            windowClass: modalClass ? modalClass : 'ib-modals-full',
            resolve: {
                dataModalChangesFlights: () => {
                    return modelObject;
                }
            }
        };

        angular.element('body').css('overflow', 'hidden');

        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }

        return this.$uibModal.open(modalObject);
    };

    showModalAssitanceVoucherEmail(isModalBlocked, template, modelObject, modalClass) {
        const modalObject = {
            animation: false,
            templateUrl: this.MmBAppConstants.templatesRoute + (template ? template : 'generic-complete-modal.html'),
            controller: 'ibModalAssistanceVoucherEmailController',
            controllerAs: 'modalCtrl',
            windowClass: modalClass ? modalClass : 'ib-modals ib-modals--md',
            resolve: {
                object: () => {
                    return modelObject;
                }
            }
        }
        if (isModalBlocked) {
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
        }
        return this.$uibModal.open(modalObject);
    };

}
