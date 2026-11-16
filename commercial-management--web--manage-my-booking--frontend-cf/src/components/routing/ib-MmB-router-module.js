(function () {
    'use strict';

    angular.module('ib-MmB-routing-module', [
        'ngRoute',
        'utf8-base64'
    ]);

    angular.module('ib-MmB-routing-module').run(InitMmBRouter);

    InitMmBRouter.$inject = ['$rootScope', 'MmBRouterPreconditionsService', '$location', '$window', 'MmBAppConstants', 'AddOnService', 'localStorageService', 'MmBUtilService'];
    /* istanbul ignore next */
    function InitMmBRouter($rootScope, MmBRouterPreconditionsService, $location, $window, MmBAppConstants, AddOnService, localStorageService, MmBUtilService) {
        var paramMD, paramPaRes, paramResult;
        $rootScope.$on('$routeChangeStart', (event, toState, toParams) => {
            const paramsObject = new URLSearchParams(window.location.search);
            paramPaRes = paramsObject.get('PaRes');
            paramMD = paramsObject.get('MD');
            paramResult = paramsObject.get('redirectResult');
            // const path3ds2 = $location.path().indexOf('/ohinfo?') !== -1 ? '/ohinfo' : $location.path().indexOf('/ibdash?') !== -1 ? '/ibdash' : $location.path().indexOf('/disrptn?') !== -1 ? '/disrptn' : false;
            if (paramMD && paramPaRes) {
                localStorageService.set('componentInfoAdyen', {'md': paramMD, 'paRes': paramPaRes});
                // $location.path(path3ds2);
            } else if(paramResult) {
                localStorageService.set('redirectResult', paramResult);
                // $location.path(path3ds2);
            }
            if (!MmBRouterPreconditionsService.canTransition(toState.name, toParams)) {
                //Stop the state transition from working
                event.preventDefault();
                //Navigate to a otherwise state OR reload the app
                if (MmBRouterPreconditionsService.otherwise(toState.name)) {
                    $location.path(MmBRouterPreconditionsService.otherwise(toState.name));
                } else {
                    $window.location = $window.location.href.split('#')[0]; // Application is in a unrecoverable state reload
                }
            }
        });
        $rootScope.GOOGLE_ADS_URIS = MmBAppConstants.GOOGLE_ADS_URIS;
        $rootScope.BANNER_IDS = MmBAppConstants.BANNER_IDS;
        AddOnService.initAddOn();
    }

})();
