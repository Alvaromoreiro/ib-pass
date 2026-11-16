/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Inject } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { CommonsHttpServicesConstants } from 'ib-web-commons/constants';
import * as angular from 'angular';
import { getSalesforceUrl, getSFClientId } from './ib-salesforce-utils';
import {
    AJSRootScope,
    CommonsRootScope
} from './ajs-upgrade/ib-commons-root-scope-bridge';
import { CommonsSessionStorageService } from './storage-utils/ib-commons-session-storage.service';
@Injectable({
    providedIn: 'root'
})
export class RedirectionService {
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private sessionStorageService: CommonsSessionStorageService
    ) {}

    externalRedirect = (path: string): void => {
        window.location.href = path;
    };

    newNavigation = (url: string, type: string): void => {
        window.open(url, type);
    };

    redirectToLoginPage = (
        referralURL: string = window.location.href,
        extraParams: Record<string, string> = {},
        expidSuffix: string = ''
    ): void => {
        this.sessionStorageService.set(
            'ib-identity-stateReferral',
            { referralURL },
            { withPrefix: false }
        );

        const baseParams = {
            client_id: getSFClientId(),
            redirect_uri: `${window.location.origin}/integration/ibplus/login/`,
            prompt: 'login',
            response_type: 'code'
        };

        const params = new URLSearchParams({
            ...baseParams,
            ...extraParams
        });

        const urlLoginSalesforce = `${getSalesforceUrl()}${
            CommonsHttpServicesConstants.SALESFORCE_TOKEN.iframeURI
        }expid_1${this.$rootScope.appMarket.toUpperCase()}${this.$rootScope.appLang.toLowerCase()}${expidSuffix}`;

        window.location.href = `${urlLoginSalesforce}?${params.toString()}`;
    };

}

try {
    angular
        .module('ib-commons-utils-module')
        .service('RedirectionService', downgradeInjectable(RedirectionService));
} catch {
    angular
        .module('ib-commons-utils-module', ['ib-commons-http-new-service-module'])
        .service('RedirectionService', downgradeInjectable(RedirectionService));
}
