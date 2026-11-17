import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ElementType } from 'react';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { SbyModal, SbyModalProps } from 'commercial-management--digital--web-components-design--library';

@Component({
    selector: 'ib-modal-sby',
    template: `<ng-react [component]="SbyModal" [props]="props"></ng-react>`
})
export class IbModalSbyComponent implements OnChanges {
    @Input() openModal: boolean = false;
    @Input() showWalletInfo: boolean = false;
    @Output() openModalChange = new EventEmitter<boolean>();

    protected readonly SbyModal: ElementType = SbyModal;
    props: SbyModalProps = {
        open: false,
        onPrimaryAction: () => this.onClick(),
        showWalletInfo: this.showWalletInfo
    };
    
    ngOnChanges (changes: SimpleChanges): void {
        if (changes['openModal']) {
            this.props = { ...this.props, open: this.openModal};
        }

        if (changes['showWalletInfo']) {
            this.props = { ...this.props, showWalletInfo: this.showWalletInfo};
        }
    }
    

    onClick () {
        this.openModal = false; //call ngOnChanges
        this.openModalChange.emit(this.openModal);
    }
}

IbModalSbyComponent.$inject = [];
downgradeToAJSComponent('ibModalSby', { component: IbModalSbyComponent }, 'ib-shared-components-module');