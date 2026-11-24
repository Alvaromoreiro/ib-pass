import { downgradeInjectable } from '@angular/upgrade/static';
import { PmtRxProxy } from '../../../../app/shared/http-services/proxy/ib-pmt-rx-proxy.service';

(function () {
    'use strict';
    angular.module('ib-pmt-services-http-module', [
        'pmt-payment-scripts-service',
        'pmt-customer-cards-fees-service'
    ])
    .factory('PmtRxProxy', downgradeInjectable(PmtRxProxy));
})();