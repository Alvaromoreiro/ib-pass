(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-widget-info-module')
        .factory('ibMmBManageWidgetInfoService', ibMmBManageWidgetInfoService);

    ibMmBManageWidgetInfoService.$inject = ['$rootScope', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', 'MmBAppConstants', 'localStorageService'];
    function ibMmBManageWidgetInfoService($rootScope, CommonsNewHttpUtilsErrorService, CommonsGenericProxy, MmBAppConstants, localStorageService) {

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
                    parameters.endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.tokenActivitiesPRO;
                    parameters.Authorization = 'Basic NjNiOG5hZTMwcWRqb3VlYmFmYjdhYW4xamY6Y3FsdTcxbmgxMWhwaTMyazN2ZzcxM3BqMHIyamdsZW1wZXRhaHZncWxtZ2oydGVjcmU4';
                }else {
                    parameters.endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.tokenActivitiesPREE;
                    parameters.Authorization = 'Basic M2VkdHAxNnNtbGxjMW42Y25icGdlMTBtcDU6anZ2YzBwbDZkOTFnODZmajh1b2VzcGY1b2JncmMxYjltZGtubDJjZHYzaWwxZ2p2OXY3';
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
