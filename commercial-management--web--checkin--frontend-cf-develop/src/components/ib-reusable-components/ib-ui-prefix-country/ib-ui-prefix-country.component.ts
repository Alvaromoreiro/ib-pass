import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'ib-ui-prefix-country',
    templateUrl: './ib-ui-prefix-country.component.html',
    styleUrls: ['./ib-ui-prefix-country.component.scss']

})
export class IbUiPrefixCountryComponent implements OnInit {

    @Input() prefixList;
    @Input() prefixId;
    @Input() prefixLabel;
    @Input() isRequired;
    @Input() prefixPlaceholder;
    @Input() prefixModel;
    @Output() outPrefixModel = new EventEmitter<any>();
    @Input() containerForm;
    @Input() selectedPrefix;
    @Input() parentForm: FormGroup = new FormGroup({prefix: new FormControl()});
    @ViewChild('myDropdown') myDropdown!: NgbDropdown;

    filteredPrefix = [];
    haveResults = false;
    collapsed = true;
    query = '';

    ngOnInit (): void {
        this.initPrefix();
        this.filteredPrefix = this.prefixList;
        this.haveResults = true;
    }

    public initPrefix (){
        this.selectedPrefix = (this.prefixList.find(prefix => prefix.code === this.prefixModel)).description;
        this.query = this.selectedPrefix;

    }

    public selectPrefix (prefix): void {
        this.query = prefix.description;
        this.selectedPrefix = this.query;
        this.outPrefixModel.emit(prefix.code);
    }

    public clickSelect (): void {
        this.collapsed = this.myDropdown.isOpen();
        if (this.collapsed){
            this.query = this.selectedPrefix;
        } else{
            this.query = '';
            this.filterPrefix();
        }
    }

    public clickOutsideSelect (): void {
        if (this.myDropdown.isOpen()){
            this.collapsed = this.myDropdown.isOpen();
        }
        this.query = this.selectedPrefix;
    }

    public filterPrefix () {
        if (this.collapsed){
            this.collapsed = false;
            this.myDropdown.open();
        }
        this.filteredPrefix = this.prefixList.filter(prefix =>
            prefix.description.toLowerCase().includes(this.query.toLowerCase())
        );
        this.haveResults = this.filteredPrefix.length > 0;
    }
}
downgradeToAJSComponent('ibUiPrefixCountry', { component: IbUiPrefixCountryComponent }, 'ib-ui-prefix-country-module');

