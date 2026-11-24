(function () {
    'use strict';

    angular
        .module('ib-modal-module')
        .service('PmtModalService', PmtModalService);

    PmtModalService.$inject = ['$rootScope', '$uibModal', 'CommonsModalService', 'IbPmtStylesHostMount'];
    function PmtModalService($rootScope, $uibModal, CommonsModalService, IbPmtStylesHostMount) {

        const self = this;
        const HOST_CLASS = 'ib-pmt-styles-host';
        angular.extend(this, CommonsModalService);

        self.showGenericError = showGenericError;
        self.showGenericModal = showGenericModal;
        self.showFilterModal = showFilterModal;
        self.showLoginModal = showLoginModal;
        self.openInsuranceModal = openInsuranceModal;
        self.showNewOrSameFlightModal = showNewOrSameFlightModal;

        function withHostClass (windowClass) {
            IbPmtStylesHostMount();
            const classes = (windowClass || 'ib-modals').split(/\s+/).filter(Boolean);
            if (classes.indexOf(HOST_CLASS) === -1) {
                classes.push(HOST_CLASS);
            }
            return classes.join(' ');
        }

        function openWithHost (modalObject) {
            modalObject = modalObject || {};
            modalObject.windowClass = withHostClass(modalObject.windowClass);
            return $uibModal.open(modalObject);
        }

        if (typeof self.open === 'function') {
            const baseOpen = self.open.bind(self);
            self.open = function (modalObject) {
                modalObject = modalObject || {};
                modalObject.windowClass = withHostClass(modalObject.windowClass);
                return baseOpen(modalObject);
            };
        }

        if (typeof self.showWaitingModal === 'function') {
            const showWaitingModalBase = self.showWaitingModal.bind(self);
            self.showWaitingModal = function (template, windowClass) {
                const args = Array.prototype.slice.call(arguments);
                if (args.length > 1) {
                    args[1] = withHostClass(windowClass);
                } else {
                    IbPmtStylesHostMount();
                    args[1] = withHostClass('ib-modals');
                }
                return showWaitingModalBase.apply(self, args);
            };
        }

        wrapClassArg('showGenericDynamicModal', 4);
        wrapClassArg('showComponentModal', 3);
        wrapClassArg('showGenericComponentModal', 2);
        wrapClassArg('showGenericErrorComponent', 2);
        wrapClassArg('showOnholdModal', 3);
        wrapClassArg('showFaresModal', 3);
        wrapClassArg('openBuildGenericModal', 2);
        wrapClassArg('showBackMainModalComponent', 2);

        function wrapClassArg (methodName, classArgIndex) {
            if (typeof self[methodName] !== 'function') {
                return;
            }
            const base = self[methodName].bind(self);
            self[methodName] = function () {
                const args = Array.prototype.slice.call(arguments);
                while (args.length <= classArgIndex) {
                    args.push(undefined);
                }
                args[classArgIndex] = withHostClass(args[classArgIndex]);
                return base.apply(self, args);
            };
        }

        ////////////////
        /**
         * Opens a generic error modal returning its instance
         * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
         * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the error modal instance opened
         */
        function showGenericError(errorObject, isModalBlocked, template) {
            var modalErrorObject = {
                animation: false,
                templateUrl: $rootScope.routes.templates + (template ? (template + '.html') : 'pmt-generic-error-modal.html'),
                controller: 'PaymentGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: withHostClass('ib-modals ib-modals--md'),
                resolve: {
                    errorObject: function () {
                        return errorObject;
                    }
                }
            };

            if (isModalBlocked) {
                modalErrorObject['backdrop'] = 'static';
                modalErrorObject['keyboard'] = false;
            }
            return openWithHost(modalErrorObject);
        }

        ////////////////
        /**
         * Opens a generic  modal returning its instance
         * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the  modal instance opened
         */
        function showGenericModal(isModalBlocked, template, modelObject, extraModalClass) {
            var modalObject = {
                animation: false,
                templateUrl: $rootScope.routes.templates + template,
                controller: 'PaymentGenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: withHostClass('ib-modals' + (extraModalClass ? ' ' + extraModalClass : ' ib-modals--md')),
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
            return openWithHost(modalObject);
        }

        ////////////////
        /**
         * Opens an especial filter  modal returning its instance
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the  modal instance opened
         */
        function showFilterModal(template, modelObject, animationEnabled, clss, controller, controllerAs) {
            var modalObject = {
                animation: animationEnabled,
                templateUrl: $rootScope.routes.templates + template + '.html',
                controller: controller,
                controllerAs: controllerAs,
                windowClass: withHostClass(clss ? clss : 'ib-modals'),
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return openWithHost(modalObject);
        }

        ////////////////
        /**
         * Opens an especial filter  modal returning its instance
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the  modal instance opened
         */
        function showLoginModal(template, modelObject, animationEnabled, clss) {
            var modalObject = {
                animation: animationEnabled,
                templateUrl: $rootScope.routes.templates + template + '.html',
                controller: 'PaymentGenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: withHostClass(clss ? clss : 'ib-modals'),
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return openWithHost(modalObject);
        }

        ////////////////
        /**
         * Opens a generic  modal returning its instance
         * @param {Object} modelObject - An object to be used in the view. This object will be associated to the 
         * @param {string} template - the name of a custom template to be shown in the modal
         * modalCtrl.model object in the generic controller
         * @returns {Object} -the  modal instance opened
         */
        function openInsuranceModal(modelObject, tpl) {
            var modalObject = {
                animation: false,
                templateUrl: $rootScope.routes.templates + tpl + '.html',
                controller: 'InsuranceModalController',
                controllerAs: 'modalCtrl',
                windowClass: withHostClass('ib-modals ib-modals--right fade'),
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return openWithHost(modalObject);
        }

        function showNewOrSameFlightModal(errorObject, isModalBlocked, template) {
            var modalErrorObject = {
                animation: false,
                templateUrl: $rootScope.routes.templates + template + '.html',
                controller: 'PaymentGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: withHostClass('ib-modals ib-modals--md'),
                resolve: {
                    errorObject: function () {
                        return errorObject;
                    }
                }
            };

            if (isModalBlocked) {
                modalErrorObject['backdrop'] = 'static';
                modalErrorObject['keyboard'] = false;
            }
            return openWithHost(modalErrorObject);
        }
    }
})();
