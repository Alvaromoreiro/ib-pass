(function () {
    'use strict';

    angular
        .module('ib-cki-modal-module')
        .service('ModalService', ModalService);

    ModalService.$inject = ['CheckinRouterConstants', '$uibModal', '$uibModalStack'];
    function ModalService (CheckinRouterConstants, $uibModal, $uibModalStack) {

        const self = this;
        let error = false;
        let wait = false;
        let errorMessage;
        let errorCode;
        let errorPassengerSeatsMap;
        let instanceModalWaiting = null;
        self.isError = isError;
        self.isWaiting = isWaiting;
        self.isWaitingGeneric = isWaitingGeneric;
        self.isNotWaiting = isNotWaiting;
        self.setErrorMessage = setErrorMessage;
        self.setErrorCode = setErrorCode;
        self.getErrorMessage = getErrorMessage;
        self.getErrorCode = getErrorCode;
        self.eraseAll = eraseAll;
        self.openGenericModal = openGenericModal;
        self.openSplitModal = openSplitModal;
        self.openAncillariesModal = openAncillariesModal;
        self.openUnavailableModal = openUnavailableModal;
        self.openPendingAQQErrorModal = openPendingAQQErrorModal;
        self.openApisUncheckableErrorModal = openApisUncheckableErrorModal;
        self.openPendingPaymentsModal = openPendingPaymentsModal;
        self.openCheckInGroupModal = openCheckInGroupModal;
        self.setErrorPassengerSeatsMap = setErrorPassengerSeatsMap;
        self.getErrorPassenger = getErrorPassenger;
        self.openInsuranceModal = openInsuranceModal;
        self.openCkiUpgradingKnowMore = openCkiUpgradingKnowMore;
        self.showLoginErrorModal = showLoginErrorModal;
        self.openDangerousObjectsModal = openDangerousObjectsModal;
        self.openNavigationErrorModal = openNavigationErrorModal;
        self.showConfigurableModal = showConfigurableModal;
        self.showGenericModal = showGenericModal;
        self.showGenericError = showGenericError;
        self.finishWaiting = finishWaiting;
        self.closeAllCurrentModals = closeAllCurrentModals;
        self.isCloseWaiting = isCloseWaiting;

        ////////////////////////FUNCTIONS///////////////////////////////

        ////////////////
        /**
         * Opens a generic error modal returning its instance
         * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
         * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the error modal instance opened
         */
        function showGenericError (errorObject, isModalBlocked, template) {
            const modalErrorObject = {
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + (template ? template : 'generic-error-modal.html'),
                controller: 'CheckinGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    ErrorModel: function () {
                        return errorObject;
                    }
                }
            };

            if (isModalBlocked) {
                modalErrorObject['backdrop'] = 'static';
                modalErrorObject['keyboard'] = false;
            }
            return $uibModal.open(modalErrorObject);
        }

        ////////////////
        /**
         * Opens a generic  modal returning its instance
         * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
         * modalCtrl.model object in the generic controller
         * @returns {Object} -the  modal instance opened
         */
        function showGenericModal (modelObject, isModalBlocked, template) {
            const modalObject = {
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + (template ? template + '.html' : 'generic-info-modal.html'),
                controller: 'CKIGenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            if (isModalBlocked) {
                modalObject['backdrop'] = 'static';
                modalObject['keyboard'] = false;
            }

            return $uibModal.open(modalObject);
        }

        /**
         * Opens a generic  modal returning its instance
         * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
         * modalCtrl.model object in the generic controller
         * @param {String} classWindows the window class to apply
         * @param {String} controllerObj Controller to manage the modal
         * @param {String} controllerAlias Alias used in the template
         * @param {boolean} animation Enable animation
         *
         *
         * @returns {Object} -the  modal instance opened
         */
        function showConfigurableModal (isModalBlocked, template, modelObject, classWindows, controllerObj, controllerAlias, animation) {
            const modalObject = {
                animation: animation ? animation : false,
                templateUrl: CheckinRouterConstants.templatesRoute + (template ? template + '.html' : 'generic-info-modal.html'),
                controller: controllerObj ? controllerObj : 'CKIGenericModalController',
                controllerAs: controllerAlias ? controllerAlias :  'modalCtrl',
                windowClass: classWindows ? classWindows : 'ib-modals ib-modals--md',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            if (isModalBlocked) {
                modalObject['backdrop'] = 'static';
                modalObject['keyboard'] = false;
            }

            return $uibModal.open(modalObject);
        }

        /**
          * @function
          * @name isError
          * @desc Sets the variable error to true and opens the modal
          */
        function isError (modelObject, template, staticModal) {
            const modalObject = {
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + (template ? template : 'modal-mensaje-error.html'),
                controller: 'CheckinGenericErrorModalController',
                controllerAs: 'modalCtrl',
                size: 'md',
                windowClass: 'ib-modals',
                resolve: {
                    ErrorModel: function () {
                        return modelObject || {};
                    }
                }
            };
            if (staticModal || getErrorCode() === 'IB_00002') {
                modalObject['backdrop'] = 'static';
                modalObject['keyboard'] = false;
            }
            error = true;
            return $uibModal.open(modalObject);
        }

        function openPendingAQQErrorModal (modelObject) {
            $uibModal.open({
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + 'modal-pending-aqq-error.html',
                controller: 'CheckinGenericErrorModalController',
                controllerAs: 'modalCtrl',
                size: 'md',
                windowClass: 'modal-search',
                backdrop: 'static',
                resolve: {
                    ErrorModel: function () {
                        return modelObject || {};
                    }
                }
            });
        }

        function openApisUncheckableErrorModal (modelObject) {
            $uibModal.open({
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + 'modal-apis-uncheckable-error.html',
                controller: 'CheckinGenericErrorModalController',
                controllerAs: 'modalCtrl',
                size: 'md',
                windowClass: 'modal-search',
                backdrop: 'static',
                resolve: {
                    ErrorModel: function () {
                        return modelObject || {};
                    }
                }
            });
        }


        /**
          * @function
          * @name isWaiting
          * @desc Sets the variable wait to true and opens the modal
          */
        function isWaiting () {
            wait = true;
            instanceModalWaiting = $uibModal.open({
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + 'modal-mensaje-wait.html',
                size: 'loading',
                backdrop: 'static',
                keyboard: false
            });
        }

        /**
          * @function
          * @name isWaitingGeneric
          * @desc shows a waiting modal using a especific template
          * @param template Name of the template to use
          */
        function isWaitingGeneric (template) {
            $uibModal.open({
                animation: false,
                templateUrl:template ? CheckinRouterConstants.templatesRoute + template :CheckinRouterConstants.templatesRoute + 'modal-mensaje-wait.html' ,
                size: 'loading',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'ib-modals ib-modals--loading-full'
            });
        }

        /**
           * @function
           * @name isNotWaiting
           * @desc Sets the variable wait to false and the variable error to fals
           */
        function isNotWaiting () {
            self.isCloseWaiting();
            $uibModalStack.dismissAll();
        }

        /**
           * @function
           * @name isCloseWaiting
           * @desc Sets the variable wait to false, the variable error to false and close instance modal waiting
           */
        function isCloseWaiting () {
            wait = false;
            if(instanceModalWaiting !== null) {
                instanceModalWaiting.close();
                instanceModalWaiting = null;
            }
            error = false;
        }


        /**
          * @function
          * @name setErrorMessage
          * @desc Sets the param object, the object that contains the message error.
          */
        function setErrorMessage (object) {
            errorMessage = object;
        }

        /**
          * @function
          * @name setErrorPassengerSeatsMap
          * @desc Sets the param object, the object that contains the message error passenger.
          */
        function setErrorPassengerSeatsMap (object) {
            errorPassengerSeatsMap = object;
        }

        /**
           * @function
           * @name setErrorMessage
           * @desc Sets the param object, the object that contains the message error.
           */
        function setErrorCode (object) {
            errorCode = object;
        }


        /**
           * @function
           * @name getErrorMessage
           * @desc Returns the variable errorMessage..
           */
        function getErrorMessage () {
            return errorMessage;
        }


        /**
           * @function
           * @name getErrorPassenger
           * @desc Returns the variable errorPassengerSeatsMap..
           */
        function getErrorPassenger () {
            return errorPassengerSeatsMap;
        }

        /**
           * @function
           * @name getErrorCode
           * @desc Returns the variable errorCode
           */
        function getErrorCode () {
            return errorCode;
        }

        /**
          * @function
          * @name eraseAll
          * @desc erases all parameters to false
          */
        function eraseAll () {
            wait = false;
            error = false;
        }

        /**
          * @function
          * @name openModalInf
          * @desc opens an information modal
        */

        function openGenericModal (size, tpl, anim, data) {
            const modalInstance = $uibModal.open({
                animation: anim,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'CKIGenericModalController',
                controllerAs: 'modalCtrl',
                size: size,
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: function () {
                        return data;
                    }
                }
            });
            return modalInstance;
        }

        /**
          * @function
          * @name openModalInf
          * @desc opens an information modal
        */

        function openPendingPaymentsModal (size, tpl, anim) {
            return $uibModal.open({
                animation: anim,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'CKIGenericModalController',
                controllerAs: 'modalCtrl',
                size: size,
                windowClass: 'modal-search',
                resolve: {
                    object: function () {
                        return {};
                    }
                }
            });
        }

        function openAncillariesModal (size, tpl, anim, object1) {
            $uibModal.open({
                animation: anim,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'AncillariesModalController',
                controllerAs: 'modalCtrl',
                size: size,
                windowClass: 'modal-search',
                resolve: {
                    object: function () {
                        return object1;
                    }
                }
            });
        }

        function openSplitModal (size, tpl, anim, newPnrInput) {
            return $uibModal.open({
                animation: anim,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'AcceptSplitModalController',
                controllerAs: 'modalCtrl',
                size: size,
                windowClass: 'modal-search',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    newPnr: function () {
                        return newPnrInput;
                    }
                }
            });
        }

        function openCheckInGroupModal (size, tpl, anim, object1) {
            $uibModal.open({
                animation: anim,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'checkInGroupModalController',
                controllerAs: 'modalCtrl',
                size: size,
                windowClass: 'modal-search',
                resolve: {
                    object: function () {
                        return object1;
                    }
                }
            });
        }


        function openUnavailableModal (size, tpl, anim) {
            $uibModal.open({
                animation: anim,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'UnavailableModalController',
                controllerAs: 'modalCtrl',
                size: size,
                windowClass: 'modal-search'
            });
        }

        ////////////////
        /**
         * Opens a generic  modal returning its instance
         * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
         * @param {string} template - the name of a custom template to be shown in the modal
         * modalCtrl.model object in the generic controller
         * @returns {Object} -the  modal instance opened
         */
        function openInsuranceModal (modelObject, tpl) {
            const modalObject = {
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + tpl + '.html',
                controller: 'InsuranceModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--right fade',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return $uibModal.open(modalObject);
        }

        /**
         * Closes the current waiting modal if it exists
         */
        function finishWaiting () {
            if (self.waitingModalInstance) {
                self.waitingModalInstance.close();
                self.waitingModalInstance = null;
            }
        }

        /**
     * Open seat map modal view
     * @param {Object} modelObject Model for load and save data
     */
        function openCkiUpgradingKnowMore (modelObject) {
            const modalObject = {
                animation: true,
                controller: 'UpgradeCkiKnowMoreController',
                controllerAs: 'upgModalCtrl',
                templateUrl: CheckinRouterConstants.templatesRoute + 'ib-modal-upgrade-know-more.html',
                windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile fade',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };

            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
            return $uibModal.open(modalObject);
        }

        //////////////////
        /**
         * Opens a generic login error modal returning its instance
         * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
         * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the error modal instance opened
         */
        function showLoginErrorModal (errorObject, isModalBlocked, template) {
            const modalErrorObject = {
                animation: false,
                templateUrl: CheckinRouterConstants.templatesRoute + (template ? template : 'generic-error-modal.html'),
                controller: 'CheckinGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    ErrorModel: function () {
                        return errorObject;
                    }
                }
            };

            if (isModalBlocked) {
                modalErrorObject['backdrop'] = 'static';
                modalErrorObject['keyboard'] = false;
            }
            return $uibModal.open(modalErrorObject);
        }

        function openDangerousObjectsModal (modelObject) {
            const modalObject = {
                templateUrl: CheckinRouterConstants.templatesRoute + 'ib-modal-dangerous-objects.html',
                controller: 'DangerousObjectsModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--desktop ib-modals--reset',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            modalObject['backdrop'] = 'static';
            modalObject['keyboard'] = false;
            return $uibModal.open(modalObject);
        }

        /*
        * Open Navigation step back modal.
         */
        function openNavigationErrorModal (modelObject,state,routeChangeStart) {
            const modalObject = {
                templateUrl: CheckinRouterConstants.templatesRoute + 'ib-navigation-error-modal.html',
                controller: 'NavigationErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--desktop ib-modals--reset',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return $uibModal.open(modalObject);
        }

        /**
         * Closes all the opened modals in the aplication
         */
        function closeAllCurrentModals () {
            $uibModalStack.dismissAll();
        }
    }
})();
