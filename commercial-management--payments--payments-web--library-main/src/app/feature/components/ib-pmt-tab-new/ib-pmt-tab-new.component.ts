import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector:'ib-pmt-tab-new',
    templateUrl:'./ib-pmt-tab-new.component.html',
    styleUrls: ['./ib-pmt-tab-new.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IbPmtTabNewComponent implements OnInit {

    constructor (){
    }

    ngOnInit (): void  {
        const inViewport = (entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('in-viewport', entry.isIntersecting);
            });
        };

        const Obs = new IntersectionObserver(inViewport);

        document.querySelectorAll('.ib-pmt-tab-mark-new').forEach($el => {
            Obs.observe($el);
        });
    }
}

downgradeToAJSComponent('ibPmtTabNew', {
    component: IbPmtTabNewComponent
}, 'ib-pmt-tab-new-module');
