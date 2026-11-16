(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-transfer-widget-info-module')
        .factory('ibMmBManageTransferWidgetInfoService', ibMmBManageTransferWidgetInfoService);

    ibMmBManageTransferWidgetInfoService.$inject = ['$rootScope', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', 'MmBAppConstants', 'localStorageService'];
    function ibMmBManageTransferWidgetInfoService ($rootScope, CommonsNewHttpUtilsErrorService, CommonsGenericProxy, MmBAppConstants, localStorageService) {

        return {
            getTokenWidget:getTokenWidget
        };

        ////////////////
        function getTokenWidget () {
            return new Promise( (resolve, reject) => {
                const widgetProMonetate = localStorageService.get('widgetProMonetate');
                const envCopy= {};
                (Object).assign(envCopy, (window).env);
                const parameters = {
                    endpoint: '',
                    Authorization: ''
                };

                if(envCopy.production || widgetProMonetate) {
                    parameters.endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.tokenTransfersPRO;
                    parameters.Authorization = envCopy.tokenTransfersPROAuthorization;
                }else {
                    parameters.endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.tokenTransfersPREE;
                    parameters.Authorization = envCopy.tokenTransfersPREEAuthorization;
                }


                const headerConfig = {
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: parameters.Authorization
                    }
                };
                CommonsGenericProxy.postGeneric(parameters.endpoint, {}, headerConfig).then((response) => {
                    resolve(response);
                }, (error) => {
                    CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
            });
        }
    }
})();
