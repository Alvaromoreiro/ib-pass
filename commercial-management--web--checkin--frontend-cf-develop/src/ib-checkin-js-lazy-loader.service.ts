import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { UpgradeModule } from '@angular/upgrade/static';

@Injectable({
    providedIn: 'root'
})
export class LazyLoaderService {
    private app: angular.auto.IInjectorService | undefined;

    constructor (private upgrade: UpgradeModule) { }

    load (el: HTMLElement): void {
        this.upgrade.bootstrap( document.body, ['ib-check-in-app'],  { strictDi: true });

        // import('@src/lazy-loading/js-application').then((app) => {
        //     try {
        //         this.upgrade.bootstrap( document.body, ['ib-MmB-app'],  { strictDi: true });
        //     } catch (e) {
        //         // eslint-disable-next-line
        //         console.error(e);
        //     }
        // }).catch(() => {});
    }

    destroy () {
        // this.upgrade.$injector?.get('$rootScope')?.destroy();
        /*if (this.app) {
            this.app.get('$rootScope').$destroy();
        }*/
    }
}
