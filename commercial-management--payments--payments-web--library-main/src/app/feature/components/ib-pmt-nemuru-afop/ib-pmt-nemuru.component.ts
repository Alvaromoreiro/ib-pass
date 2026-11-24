import { Component, Input, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import angular from 'angular';
import { ibPmtNemuruService } from './ib-pmt-nemuru.service';


declare global {
    interface Window { Nemuru: any; }
}



@Component({
    selector:'ib-pmt-nemuru-afop',
    templateUrl:'./ib-pmt-nemuru-view.component.html'
})

export class IbPmtNemuruComponent implements OnInit{

    @Input()
    private orderId:string ='';
    @Input()
    private accessToken:string ='';
    private idContainerNemuru:string = 'nemuru-checkout';


    constructor ( private ibPmtNemuruService : ibPmtNemuruService){
    }

    private fixParentModalStyle = (disable: boolean = true): void => {
        const $container: HTMLElement = document.querySelector(`#${this.idContainerNemuru}`);
        if(!$container) return;
        const $modal: HTMLElement = $container.closest('.modal-dialog');
        if (!$modal) return;
        $modal.style.transform = disable ? 'none' : null;
    };

    ngOnInit () :void{
        window.Nemuru.checkout({
            container: this.idContainerNemuru,
            orderId: this.orderId,
            accessToken: this.accessToken,
            style: {
                color: '#3E6AE1',
                branding: 'iberia',
                variant: 'modal'
            },
            behaviour: {
                disableFormEdition: true,
                enableAutoClose: true
            },
            onStatusChange: (status) => {
                if (status === 'approved') {
                    // do something on approved
                    this.ibPmtNemuruService.setNemuruAvailable(false);
                    this.fixParentModalStyle(false);
                }
               
            },
            onClose: (status) => {
                // do something on close
                this.ibPmtNemuruService.setNemuruAvailable(false);
                this.ibPmtNemuruService.submitPayment();
                this.fixParentModalStyle(false);

            },
            onError: (error) => {
                // do something on error
                this.ibPmtNemuruService.setNemuruAvailable(false);
                this.ibPmtNemuruService.submitPayment();
                this.fixParentModalStyle(false);
            }
        });
        
        this.fixParentModalStyle(true);
    }
   



    
}

try{
    angular.module('ib-pmt-nemuru-afop').directive('ibPmtNemuruAfop', downgradeComponent({
        component:IbPmtNemuruComponent,
        inputs:[
            'orderId', 'accessToken'
        ]
    }));
}catch{
    angular.module('ib-pmt-nemuru-afop', []).directive('ibPmtNemuruAfop', downgradeComponent({
        component:IbPmtNemuruComponent,
        inputs:[
            'orderId', 'accessToken'
        ]
    }));
}   