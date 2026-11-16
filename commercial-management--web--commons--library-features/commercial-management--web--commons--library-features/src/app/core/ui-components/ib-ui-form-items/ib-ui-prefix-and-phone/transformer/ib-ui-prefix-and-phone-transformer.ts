// @ts-nocheck
import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Prefix, PrefixResponse } from 'ib-web-commons/models';

@Injectable({
    providedIn: "root",
    })
export class IbUiPrefixAndPhoneTransformer {
    constructor (private localStorageService: CommonsSessionStorageService) {}

    transformPrefixAndPhone = (
        prefixAndPhoneList: PrefixResponse[]
    ): Prefix[] => {
        const prefixAndPhoneListTransformed = [];

        prefixAndPhoneList.forEach((item) => {
            prefixAndPhoneListTransformed.push({
                id: item.code,
                name: item.description.split(' / ')[1],
                country: item.countryCode
            });
        });
        this.localStorageService.set(
            'prefixListTransformed',
            prefixAndPhoneListTransformed
        );
        return prefixAndPhoneListTransformed;
    };
}

try {
    angular
        .module('ib-ui-prefix-and-phone-module')
        .service(
            'ibUiPrefixAndPhoneTransformer',
            downgradeInjectable(IbUiPrefixAndPhoneTransformer)
        );
} catch {
    angular
        .module('ib-ui-prefix-and-phone-module', [])
        .service(
            'ibUiPrefixAndPhoneTransformer',
            downgradeInjectable(IbUiPrefixAndPhoneTransformer)
        );
}
