(function () {
    'use strict';
    angular.module('ib-checkin-biometric-boarding-module')
        .service('BiometricsHandlerProvider', BiometricsHandlerProvider);

    BiometricsHandlerProvider.$inject = ['ModalService','RedirectionService','$rootScope', '$window', 'localStorageService','$location'];

    function BiometricsHandlerProvider(ModalService, RedirectionService,$rootScope, $window, localStorageService, $location) {
        var vm = this;
        vm.defaultErrorHandler = defaultErrorHandler;
        vm.expirationDateErrorHandler = expirationDateErrorHandler;
        vm.userDataInconsistencyHandler = userDataInconsistencyHandler;
        vm.infoAssociatedNotFoundPnrHandler = infoAssociatedNotFoundPnrHandler;
        vm.orderNotFoundHandler = orderNotFoundHandler;
        vm.flightNotFoundHandler = flightNotFoundHandler;
        vm.passengerDataIdConflictHandler = passengerDataIdConflictHandler;
        vm.documentNotFoundHandler = documentNotFoundHandler;
        vm.invalidDateFormatHandler = invalidDateFormatHandler;
        vm.biometricGenericModalHandler = biometricGenericModalHandler;

        function defaultErrorHandler(errorObject) {
            var defaultErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'REST_SERVICE_ERROR_GENERAL',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'confirmation':true
            };
            ModalService.showGenericModal(defaultErrorInfo, false).result.then(angular.noop, angular.noop);
        }

        function expirationDateErrorHandler(errorObject) {
            var expirationDateErrorInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_ID_DOCUMENT_EXPIRATION',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code
            };
            ModalService.showGenericModal(expirationDateErrorInfo, false).result.then(angular.noop, angular.noop);
        }

        function userDataInconsistencyHandler(errorObject) {
            var userDataInconsistencyHandlerInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_BOARDING_CARD_FORMAT_NOT_CORRECT',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code
            };

            ModalService.showGenericModal(userDataInconsistencyHandlerInfo, true).result.then(angular.noop, angular.noop);
        }

        function infoAssociatedNotFoundPnrHandler(errorObject) {
            var associatedNotFoundPnrInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_ASSOCIATED_INFO_PNR_NOT_FOUND',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'confirmation':true
            };
            ModalService.showGenericModal(associatedNotFoundPnrInfo, false).result.then(angular.noop, angular.noop);
        }

        function orderNotFoundHandler(errorObject) {
            var orderNotFoundHandlerInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_BOARDING_CARD_INVALID_INCONSISTENCE',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'confirmation':true
            };

            ModalService.showGenericModal(orderNotFoundHandlerInfo, true).result.then(angular.noop, angular.noop);
        }

        function flightNotFoundHandler(errorObject) {
            var flightNotFoundHandlerInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_FLIGHT_NOT_FOUND',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'confirmation':true
            };

            ModalService.showGenericModal(flightNotFoundHandlerInfo, true).result.then(angular.noop, angular.noop);
        }

        function invalidDateFormatHandler(errorObject) {
            var invalidDateFormatHandlerInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_INVALID_DATE_FORMAT',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'biometricDocumentError': true,
            };

            ModalService.showGenericModal(invalidDateFormatHandlerInfo, true).result.then(angular.noop, angular.noop);
        }

        function passengerDataIdConflictHandler(errorObject) {
            var passengerDataIdConflictInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_PASSENGER_INFO_DOESNT_MATCH',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'biometricDocumentError': true,
                
            };
            ModalService.showGenericModal(passengerDataIdConflictInfo, true).result.then(angular.noop, angular.noop);
        }

        function documentNotFoundHandler(errorObject) {
            var documentNotFoundHandlerInfo = {
                'title': {
                    'message': 'PCC_CARD_ERROR_MODAL_TITLE',
                    'needsTranslate': true
                },
                'message': 'BIOMETRIC_BOARDING_REQUEST_DOCUMENT_NOT_FOUND',
                'needsTranslate': true,
                'internalErrorCode': errorObject.code,
                'biometricDocumentError': true,

            };

            ModalService.showGenericModal(documentNotFoundHandlerInfo, true).result.then(angular.noop, angular.noop);
        }

        function biometricGenericModalHandler(errorObject) {
            var biometricGenericModalHandlerInfo = {
                'internalErrorCode': errorObject.code,
                'goToConfirmation': function(){
                    ModalService.closeAllCurrentModals();
                    $location.path('/ibcocf-and-ibeccf');
                    
                },
                'moreInformation':function(){
                    var linkList = localStorageService.get('linksList'), navegationURL;
                    navegationURL = $window.location.origin  + linkList['BIOMETRIC_LANDING_LINK'].uri;
                    RedirectionService.newNavigation(navegationURL);
                },
                'biometricDocumentError':true
            };
            ModalService.showConfigurableModal(true, 'ib-modal-biometric-error', biometricGenericModalHandlerInfo, 'ib-modals ib-modals--md ib-modals--grey ib-modals--p-small-responsive',
                null, null, false).result.then(angular.noop, angular.noop);
        }

    }
})();