import { uibDatepickerDecorator } from './components/decorators/uib-datepicker-decorator';

(function () {
    'use strict';

    /**
     * Configure views and controls the transitions between them.
     */
    angular.module('ib-MmB-app').config(MmBAppConfig);

    MmBAppConfig.$inject = ['MmBAppConstants', '$translateProvider', '$httpProvider', 'tmhDynamicLocaleProvider', '$provide', '$qProvider'];
    function MmBAppConfig(MmBAppConstants, $translateProvider, $httpProvider, tmhDynamicLocaleProvider, $provide, $qProvider) {
        //Initialize the translation filter provider
        $translateProvider.useStaticFilesLoader({ files: [{ prefix: MmBAppConstants.generalI18nRoute, suffix: '.json' }, { prefix: MmBAppConstants.i18nRoute, suffix: '.json' }] });
        $translateProvider.useSanitizeValueStrategy('escaped');
        tmhDynamicLocaleProvider.localeLocationPattern(MmBAppConstants.localeLanguageRoute + 'locale_{{locale}}.js');
        $httpProvider.interceptors.push('IbHttpInterceptor');
        $provide.decorator('uibDatepickerDirective', ['$delegate', uibDatepickerDecorator]);
        $qProvider.errorOnUnhandledRejections(!MmBAppConstants.production);
        $httpProvider.defaults.withCredentials = true;
    }
})();