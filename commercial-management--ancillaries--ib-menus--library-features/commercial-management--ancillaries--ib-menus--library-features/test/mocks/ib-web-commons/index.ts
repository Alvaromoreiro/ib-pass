import angular from 'angular';
import { CommonsModalService } from './app/core/ib-modal/services/ib-modal-service';

angular.module('ib-commons-http-service-module', []);

angular
    .module('ib-commons-modal-service-module', [])
    .service('CommonsModalService', CommonsModalService);

angular
    .module('ib-commons-http-service-module')
    .value('CurrencyService', {
        formatPrice: (_currency: unknown, value: number) => value
    })
    .value('currencyService', {
        formatPrice: (_currency: unknown, value: number) => value
    })
    .value('CommonsAncillariesService', {});

[
    'ib-commons-http-service-module',
    'ib-commons-utils-module',
    'ib-ui-city-selector-component-module',
    'ib-ui-passenger-selector-module'
].forEach((moduleName) => {
    try {
        angular.module(moduleName);
    } catch {
        angular.module(moduleName, []);
    }
});

export * from './utils';
export * from './services';
export * from './models';
