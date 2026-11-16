(function () {


    angular
        .module('ib-booking-modal-module')
        .service('BookingModalService', BookingModalService);

    BookingModalService.$inject = ['BookingAppConstants', 'CommonsModalService', '$rootScope', '$uibModalStack', '$filter'];
    function BookingModalService (BookingAppConstants, CommonsModalService, $rootScope, $uibModalStack, $filter) {

        const self = this;
        angular.extend(this, CommonsModalService);
        self.keepAliveModalInstance = null;

        self.showLoginModal = showLoginModal;
        self.showFilterModal = showFilterModal;
        self.showLoginErrorModal = showLoginErrorModal;
        self.openInsuranceModal = openInsuranceModal;
        self.showITravelWarningModal = showITravelWarningModal;
        self.showGenericDynamicModal = showGenericDynamicModal;
        self.closeAllCurrentModals = closeAllCurrentModals;
        self.showBKIGenericModal = showBKIGenericModal;
        self.showBKISliceTimeLeftModal = showBKISliceTimeLeftModal;
        self.showKeepAliveModal = showKeepAliveModal;
        ////////////////

        //////////////////
        /**
         * Opens a show keep alive modal returning its instance
         * @param {Object} genericModalObject - the object to show in the template. It is passed to the controller.
         * @param {boolean} isModalBlocked - if the modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the error modal instance opened
         */
        function showKeepAliveModal (genericModalObject, isModalBlocked, template, extraModalClass) {
            const modalObject = {
                templateUrl: $rootScope.routes.templates + template,
                controller: 'GenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals' + (extraModalClass ? ' ' + extraModalClass : '') + ' ib-modals--md',
                resolve: {
                    object: function () {
                        return genericModalObject;
                    }
                }
            };

            if (isModalBlocked) {
                modalObject.backdrop = 'static';
                modalObject.keyboard = false;
            }
            
            if ( self.keepAliveModalInstance ) {
                self.keepAliveModalInstance.close( modalObject );
                self.keepAliveModalInstance = null;
            }
            
            self.keepAliveModalInstance = self.open( modalObject );
            
            return self.keepAliveModalInstance;
        }

        //////////////////
        /**
         * Opens a generic login error modal returning its instance
         * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
         * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the error modal instance opened
         */
        function showLoginErrorModal (errorObject, isModalBlocked, template, extraModalClass) {
            const modalErrorObject = {
                animation: false,
                templateUrl: BookingAppConstants.templatesRoute + (template ? (template + '.html') : 'generic-login-modal-error.html'),
                controller: 'GenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals' + (extraModalClass ? ' ' + extraModalClass : '') + ' ib-modals--md',
                resolve: {
                    object: function () {
                        return errorObject;
                    }
                }
            };

            if (isModalBlocked) {
                modalErrorObject.backdrop = 'static';
                modalErrorObject.keyboard = false;
            }
            return self.open(modalErrorObject);
        }

        ////////////////
        /**
         * Opens an especial filter  modal returning its instance
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the  modal instance opened
         */
        function showLoginModal (template, modelObject, animationEnabled, clss) {
            const modalObject = {
                animation: animationEnabled,
                templateUrl: $rootScope.routes.templates + template + '.html',
                controller: 'GenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: clss ? clss : 'ib-modals',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return $uibModal.open(modalObject);
        }
        ////////////////
        /**
         * Opens an especial filter  modal returning its instance
         * @param {string} template - the name of a custom template to be shown in the modal
         * @returns {Object} -the  modal instance opened
         */
        function showFilterModal (template, modelObject, animationEnabled, clss, controller, controllerAs) {
            const modalObject = {
                animation: animationEnabled,
                templateUrl: BookingAppConstants.templatesRoute + template + '.html',
                controller: controller,
                controllerAs: controllerAs,
                windowClass: clss ? clss : 'ib-modals',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return self.open(modalObject);
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
                templateUrl: BookingAppConstants.templatesRoute + tpl + '.html',
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
            return self.open(modalObject);
        }

        /**
         * Opens a warning modal when certain users (logged users with special discounts) uncheck the "I Travel" checkbox.
         */
        function showITravelWarningModal (modelObject) {
            const modalObject = {
                animation: false,
                templateUrl: BookingAppConstants.templatesRoute + 'ib-modal-itravel-warning.html',
                controller: 'ITravelWarningModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals' + ' ib-modals--md',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            return self.open(modalObject);
        }
        function showGenericDynamicModal (isModalBlocked, template, modelObject, controller) {
            const modalObject = {
                animation: false,
                templateUrl: BookingAppConstants.templatesRoute + template,
                controller: controller,
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md ib-modals--padding-big',
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            if (isModalBlocked) {
                modalObject.backdrop = 'static';
                modalObject.keyboard = false;
            }
            return self.open(modalObject);
        }

        function showBKIGenericModal (isModalBlocked, template, modelObject, extraModalClass) {
            if (template)
                template = template.includes('.html') ? template : (template + '.html');
            const modalObject= {
                animation: false,
                templateUrl: BookingAppConstants.templatesRoute + template,
                controller: 'BKIGenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals' + (extraModalClass ? ' ' + extraModalClass : ' ib-modals--md'),
                resolve: {
                    object: function () {
                        return modelObject;
                    }
                }
            };
            if (isModalBlocked) {
                modalObject.backdrop = 'static';
                modalObject.keyboard = false;
            }
            return self.open(modalObject);
        }

        function showBKISliceTimeLeftModal(timeLeft) {
            const tagsInfo = {
                p: {
                    tag: 'p',
                    class: 'ib-text'
                }
            };
            return self.showGenericModal(true, 'ib-modal-lastMinute-flight.html',{
                timeLeft,
                needsHtmlBinding: true,
                body: $filter('literalFormatter')($filter('translate')('MODAL_LASTMINUTE_BODY'),tagsInfo)
            });
        }


        /**
         * Closes all the opened modals in the aplication
         */
        function closeAllCurrentModals () {
            $uibModalStack.dismissAll();
        }
        
    }
})();
